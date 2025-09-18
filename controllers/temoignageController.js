// controllers/temoignageController.js
const TemoignageService = require('../services/temoignageService');
const { asyncHandler } = require('../middleware/errorHandler');

class TemoignageController {
    // Route publique - témoignages validés seulement
    static getValidated = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await TemoignageService.getValidated(page, limit);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        res.json(result);
    })

    // Route admin - tous les témoignages
    static getAll = asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await TemoignageService.getAll(page, limit);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        res.json(result);
    })

    static create = asyncHandler(async (req, res) => {
        console.log("Corps reçu :", req.body);
        const { name, message } = req.body;          // ✅ Seulement name et message
        const errors = {};

        // Validation nom
        if (!name || !name.trim()) {                 // ✅ Validation détaillée
            errors.name = "Veuillez saisir votre nom.";
        } else if (name.trim().length < 2) {
            errors.name = "Le nom doit contenir au moins 2 caractères.";
        }

        // Validation message
        if (!message || !message.trim()) {           // ✅ Validation détaillée
            errors.message = "Veuillez saisir votre message.";
        } else if (message.trim().length < 10) {
            errors.message = "Le message doit contenir au moins 10 caractères.";
        }

        // Si erreurs, renvoyer toutes en une seule fois
        if (Object.keys(errors).length > 0) {       // ✅ Format errors comme votre code
            return res.status(400).json({ success: false, errors });
        }

        const result = await TemoignageService.create({
            name: name.trim(),
            message: message.trim()
        });

        res.status(201).json(result);
    })

    static updateStatus = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        const result = await TemoignageService.updateStatus(id, status);

        if (!result.success) {
            const statusCode = result.error === 'Témoignage non trouvé' ? 404 : 400;
            return res.status(statusCode).json({ error: result.error });
        }

        res.json(result);
    })

    static delete = asyncHandler(async (req, res) => {
        const { id } = req.params;

        const result = await TemoignageService.delete(id);

        if (!result.success) {
            const statusCode = result.error === 'Témoignage non trouvé' ? 404 : 500;
            return res.status(statusCode).json({ error: result.error });
        }

        res.json(result);
    })
}

module.exports = TemoignageController;