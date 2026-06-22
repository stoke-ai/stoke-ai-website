import { NextResponse } from 'next/server';
import { exchangeAuthorizationCode, verifyState } from '@/lib/quickbooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  if (error) {
    return htmlResponse('QuickBooks connection cancelled', `<p>Intuit returned: ${escapeHtml(errorDescription || error)}</p>`, 400);
  }

  const code = url.searchParams.get('code');
  const realmId = url.searchParams.get('realmId');
  const state = url.searchParams.get('state');

  if (!code || !realmId || !state) {
    return htmlResponse('QuickBooks connection incomplete', '<p>Missing code, realmId, or state from Intuit.</p>', 400);
  }

  try {
    verifyState(state);
    const tokenSet = await exchangeAuthorizationCode(code, realmId);

    return htmlResponse(
      'QuickBooks connected',
      `<p>Blaze can now pull QuickBooks data for company realm <strong>${escapeHtml(tokenSet.realmId)}</strong>.</p>
       <p>Access token expires: ${escapeHtml(tokenSet.accessTokenExpiresAt)}</p>
       <p>You can close this tab.</p>`,
    );
  } catch (callbackError) {
    return htmlResponse(
      'QuickBooks connection failed',
      `<p>${escapeHtml(callbackError instanceof Error ? callbackError.message : 'Unknown callback error')}</p>`,
      500,
    );
  }
}

function htmlResponse(title: string, body: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f7f3ed; color: #17201a; margin: 0; padding: 40px 18px; }
    main { max-width: 680px; margin: 0 auto; background: white; border: 1px solid #eadfce; border-radius: 24px; padding: 32px; box-shadow: 0 18px 60px rgba(31, 28, 23, .08); }
    h1 { margin-top: 0; font-size: 32px; }
    p { line-height: 1.55; }
  </style>
</head>
<body><main><h1>${escapeHtml(title)}</h1>${body}</main></body>
</html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return char;
    }
  });
}
