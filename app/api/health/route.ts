import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key');
  if (!process.env.SETUP_KEY || key !== process.env.SETUP_KEY) return new NextResponse('Unauthorized', { status: 401 });

  const status = {
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    stripeSecret: Boolean(process.env.STRIPE_SECRET_KEY),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    twilioAccount: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    twilioSender: Boolean(process.env.TWILIO_FROM_PHONE || process.env.TWILIO_MESSAGING_SERVICE_SID),
    ownerPhone: Boolean(process.env.OWNER_PHONE),
    brandonPhone: Boolean(process.env.BRANDON_PHONE),
    calendlyUrl: Boolean(process.env.NEXT_PUBLIC_CALENDLY_URL),
    calendlyPat: Boolean(process.env.CALENDLY_PAT),
    calendlyWebhookKey: Boolean(process.env.CALENDLY_WEBHOOK_KEY),
    bookingPhone: Boolean(process.env.NEXT_PUBLIC_BOOKING_PHONE),
    googleAnalytics: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    metaPixel: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  };

  return NextResponse.json({
    ok: true,
    readyForPayments: status.siteUrl && status.stripeSecret && status.stripeWebhook,
    readyForOperatorSms: status.twilioAccount && status.twilioSender && status.ownerPhone && status.brandonPhone,
    readyForCalendly: status.calendlyUrl,
    readyForCalendlySmsWebhook: status.calendlyUrl && status.calendlyPat && status.calendlyWebhookKey,
    status,
  });
}
