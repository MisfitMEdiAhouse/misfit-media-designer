import twilio from 'twilio';

const OWNER_FALLBACK_PHONE = '+13853673217';
const BRANDON_FALLBACK_PHONE = '+18014589990';

export function normalizeUsPhone(value: string | undefined | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (value.trim().startsWith('+') && digits.length >= 11) return `+${digits}`;
  return null;
}

export function twilioConfigured() {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    (process.env.TWILIO_FROM_PHONE || process.env.TWILIO_MESSAGING_SERVICE_SID)
  );
}

export async function sendSms(toValue: string | undefined | null, body: string) {
  const to = normalizeUsPhone(toValue);
  if (!to || !twilioConfigured()) return { sent: false, reason: 'not_configured_or_invalid_phone' } as const;

  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  const routing = process.env.TWILIO_MESSAGING_SERVICE_SID
    ? { messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID }
    : { from: normalizeUsPhone(process.env.TWILIO_FROM_PHONE)! };

  const message = await client.messages.create({ to, body: body.slice(0, 1500), ...routing });
  return { sent: true, sid: message.sid } as const;
}

export function getOwnerPhone() {
  return normalizeUsPhone(process.env.OWNER_PHONE) || OWNER_FALLBACK_PHONE;
}

export function getBrandonPhone() {
  return normalizeUsPhone(process.env.BRANDON_PHONE) || BRANDON_FALLBACK_PHONE;
}

export async function sendOperatorSms(body: string, includeBrandon = true) {
  const recipients: string[] = [getOwnerPhone()];
  if (includeBrandon) recipients.push(getBrandonPhone());
  const unique = Array.from(new Set(recipients.filter(Boolean)));
  return Promise.all(unique.map((recipient) => sendSms(recipient, body)));
}
