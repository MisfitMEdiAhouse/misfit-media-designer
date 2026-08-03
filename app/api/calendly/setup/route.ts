import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const suppliedKey = url.searchParams.get('key');
  const setupKey = process.env.SETUP_KEY;
  const token = process.env.CALENDLY_PAT;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  const webhookKey = process.env.CALENDLY_WEBHOOK_KEY;

  if (!setupKey || suppliedKey !== setupKey) return new NextResponse('Unauthorized', { status: 401 });
  if (!token || !siteUrl || !webhookKey) {
    return NextResponse.json({
      ok: false,
      error: 'Missing CALENDLY_PAT, NEXT_PUBLIC_SITE_URL, or CALENDLY_WEBHOOK_KEY',
    }, { status: 503 });
  }

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    const meResponse = await fetch('https://api.calendly.com/users/me', { headers, cache: 'no-store' });
    const meData = await meResponse.json();
    if (!meResponse.ok) return NextResponse.json({ ok: false, step: 'users/me', calendly: meData }, { status: meResponse.status });

    const userUri = meData?.resource?.uri;
    const organizationUri = meData?.resource?.current_organization;
    if (!userUri || !organizationUri) return NextResponse.json({ ok: false, error: 'Calendly user or organization URI missing' }, { status: 500 });

    const endpoint = `${siteUrl}/api/calendly-webhook?key=${encodeURIComponent(webhookKey)}`;
    const listUrl = new URL('https://api.calendly.com/webhook_subscriptions');
    listUrl.searchParams.set('organization', organizationUri);
    listUrl.searchParams.set('scope', 'user');
    listUrl.searchParams.set('user', userUri);

    const listResponse = await fetch(listUrl, { headers, cache: 'no-store' });
    const listData = await listResponse.json();
    if (listResponse.ok) {
      const existing = (listData?.collection || []).find((item: { callback_url?: string; uri?: string }) => item.callback_url === endpoint);
      if (existing) return NextResponse.json({ ok: true, status: 'already_registered', endpoint, webhook: existing.uri });
    }

    const createResponse = await fetch('https://api.calendly.com/webhook_subscriptions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url: endpoint,
        events: ['invitee.created', 'invitee.canceled'],
        organization: organizationUri,
        user: userUri,
        scope: 'user',
      }),
    });
    const createData = await createResponse.json();
    return NextResponse.json({ ok: createResponse.ok, status: createResponse.ok ? 'registered' : 'failed', endpoint, calendly: createData }, { status: createResponse.status });
  } catch (error) {
    console.error('Calendly setup failed', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
