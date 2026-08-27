const Notification = require('../models/Notification');

const notificationEngine = {
  /**
   * Creates a notification for a user
   * @param {Object} data - { recipient, type, title, message, actionUrl }
   */
  createNotification: async (data) => {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      console.error('Notification Engine Error:', error);
      // We don't throw here so it doesn't break the main flow (e.g. order creation)
    }
  },

  /**
   * Helper specifically for Order placement
   */
  notifyOrderPlaced: async (userId, orderId, amount) => {
    return await notificationEngine.createNotification({
      recipient: userId,
      type: 'ORDER',
      title: 'Order Confirmed',
      message: `Your order for $${amount} has been placed successfully.`,
      actionUrl: '/orders'
    });
  },

  /**
   * Helper specifically for Appointments
   */
  notifyAppointmentBooked: async (userId, vetName, date) => {
    return await notificationEngine.createNotification({
      recipient: userId,
      type: 'APPOINTMENT',
      title: 'Appointment Booked',
      message: `Your appointment with ${vetName} is confirmed for ${new Date(date).toLocaleDateString()}.`,
      actionUrl: '/dashboard'
    });
  }
};

module.exports = notificationEngine;
