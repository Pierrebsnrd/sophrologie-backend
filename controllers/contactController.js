// controllers/contactController.js
const ContactService = require('../services/contactService');
const { asyncHandler } = require('../middleware/errorHandler');

// Fonction de validation du téléphone français (comme dans votre code)
function isValidPhone(phone) {                          // ✅ Ajouté fonction validation
  if (!phone || !phone.trim()) return false; 
  const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
  const cleanPhone = phone.replace(/[\s\.\-]/g, '');
  return phoneRegex.test(cleanPhone);
}

class ContactController {
  static create = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;   // ✅ 'phone' au lieu de 'subject'
    const errors = {};                                  // ✅ Object errors comme votre code

    // Validation nom
    if (!name || !name.trim()) {                       // ✅ Validation détaillée
      errors.name = "Le prénom est requis.";
    } else if (name.trim().length < 2) {
      errors.name = "Le prénom doit contenir au moins 2 caractères.";
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      errors.email = "L'email est requis.";
    } else if (!emailRegex.test(email)) {
      errors.email = "Veuillez entrer un email valide.";
    }

    // Validation téléphone (obligatoire)             // ✅ Validation phone ajoutée
    if (!phone || !phone.trim()) {
      errors.phone = "Le numéro de téléphone est requis.";
    } else if (!isValidPhone(phone)) {
      errors.phone = "Veuillez entrer un numéro de téléphone valide (format français).";
    }

    // Validation message
    if (!message || !message.trim()) {
      errors.message = "Le message est requis.";
    } else if (message.trim().length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères.";
    }

    if (Object.keys(errors).length > 0) {              // ✅ Format errors comme votre code
      return res.status(400).json({ success: false, errors });
    }

    const result = await ContactService.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),                              // ✅ phone inclus
      message: message.trim()
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(201).json(result);
  })

  static getAll = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await ContactService.getAll(page, limit);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result);
  })

  static markAsAnswered = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await ContactService.markAsAnswered(id);

    if (!result.success) {
      const statusCode = result.error === 'Message non trouvé' ? 404 : 500;
      return res.status(statusCode).json({ error: result.error });
    }

    res.json(result);
  })

  static delete = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await ContactService.delete(id);

    if (!result.success) {
      const statusCode = result.error === 'Message non trouvé' ? 404 : 500;
      return res.status(statusCode).json({ error: result.error });
    }

    res.json(result);
  })
}

module.exports = ContactController;