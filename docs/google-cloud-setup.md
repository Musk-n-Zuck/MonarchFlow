# Google Cloud IAM Setup for Solo Leveling App

This guide explains how to set up Google Cloud IAM for automatic API key management in the Solo Leveling productivity app.

## Prerequisites

1. Google Cloud Project with billing enabled
2. Supabase project with Edge Functions enabled
3. Access to Google Cloud Console

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** > **Service Accounts**
3. Click **Create Service Account**
4. Fill in the details:
   - **Name**: `solo-leveling-api-manager`
   - **Description**: `Service account for managing Gemini API keys`
5. Click **Create and Continue**

## Step 2: Grant Required Permissions

Add the following roles to your service account:

1. **API Keys Admin** (`roles/serviceusage.apiKeysAdmin`)
   - Allows creating, deleting, and managing API keys
2. **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`)
   - Allows using Google Cloud services

## Step 3: Create and Download Service Account Key

1. In the Service Accounts list, click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** format
5. Download the key file and keep it secure

## Step 4: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Generative Language API** (for Gemini)
   ```bash
   gcloud services enable generativelanguage.googleapis.com
   ```

2. **API Keys API** (for key management)
   ```bash
   gcloud services enable apikeys.googleapis.com
   ```

3. **Service Usage API**
   ```bash
   gcloud services enable serviceusage.googleapis.com
   ```

## Step 5: Configure Environment Variables

Add the following environment variables to your Supabase project:

### In Supabase Dashboard > Settings > Edge Functions

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL=solo-leveling-api-manager@your-project-id.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----
GOOGLE_CLOUD_PRIVATE_KEY_ID=your-private-key-id

# API Key Encryption
API_KEY_ENCRYPTION_KEY=your-32-character-encryption-key

# Cron Job Security
CRON_SECRET_TOKEN=your-secure-random-token-for-cron-jobs
```

### Extracting Values from Service Account JSON

From your downloaded service account JSON file, extract:

- `project_id` → `GOOGLE_CLOUD_PROJECT_ID`
- `client_email` → `GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_CLOUD_PRIVATE_KEY` (keep the \n characters)
- `private_key_id` → `GOOGLE_CLOUD_PRIVATE_KEY_ID`

### Generating Encryption Key

Generate a secure 32-character encryption key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 6: Deploy Edge Functions

Deploy the API key management functions:

```bash
# Deploy createHunterKey function
supabase functions deploy createHunterKey

# Deploy rotateInactiveKeys function
supabase functions deploy rotateInactiveKeys
```

## Step 7: Set Up Key Rotation Cron Job

Create a cron job to automatically rotate inactive keys. You can use:

1. **GitHub Actions** (recommended for simplicity)
2. **Vercel Cron Jobs**
3. **External cron service**

### Example GitHub Actions Workflow

Create `.github/workflows/rotate-keys.yml`:

```yaml
name: Rotate Inactive API Keys

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  rotate-keys:
    runs-on: ubuntu-latest
    steps:
      - name: Rotate Inactive Keys
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}" \
            -H "Content-Type: application/json" \
            "${{ secrets.SUPABASE_URL }}/functions/v1/rotateInactiveKeys"
```

Add these secrets to your GitHub repository:
- `CRON_SECRET_TOKEN`: The token you generated
- `SUPABASE_URL`: Your Supabase project URL

## Step 8: Test the Setup

Test your configuration by creating a test hunter:

```javascript
// In your app or via Supabase SQL editor
const testResult = await supabase.functions.invoke('createHunterKey', {
  body: {
    hunterId: 'test-hunter-id',
    hunterClass: 'Scholar',
    hunterName: 'Test Hunter'
  }
});

console.log(testResult);
```

## Security Best Practices

1. **Never commit service account keys to version control**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate your service account keys**
4. **Monitor API key usage and costs**
5. **Set up billing alerts in Google Cloud**
6. **Use least-privilege access for service accounts**

## Monitoring and Maintenance

### Cost Monitoring

1. Set up billing alerts in Google Cloud Console
2. Monitor API usage through the `usage_logs` table
3. Use the `api_usage_summary` view for analytics

### Key Rotation Monitoring

1. Check the rotation function logs regularly
2. Monitor for failed rotations
3. Set up alerts for rotation failures

### Database Maintenance

Run these queries periodically to maintain performance:

```sql
-- Clean up old usage logs (older than 90 days)
DELETE FROM usage_logs 
WHERE logged_at < NOW() - INTERVAL '90 days';

-- Update last_active for active users
UPDATE profiles 
SET last_active = NOW() 
WHERE id IN (
  SELECT DISTINCT hunter_id 
  FROM usage_logs 
  WHERE logged_at > NOW() - INTERVAL '1 day'
);
```

## Troubleshooting

### Common Issues

1. **"Failed to create API key"**
   - Check service account permissions
   - Verify APIs are enabled
   - Check project billing status

2. **"Decryption failed"**
   - Verify encryption key is correct
   - Check for key corruption in database

3. **"Unauthorized" for rotation**
   - Verify CRON_SECRET_TOKEN matches
   - Check cron job configuration

### Debug Commands

```bash
# Test service account authentication
gcloud auth activate-service-account --key-file=path/to/key.json

# List API keys
gcloud alpha services api-keys list

# Check enabled APIs
gcloud services list --enabled
```

## Cost Estimation

Typical costs for the Solo Leveling app:

- **API Key Management**: ~$0.01/month per 1000 keys
- **Gemini API Usage**: ~$0.75 per 1M input tokens
- **Storage**: Minimal cost for encrypted keys

Budget recommendations:
- **Free tier**: $5/month per user
- **S-Rank Pass**: $100/month per user