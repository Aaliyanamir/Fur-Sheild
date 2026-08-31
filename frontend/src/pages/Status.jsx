import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const services = [
  { name: 'Web application', status: 'Operational' },
  { name: 'Appointments API', status: 'Operational' },
  { name: 'Shop & checkout', status: 'Operational' },
  { name: 'Adoption pipeline', status: 'Operational' },
  { name: 'Notifications', status: 'Operational' },
];

export default function Status() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-display font-black text-espresso-900 mb-2">System Status</h1>
      <p className="text-espresso-500 mb-8">All core services are running normally.</p>
      <div className="bg-white rounded-[2rem] border border-camel-100 divide-y divide-camel-100 overflow-hidden">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between px-6 py-5">
            <span className="font-bold text-espresso-900">{s.name}</span>
            <span className="flex items-center gap-2 text-emerald-700 text-sm font-bold">
              <CheckCircle2 size={16} /> {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
