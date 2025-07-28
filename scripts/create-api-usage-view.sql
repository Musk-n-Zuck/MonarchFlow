-- Create the api_usage_summary view if it doesn't exist
-- This can be run directly in the Supabase SQL Editor

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

-- Grant permissions
GRANT SELECT ON api_usage_summary TO service_role;

-- Add comment
COMMENT ON VIEW api_usage_summary IS 'Summary view of API usage statistics per hunter';

-- Test the view
SELECT COUNT(*) as view_test FROM api_usage_summary;