const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

// Add states for Owner Avatar
code = code.replace(
  "const [walkinImageFile, setWalkinImageFile] = useState(null);",
  "const [walkinImageFile, setWalkinImageFile] = useState(null);\n  const [walkinOwnerImageFile, setWalkinOwnerImageFile] = useState(null);\n  const [walkinOwnerImagePreview, setWalkinOwnerImagePreview] = useState(null);"
);

code = code.replace(
  "const [editPatientImageFile, setEditPatientImageFile] = useState(null);",
  "const [editPatientImageFile, setEditPatientImageFile] = useState(null);\n  const [editOwnerImageFile, setEditOwnerImageFile] = useState(null);\n  const [editOwnerImagePreview, setEditOwnerImagePreview] = useState(null);"
);

// Map ownerImage correctly in fetchQueue
code = code.replace(
  /ownerImage: '\/images\/product-placeholder.jpg',/g,
  `ownerImage: (isWalkin ? appt.walkInDetails.ownerAvatarUrl : appt.ownerId?.avatarUrl) ? ((isWalkin ? appt.walkInDetails.ownerAvatarUrl : appt.ownerId?.avatarUrl).startsWith('http') ? (isWalkin ? appt.walkInDetails.ownerAvatarUrl : appt.ownerId?.avatarUrl) : 'http://localhost:5000' + (isWalkin ? appt.walkInDetails.ownerAvatarUrl : appt.ownerId?.avatarUrl)) : '/images/product-placeholder.jpg',`
);

// Reset walkin states
code = code.replace(
  "setWalkinImagePreview(null);",
  "setWalkinImagePreview(null);\n    setWalkinOwnerImageFile(null);\n    setWalkinOwnerImagePreview(null);"
);

// Append ownerAvatar in handleAddWalkin
code = code.replace(
  "if (walkinImageFile) formData.append('petAvatar', walkinImageFile);",
  "if (walkinImageFile) formData.append('petAvatar', walkinImageFile);\n    if (walkinOwnerImageFile) formData.append('ownerAvatar', walkinOwnerImageFile);"
);

// Append ownerAvatar in handleEditPatient
code = code.replace(
  "if (editPatientImageFile) formData.append('petAvatar', editPatientImageFile);",
  "if (editPatientImageFile) formData.append('petAvatar', editPatientImageFile);\n    if (editOwnerImageFile) formData.append('ownerAvatar', editOwnerImageFile);"
);

// Open Edit Patient Modal
code = code.replace(
  "setEditPatientImagePreview(activePatient.petImage);",
  "setEditPatientImagePreview(activePatient.petImage);\n    setEditOwnerImagePreview(activePatient.ownerImage);\n    setEditOwnerImageFile(null);"
);

// Inject Owner Upload UI into Edit Patient Modal
const editPetUploadRegex = /<p className="text-\[10px\] text-camel-600 font-bold uppercase tracking-widest">Change Pet Photo<\/p>\s*<\/div>/;
const newEditPetUpload = `<p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Change Pet Photo</p>
                       </div>
                       <div className="flex flex-col items-center mb-4">
                         <div className="relative w-16 h-16 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {editOwnerImagePreview ? <img src={editOwnerImagePreview} className="w-full h-full object-cover" alt="Owner"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Owner</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setEditOwnerImageFile(file);
                               setEditOwnerImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Change Owner Photo</p>
                       </div>`;
code = code.replace(editPetUploadRegex, newEditPetUpload);

// Inject Owner Upload UI into Walkin Modal
const walkinPetUploadRegex = /<p className="text-\[10px\] text-camel-600 font-bold uppercase tracking-widest">Pet Photo<\/p>\s*<\/div>/;
const newWalkinPetUpload = `<p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Pet Photo</p>
                       </div>
                       <div className="flex flex-col items-center mb-4">
                         <div className="relative w-16 h-16 rounded-full border border-camel-200 overflow-hidden mb-2 bg-camel-50">
                           {walkinOwnerImagePreview ? <img src={walkinOwnerImagePreview} className="w-full h-full object-cover" alt="Owner"/> : <div className="w-full h-full flex items-center justify-center text-camel-300 font-medium text-[10px]">Owner</div>}
                           <input type="file" accept="image/*" onChange={(e) => {
                             const file = e.target.files[0];
                             if(file) {
                               setWalkinOwnerImageFile(file);
                               setWalkinOwnerImagePreview(URL.createObjectURL(file));
                             }
                           }} className="absolute inset-0 opacity-0 cursor-pointer" />
                         </div>
                         <p className="text-[10px] text-camel-600 font-bold uppercase tracking-widest">Owner Photo (Optional)</p>
                       </div>`;
code = code.replace(walkinPetUploadRegex, newWalkinPetUpload);

// Fix UI layout in modals so they sit side-by-side
code = code.replace(
  /<div className="flex flex-col items-center mb-4">/g,
  `<div className="flex flex-col items-center mb-4 w-1/2">`
);
code = code.replace(
  /<div className="flex flex-col items-center mb-4 w-1\/2">\s*<div className="relative w-24/g,
  `<div className="flex flex-row justify-center gap-8 mb-6">\n<div className="flex flex-col items-center mb-4">\n<div className="relative w-24`
);
code = code.replace(
  /Change Owner Photo<\/p>\s*<\/div>/g,
  `Change Owner Photo</p>\n</div>\n</div>`
);
code = code.replace(
  /Owner Photo \(Optional\)<\/p>\s*<\/div>/g,
  `Owner Photo (Optional)</p>\n</div>\n</div>`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
