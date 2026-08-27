const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', 'utf8');

// 1. Add Auth Context Update capability
code = code.replace(
  "import { AuthContext } from '../context/AuthContext';",
  "import { AuthContext } from '../context/AuthContext';\nimport authService from '../services/auth.service';"
);

code = code.replace(
  "const { user } = useContext(AuthContext);",
  "const { user, dispatch } = useContext(AuthContext) || { user: {} };" // Add dispatch
);

// 2. Add State for New Modals
const newStates = `
  const [isVetProfileModalOpen, setIsVetProfileModalOpen] = useState(false);
  const [vetProfileForm, setVetProfileForm] = useState({ name: user?.name || '' });
  const [vetImageFile, setVetImageFile] = useState(null);
  const [vetImagePreview, setVetImagePreview] = useState(user?.avatarUrl ? ('http://localhost:5000' + user.avatarUrl) : null);

  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editPatientForm, setEditPatientForm] = useState({ petName: '', breed: '', species: '', age: '', ownerName: '' });
  const [editPatientImageFile, setEditPatientImageFile] = useState(null);
  const [editPatientImagePreview, setEditPatientImagePreview] = useState(null);

  const [walkinImageFile, setWalkinImageFile] = useState(null);
  const [walkinImagePreview, setWalkinImagePreview] = useState(null);
`;
code = code.replace(
  /const \[isUpdateModalOpen.*?;/m,
  newStates + '\n  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);'
);

// 3. Add Handlers
const newHandlers = `
  const handleVetProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', vetProfileForm.name);
    if (vetImageFile) {
      formData.append('avatar', vetImageFile);
    }
    const res = await authService.updateProfile(formData);
    if (res.success) {
      if (dispatch) dispatch({ type: 'LOGIN_SUCCESS', payload: res });
      setIsVetProfileModalOpen(false);
    }
  };

  const openEditPatientModal = () => {
    setEditPatientForm({
      petName: activePatient.petName,
      breed: activePatient.breed,
      species: activePatient.species || 'Dog',
      age: activePatient.age,
      ownerName: activePatient.owner
    });
    setEditPatientImagePreview(activePatient.petImage);
    setEditPatientImageFile(null);
    setIsEditPatientModalOpen(true);
    setIsStatusDropdownOpen(false);
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('petName', editPatientForm.petName);
    formData.append('breed', editPatientForm.breed);
    formData.append('species', editPatientForm.species);
    formData.append('age', editPatientForm.age);
    formData.append('ownerName', editPatientForm.ownerName);
    if (editPatientImageFile) formData.append('petAvatar', editPatientImageFile);

    await vetService.updateWalkin(activePatient.id, formData);
    await fetchQueue();
    setIsEditPatientModalOpen(false);
  };
`;
code = code.replace(
  /const handleAddWalkin = async/m,
  newHandlers + '\n  const handleAddWalkin = async'
);

// Modify handleAddWalkin to use FormData
const addWalkinRegex = /const handleAddWalkin = async \(e\) => \{[\s\S]*?await fetchQueue\(\);\n  \};/;
const addWalkinNew = `
  const handleAddWalkin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reason', walkinForm.reason);
    formData.append('severity', walkinForm.severity);
    formData.append('petName', walkinForm.petName);
    formData.append('breed', walkinForm.breed);
    formData.append('species', walkinForm.species);
    formData.append('age', walkinForm.age);
    formData.append('ownerName', walkinForm.ownerName);
    if (walkinImageFile) formData.append('petAvatar', walkinImageFile);

    await vetService.createAppointment(formData);
    
    setWalkinForm({ petName: '', breed: '', species: 'Dog', age: '', ownerName: '', reason: '', severity: 'ROUTINE' });
    setWalkinImageFile(null);
    setWalkinImagePreview(null);
    setIsWalkinModalOpen(false);
    await fetchQueue();
  };
`;
code = code.replace(addWalkinRegex, addWalkinNew);

// Update user picture display and make it clickable
code = code.replace(
  /<div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-camel-50 shadow-sm relative flex items-center justify-center bg-camel-100 text-2xl font-black text-espresso-500">([\s\S]*?)<\/div>/,
  `<div onClick={() => setIsVetProfileModalOpen(true)} className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-camel-50 shadow-sm relative flex items-center justify-center bg-camel-100 text-2xl font-black text-espresso-500 cursor-pointer group">
    {user?.avatarUrl ? <img src={user.avatarUrl.startsWith('http') ? user.avatarUrl : 'http://localhost:5000'+user.avatarUrl} className="w-full h-full object-cover" /> : (user?.name?.charAt(0) || 'V')}
    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs">Edit</div>
    <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
  </div>`
);

// Add Edit Patient action to dropdown
code = code.replace(
  /<button onClick=\{openUpdateModal\} className="w-full/g,
  `<button onClick={openEditPatientModal} className="w-full text-left px-4 py-3 text-sm font-bold text-espresso-700 hover:bg-camel-50 transition-colors flex items-center gap-2"><FileDigit size={14} className="text-camel-500" /> Edit Patient</button>\n                           <button onClick={openUpdateModal} className="w-full`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetHub.jsx', code);
