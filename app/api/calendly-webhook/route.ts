import { NextResponse } from 'next/server';
import { sendOperatorSms } from '../../../lib/twilio';

export const runtime = 'nodejs';

function mountainTime(value: unknown) {
  if (typeof value !== 'string' || !value) return 'Time not supplied';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

export async function POST(req: Request) {
  const expectedKey = process.env.CALENDLY_WEBHOOK_KEY;
  const suppliedKey = new URL(req.url).searchParams.get('key');
  if (!expectedKey || suppliedKey !== expectedKey) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const body = await req.json();
    const eventType = String(body?.event || '');
    const payload = body?.payload || {};
    const scheduled = payload?.scheduled_event || {};
    const tracking = payload?.tracking || {};
    const eventName = scheduled?.name || 'Junk Removal Pickup';
    const start = mountainTime(scheduled?.start_time);
    const inviteeName = payload?.name || 'Customer';
    const inviteeEmail = payload?.email || '';
    const cancelReason = payload?.cancellation?.reason || payload?.cancel_reason || '';
    const source = tracking?.utm_source || tracking?.utm_campaign || 'Calendly';

    if (eventType === 'invitee.created') {
      const message = [
        'CALENDAR BOOKED — JUNK PICKUP',
        `Customer: ${inviteeName}`,
        `Email: ${inviteeEmail}`,
        `When: ${start}`,
        `Event: ${eventName}`,
        `Source: ${source}`,
        'Status: Pickup window confirmed',
      ].join('\n');
      await sendOperatorSms(message, true);
    } else if (eventType === 'invitee.canceled') {
      const message = [
        'JUNK PICKUP CANCELED / RESCHEDULED',
        `Customer: ${inviteeName}`,
        `Email: ${inviteeEmail}`,
        `Original time: ${start}`,
        `Reason: ${cancelReason || 'Not supplied'}`,
        `Rescheduled: ${payload?.rescheduled ? 'Yes' : 'No'}`,
      ].join('\n');
      await sendOperatorSms(message, true);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Calendly webhook error', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
