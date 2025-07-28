-- Migration for API Key Management System
-- Adds necessary indexes and functions for Google Cloud IAM integration

-- Add index for API key rotation queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_active_with_keys ON profiles(last_active) 
WHERE gemini_key_enc IS NOT NULL;

-- Add index for subscription tier filtering
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier_active ON profiles(subscription_tier, last_active);

-- Function to track API key usage
CREATE OR REPLACE FUNCTION log_api_usage(
  p_hunter_id UUID,
  p_tokens_used INTEGER,
  p_cost_cents INTEGER,
  p_service_type TEXT DEFAULT 'gemini'
)
RETURNS VOID AS $$
BEGIN
  -- Insert usage log
  INSERT INTO usage_logs (hunter_id, tokens_used, cost_cents, service_type)
  VALUES (p_hunter_id, p_tokens_used, p_cost_cents, p_service_type);
  
  -- Update profile usage counters
  UPDATE profiles 
  SET 
    gemini_usage_tokens = gemini_usage_tokens + p_tokens_used,
    gemini_budget_cents = GREATEST(0, gemini_budget_cents - p_cost_cents),
    updated_at = NOW()
  WHERE id = p_hunter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if hunter has sufficient budget
CREATE OR REPLACE FUNCTION check_api_budget(
  p_hunter_id UUID,
  p_estimated_cost_cents INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_budget INTEGER;
BEGIN
  SELECT gemini_budget_cents INTO current_budget
  FROM profiles
  WHERE id = p_hunter_id;
  
  RETURN COALESCE(current_budget, 0) >= p_estimated_cost_cents;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refill API budget for premium users
CREATE OR REPLACE FUNCTION refill_premium_budget()
RETURNS INTEGER AS $$
DECLARE
  refilled_count INTEGER := 0;
BEGIN
  -- Refill budget for S-Rank subscribers
  UPDATE profiles 
  SET 
    gemini_budget_cents = 10000, -- $100
    updated_at = NOW()
  WHERE 
    subscription_tier = 's_rank' 
    AND gemini_budget_cents < 5000; -- Refill if below $50
  
  GET DIAGNOSTICS refilled_count = ROW_COUNT;
  
  RETURN refilled_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get hunters needing key rotation
CREATE OR REPLACE FUNCTION get_hunters_for_key_rotation(
  p_days_inactive INTEGER DEFAULT 30
)
RETURNS TABLE (
  hunter_id UUID,
  hunter_name TEXT,
  hunter_class TEXT,
  last_active TIMESTAMP WITH TIME ZONE,
  days_inactive INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.hunter_name,
    p.hunter_class,
    p.last_active,
    EXTRACT(DAY FROM NOW() - p.last_active)::INTEGER
  FROM profiles p
  WHERE 
    p.gemini_key_enc IS NOT NULL
    AND p.subscription_tier = 'free'
    AND p.last_active < NOW() - INTERVAL '1 day' * p_days_inactive
  ORDER BY p.last_active ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely update API key
CREATE OR REPLACE FUNCTION update_hunter_api_key(
  p_hunter_id UUID,
  p_encrypted_key TEXT,
  p_reset_usage BOOLEAN DEFAULT TRUE
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE profiles 
  SET 
    gemini_key_enc = p_encrypted_key,
    gemini_usage_tokens = CASE WHEN p_reset_usage THEN 0 ELSE gemini_usage_tokens END,
    updated_at = NOW()
  WHERE id = p_hunter_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for API usage analytics
CREATE OR REPLACE VIEW api_usage_summary AS
SELECT 
  p.id as hunter_id,
  p.hunter_name,
  p.hunter_class,
  p.subscription_tier,
  p.gemini_budget_cents,
  p.gemini_usage_tokens,
  COALESCE(SUM(ul.cost_cents), 0) as total_cost_cents,
  COALESCE(SUM(ul.tokens_used), 0) as total_tokens_used,
  COUNT(ul.id) as api_calls_count,
  MAX(ul.logged_at) as last_api_call
FROM profiles p
LEFT JOIN usage_logs ul ON p.id = ul.hunter_id
WHERE p.gemini_key_enc IS NOT NULL
GROUP BY p.id, p.hunter_name, p.hunter_class, p.subscription_tier, 
         p.gemini_budget_cents, p.gemini_usage_tokens;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION log_api_usage TO service_role;
GRANT EXECUTE ON FUNCTION check_api_budget TO service_role;
GRANT EXECUTE ON FUNCTION refill_premium_budget TO service_role;
GRANT EXECUTE ON FUNCTION get_hunters_for_key_rotation TO service_role;
GRANT EXECUTE ON FUNCTION update_hunter_api_key TO service_role;
GRANT SELECT ON api_usage_summary TO service_role;

-- Add RLS policies for usage_logs
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own usage logs
CREATE POLICY "Users can view own usage logs" ON usage_logs
  FOR SELECT USING (auth.uid() = hunter_id);

-- Service role can manage all usage logs
CREATE POLICY "Service role can manage usage logs" ON usage_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON FUNCTION log_api_usage IS 'Logs API usage and updates hunter budget/usage counters';
COMMENT ON FUNCTION check_api_budget IS 'Checks if hunter has sufficient budget for API call';
COMMENT ON FUNCTION refill_premium_budget IS 'Refills API budget for premium subscribers';
COMMENT ON FUNCTION get_hunters_for_key_rotation IS 'Gets list of hunters needing API key rotation';
COMMENT ON FUNCTION update_hunter_api_key IS 'Safely updates hunter API key with optional usage reset';
COMMENT ON VIEW api_usage_summary IS 'Summary view of API usage statistics per hunter';