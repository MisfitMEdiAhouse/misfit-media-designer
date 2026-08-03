import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const suppliedKey = url.searchParams.get('key');
  const setupKey = process.env.SETUP_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

  if (!setupKey || suppliedKey !== setupKey) return new NextResponse('Unauthorized', { status: 401 });
  if (!stripeKey || !siteUrl) {
    return NextResponse.json({ ok: false, error: 'Missing STRIPE_SECRET_KEY or NEXT_PUBLIC_SITE_URL' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const endpointUrl = `${siteUrl}/api/stripe-webhook`;
    const existing = await stripe.webhookEndpoints.list({ limit: 100 });
    const match = existing.data.find((endpoint) => endpoint.url === endpointUrl && endpoint.status === 'enabled');

    if (match) {
      return NextResponse.json({
        ok: true,
        status: 'already_exists',
        endpointUrl,
        endpointId: match.id,
        message: 'Stripe does not reveal an existing signing secret. Use Stripe Workbench to reveal/roll it, or delete the old endpoint and run setup again.',
      });
    }

    const endpoint = await stripe.webhookEndpoints.create({
      url: endpointUrl,
      enabled_events: ['checkout.session.completed'],
      description: 'Weber Junk Rescue paid-booking notifications',
      metadata: { app: 'weber-junk-rescue', owner: 'misfit-mediahouse' },
    });

    return NextResponse.json({
      ok: true,
      status: 'created',
      endpointUrl,
      endpointId: endpoint.id,
      signingSecret: endpoint.secret,
      nextStep: 'Copy signingSecret into Vercel as STRIPE_WEBHOOK_SECRET, then redeploy.',
    });
  } catch (error) {
    console.error('Stripe setup failed', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown Stripe error' }, { status: 500 });
  }
}
