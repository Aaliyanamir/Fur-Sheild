import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, X, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

const DocumentPreviewModal = ({ doc, petName, isOpen, onClose }) => {
  if (!doc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 border border-slate-200"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-900 text-white p-3 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">{doc.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">Document for {petName} • {doc.category}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Document Mock Viewer Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between items-center text-slate-700 border-b border-slate-200 pb-3">
                <span className="font-bold">Official Document Details</span>
                <span className="bg-slate-200 px-2 py-0.5 rounded font-mono text-[10px] uppercase">{doc.fileType} • {doc.fileSize}</span>
              </div>

              <div className="space-y-2 text-slate-600">
                <p><strong>Issued By:</strong> {doc.issuedBy}</p>
                <p><strong>Upload Date:</strong> {doc.uploadDate}</p>
                <p><strong>Verification Code:</strong> <span className="font-mono text-slate-900">VERIFIED-FS-{Math.floor(100000 + Math.random() * 900000)}</span></p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 text-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Digitally Signed & Authenticated Record</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  This digitized certificate/imaging file is officially registered in the FurShield Cloud Repository and linked to patient ID #{petName}.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print Document
              </button>

              <button
                onClick={() => {
                  alert(`Downloading ${doc.title}...`);
                  onClose();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Document
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocumentPreviewModal;
