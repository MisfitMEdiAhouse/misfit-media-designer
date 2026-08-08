'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Attribution = {
  referral: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
};

type Answers = {
  loadSize: string;
  address: string;
  junkLocation: string;
  description: string;
  specialItems: string;
  preferredDate: string;
  preferredWindow: string;
  name: string;
  phone: string;
  email: string;
  smsConsent: boolean;
  termsAccepted: boolean;
};

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: RecognitionCtor;
    SpeechRecognition?: RecognitionCtor;
  }
}

const loadOptions = [
  ['Minimum Dispatch', '$275+'],
  ['Starter Load', '$375–$525'],
  ['Half Trailer', '$575–$750'],
  ['Full 14ft Trailer', '$950–$1,400'],
];

const locationOptions = ['Garage', 'Curb / driveway', 'Basement', 'Upstairs', 'Yard', 'Rental / move-out', 'Construction site'];
const windowOptions = ['Any business-hours window', '9 AM–11 AM', '11 AM–1 PM', '1 PM–3 PM', '3 PM–5 PM'];

export default function GuidedBooking({ attribution }: { attribution: Attribution }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [listeningField, setListeningField] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<RecognitionCtor> | null>(null);
  const [answers, setAnswers] = useState<Answers>({
    loadSize: 'Half Trailer',
    address: '',
    junkLocation: 'Garage',
    description: '',
    specialItems: '',
    preferredDate: '',
    preferredWindow: 'Any business-hours window',
    name: '',
    phone: '',
    email: '',
    smsConsent: true,
    termsAccepted: false,
  });

  const prompts = useMemo(() => [
    'First, pick the load size that looks closest. If you are not sure, half trailer is a good starting point and we confirm the final price before loading.',
    'Where are we picking up, and where is the junk located?',
    'Tell me what needs to go. A simple list is perfect.',
    'Any heavy or special items? If not, just leave it blank.',
    'What day and business-hours window works best?',
    'Last step. Tell us who to contact and confirm the booking terms.',
  ], []);

  function speak(text: string) {
    if (!voiceOn || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    if (open) speak(step === 0 ? `Welcome to Weber Junk Rescue. I can walk you through this in about a minute. ${prompts[0]}` : prompts[step]);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  function listen(field: keyof Answers) {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) return;
    recognitionRef.current?.stop();
    const recognition = new Ctor();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript || '';
      setAnswers((prev) => ({ ...prev, [field]: transcript }));
      setListeningField(null);
    };
    recognition.onend = () => setListeningField(null);
    recognition.onerror = () => setListeningField(null);
    recognitionRef.current = recognition;
    setListeningField(String(field));
    recognition.start();
  }

  function canContinue() {
    if (step === 0) return Boolean(answers.loadSize);
    if (step === 1) return Boolean(answers.address && answers.junkLocation);
    if (step === 2) return Boolean(answers.description.trim());
    if (step === 3) return true;
    if (step === 4) return true;
    return Boolean(answers.name && answers.phone && answers.email && answers.termsAccepted);
  }

  function close() {
    recognitionRef.current?.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setOpen(false);
  }

  return (
    <>
      <button className="button guide-launch" type="button" onClick={() => { setOpen(true); setStep(0); }}>
        <span className="guide-pulse" /> Guide Me Through Booking
      </button>
      {open ? (
        <div className="guide-overlay" role="dialog" aria-modal="true" aria-label="Guided junk removal booking">
          <div className="guide-shell">
            <div className="guide-topbar">
              <div className="guide-brand">
                <img src="/misfit-skull-rose.svg" alt="Misfit skull and rose" />
                <span><strong>Misfit Booking Guide</strong><small>Weber Junk Rescue</small></span>
              </div>
              <div className="guide-actions">
                <button className="guide-voice" type="button" onClick={() => setVoiceOn((value) => !value)}>{voiceOn ? '🔊 Voice on' : '🔇 Voice off'}</button>
                <button className="guide-close" type="button" onClick={close} aria-label="Close guided booking">×</button>
              </div>
            </div>

            <div className="guide-progress"><i style={{ width: `${((step + 1) / 6) * 100}%` }} /></div>
            <div className="guide-stage"><span>STEP {step + 1} OF 6</span><strong>{prompts[step]}</strong></div>

            <form action="/api/create-checkout-session" method="POST" className="guide-form">
              <input type="hidden" name="loadSize" value={answers.loadSize} />
              <input type="hidden" name="address" value={answers.address} />
              <input type="hidden" name="junkLocation" value={answers.junkLocation} />
              <input type="hidden" name="access" value="Not sure / guided booking" />
              <input type="hidden" name="description" value={answers.description} />
              <input type="hidden" name="specialItems" value={answers.specialItems} />
              <input type="hidden" name="preferredDate" value={answers.preferredDate} />
              <input type="hidden" name="preferredWindow" value={answers.preferredWindow} />
              <input type="hidden" name="name" value={answers.name} />
              <input type="hidden" name="phone" value={answers.phone} />
              <input type="hidden" name="email" value={answers.email} />
              <input type="hidden" name="smsConsent" value={answers.smsConsent ? 'yes' : ''} />
              <input type="hidden" name="termsAccepted" value={answers.termsAccepted ? 'yes' : ''} />
              <input type="hidden" name="referral" value={attribution.referral} />
              <input type="hidden" name="utmSource" value={attribution.utmSource} />
              <input type="hidden" name="utmMedium" value={attribution.utmMedium} />
              <input type="hidden" name="utmCampaign" value={attribution.utmCampaign} />
              <input type="hidden" name="utmContent" value="guided-booking" />

              {step === 0 ? <div className="guide-options">{loadOptions.map(([label, range]) => <button type="button" key={label} className={answers.loadSize === label ? 'guide-option selected' : 'guide-option'} onClick={() => setAnswers((prev) => ({ ...prev, loadSize: label }))}><b>{label}</b><span>{range}</span></button>)}</div> : null}

              {step === 1 ? <div className="guide-fields">
                <GuideInput label="Pickup address" value={answers.address} onChange={(value) => setAnswers((prev) => ({ ...prev, address: value }))} onMic={() => listen('address')} listening={listeningField === 'address'} placeholder="Street, city, ZIP" />
                <label><span>Where is the junk?</span><select value={answers.junkLocation} onChange={(e) => setAnswers((prev) => ({ ...prev, junkLocation: e.target.value }))}>{locationOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
              </div> : null}

              {step === 2 ? <GuideTextArea label="What needs to go?" value={answers.description} onChange={(value) => setAnswers((prev) => ({ ...prev, description: value }))} onMic={() => listen('description')} listening={listeningField === 'description'} placeholder="Couch, mattress, garage boxes, old fence panels..." /> : null}

              {step === 3 ? <GuideTextArea label="Heavy or special items" value={answers.specialItems} onChange={(value) => setAnswers((prev) => ({ ...prev, specialItems: value }))} onMic={() => listen('specialItems')} listening={listeningField === 'specialItems'} placeholder="Fridge, tires, concrete, shingles, hot tub... or leave blank" /> : null}

              {step === 4 ? <div className="guide-fields guide-fields-two"><label><span>Preferred date</span><input type="date" value={answers.preferredDate} onChange={(e) => setAnswers((prev) => ({ ...prev, preferredDate: e.target.value }))} /></label><label><span>Preferred window</span><select value={answers.preferredWindow} onChange={(e) => setAnswers((prev) => ({ ...prev, preferredWindow: e.target.value }))}>{windowOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div> : null}

              {step === 5 ? <div className="guide-fields">
                <GuideInput label="Name" value={answers.name} onChange={(value) => setAnswers((prev) => ({ ...prev, name: value }))} onMic={() => listen('name')} listening={listeningField === 'name'} placeholder="Your name" />
                <GuideInput label="Mobile phone" value={answers.phone} onChange={(value) => setAnswers((prev) => ({ ...prev, phone: value }))} onMic={() => listen('phone')} listening={listeningField === 'phone'} placeholder="801-555-0123" />
                <GuideInput label="Email" value={answers.email} onChange={(value) => setAnswers((prev) => ({ ...prev, email: value }))} onMic={() => listen('email')} listening={listeningField === 'email'} placeholder="you@example.com" />
                <label className="guide-check"><input type="checkbox" checked={answers.termsAccepted} onChange={(e) => setAnswers((prev) => ({ ...prev, termsAccepted: e.target.checked }))} /><span>I understand the final price is approved before loading and the $150 deposit applies to completed service.</span></label>
                <label className="guide-check"><input type="checkbox" checked={answers.smsConsent} onChange={(e) => setAnswers((prev) => ({ ...prev, smsConsent: e.target.checked }))} /><span>Send me booking-related texts. Reply STOP to opt out.</span></label>
              </div> : null}

              <div className="guide-nav">
                <button className="button button-secondary" type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Back</button>
                {step < 5 ? <button className="button" type="button" disabled={!canContinue()} onClick={() => setStep((value) => Math.min(5, value + 1))}>Continue</button> : <button className="button" type="submit" disabled={!canContinue()}>Reserve — Pay $150</button>}
              </div>
            </form>
            <div className="guide-foot"><span>🎙 Tap the mic on text fields to answer out loud.</span><span>Final price confirmed before loading.</span></div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function GuideInput({ label, value, onChange, onMic, listening, placeholder }: { label: string; value: string; onChange: (value: string) => void; onMic: () => void; listening: boolean; placeholder: string }) {
  return <label className="guide-input"><span>{label}</span><div><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /><button type="button" onClick={onMic} className={listening ? 'mic listening' : 'mic'} aria-label={`Speak ${label}`}>{listening ? '●' : '🎙'}</button></div></label>;
}

function GuideTextArea({ label, value, onChange, onMic, listening, placeholder }: { label: string; value: string; onChange: (value: string) => void; onMic: () => void; listening: boolean; placeholder: string }) {
  return <label className="guide-input"><span>{label}</span><div className="guide-text-wrap"><textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /><button type="button" onClick={onMic} className={listening ? 'mic listening' : 'mic'} aria-label={`Speak ${label}`}>{listening ? '●' : '🎙'}</button></div></label>;
}
