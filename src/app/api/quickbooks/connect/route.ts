import { NextResponse } from 'next/server';
import { buildAuthorizationUrl, isAuthorizedSetupRequest } from '@/lib/quickbooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!isAuthorizedSetupRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { authorizationUrl } = buildAuthorizationUrl(request);
    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to start QuickBooks connection' },
      { status: 500 },
    );
  }
}
