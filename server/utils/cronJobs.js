const cron = require('node-cron');
const Pet = require('../models/Pet');
const notificationEngine = require('./notificationEngine');

// Run every day at 8:00 AM
const startCronJobs = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily vaccine check cron job...');
    try {
      // Find pets with vaccines due in the next 7 days
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pets = await Pet.find({
        'healthRecords.vaccinations.dueDate': {
          $gte: today,
          $lte: nextWeek
        }
      }).populate('owner');

      for (const pet of pets) {
        for (const vax of pet.healthRecords.vaccinations) {
          const dueDate = new Date(vax.dueDate);
          // If due exactly 7 days from now (or within range logic, simplifying for now)
          if (dueDate >= today && dueDate <= nextWeek) {
            await notificationEngine.createNotification({
              recipient: pet.owner._id,
              type: 'VACCINE',
              title: 'Vaccine Reminder',
              message: `${pet.name} is due for their ${vax.name} vaccine on ${dueDate.toLocaleDateString()}.`,
              actionUrl: '/dashboard'
            });
          }
        }
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};

module.exports = startCronJobs;
