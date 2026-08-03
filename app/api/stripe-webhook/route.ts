import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOperatorSms, sendSms } from '../../../lib/twilio';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) return new NextResponse('Stripe webhook is not configured', { status: 503 });

  const stripe = new Stripe(secretKey);
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown signature error';
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') return NextResponse.json({ received: true });

  try {
    const incoming = event.data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(incoming.id);
    const m = session.metadata || {};

    if (m.operatorNotified === 'true') return NextResponse.json({ received: true, duplicate: true });

    const operatorMessage = [
      'PAID JUNK BOOKING — ACTION REQUIRED',
      'Deposit: $150 PAID',
      `Name: ${m.name || session.customer_details?.name || ''}`,
      `Phone: ${m.phone || session.customer_details?.phone || ''}`,
      `Email: ${m.email || session.customer_details?.email || ''}`,
      `Address: ${m.address || ''}`,
      `Load: ${m.loadSize || ''}`,
      `Location/access: ${m.junkLocation || ''} / ${m.access || ''}`,
      `Preferred: ${m.preferredDate || 'Not selected'} ${m.preferredWindow || ''}`,
      `Special: ${m.specialItems || 'None listed'}`,
      `Photos: ${m.photoLink || 'Not supplied'}`,
      `Source: ${m.referral || 'DIRECT'} / ${m.utmSource || 'direct'} / ${m.utmCampaign || ''}`,
      `Description: ${(m.description || '').slice(0, 350)}`,
      'Next: Customer must complete the Calendly pickup booking.',
    ].join('\n');

    await sendOperatorSms(operatorMessage, true);

    if (m.smsConsent === 'yes' && m.phone) {
      const calendly = process.env.NEXT_PUBLIC_CALENDLY_URL;
      const customerMessage = calendly
        ? `Weber Junk Rescue: Your $150 deposit is received and applied to your haul. Book your pickup window here: ${calendly} Reply STOP to opt out.`
        : 'Weber Junk Rescue: Your $150 deposit is received and applied to your haul. We will contact you to confirm the pickup window. Reply STOP to opt out.';
      await sendSms(m.phone, customerMessage);
    }

    await stripe.checkout.sessions.update(session.id, {
      metadata: { ...m, operatorNotified: 'true', operatorNotifiedAt: new Date().toISOString() },
    });
  } catch (error) {
    console.error('Paid booking fulfillment failed', error);
    return new NextResponse('Booking notification failed', { status: 500 });
  }

  return NextResponse.json({ received: true });
}
