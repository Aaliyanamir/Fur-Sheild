import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShoppingBag, Stethoscope, UserPlus } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your profile',
    body: 'Sign up as an owner, vet, or shelter in under a minute.',
    to: '/signup',
  },
  {
    icon: Stethoscope,
    title: 'Book trusted care',
    body: 'Find verified veterinarians and lock in a visit that fits your day.',
    to: '/book-vet',
  },
  {
    icon: HeartHandshake,
    title: 'Adopt with confidence',
    body: 'Meet rescues, submit an application, and track every step.',
    to: '/adopt',
  },
  {
    icon: ShoppingBag,
    title: 'Shop essentials',
    body: 'Nutrition, toys, and health supplies — delivered when you need them.',
    to: '/shop',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-[#FAF8F5] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-camel-600 mb-3">Simple by design</p>
          <h2 className="text-4xl md:text-5xl font-display font-black text-espresso-900">How FurShield works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                to={s.to}
                className="group bg-white rounded-[2rem] border border-camel-100 p-7 hover:shadow-xl hover:border-camel-300 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-camel-100 text-camel-800 flex items-center justify-center mb-5 group-hover:bg-camel-600 group-hover:text-white transition-colors">
                  <Icon size={22} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-camel-500 mb-2">Step 0{i + 1}</p>
                <h3 className="text-xl font-black text-espresso-900 mb-2">{s.title}</h3>
                <p className="text-sm text-espresso-500 leading-relaxed">{s.body}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
