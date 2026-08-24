import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, MapPin, Phone, Compass, X, CheckCircle2, ShieldAlert, Navigation } from 'lucide-react';

const emergencyClinics = [
  {
    id: 'c1',
    name: 'Metropolitan 24/7 Animal Emergency Hospital',
    distance: '1.2 km away',
    address: '450 Emergency Center Blvd, Tech City',
    phone: '+1 (800) 555-9111',
    openStatus: 'Open 24 Hours • Emergency Staff On Duty',
    doctorOnDuty: 'Dr. Marcus Vance (Emergency Surgeon)'
  },
  {
    id: 'c2',
    name: 'Paws & Claws Trauma & Urgent Care Center',
    distance: '3.4 km away',
    address: '128 Health Avenue, Tech City',
    phone: '+1 (800) 555-8822',
    openStatus: 'Open 24 Hours • ICU Unit Active',
    doctorOnDuty: 'Dr. Sarah Connor (DVM)'
  },
  {
    id: 'c3',
    name: 'Central Pet Poison & Trauma Helpline Clinic',
    distance: '5.8 km away',
    address: '89 Rescue Parkway, Tech City',
    phone: '+1 (800) 555-7733',
    openStatus: 'Open 24 Hours • Poison Hotline',
    doctorOnDuty: 'Dr. Emily Watson (DVM)'
  }
];

const EmergencySOS = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLocateMe = () => {
    setLocating(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(4),
          lng: position.coords.longitude.toFixed(4)
        });
        setLocating(false);
      },
      (err) => {
        // Fallback mock coordinates if permission denied or error
        setLocation({ lat: '40.7128', lng: '-74.0060' });
        setErrorMsg('Using default location (Permission requested or denied).');
        setLocating(false);
      },
      { timeout: 5000 }
    );
  };

  return (
    <>
      {/* FLOATING PROMINENT SOS BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          if (!location) handleLocateMe();
        }}
        className="fixed bottom-24 right-6 z-40 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-xl flex items-center gap-2.5 font-extrabold text-xs tracking-wider uppercase border-2 border-white"
      >
        <AlertCircle className="w-5 h-5 animate-pulse text-white" />
        <span>SOS 24/7 Vet Clinic</span>
      </motion.button>

      {/* EMERGENCY MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-slate-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 text-red-600 p-3 rounded-2xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      24/7 Emergency Vet Clinic Locator
                      <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase animate-pulse">
                        SOS Urgent
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Locate trauma centers, poison control, and 24/7 veterinary hospitals near you.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Location Status Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center space-x-2.5 text-xs text-slate-700 font-semibold">
                  <Compass className={`w-4 h-4 text-slate-500 ${locating ? 'animate-spin' : ''}`} />
                  <span>
                    {locating
                      ? 'Detecting your coordinates...'
                      : location
                      ? `GPS Position: Lat ${location.lat}, Lng ${location.lng}`
                      : 'Coordinates not detected yet.'}
                  </span>
                </div>

                <button
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Re-Detect Location</span>
                </button>
              </div>

              {errorMsg && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
                  {errorMsg}
                </p>
              )}

              {/* Google Maps Placeholder iframe */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 h-60 relative bg-slate-100">
                <iframe
                  title="Emergency Vet Locator Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d144.9537363153167!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>

              {/* Nearby Emergency Clinics List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Verified 24/7 Trauma Hospitals
                </h3>

                <div className="space-y-3">
                  {emergencyClinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md">
                            {clinic.distance}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{clinic.name}</h4>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {clinic.address}
                        </p>
                        <p className="text-[11px] text-slate-600 font-medium">
                          {clinic.openStatus} • On Duty: {clinic.doctorOnDuty}
                        </p>
                      </div>

                      <a
                        href={`tel:${clinic.phone}`}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Hotline
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencySOS;
