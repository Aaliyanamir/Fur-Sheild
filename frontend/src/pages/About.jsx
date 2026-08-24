import React from 'react';
import { Shield, Heart, CheckCircle2, Users, Award, Stethoscope } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>About FurShield</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">Empowering Pet Care Excellence</h1>
        <p className="text-gray-600 text-base leading-relaxed">
          FurShield is a full-stack pet care ecosystem designed to bridge the gap between pet parents, licensed veterinarians, and rescue shelters.
        </p>
      </div>

      {/* Grid Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Core Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We believe every pet deserves continuous, transparent, and comprehensive healthcare tracking. By providing strict Role-Based Access Control (RBAC), pet parents can store digitized health records, veterinarians can manage clinic schedules and log diagnoses seamlessly, and shelters can find loving forever homes for rescue pets.
          </p>

          <div className="space-y-3">
            {[
              'Centralized Medical Timeline & Vet Certificate Repository',
              'Verified Veterinary Schedules & Diagnosis Logging',
              'Shelter Pet Inventory & Adopter Interest Tracking',
              'E-Commerce Storefront for Curated Pet Care Products'
            ].map((point, idx) => (
              <div key={idx} className="flex items-center space-x-3 text-sm font-medium text-gray-800">
                <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <img
            src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80"
            alt="Veterinarian with dog"
            className="w-full h-80 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
