'use client';

import { useState } from 'react';

type Attribution = {
  referral: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
};

const loads = [
  { value: 'Minimum Dispatch', label: 'Minimum', range: '$275+' },
  { value: 'Starter Load', label: 'Starter', range: '$375–$525' },
  { value: 'Half Trailer', label: 'Half Trailer', range: '$575–$750' },
  { value: 'Full 14ft Trailer', label: 'Full Trailer', range: '$950–$1,400' },
];

export default function BookingForm({
  attribution,
  bookingPhone,
}: {
  attribution: Attribution;
  bookingPhone: string;
}) {
  const [loadSize, setLoadSize] = useState('Half Trailer');
  const selected = loads.find((load) => load.value === loadSize) || loads[2];
  const smsHref = bookingPhone
    ? `sms:${bookingPhone}?body=${encodeURIComponent('I am booking a Weber Junk Rescue pickup and want to send load photos.')}`
    : '#';

  function trackCheckout() {
    const win = window as typeof window & {
      dataLayer?: Array<Record<string, unknown>>;
      fbq?: (...args: unknown[]) => void;
    };
    win.dataLayer?.push({
      event: 'junk_checkout_started',
      load_size: loadSize,
      referral: attribution.referral,
      value: 150,
      currency: 'USD',
    });
    win.fbq?.('track', 'InitiateCheckout', {
      value: 150,
      currency: 'USD',
      content_name: loadSize,
    });
  }

  return (
    <form className="booking-form" action="/api/create-checkout-session" method="POST" onSubmit={trackCheckout}>
      <input type="hidden" name="loadSize" value={loadSize} />
      <input type="hidden" name="referral" value={attribution.referral} />
      <input type="hidden" name="utmSource" value={attribution.utmSource} />
      <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
      <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
      <input type="hidden" name="utmContent" value={attribution.utmContent} />

      <div className="form-step"><strong>1. Choose the closest load size</strong><span>FINAL PRICE CONFIRMED ON-SITE</span></div>
      <div className="load-picker">
        {loads.map((load) => (
          <label className="load-option" key={load.value}>
            <input
              type="radio"
              name="loadPicker"
              value={load.value}
              checked={loadSize === load.value}
              onChange={() => setLoadSize(load.value)}
            />
            <span><b>{load.label}</b><em>{load.range}</em></span>
          </label>
        ))}
      </div>

      <div className="form-step"><strong>2. Tell us about the job</strong><span>ABOUT 2 MINUTES</span></div>
      <div className="form-grid">
        <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required autoComplete="name" placeholder="Your name" maxLength={80} /></div>
        <div className="field"><label htmlFor="phone">Mobile phone</label><input id="phone" name="phone" required autoComplete="tel" inputMode="tel" placeholder="(801) 555-0123" maxLength={30} /></div>
        <div className="field field-full"><label htmlFor="email">Email</label><input id="email" name="email" required autoComplete="email" type="email" placeholder="you@example.com" maxLength={120} /></div>
        <div className="field field-full"><label htmlFor="address">Pickup address</label><input id="address" name="address" required autoComplete="street-address" placeholder="Street address, city, ZIP" maxLength={180} /></div>
        <div className="field"><label htmlFor="junkLocation">Where is the junk?</label><select id="junkLocation" name="junkLocation" required defaultValue="Garage"><option>Garage</option><option>Curb / driveway</option><option>Basement</option><option>Upstairs</option><option>Yard</option><option>Rental / move-out</option><option>Construction site</option></select></div>
        <div className="field"><label htmlFor="access">Access</label><select id="access" name="access" required defaultValue="Ground level / easy access"><option>Ground level / easy access</option><option>Stairs involved</option><option>Long carry</option><option>Gate / tight access</option><option>Elevator</option><option>Not sure</option></select></div>
        <div className="field field-full"><label htmlFor="description">What needs to go?</label><textarea id="description" name="description" required placeholder="Example: sectional couch, two dressers, boxes, old fence panels, and garage junk." maxLength={500} /></div>
        <div className="field field-full"><label htmlFor="specialItems">Heavy or special items</label><input id="specialItems" name="specialItems" placeholder="Mattress, fridge, TV, tires, concrete, dirt, shingles, hot tub, shed, paint, etc." maxLength={250} /><small>List anything unusually heavy, regulated, or costly to dispose of.</small></div>
        <div className="field"><label htmlFor="preferredDate">Preferred date</label><input id="preferredDate" name="preferredDate" type="date" /></div>
        <div className="field"><label htmlFor="preferredWindow">Preferred window</label><select id="preferredWindow" name="preferredWindow" defaultValue="Any business-hours window"><option>Any business-hours window</option><option>9 AM–11 AM</option><option>11 AM–1 PM</option><option>1 PM–3 PM</option><option>3 PM–5 PM</option></select></div>
        <div className="field field-full"><label htmlFor="photoLink">Photo-share link (optional)</label><input id="photoLink" name="photoLink" type="url" placeholder="Google Photos, iCloud, Dropbox, etc." maxLength={300} /><small>{bookingPhone ? <a href={smsHref}>Or tap here to text the photos.</a> : 'You can send photos after the deposit.'}</small></div>
      </div>

      <div className="estimate-bar"><span>Selected planning range</span><b>{selected.range}</b></div>
      <label className="consent-row">
        <input type="checkbox" name="termsAccepted" value="yes" required />
        <span>I understand this is a planning range, the final price is approved before loading, the $150 deposit applies to completed service, and prohibited or undisclosed materials may be declined.</span>
      </label>
      <label className="consent-row">
        <input type="checkbox" name="smsConsent" value="yes" />
        <span>I agree to receive booking-related text messages at the number provided. Message and data rates may apply. Reply STOP to opt out.</span>
      </label>
      <div className="submit-row">
        <button className="button" type="submit">Reserve Pickup — Pay $150</button>
        <span className="submit-note">Secure Stripe Checkout. Deposit is credited toward your completed haul.</span>
      </div>
    </form>
  );
}
