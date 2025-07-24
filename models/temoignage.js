const mongoose = require('mongoose');

const temoignageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'validated', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Temoignage', temoignageSchema);
