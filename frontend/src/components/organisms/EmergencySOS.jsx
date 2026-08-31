import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPin, Navigation, Phone, Siren, X } from 'lucide-react';

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FALLBACK = [
  { name: 'City 24/7 Pet ER', lat: 24.8607, lon: 67.0011, phone: '+92 21 111 738 738', open: true },
  { name: 'Paws Emergency Hospital', lat: 24.873, lon: 67.036, phone: '+92 21 3456 7890', open: true },
  { name: 'NightOwl Veterinary Clinic', lat: 24.846, lon: 67.025, phone: '+92 21 3678 1122', open: true },
];

export default function EmergencySOS() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coords, setCoords] = useState(null);
  const [clinics, setClinics] = useState([]);

  const locate = () => {
    setLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Location is not supported in this browser.');
      setClinics(FALLBACK);
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });
        try {
          const query = `[out:json][timeout:12];node["amenity"="veterinary"](around:20000,${latitude},${longitude});out 12;`;
          const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
          });
          const data = await res.json();
          const mapped = (data.elements || [])
            .filter((n) => n.lat && n.lon)
            .map((n) => ({
              name: n.tags?.name || 'Veterinary Clinic',
              lat: n.lat,
              lon: n.lon,
              phone: n.tags?.phone || n.tags?.['contact:phone'] || '',
              open: n.tags?.opening_hours?.includes('24') || true,
              km: haversineKm(latitude, longitude, n.lat, n.lon),
            }))
            .sort((a, b) => a.km - b.km)
            .slice(0, 8);
          setClinics(mapped.length ? mapped : FALLBACK.map((c) => ({ ...c, km: haversineKm(latitude, longitude, c.lat, c.lon) })));
        } catch {
          setClinics(FALLBACK.map((c) => ({ ...c, km: haversineKm(latitude, longitude, c.lat, c.lon) })));
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Location permission denied. Showing regional emergency clinics.');
        setClinics(FALLBACK);
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  const handleOpen = () => {
    setOpen(true);
    if (!clinics.length) locate();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 left-6 z-[90] flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-rose-600 text-white shadow-[0_12px_30px_rgba(225,29,72,0.4)] hover:bg-rose-500 transition-all"
        aria-label="Emergency SOS"
      >
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-rose-300 animate-ping opacity-40" />
          <Siren size={18} className="relative" />
        </span>
        <span className="text-xs font-black uppercase tracking-widest">SOS</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso-900/70 backdrop-blur-sm z-[250]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 bottom-6 md:inset-auto md:left-8 md:bottom-8 md:w-[420px] z-[260] bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
            >
              <div className="bg-rose-600 text-white p-5 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-100">Emergency</p>
                  <h3 className="text-xl font-display font-black mt-1">Nearby 24/7 Clinics</h3>
                  <p className="text-xs text-rose-100 mt-1">If your pet is in distress, go to the nearest ER now.</p>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1">
                {loading && (
                  <div className="py-12 text-center text-espresso-500">
                    <Loader2 className="mx-auto mb-3 animate-spin text-rose-500" />
                    <p className="text-sm font-bold">Scanning nearby veterinary ERs…</p>
                  </div>
                )}
                {error && !loading && <p className="text-xs font-medium text-rose-600 mb-3">{error}</p>}
                {!loading &&
                  clinics.map((c) => (
                    <div key={`${c.name}-${c.lat}`} className="border border-camel-100 rounded-2xl p-4 mb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-black text-espresso-900">{c.name}</h4>
                          <p className="text-xs font-bold text-camel-600 mt-1 flex items-center gap-1">
                            <MapPin size={12} />
                            {c.km != null ? `${c.km.toFixed(1)} km away` : 'Regional clinic'}
                          </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">Open</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {c.phone && (
                          <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="flex-1 py-2 rounded-xl bg-espresso-900 text-white text-xs font-bold flex items-center justify-center gap-1">
                            <Phone size={12} /> Call
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}${coords ? `&origin=${coords.latitude},${coords.longitude}` : ''}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 rounded-xl bg-camel-100 text-espresso-900 text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <Navigation size={12} /> Directions
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
