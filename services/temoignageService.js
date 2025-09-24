const Temoignage = require('../models/temoignage');

// Import avec gestion d'erreur
let sendNewTestimonialNotification;
try {
    ({ sendNewTestimonialNotification } = require('../utils/emailService'));
} catch (error) {
    console.error('⚠️ Service email non disponible:', error.message);
    sendNewTestimonialNotification = null;
}

class TemoignageService {
    static async getAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await Temoignage.countDocuments();

            const temoignages = await Temoignage.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    temoignages,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        total,
                        limit
                    }
                }
            };
        } catch (error) {
            console.error('Erreur récupération témoignages:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }

    static async getValidated(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const filter = { status: 'validated' };
            const total = await Temoignage.countDocuments(filter);

            const temoignages = await Temoignage.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    temoignages,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        total,
                        limit
                    }
                }
            };
        } catch (error) {
            console.error('Erreur récupération témoignages validés:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }

    static async create(temoignageData) {
        try {
            console.log('✅ Création témoignage:', temoignageData);

            const temoignage = new Temoignage({
                ...temoignageData,
                status: 'pending'
            });

            const savedTemoignage = await temoignage.save();

            // Envoyer notification email admin
            if (sendNewTestimonialNotification) {
                try {
                    await sendNewTestimonialNotification(savedTemoignage);
                    console.log('✅ Notification email envoyée');
                } catch (emailError) {
                    console.error('⚠️ Erreur envoi email (témoignage sauvé):', emailError);
                    // Log pour diag
                    if (emailError.code) {
                        console.error("Code erreur email:", emailError.code);
                    }
                    if (emailError.response) {
                        console.error("Réponse serveur email:", emailError.response);
                    }
                }
            } else {
                console.log("⚠️ Service email non configuré - seule la sauvegarde en DB fonctionne");
            }

            return {
                success: true,
                data: savedTemoignage,
                message: 'Merci pour votre témoignage ! Il sera publié après validation.'
            };
        } catch (error) {
            console.error('Erreur création témoignage:', error);
            return { success: false, error: 'Erreur serveur lors de l\'ajout du témoignage' };
        }
    }

    static async updateStatus(id, status) {
        try {
            if (!['pending', 'validated', 'rejected'].includes(status)) {
                return { success: false, error: 'Statut invalide' };
            }

            const temoignage = await Temoignage.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );

            if (!temoignage) {
                return { success: false, error: 'Témoignage non trouvé' };
            }

            return { success: true, data: temoignage };
        } catch (error) {
            console.error('Erreur maj statut témoignage:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }

    static async delete(id) {
        try {
            const deleted = await Temoignage.findByIdAndDelete(id);
            if (!deleted) {
                return { success: false, error: 'Témoignage non trouvé' };
            }
            return { success: true, message: 'Témoignage supprimé' };
        } catch (error) {
            console.error('Erreur suppression témoignage:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }
}

module.exports = TemoignageService;