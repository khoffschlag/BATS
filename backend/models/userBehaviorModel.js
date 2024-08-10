const mongoose = require("mongoose");

const userBehaviorSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventType: { type: String, required: true },
  eventData: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

const UserBehavior = mongoose.model(
  "UserBehavior",
  userBehaviorSchema,
  "analytics"
);

module.exports = UserBehavior;
