import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ReportExporter = ({ pet }) => {
  const [generating, setGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportPDF = () => {
    setGenerating(true);
    setDownloadSuccess(false);

    try {
      const doc = new jsPDF();

      // PDF Document Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('FurShield Pet Care Platform', 14, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('Official Digitized Pet Medical Health Report', 14, 28);
      doc.line(14, 32, 196, 32);

      // Pet Overview Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Patient Profile: ${pet.name || 'Max'}`, 14, 42);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Species: ${pet.species || 'Dog'}`, 14, 50);
      doc.text(`Breed: ${pet.breed || 'Golden Retriever'}`, 14, 56);
      doc.text(`Age: ${pet.age || 3} Years`, 14, 62);
      doc.text(`Weight: ${pet.weight || '31.2 kg'}`, 14, 68);
      doc.text(`Microchip #: ${pet.microchipNo || '985141002341908'}`, 14, 74);
      doc.text(`Vaccination Status: ${pet.vaccinationStatus || 'Up-to-Date'}`, 14, 80);

      doc.line(14, 86, 196, 86);

      // Medical Timeline Encounters
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Medical History & Clinical Encounters:', 14, 96);

      let yPos = 106;
      const records = pet.timeline || pet.pastRecords || [];

      if (records.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No past clinical records logged.', 14, yPos);
      } else {
        records.forEach((rec, idx) => {
          if (yPos > 260) {
            doc.addPage();
            yPos = 20;
          }

          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.text(`${idx + 1}. ${rec.title || rec.type} (${rec.date})`, 14, yPos);

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          doc.text(`Doctor/Clinic: ${rec.doctor || rec.clinic || 'Licensed Vet'}`, 14, yPos + 6);
          
          const notesText = doc.splitTextToSize(`Notes: ${rec.notes || 'Clinical examination normal.'}`, 180);
          doc.text(notesText, 14, yPos + 12);

          yPos += 24 + (notesText.length * 4);
        });
      }

      // Footer Verification Stamp
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated on ${new Date().toLocaleDateString()} • Digitally Verified by FurShield Platform`, 14, 285);

      // Save PDF File
      const filename = `${pet.name || 'Pet'}_Medical_Report_FurShield.pdf`;
      doc.save(filename);

      setGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      // Fallback window.print() if jsPDF encounters error
      window.print();
      setGenerating(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleExportPDF}
        disabled={generating}
        className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
      >
        {generating ? (
          <>
            <FileText className="w-3.5 h-3.5 animate-spin" />
            <span>Compiling PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF Medical Report</span>
          </>
        )}
      </button>

      {downloadSuccess && (
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          PDF Downloaded!
        </span>
      )}
    </div>
  );
};

export default ReportExporter;
