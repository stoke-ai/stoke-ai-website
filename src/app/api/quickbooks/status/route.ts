import { NextResponse } from 'next/server';
import { getConnectionStatus, getQuickBooksConfig, isAuthorizedSetupRequest } from '@/lib/quickbooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAuthorizedSetupRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = getQuickBooksConfig();
  const status = await getConnectionStatus();

  return NextResponse.json({
    ...status,
    configured: {
      clientId: Boolean(config.clientId),
      clientSecret: Boolean(config.clientSecret),
      redirectUri: config.redirectUri || null,
      setupSecret: Boolean(config.setupSecret),
      tokenEncryptionKey: Boolean(config.encryptionKey),
      blobStore: Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL_OIDC_TOKEN),
    },
  });
}
