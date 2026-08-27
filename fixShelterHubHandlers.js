const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', 'utf8');

const handlers = `
  const openLogModal = (e, pet) => {
    e.stopPropagation();
    setLogPetId(pet._id);
    setLogForm({ activityType: 'Feeding', notes: '' });
    setIsLogModalOpen(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await shelterService.addDailyLog(logPetId, logForm);
      if (res.success) {
        setIsLogModalOpen(false);
        fetchPipeline();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit daily log");
    }
  };
`;

// Find where handleAddIntake starts, and insert these handlers before it.
code = code.replace(
  "const handleAddIntake = async (e) => {",
  handlers + "\n  const handleAddIntake = async (e) => {"
);

// Add try-catch to handleAddIntake
code = code.replace(
  "const handleAddIntake = async (e) => {\r\n    e.preventDefault();\r\n    const formData = new FormData();",
  "const handleAddIntake = async (e) => {\r\n    e.preventDefault();\r\n    try {\r\n      const formData = new FormData();"
);

// Close try-catch block for handleAddIntake
code = code.replace(
  "setIsIntakeDrawerOpen(false);\r\n    fetchPipeline();\r\n  };\r\n\r\n  const openEditModal",
  "setIsIntakeDrawerOpen(false);\r\n      fetchPipeline();\r\n    } catch (error) {\r\n      console.error(error);\r\n      alert('Error adding intake: ' + error.response?.data?.message || error.message);\r\n    }\r\n  };\r\n\r\n  const openEditModal"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', code);
