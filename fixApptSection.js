const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

const appointmentsJSX = `
      {/* Appointments Section */}
      <div className="mt-8 mb-12">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-black text-espresso-900 flex items-center gap-2"><Calendar size={24} className="text-camel-500"/> Upcoming Appointments</h2>
            <button onClick={() => navigate('/book-appointment')} className="bg-camel-600 hover:bg-camel-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-camel-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
              <Plus size={16} /> Book Appointment
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.length === 0 ? (
               <div className="col-span-full bg-white rounded-[2rem] border border-camel-100 p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-camel-50 rounded-full flex items-center justify-center text-camel-300 mb-4">
                   <Calendar size={24} />
                 </div>
                 <p className="text-espresso-500 font-bold">No upcoming appointments.</p>
                 <button onClick={() => navigate('/book-appointment')} className="mt-4 text-camel-600 font-bold hover:underline">Schedule one now</button>
               </div>
            ) : appointments.map(appt => (
               <div key={appt._id} className="bg-white rounded-[2rem] border border-camel-100 p-6 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-camel-100 overflow-hidden border border-camel-200">
                       <img src={appt.petId?.avatarUrl ? (appt.petId.avatarUrl.startsWith('http') ? appt.petId.avatarUrl : \`http://localhost:5000\${appt.petId.avatarUrl}\`) : '/images/product-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div>
                       <h3 className="font-black text-espresso-900 leading-tight">{appt.petId?.name}</h3>
                       <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">{appt.severity}</p>
                     </div>
                   </div>
                   <span className={\`text-[10px] font-bold uppercase px-3 py-1 rounded-full \${appt.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}\`}>{appt.status}</span>
                 </div>
                 
                 <div className="space-y-2 mb-4 bg-[#FAF8F5] p-3 rounded-xl border border-camel-50">
                   <div className="flex items-center gap-2 text-sm text-espresso-900">
                     <Calendar size={14} className="text-camel-500 shrink-0" />
                     <span className="font-bold">{new Date(appt.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-espresso-600">
                     <Stethoscope size={14} className="text-camel-400 shrink-0" />
                     <span className="font-medium">Dr. {appt.vetId?.name}</span>
                   </div>
                 </div>
                 
                 <p className="text-xs text-espresso-500 italic line-clamp-2 border-l-2 border-camel-200 pl-3">"{appt.reason}"</p>
               </div>
            ))}
         </div>
      </div>
`;

// Insert the appointments section right before the modals (which are grouped inside AnimatePresence)
// A good place is right before the first AnimatePresence that wraps a modal, OR inside the main div before the modals.
// Let's find the closing tag of the main content before the modals start.
// Modals start with "{/* Add Pet / Edit Pet Modal */}" or similar.
const modalStartRegex = /      \{\/\* Add Pet \/ Edit Pet Modal \*\/\}/;
code = code.replace(modalStartRegex, appointmentsJSX + "\n\n" + "      {/* Add Pet / Edit Pet Modal */}");

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
