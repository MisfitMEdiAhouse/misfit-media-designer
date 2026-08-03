import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendOperatorSms } from '../../../lib/twilio';

export const runtime = 'nodejs';

function field(form: FormData, key: string, max = 500) {
  return String(form.get(key) || '').trim().slice(0, max);
}

export async function POST(req: Request) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, '');
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return NextResponse.redirect(`${origin}/?error=checkout`, { status: 303 });

  try {
    const form = await req.formData();
    const metadata = {
      name: field(form, 'name', 80),
      phone: field(form, 'phone', 30),
      email: field(form, 'email', 120),
      address: field(form, 'address', 180),
      loadSize: field(form, 'loadSize', 80),
      junkLocation: field(form, 'junkLocation', 80),
      access: field(form, 'access', 80),
      description: field(form, 'description', 500),
      specialItems: field(form, 'specialItems', 250),
      preferredDate: field(form, 'preferredDate', 30),
      preferredWindow: field(form, 'preferredWindow', 80),
      photoLink: field(form, 'photoLink', 300),
      referral: field(form, 'referral', 80) || 'DIRECT',
      utmSource: field(form, 'utmSource', 80),
      utmMedium: field(form, 'utmMedium', 80),
      utmCampaign: field(form, 'utmCampaign', 80),
      utmContent: field(form, 'utmContent', 80),
      smsConsent: field(form, 'smsConsent', 10),
      termsAccepted: field(form, 'termsAccepted', 10),
      operatorNotified: 'false',
    };

    if (!metadata.name || !metadata.phone || !metadata.email || !metadata.address || !metadata.description || metadata.termsAccepted !== 'yes') {
      return NextResponse.redirect(`${origin}/?error=checkout&ref=${encodeURIComponent(metadata.referral)}`, { status: 303 });
    }

    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?cancelled=1&ref=${encodeURIComponent(metadata.referral)}`,
      customer_creation: 'always',
      customer_email: metadata.email,
      client_reference_id: metadata.referral,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: 15000,
          product_data: {
            name: 'Weber Junk Rescue Dispatch Deposit',
            description: 'Applied to the final approved junk-removal total.',
          },
        },
      }],
      payment_intent_data: {
        description: `Weber Junk Rescue deposit — ${metadata.name}`,
        metadata: { referral: metadata.referral, loadSize: metadata.loadSize, phone: metadata.phone },
      },
      metadata,
      custom_text: {
        submit: { message: 'Your $150 deposit is applied to the final approved haul total.' },
      },
    });

    const pendingMessage = [
      'NEW JUNK LEAD — CHECKOUT STARTED',
      `Name: ${metadata.name}`,
      `Phone: ${metadata.phone}`,
      `Address: ${metadata.address}`,
      `Load: ${metadata.loadSize}`,
      `Preferred: ${metadata.preferredDate || 'Not selected'} ${metadata.preferredWindow || ''}`,
      `Source: ${metadata.referral} / ${metadata.utmSource || 'direct'}`,
      'Status: Deposit not paid yet',
    ].join('\n');

    try {
      await sendOperatorSms(pendingMessage, false);
    } catch (smsError) {
      console.error('Pending lead SMS failed', smsError);
    }

    return NextResponse.redirect(session.url || origin, { status: 303 });
  } catch (error) {
    console.error('Checkout session error', error);
    return NextResponse.redirect(`${origin}/?error=checkout`, { status: 303 });
  }
}
