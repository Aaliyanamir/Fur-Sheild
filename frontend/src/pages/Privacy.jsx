import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-display font-black text-espresso-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-espresso-500 mb-8">Last updated August 28, 2026</p>
      <div className="bg-white rounded-[2rem] border border-camel-100 p-8 space-y-5 text-espresso-700 leading-relaxed">
        <p>FurShield collects only the information needed to run pet health records, appointments, adoptions, and shop orders.</p>
        <p>Account data, pet medical history, and order details are stored securely and are never sold to third-party advertisers.</p>
        <p>Location is requested only when you use Emergency SOS, and is used in-session to rank nearby clinics. We do not store a live location trail.</p>
        <p>You may request deletion of your account and associated records by writing to hello@furshield.app.</p>
      </div>
    </div>
  );
}
