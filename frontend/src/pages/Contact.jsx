import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', topic: 'Support', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', topic: 'Support', message: '' });
      toast('Message received. Our team will reply within 24 hours.');
    }, 700);
  };

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] pb-20">
      <div className="bg-espresso-900 pt-20 pb-28 px-4 text-center">
        <h1 className="text-5xl font-display font-black text-white mb-4">We are here to help</h1>
        <p className="text-camel-200 max-w-xl mx-auto">Owners, clinics, and shelters — one inbox for the whole ecosystem.</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-16 grid md:grid-cols-5 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[
            { icon: Mail, label: 'Email', value: 'hello@furshield.app' },
            { icon: Phone, label: 'Care line', value: '+92 21 111 387 743' },
            { icon: MapPin, label: 'HQ', value: 'Karachi, Pakistan' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-3xl border border-camel-100 p-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-camel-100 text-camel-800 flex items-center justify-center">
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-camel-600">{item.label}</p>
                <p className="font-bold text-espresso-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-[2rem] border border-camel-100 shadow-xl p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm" />
          </div>
          <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm font-bold">
            <option>Support</option>
            <option>Partnerships</option>
            <option>Shelter onboarding</option>
            <option>Veterinary clinics</option>
          </select>
          <textarea required rows="5" placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm resize-none" />
          <button disabled={sending} className="w-full bg-espresso-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
            <Send size={16} /> {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
