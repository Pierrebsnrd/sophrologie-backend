const ContactMessage = require('../models/contactMessage');

// Import avec gestion d'erreur
let sendContactMessage;
try {
    ({ sendContactMessage } = require('../utils/emailService'));
} catch (error) {
    console.error('⚠️ Service email non disponible:', error.message);
    sendContactMessage = null;
}

class ContactService {
    static async create(messageData) {
        try {
            console.log("✅ Création message contact:", messageData);

            // Sauvegarder en base de données D'ABORD
            await ContactMessage.create(messageData);
            console.log("✅ Message de contact sauvé en base");

            // Envoyer les emails (admin + auto-réponse client)
            if (sendContactMessage) {
                try {
                    await sendContactMessage(messageData);
                    console.log("✅ Emails envoyés avec succès");
                } catch (emailError) {
                    console.error("⚠️ Erreur envoi emails (message sauvé quand même):", emailError);
                    // Log détaillé pour diagnostiquer
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
                message: "Votre message a été envoyé avec succès ! Vous recevrez une réponse sous 24 - 48 heures."
            };
        } catch (error) {
            console.error('❌ Erreur création message contact:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
            };
        }
    }

    static async getAll(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const total = await ContactMessage.countDocuments();

            const messages = await ContactMessage.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(total / limit);

            return {
                success: true,
                data: {
                    messages,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        total,
                        limit
                    }
                }
            };
        } catch (error) {
            console.error('Erreur récupération messages:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }

    static async markAsAnswered(id) {
        try {
            const message = await ContactMessage.findByIdAndUpdate(
                id,
                { answered: true },
                { new: true }
            );

            if (!message) {
                return { success: false, error: 'Message non trouvé' };
            }

            return { success: true, data: message };
        } catch (error) {
            console.error('Erreur mise à jour message:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }

    static async delete(id) {
        try {
            const deleted = await ContactMessage.findByIdAndDelete(id);
            if (!deleted) {
                return { success: false, error: 'Message non trouvé' };
            }
            return { success: true, message: 'Message supprimé' };
        } catch (error) {
            console.error('Erreur suppression message:', error);
            return { success: false, error: 'Erreur serveur' };
        }
    }
}

module.exports = ContactService;