import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';

export default function TrustSection() {
  // BACKEND PREP: This data structure simulates an API response (e.g., from GET /api/metrics)
  const apiMockData = {
    metrics: [
      { id: 1, value: "10k+", label: "Active Pets" },
      { id: 2, value: "500+", label: "Verified Vets" },
      { id: 3, value: "99.9%", label: "Uptime SLA" },
      { id: 4, value: "24/7", label: "Emergency Support" }
    ],
    testimonials: [
      {
        id: 101,
        quote: "FurShield completely transformed how we manage our shelter. The intake pipeline and medical tracking are flawless.",
        author: "Sarah Jenkins",
        role: "Director, City Paws Rescue",
        rating: 5
      },
      {
        id: 102,
        quote: "As a clinical vet, having instant access to a pet's complete digital history before they even walk in is game-changing.",
        author: "Dr. Mark Thorne",
        role: "Lead Veterinarian",
        rating: 5
      }
    ]
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative w-full bg-espresso-900 py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Metrics Grid (Data-Driven) */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 py-12 border-y border-white/10"
        >
          {apiMockData.metrics.map((metric) => (
            <motion.div key={metric.id} variants={fadeUp} className="flex flex-col items-center justify-center text-center">
              <h4 className="text-4xl lg:text-5xl font-display font-bold text-white mb-2">{metric.value}</h4>
              <p className="text-sm font-bold tracking-widest uppercase text-camel-400">{metric.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials (Data-Driven) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-camel-500" size={24} />
              <span className="text-xs font-bold tracking-[0.2em] text-camel-300 uppercase">Trusted Ecosystem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6">
              Built for trust. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-camel-400 to-camel-600 italic">Engineered for care.</span>
            </h2>
          </motion.div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {apiMockData.testimonials.map((testimonial, idx) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-camel-500 fill-camel-500" />
                    ))}
                  </div>
                  <p className="text-white/80 font-medium leading-relaxed mb-8">"{testimonial.quote}"</p>
                </div>
                <div>
                  <p className="text-white font-bold">{testimonial.author}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
