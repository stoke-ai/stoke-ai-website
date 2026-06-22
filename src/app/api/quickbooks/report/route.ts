import { NextResponse } from 'next/server';
import { getFreshTokenSet, isAuthorizedSetupRequest, quickBooksApiFetch } from '@/lib/quickbooks';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowedReports = new Set([
  'ProfitAndLoss',
  'BalanceSheet',
  'CashFlow',
  'AgedReceivables',
  'AgedPayables',
  'TrialBalance',
]);

export async function GET(request: Request) {
  if (!isAuthorizedSetupRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const report = url.searchParams.get('report') || 'ProfitAndLoss';

  if (!allowedReports.has(report)) {
    return NextResponse.json({ error: `Unsupported report: ${report}` }, { status: 400 });
  }

  const tokenSet = await getFreshTokenSet();
  const params = new URLSearchParams();
  for (const key of ['start_date', 'end_date', 'accounting_method', 'summarize_column_by']) {
    const value = url.searchParams.get(key);
    if (value) params.set(key, value);
  }
  params.set('minorversion', url.searchParams.get('minorversion') || '75');

  const response = await quickBooksApiFetch(`/v3/company/${tokenSet.realmId}/reports/${report}?${params.toString()}`);
  const data = await response.json();

  return NextResponse.json(data);
}
