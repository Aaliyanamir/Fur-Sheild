const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', 'utf8');

// Add appointments state
code = code.replace(
  "const [pets, setPets] = useState([]);",
  "const [pets, setPets] = useState([]);\n  const [appointments, setAppointments] = useState([]);"
);

// Update fetch to include appointments
code = code.replace(
  "const response = await dashboardService.getOwnerDashboardData();",
  "const [response, apptRes] = await Promise.all([dashboardService.getOwnerDashboardData(), dashboardService.getMyAppointments()]);"
);
code = code.replace(
  "setPets(response.data);",
  "setPets(response.data);\n        if (apptRes.success) setAppointments(apptRes.data);"
);

// Add Calendar icon and Link import
code = code.replace(
  "import { useNavigate } from 'react-router-dom';",
  ""
);
code = code.replace(
  "import { Calendar, Plus,",
  "import { useNavigate } from 'react-router-dom';\nimport { Calendar, Plus,"
);

code = code.replace(
  "export default function OwnerDashboard() {",
  "export default function OwnerDashboard() {\n  const navigate = useNavigate();"
);

// Inject Appointments Section right above the main container bottom
const appointmentsJSX = `
      {/* Appointments Section */}
      <div className="mt-8">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-espresso-900 flex items-center gap-2"><Calendar size={24} className="text-camel-500"/> Upcoming Appointments</h2>
            <button onClick={() => navigate('/book-appointment')} className="bg-camel-600 hover:bg-camel-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md transition-colors flex items-center gap-2">
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
               <div key={appt._id} className="bg-white rounded-[2rem] border border-camel-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-camel-100 overflow-hidden">
                       <img src={appt.petId?.avatarUrl ? (appt.petId.avatarUrl.startsWith('http') ? appt.petId.avatarUrl : \`http://localhost:5000\${appt.petId.avatarUrl}\`) : '/images/product-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div>
                       <h3 className="font-black text-espresso-900">{appt.petId?.name}</h3>
                       <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest">{appt.severity}</p>
                     </div>
                   </div>
                   <span className={\`text-[10px] font-bold uppercase px-3 py-1 rounded-full \${appt.status === 'WAITING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}\`}>{appt.status}</span>
                 </div>
                 
                 <div className="space-y-2 mb-4">
                   <div className="flex items-center gap-2 text-sm text-espresso-600">
                     <Calendar size={14} className="text-camel-400" />
                     <span className="font-bold">{new Date(appt.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-espresso-600">
                     <Stethoscope size={14} className="text-camel-400" />
                     <span className="font-medium">Dr. {appt.vetId?.name}</span>
                   </div>
                 </div>
                 
                 <p className="text-xs text-espresso-400 italic line-clamp-2">"{appt.reason}"</p>
               </div>
            ))}
         </div>
      </div>
`;

code = code.replace(
  "    </div>\n  );\n}",
  appointmentsJSX + "\n    </div>\n  );\n}"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/OwnerDashboard.jsx', code);
