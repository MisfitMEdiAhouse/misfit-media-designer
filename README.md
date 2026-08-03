# Weber Junk Rescue

Mobile-first Weber County junk-removal funnel owned and operated through Misfit Mediahouse.

## Live customer flow

1. Ad, social post, or tracked QR opens the site.
2. Customer chooses a load range and submits job details.
3. Owner receives a pending-checkout SMS.
4. Customer pays a $150 dispatch deposit through the owner's Stripe account.
5. Stripe webhook notifies the owner and Brandon that the deposit is paid.
6. Customer is sent to Calendly to choose the pickup window.
7. Calendly webhook notifies the owner and Brandon when the exact appointment is booked, canceled, or rescheduled.
8. Final price is approved before loading. Owner controls customer collection and pays Brandon as subcontractor.

## Phone-only Vercel deployment

1. On your phone, sign in to Vercel with the GitHub account connected to `MisfitMEdiAhouse`.
2. Tap **Add New > Project**.
3. Import `MisfitMEdiAhouse/misfit-media-designer`.
4. Framework should detect as **Next.js**. Tap **Deploy**.
5. Copy the new Vercel URL.
6. Open the Vercel project, go to **Settings > Environment Variables**, and add every required value from `.env.example`.
7. Set `NEXT_PUBLIC_SITE_URL` to the exact Vercel URL with `https://` and no trailing slash.
8. Redeploy once after the environment variables are saved.

## Required environment variables

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_CALENDLY_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_FROM_PHONE or TWILIO_MESSAGING_SERVICE_SID
OWNER_PHONE
BRANDON_PHONE
SETUP_KEY
```

Recommended:

```text
NEXT_PUBLIC_BOOKING_PHONE
CALENDLY_PAT
CALENDLY_WEBHOOK_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_META_PIXEL_ID
```

Brandon's number currently prepared for the environment value:

```text
BRANDON_PHONE=+18014589990
```

## Stripe setup

Start with Stripe test keys.

Create a webhook destination:

```text
https://YOUR-LIVE-DOMAIN/api/stripe-webhook
```

Subscribe to:

```text
checkout.session.completed
```

Copy the webhook signing secret into:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
```

Run one complete $150 test-mode checkout. Confirm:

- owner receives pending lead SMS;
- owner and Brandon receive paid-booking SMS;
- success page opens;
- Calendly link opens with customer name/email prefilled.

Only then replace the Stripe test key and webhook with live mode values.

## Calendly setup

Create an event type called **Junk Removal Pickup Window**.

Recommended availability:

```text
Monday-Friday
9:00 AM-5:00 PM
America/Denver
```

Set realistic buffers and daily booking limits based on trailer capacity and dump runs.

For automatic Twilio notices when the exact appointment is booked:

1. Generate a Calendly personal access token.
2. Add it to Vercel as `CALENDLY_PAT`.
3. Add a long private value as `CALENDLY_WEBHOOK_KEY`.
4. Redeploy.
5. Open the protected setup dashboard:

```text
https://YOUR-LIVE-DOMAIN/admin/setup?key=YOUR_SETUP_KEY
```

6. Tap **Register Calendly Webhook**.

If the Calendly plan does not support webhooks, configure Calendly's built-in email/calendar notifications for Brandon as the fallback.

## Private setup dashboard

After deployment:

```text
https://YOUR-LIVE-DOMAIN/admin/setup?key=YOUR_SETUP_KEY
```

It shows which services are configured, the exact Stripe webhook endpoint, the Calendly registration button, health status, and a link to the QR flyer.

Never share `SETUP_KEY`, Stripe keys, Twilio auth token, Calendly token, or webhook secrets.

## Referral and campaign URLs

```text
https://YOUR-LIVE-DOMAIN?ref=BRANDON&utm_source=brandon&utm_medium=referral&utm_campaign=launch
https://YOUR-LIVE-DOMAIN?ref=FLYER-OGDEN&utm_source=door-hanger&utm_medium=qr&utm_campaign=ogden-launch
https://YOUR-LIVE-DOMAIN?ref=FACEBOOK&utm_source=facebook&utm_medium=organic&utm_campaign=weber-launch
https://YOUR-LIVE-DOMAIN?ref=INSTAGRAM&utm_source=instagram&utm_medium=social&utm_campaign=weber-launch
```

Referral, UTM source, medium, campaign, and content are stored in Stripe metadata and included in operator notifications.

## QR flyer

Open:

```text
https://YOUR-LIVE-DOMAIN/qr?ref=FLYER-OGDEN
```

Change the `ref` value for every channel, neighborhood, person, or physical flyer batch. The page generates its own high-error-correction SVG QR code and can be printed or saved from a phone.

Examples:

```text
/qr?ref=BRANDON
/qr?ref=FLYER-ROY
/qr?ref=FACEBOOK
/qr?ref=CREW01
```

## Pricing currently encoded

- Route-fit minimum: **$275+**
- Starter load: **$375-$525**
- Half trailer: **$575-$750**
- Full 14ft trailer: **$950-$1,400**
- Dispatch deposit: **$150**, credited to completed service
- Heavy, specialty, and regulated items require confirmation

## Important operating rule

The site is a sales and booking system, not permission to accept every material. Before launch, confirm insurance, towing/weight limits, landfill rules, prohibited materials, subcontractor terms, payment/refund policy, and required local business registrations.
