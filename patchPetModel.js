const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/models/Pet.js', 'utf8');

const newSchema = `
  documents: [{
    title: String,
    docType: { type: String, enum: ['X-Ray', 'Lab Report', 'Insurance', 'Certificate', 'Other'] },
    fileUrl: String,
    dateUploaded: { type: Date, default: Date.now }
  }],
  medicalPassport: {
    vaccinations: [{ 
      name: String, 
      dateAdministered: Date, 
      nextDue: Date,
      status: { type: String, enum: ['Up to Date', 'Due Soon', 'Overdue'] }
    }],
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }]
  }
`;

code = code.replace(
  /  medicalPassport: \{[\s\S]*?\}\n/,
  newSchema + "\n"
);

fs.writeFileSync('d:/Pet-Care/server/models/Pet.js', code);
