const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', 'utf8');

// 1. Add adoptionRequests state
code = code.replace(
  "const [pipelineData, setPipelineData] = useState([]);\n  const [loading, setLoading] = useState(true);",
  "const [pipelineData, setPipelineData] = useState([]);\n  const [adoptionRequests, setAdoptionRequests] = useState([]);\n  const [loading, setLoading] = useState(true);"
);

// 2. Fetch adoption requests
code = code.replace(
  "const res = await shelterService.getPipeline();",
  "const [res, requestsRes] = await Promise.all([shelterService.getPipeline(), shelterService.getAdoptionRequests()]);"
);
code = code.replace(
  "setPipelineData(res.data);",
  "setPipelineData(res.data);\n        if (requestsRes.success) setAdoptionRequests(requestsRes.data);"
);

// 3. Add handleRequestStatus
const handlers = `
  const handleRequestStatus = async (id, status) => {
    try {
      const res = await shelterService.updateAdoptionRequestStatus(id, status);
      if (res.success) {
        // Refresh data
        const [pipeRes, reqRes] = await Promise.all([shelterService.getPipeline(), shelterService.getAdoptionRequests()]);
        if (pipeRes.success) setPipelineData(pipeRes.data);
        if (reqRes.success) setAdoptionRequests(reqRes.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
`;
code = code.replace("useEffect(() => {", handlers + "\n  useEffect(() => {");

// 4. Update the "Quick Actions" grid to actually show Pending Requests as a list instead of a Modal.
// Or just inject the Pending Requests Section right after the Quick Actions grid.
const requestsJSX = `
        {/* Pending Adoption Requests */}
        <div className="mt-8 mb-12">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-espresso-900 flex items-center gap-2"><Heart size={24} className="text-rose-500"/> Pending Adoption Requests</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {adoptionRequests.filter(r => r.status === 'Pending').length === 0 ? (
                 <div className="col-span-full bg-white rounded-[2rem] border border-camel-100 p-8 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-4">
                     <Heart size={24} />
                   </div>
                   <p className="text-espresso-500 font-bold">No pending adoption requests right now.</p>
                 </div>
              ) : adoptionRequests.filter(r => r.status === 'Pending').map(req => (
                 <div key={req._id} className="bg-white rounded-[2rem] border border-camel-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="font-black text-espresso-900 leading-tight">{req.applicantName}</h3>
                       <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">{req.email}</p>
                     </div>
                     <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-700">{req.status}</span>
                   </div>
                   
                   <div className="flex items-center gap-3 mb-4 bg-[#FAF8F5] p-3 rounded-xl border border-camel-50">
                     <div className="w-10 h-10 rounded-full bg-camel-100 overflow-hidden border border-camel-200 shrink-0">
                       <img src={req.animalId?.avatarUrl ? (req.animalId.avatarUrl.startsWith('http') ? req.animalId.avatarUrl : \`http://localhost:5000\${req.animalId.avatarUrl}\`) : '/images/product-placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                     </div>
                     <div>
                       <p className="text-[10px] font-bold text-espresso-400 uppercase tracking-widest mb-0.5">Interested In</p>
                       <p className="text-sm font-black text-espresso-900 leading-none">{req.animalId?.name}</p>
                     </div>
                   </div>
                   
                   <div className="mb-6 flex-1">
                     <p className="text-xs text-espresso-600 font-medium line-clamp-3 italic mb-2">"{req.message}"</p>
                     <p className="text-[10px] font-bold text-camel-500 uppercase tracking-widest">Home: {req.livingSituation}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 mt-auto">
                     <button onClick={() => handleRequestStatus(req._id, 'Rejected')} className="py-2.5 rounded-xl font-bold text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100">Decline</button>
                     <button onClick={() => handleRequestStatus(req._id, 'Approved')} className="py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-white hover:bg-emerald-600 shadow-md transition-colors">Approve</button>
                   </div>
                 </div>
              ))}
           </div>
        </div>
`;

// Insert the requestsJSX inside the main wrapper right after the Quick Actions grid
// The main wrapper has `<div className="max-w-7xl mx-auto w-full py-8 px-4 font-sans">`
// Let's inject it right before the final Modals section (which starts with `{/* Intake Rescue Drawer */}`).
const drawerRegex = /\{\/\* Intake Rescue Drawer \*\/\}/;
code = code.replace(drawerRegex, requestsJSX + "\n\n" + "      {/* Intake Rescue Drawer */}");

// Make sure CheckCircle and X exist (already there? Yes).
fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterDashboard.jsx', code);
