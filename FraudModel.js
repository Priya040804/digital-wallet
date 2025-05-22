const mongoose = require('mongoose');

const fraudLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String, required: true },
  metadata: { type: Object },
});

module.exports = mongoose.model('FraudLog', fraudLogSchema);
