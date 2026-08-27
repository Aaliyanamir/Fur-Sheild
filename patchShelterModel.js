const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/models/ShelterAnimal.js', 'utf8');

const additionalFields = `
  age: { type: String },
  dailyLogs: [{
    date: { type: Date, default: Date.now },
    activityType: { type: String, enum: ['Feeding', 'Grooming', 'Medication', 'Walk/Exercise', 'Other'] },
    notes: { type: String },
    loggedBy: { type: String }
  }],
`;

code = code.replace(
  "  breed: { type: String },",
  "  breed: { type: String },\n" + additionalFields
);

fs.writeFileSync('d:/Pet-Care/server/models/ShelterAnimal.js', code);
