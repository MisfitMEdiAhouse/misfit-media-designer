import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import twilio from 'twilio';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata || {};
    const message = `NEW PAID JUNK BOOKING\nDeposit: $150 paid\nName: ${m.name || ''}\nPhone: ${m.phone || ''}\nAddress: ${m.address || ''}\nLoad: ${m.loadSize || ''}\nWhere: ${m.junkLocation || ''}\nWindow: ${m.preferredWindow || ''}\nReferral: ${m.referral || 'DIRECT'}\nSpecial: ${m.specialItems || ''}\nPhotos: ${m.photoLink || ''}\nDescription: ${(m.description || '').slice(0, 240)}`;

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE) {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const recipients = [process.env.OWNER_PHONE, process.env.BRANDON_PHONE].filter(Boolean) as string[];
      await Promise.all(recipients.map((to) => client.messages.create({ to, from: process.env.TWILIO_FROM_PHONE!, body: message })));
    }
  }

  return NextResponse.json({ received: true });
}
