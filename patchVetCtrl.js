const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/vet.controller.js', 'utf8');

// Replace in createAppointment
code = code.replace(
  /if \(req\.file && walkInDetails\) \{\s*walkInDetails\.petAvatarUrl = `\/uploads\/\$\{req\.file\.filename\}`;\s*\}/g,
  `if (req.files && walkInDetails) {
      if (req.files['petAvatar']) walkInDetails.petAvatarUrl = '/uploads/' + req.files['petAvatar'][0].filename;
      if (req.files['ownerAvatar']) walkInDetails.ownerAvatarUrl = '/uploads/' + req.files['ownerAvatar'][0].filename;
    }`
);

// Replace in updateWalkin
code = code.replace(
  /if \(req\.file\) \{\s*appointment\.walkInDetails\.petAvatarUrl = '\/uploads\/' \+ req\.file\.filename;\s*\}/g,
  `if (req.files) {
        if (req.files['petAvatar']) appointment.walkInDetails.petAvatarUrl = '/uploads/' + req.files['petAvatar'][0].filename;
        if (req.files['ownerAvatar']) appointment.walkInDetails.ownerAvatarUrl = '/uploads/' + req.files['ownerAvatar'][0].filename;
      }`
);

code = code.replace(
  /if \(req\.file\) \{\s*pet\.avatarUrl = '\/uploads\/' \+ req\.file\.filename;\s*\}/g,
  `if (req.files) {
          if (req.files['petAvatar']) pet.avatarUrl = '/uploads/' + req.files['petAvatar'][0].filename;
        }
        
        if (req.files && req.files['ownerAvatar'] && appointment.ownerId) {
          const User = mongoose.model('User');
          const owner = await User.findById(appointment.ownerId);
          if (owner) {
            owner.avatarUrl = '/uploads/' + req.files['ownerAvatar'][0].filename;
            await owner.save();
          }
        }`
);

fs.writeFileSync('d:/Pet-Care/server/controllers/vet.controller.js', code);
