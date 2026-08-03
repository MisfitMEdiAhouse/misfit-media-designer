'use client';

export default function PrintButton() {
  return <button className="button" type="button" onClick={() => window.print()}>Print / Save Flyer</button>;
}
