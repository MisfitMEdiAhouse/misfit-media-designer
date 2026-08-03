# Weber Junk Rescue / Misfit Junk Booking Funnel

Roads-style command-center junk removal funnel for Weber County.

## Flow

Ad / QR -> site -> customer form -> $150 Stripe dispatch deposit -> Stripe webhook -> Twilio SMS to owner + Brandon -> success page -> Calendly pickup window.

## Deploy

Import this repo into Vercel.

## Required Vercel environment variables

```bash
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-URL.vercel.app
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/YOURNAME/junk-pickup

STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_FROM_PHONE=+1xxxxxxxxxx
OWNER_PHONE=+1xxxxxxxxxx
BRANDON_PHONE=+1xxxxxxxxxx
```

## Stripe webhook

Add endpoint:

```text
https://YOUR-VERCEL-URL.vercel.app/api/stripe-webhook
```

Event:

```text
checkout.session.completed
```

## Referral links

```text
https://YOUR-VERCEL-URL.vercel.app?ref=BRANDON
https://YOUR-VERCEL-URL.vercel.app?ref=JON
https://YOUR-VERCEL-URL.vercel.app?ref=FLYER-OGDEN
https://YOUR-VERCEL-URL.vercel.app?ref=FACEBOOK
https://YOUR-VERCEL-URL.vercel.app?ref=INSTAGRAM
```

## Pricing

- Minimum Dispatch: $275+
- Starter Load: $375-$525
- Half Trailer: $575-$750
- Full 14ft Trailer: $950-$1,400
- Deposit: $150
