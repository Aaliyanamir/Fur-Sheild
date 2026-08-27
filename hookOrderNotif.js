const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/server/controllers/order.controller.js', 'utf8');

if (!code.includes("notificationEngine")) {
  code = code.replace(
    "const Order = require('../models/Order');",
    "const Order = require('../models/Order');\nconst notificationEngine = require('../utils/notificationEngine');"
  );
  
  // Look for the creation part: const createdOrder = await order.save();
  code = code.replace(
    "const createdOrder = await order.save();",
    "const createdOrder = await order.save();\n\n    // TRIGGER NOTIFICATION\n    await notificationEngine.notifyOrderPlaced(req.user._id, createdOrder._id, createdOrder.totalPrice);"
  );
  fs.writeFileSync('d:/Pet-Care/server/controllers/order.controller.js', code);
}
