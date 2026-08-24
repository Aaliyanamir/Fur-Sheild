import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Heart, 
  Calendar, 
  ShoppingBag, 
  Stethoscope, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Activity, 
  Clock, 
  Star, 
  Users, 
  Building, 
  FileText, 
  ShieldCheck,
  TrendingUp,
  Smile
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const Home = () => {
  return (
    <div className="space-y-0 font-sans bg-white overflow-hidden">
      {/* 1. HERO SECTION (Pure White Background, Centered, Ample Whitespace) */}
      <section className="bg-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 bg-brand-light border border-brand-sage/60 px-4 py-1.5 rounded-full text-xs font-extrabold text-brand-dark tracking-wide">
              <Shield className="w-4 h-4 text-brand-dark" />
              <span>Next-Gen MERN Veterinary & Pet Care Platform</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Complete Healthcare & Loving Care for <span className="text-brand-dark underline decoration-brand-sage underline-offset-8">Every Paw & Wing.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
              FurShield connects Pet Owners, Licensed Veterinarians, and Animal Rescue Shelters in one unified SaaS ecosystem. Track medical timelines, log clinical treatments, schedule appointments, and adopt pets.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="bg-brand-dark hover:bg-brand-darker text-white font-extrabold px-8 py-4 rounded-2xl text-sm shadow-md transition-all flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="bg-brand-sage hover:bg-emerald-200 text-brand-dark font-extrabold px-8 py-4 rounded-2xl text-sm transition-all flex items-center gap-2"
              >
                Explore Features
              </Link>
            </motion.div>
          </motion.div>

          {/* Large Floating Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white"
          >
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-[11px] font-mono text-slate-400 ml-4">https://furshield.app/dashboard</span>
            </div>

            <div className="p-6 bg-slate-50 relative">
              <img
                src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80"
                alt="FurShield SaaS Dashboard"
                className="w-full h-[420px] object-cover rounded-2xl border border-slate-200 shadow-sm"
              />

              {/* Overlay Badge Cards */}
              <div className="absolute top-10 left-10 hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-slate-200">
                <div className="bg-pastel-mint text-brand-dark p-2.5 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-brand-dark" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block">Digitized Vet Certificates</span>
                  <span className="text-[10px] text-slate-500 font-semibold">Verified Electronic Signature</span>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-slate-200">
                <div className="bg-pastel-blue text-blue-700 p-2.5 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 block">Visual Health Timeline</span>
                  <span className="text-[10px] text-emerald-600 font-bold">100% Up-To-Date</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. IMPACT / STATS STRIP SECTION */}
      <section className="bg-bg-soft py-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-3xl sm:text-4xl font-black text-brand-dark">10,000+</span>
              <p className="text-xs text-slate-500 font-extrabold mt-1 uppercase tracking-wider">Pet Profiles Managed</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-3xl sm:text-4xl font-black text-brand-dark">500+</span>
              <p className="text-xs text-slate-500 font-extrabold mt-1 uppercase tracking-wider">Verified Vets & Clinics</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-3xl sm:text-4xl font-black text-brand-dark">1,200+</span>
              <p className="text-xs text-slate-500 font-extrabold mt-1 uppercase tracking-wider">Happy Rescue Adoptions</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
              <span className="text-3xl sm:text-4xl font-black text-brand-dark">99.9%</span>
              <p className="text-xs text-slate-500 font-extrabold mt-1 uppercase tracking-wider">Platform Uptime</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. FEATURES GRID (The Ecosystem) */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3 max-w-2xl mx-auto"
          >
            <span className="text-xs font-extrabold uppercase text-brand-dark tracking-wider bg-brand-light px-3 py-1 rounded-full border border-brand-sage">
              Integrated SaaS Platform
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Four Core Modules, One Platform</h2>
            <p className="text-slate-600 text-sm font-medium">
              Eliminate fragmented records and disconnected communication with our role-tailored SaaS tools.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
              <div className="bg-pastel-mint text-brand-dark w-14 h-14 rounded-2xl flex items-center justify-center">
                <Activity className="w-7 h-7 text-brand-dark" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Visual Health Management</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Color-coded medical timelines for vaccinations, physical exams, and surgeries. Upload digitized vet certificates, lab reports, and export PDF records instantly.
              </p>
              <Link to="/owner-dashboard" className="inline-flex items-center text-xs font-extrabold text-brand-dark hover:underline pt-2">
                Explore Pet Owner Features →
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
              <div className="bg-pastel-blue text-blue-800 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-blue-700" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Veterinary Consultation Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Manage clinic appointment queues, approve bookings, access complete patient medical files, and securely log post-visit clinical diagnoses and prescriptions.
              </p>
              <Link to="/vet-dashboard" className="inline-flex items-center text-xs font-extrabold text-brand-dark hover:underline pt-2">
                Explore Veterinary Console →
              </Link>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
              <div className="bg-pastel-pink text-pink-800 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Building className="w-7 h-7 text-pink-700" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Rescue Shelter Adoption Network</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                List adoptable animals with health status tags, record daily feeding/grooming care logs, review incoming adopter interest forms, and finalize adoptions.
              </p>
              <Link to="/shelter-dashboard" className="inline-flex items-center text-xs font-extrabold text-brand-dark hover:underline pt-2">
                Explore Shelter Network →
              </Link>
            </motion.div>

            {/* Card 4 */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
              <div className="bg-pastel-yellow text-amber-800 w-14 h-14 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-amber-700" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Curated Pet Marketplace</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Shop vet-approved organic kibble, medicated shampoos, supplements, and ergonomic harnesses with real-time cart drawer state and mock checkout tracking.
              </p>
              <Link to="/shop" className="inline-flex items-center text-xs font-extrabold text-brand-dark hover:underline pt-2">
                Browse Marketplace →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Step-by-Step Flow) */}
      <section className="py-24 bg-bg-soft border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase text-brand-dark tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
              Simple 3-Step Journey
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">How FurShield Works</h2>
            <p className="text-slate-600 text-sm font-medium">Streamlined onboarding for pet parents, clinics, and rescue shelters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Create Pet Profile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Register your pet with species, breed, age, weight, microchip #, and upload past vet certificates.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Connect with Vets & Shelters</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schedule consultations with licensed veterinarians or submit adoption requests to rescue shelters.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-card space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-dark text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Track & Export Health Records</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitor vaccination reminders, receive AI care advice, and export structured PDF medical files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS / SOCIAL PROOF */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900">Trusted Across the Community</h2>
            <p className="text-slate-600 text-sm font-medium">Hear from pet parents, veterinary surgeons, and shelter managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-soft p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                "Having all of Buddy's vaccine certificates and health records digitized in one place saved us during our cross-state travel!"
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Alex Johnson" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alex Johnson</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Pet Parent (Golden Retriever)</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-soft p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                "FurShield's clinical treatment logger and appointment queue streamline our daily hospital routine significantly."
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80" alt="Dr. Sarah Connor" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Connor, DVM</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Lead Veterinary Surgeon</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-soft p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex text-amber-400 space-x-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed font-medium">
                "We managed over 25 successful rescue adoptions this month using FurShield's adopter coordination tools."
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" alt="Sarah Miller" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sarah Miller</h4>
                  <span className="text-[10px] text-slate-500 font-semibold">Happy Tails Shelter Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION (Deep Forest Green Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-brand-dark rounded-3xl p-8 sm:p-14 text-white shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Give Your Pet the Healthcare They Deserve?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-medium max-w-xl mx-auto">
              Join thousands of pet parents, licensed veterinarians, and rescue shelters on the FurShield ecosystem today.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-brand-sage hover:bg-emerald-200 text-brand-dark font-black px-8 py-4 rounded-2xl text-sm shadow-lg transition-all inline-flex items-center gap-2"
              >
                Join FurShield Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
