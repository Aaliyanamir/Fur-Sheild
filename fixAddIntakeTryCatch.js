const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', 'utf8');

// Replace handleAddIntake body with try catch
const newIntakeFunc = `  const handleAddIntake = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', intakeForm.name);
      formData.append('breed', intakeForm.breed);
      formData.append('species', intakeForm.species);
      if(intakeForm.age) formData.append('age', intakeForm.age);
      formData.append('behaviorNotes', intakeForm.behaviorNotes);
      if (intakeImageFile) formData.append('avatar', intakeImageFile);
      if (aiResult) formData.append('aiTriageLog', JSON.stringify({ log: intakeForm.behaviorNotes, severity: aiResult.severity }));

      await shelterService.addIntake(formData);
      
      setIntakeForm({ name: '', breed: '', species: 'Dog', age: '', behaviorNotes: '' });
      setIntakeImageFile(null);
      setIntakeImagePreview(null);
      setAiResult(null);
      setIsIntakeDrawerOpen(false);
      fetchPipeline();
    } catch (error) {
      console.error(error);
      alert('Error adding intake: ' + (error.response?.data?.message || error.message));
    }
  };`;

// We find `const handleAddIntake = async (e) => {` and the next `};`
const startIdx = code.indexOf('const handleAddIntake = async (e) => {');
const endMarker = '  const openEditModal = (pet) => {';
const endIdx = code.indexOf(endMarker, startIdx);

if(startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + newIntakeFunc + "\n\n" + code.substring(endIdx);
  fs.writeFileSync('d:/Pet-Care/frontend/src/pages/ShelterHub.jsx', code);
  console.log("Replaced handleAddIntake successfully");
} else {
  console.log("Failed to find boundaries");
}
