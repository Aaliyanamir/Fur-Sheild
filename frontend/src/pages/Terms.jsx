import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-display font-black text-espresso-900 mb-4">Terms of Service</h1>
      <p className="text-sm text-espresso-500 mb-8">Last updated August 28, 2026</p>
      <div className="bg-white rounded-[2rem] border border-camel-100 p-8 space-y-5 text-espresso-700 leading-relaxed">
        <p>FurShield is a coordination platform. Veterinary advice from the AI assistant is educational and does not replace an in-person clinical exam.</p>
        <p>Adoption applications are reviewed by partner shelters. Listing a pet does not guarantee approval.</p>
        <p>Shop orders are fulfilled subject to stock. Prescription items may require verification from a licensed veterinarian.</p>
        <p>Misuse of Emergency SOS, fraudulent listings, or harassment of clinic staff may result in account suspension.</p>
      </div>
    </div>
  );
}
