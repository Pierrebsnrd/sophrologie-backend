const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  answered: { type: Boolean, default: false },
  
  // ✅ MODIFICATION : Ajouter TTL sur createdAt
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 60 * 60 * 24 * 365 * 3  // 94 608 000 secondes = 3 ans
  }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);