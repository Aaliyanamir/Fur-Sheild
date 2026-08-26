import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function EcosystemSection() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const features = [
    {
      title: "For Pet Parents",
      desc: "Complete medical history, real-time health tracking, and instant vet appointments in one unified space.",
      image: "/images/pet-owner.jpg",
      align: "left"
    },
    {
      title: "For Veterinarians",
      desc: "Streamlined clinical workflows, secure digital records, and effortless patient communication.",
      image: "/images/vet-clinic.jpg",
      align: "right"
    },
    {
      title: "For Rescue Shelters",
      desc: "Centralized adoption pipelines, intake management, and community integration.",
      image: "/images/shelter-dogs.jpg",
      align: "left"
    }
  ];

  return (
    <section className="relative w-full bg-bg-primary py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="mb-20 md:mb-32 max-w-3xl"
        >
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-espresso-900 tracking-tight leading-[1.1] mb-6">
            One platform.<br/>
            <span className="text-camel-500 italic font-medium">Three unified realities.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-espresso-500 font-medium max-w-xl leading-relaxed">
            We are replacing fragmented systems with a single, elegant ecosystem designed for the modern standard of animal welfare.
          </motion.p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={container}
              className={`flex flex-col gap-10 md:gap-16 items-center ${feature.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              {/* Image Container with Parallax-like reveal */}
              <motion.div variants={fadeUp} className="w-full md:w-1/2 relative group">
                <div className="overflow-hidden rounded-3xl aspect-[4/3] bg-camel-100">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-espresso-900/10 pointer-events-none"></div>
              </motion.div>

              {/* Text Content */}
              <motion.div variants={fadeUp} className="w-full md:w-1/2 flex flex-col items-start px-4 md:px-0">
                <h3 className="text-3xl lg:text-4xl font-display font-bold text-espresso-900 mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-espresso-800/70 font-medium leading-relaxed mb-8 max-w-md">
                  {feature.desc}
                </p>
                <button className="group flex items-center gap-3 text-camel-600 font-bold tracking-wide uppercase text-sm hover:text-camel-700 transition-colors">
                  Explore Features 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

