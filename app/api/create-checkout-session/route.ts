import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as any });

export async function POST(req: Request) {
  const form = await req.formData();
  const data: Record<string, string> = {};
  for (const [key, value] of form.entries()) data[key] = String(value || '');

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?cancelled=1&ref=${encodeURIComponent(data.referral || 'DIRECT')}`,
    customer_creation: 'if_required',
    phone_number_collection: { enabled: true },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: 15000,
          product_data: {
            name: 'Junk Removal Dispatch Deposit',
            description: 'Deposit applies to final Weber County junk removal total.',
          },
        },
      },
    ],
    metadata: data,
  });

  return NextResponse.redirect(session.url || origin, { status: 303 });
}
