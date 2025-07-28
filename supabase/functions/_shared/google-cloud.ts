/**
 * Google Cloud IAM utilities for managing API keys
 * Handles service account authentication and API key lifecycle
 */

interface GoogleCloudConfig {
  projectId: string;
  serviceAccountEmail: string;
  privateKey: string;
  privateKeyId: string;
}

interface ApiKeyResponse {
  name: string;
  keyString: string;
  uid: string;
  displayName: string;
  restrictions?: {
    apiTargets?: Array<{
      service: string;
      methods?: string[];
    }>;
  };
}

/**
 * Creates a JWT token for Google Cloud API authentication
 */
async function createJWT(config: GoogleCloudConfig): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: config.privateKeyId,
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: config.serviceAccountEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600, // 1 hour
    iat: now,
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    new TextEncoder().encode(config.privateKey),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signatureInput));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signatureInput}.${encodedSignature}`;
}

/**
 * Gets an access token from Google OAuth2
 */
async function getAccessToken(config: GoogleCloudConfig): Promise<string> {
  const jwt = await createJWT(config);
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a new Google Gemini API key with restrictions
 */
export async function createGeminiApiKey(
  config: GoogleCloudConfig,
  displayName: string,
  hunterId: string
): Promise<ApiKeyResponse> {
  const accessToken = await getAccessToken(config);
  
  const apiKeyData = {
    displayName: `${displayName}-${hunterId.slice(0, 8)}`,
    restrictions: {
      apiTargets: [
        {
          service: 'generativelanguage.googleapis.com',
          methods: ['*'],
        },
      ],
    },
  };

  const response = await fetch(
    `https://apikeys.googleapis.com/v2/projects/${config.projectId}/locations/global/keys`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create API key: ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Lists all API keys for the project
 */
export async function listApiKeys(config: GoogleCloudConfig): Promise<ApiKeyResponse[]> {
  const accessToken = await getAccessToken(config);
  
  const response = await fetch(
    `https://apikeys.googleapis.com/v2/projects/${config.projectId}/locations/global/keys`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to list API keys: ${response.statusText}`);
  }

  const result = await response.json();
  return result.keys || [];
}

/**
 * Deletes an API key by its resource name
 */
export async function deleteApiKey(config: GoogleCloudConfig, keyName: string): Promise<void> {
  const accessToken = await getAccessToken(config);
  
  const response = await fetch(
    `https://apikeys.googleapis.com/v2/${keyName}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete API key: ${response.statusText}`);
  }
}

/**
 * Gets API key details by resource name
 */
export async function getApiKey(config: GoogleCloudConfig, keyName: string): Promise<ApiKeyResponse> {
  const accessToken = await getAccessToken(config);
  
  const response = await fetch(
    `https://apikeys.googleapis.com/v2/${keyName}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get API key: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Validates Google Cloud configuration
 */
export function validateGoogleCloudConfig(config: Partial<GoogleCloudConfig>): GoogleCloudConfig {
  const required = ['projectId', 'serviceAccountEmail', 'privateKey', 'privateKeyId'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Google Cloud config: ${missing.join(', ')}`);
  }
  
  return config as GoogleCloudConfig;
}