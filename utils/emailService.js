const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuration des couleurs et style pour la sophrologie
const emailStyles = {
  primaryColor: '#2c5530', // Vert apaisant
  secondaryColor: '#6b8e6b',
  accentColor: '#a8c8a8',
  backgroundColor: '#f8fdf8',
  textColor: '#2c3e2c',
  borderRadius: '12px',
  softShadow: '0 4px 12px rgba(44, 85, 48, 0.1)'
};

// Template de base réutilisable
const getBaseTemplate = (content, subtitle = '') => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cabinet de Sophrologie</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f8f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 650px; margin: 0 auto; background: white; box-shadow: ${emailStyles.softShadow};">
            
            <!-- Header avec logo et branding -->
            <div style="background: linear-gradient(135deg, ${emailStyles.primaryColor} 0%, ${emailStyles.secondaryColor} 100%); color: white; padding: 30px 20px; text-align: center; border-radius: ${emailStyles.borderRadius} ${emailStyles.borderRadius} 0 0;">
                <div style="display: inline-block; background: white; border-radius: 50%; padding: 15px; margin-bottom: 15px; box-shadow: ${emailStyles.softShadow};">
                    <span style="color: ${emailStyles.primaryColor}; font-size: 24px; font-weight: bold;">🧘‍♀️</span>
                </div>
                <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">Cabinet de Sophrologie</h1>
                ${subtitle ? `<p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">${subtitle}</p>` : ''}
            </div>

            <!-- Contenu principal -->
            <div style="padding: 30px 25px;">
                ${content}
            </div>

            <!-- Footer professionnel -->
            <div style="background: ${emailStyles.backgroundColor}; padding: 25px; border-top: 1px solid #e8f0e8; text-align: center; font-size: 14px; color: #6b8e6b; border-radius: 0 0 ${emailStyles.borderRadius} ${emailStyles.borderRadius};">
                <div style="margin-bottom: 15px;">
                    <strong style="color: ${emailStyles.primaryColor};">Votre Cabinet de Sophrologie</strong>
                </div>
                <div style="margin-bottom: 10px;">
                    📍 [Votre adresse] • 📞 [Votre téléphone] • 📧 [Votre email]
                </div>
                <div style="margin-bottom: 15px;">
                    🌐 <a href="#" style="color: ${emailStyles.secondaryColor}; text-decoration: none;">[Votre site web]</a>
                </div>
                <div style="font-size: 13px; opacity: 0.8;">
                    "Retrouvez votre équilibre intérieur par la sophrologie"
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Notification témoignage avec design professionnel
const sendNewTestimonialNotification = async (temoignageData) => {
  const { name, message, createdAt } = temoignageData;
  const dateFormatted = new Date(createdAt || Date.now()).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const content = `
    <div style="margin-bottom: 25px;">
        <h2 style="color: ${emailStyles.primaryColor}; margin: 0 0 20px 0; font-size: 22px; font-weight: 400;">
            ✨ Nouveau témoignage reçu
        </h2>
        <p style="color: ${emailStyles.textColor}; line-height: 1.6; margin-bottom: 20px;">
            Un nouveau témoignage vient d'être soumis sur votre site et attend votre validation.
        </p>
    </div>

    <!-- Carte du témoignage -->
    <div style="background: ${emailStyles.backgroundColor}; border: 2px solid ${emailStyles.accentColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 20px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="background: ${emailStyles.primaryColor}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">
                ${name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 style="margin: 0; color: ${emailStyles.primaryColor}; font-size: 18px;">${name}</h3>
                <p style="margin: 5px 0 0 0; color: ${emailStyles.secondaryColor}; font-size: 14px;">
                    📅 ${dateFormatted}
                </p>
            </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${emailStyles.primaryColor}; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 10px 0; color: ${emailStyles.textColor}; font-size: 16px;">Témoignage :</h4>
            <p style="margin: 0; line-height: 1.6; color: ${emailStyles.textColor}; font-style: italic;">
                "${message}"
            </p>
        </div>
    </div>

    <!-- Call to action -->
    <div style="text-align: center; margin: 30px 0;">
        <div style="background: ${emailStyles.primaryColor}; color: white; padding: 15px 30px; border-radius: 25px; display: inline-block; text-decoration: none; font-weight: 500; box-shadow: ${emailStyles.softShadow};">
            🔗 Connectez-vous à votre interface d'administration pour valider ce témoignage
        </div>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
            💡 <strong>Rappel :</strong> Les témoignages validés renforcent la confiance de vos futurs patients. 
            Prenez le temps de les lire attentivement avant validation.
        </p>
    </div>
  `;

  const mailOptions = {
    from: `"Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: '🌱 Nouveau témoignage en attente de validation',
    html: getBaseTemplate(content, 'Gestion des témoignages')
  };

  await transporter.sendMail(mailOptions);
};

// Message de contact avec auto-réponse
const sendContactMessage = async ({ name, email, message }) => {
  const dateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Email pour l'admin
  const adminContent = `
    <div style="margin-bottom: 25px;">
        <h2 style="color: ${emailStyles.primaryColor}; margin: 0 0 20px 0; font-size: 22px; font-weight: 400;">
            📬 Nouveau message de contact
        </h2>
        <p style="color: ${emailStyles.textColor}; line-height: 1.6;">
            Un nouveau message a été envoyé depuis votre site web.
        </p>
    </div>

    <!-- Informations du contact -->
    <div style="background: ${emailStyles.backgroundColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 20px 0;">
        <h3 style="color: ${emailStyles.primaryColor}; margin: 0 0 20px 0; font-size: 18px;">Informations du contact</h3>
        
        <div style="display: grid; gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid ${emailStyles.accentColor};">
                <strong style="color: ${emailStyles.primaryColor};">👤 Nom :</strong>
                <span style="color: ${emailStyles.textColor}; margin-left: 10px;">${name}</span>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid ${emailStyles.accentColor};">
                <strong style="color: ${emailStyles.primaryColor};">📧 Email :</strong>
                <a href="mailto:${email}" style="color: ${emailStyles.secondaryColor}; margin-left: 10px; text-decoration: none;">${email}</a>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid ${emailStyles.accentColor};">
                <strong style="color: ${emailStyles.primaryColor};">📅 Reçu le :</strong>
                <span style="color: ${emailStyles.textColor}; margin-left: 10px;">${dateFormatted}</span>
            </div>
        </div>
    </div>

    <!-- Message -->
    <div style="background: white; border: 2px solid ${emailStyles.accentColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 20px 0; box-shadow: ${emailStyles.softShadow};">
        <h3 style="color: ${emailStyles.primaryColor}; margin: 0 0 15px 0; font-size: 18px;">💬 Message :</h3>
        <div style="background: ${emailStyles.backgroundColor}; padding: 20px; border-radius: 8px; line-height: 1.7; color: ${emailStyles.textColor};">
            ${message.replace(/\n/g, '<br>')}
        </div>
    </div>

    <!-- Actions rapides -->
    <div style="background: #e8f4f8; border: 1px solid #bee5eb; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h4 style="color: #0c5460; margin: 0 0 10px 0;">⚡ Actions rapides :</h4>
        <p style="margin: 5px 0; color: #0c5460;">
            • <strong>Répondre :</strong> <a href="mailto:${email}" style="color: #0c5460;">Cliquez ici pour répondre directement</a><br>
            • <strong>Délai recommandé :</strong> Réponse sous 24h maximum
        </p>
    </div>
  `;

  const adminMailOptions = {
    from: `"Site Web - Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `🌱 Nouveau message de ${name}`,
    html: getBaseTemplate(adminContent, 'Message de contact')
  };

  await transporter.sendMail(adminMailOptions);

  // Auto-réponse pour le client
  await sendAutoResponse(name, email);
};

// Auto-réponse professionnelle pour le client 
const sendAutoResponse = async (name, email) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: ${emailStyles.primaryColor}; margin: 0 0 15px 0; font-size: 24px; font-weight: 400;">
            Merci ${name} ! 🙏
        </h2>
        <p style="color: ${emailStyles.secondaryColor}; font-size: 18px; margin: 0;">
            Votre message a bien été reçu
        </p>
    </div>

    <div style="background: ${emailStyles.backgroundColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 20px 0; text-align: center;">
        <div style="background: ${emailStyles.primaryColor}; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px;">
            ✅
        </div>
        <h3 style="color: ${emailStyles.primaryColor}; margin: 0 0 15px 0; font-size: 20px;">Message bien reçu !</h3>
        <p style="color: ${emailStyles.textColor}; line-height: 1.6; margin: 0;">
            Je vous remercie pour votre prise de contact. Votre message 
            a été transmis et je m'engage à vous répondre dans les <strong>24 heures</strong>.
        </p>
    </div>

    <div style="background: white; border: 2px solid ${emailStyles.accentColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 25px 0;">
        <h4 style="color: ${emailStyles.primaryColor}; margin: 0 0 15px 0; font-size: 18px;">🧘‍♀️ En attendant ma réponse...</h4>
        <ul style="color: ${emailStyles.textColor}; line-height: 1.8; padding-left: 20px;">
            <li>Consultez mon site web pour découvrir mes services de sophrologie</li>
            <li>Suivez-moi sur les réseaux sociaux pour des conseils bien-être</li>
            <li>En cas d'urgence, n'hésitez pas à me contacter par téléphone</li>
        </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <p style="color: ${emailStyles.secondaryColor}; font-style: italic; margin: 0;">
            "La sophrologie vous accompagne vers un mieux-être durable"
        </p>
    </div>
  `;

  const clientMailOptions = {
    from: `"Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🌱 Confirmation de réception - Cabinet de Sophrologie',
    html: getBaseTemplate(content, 'Confirmation de votre message')
  };

  await transporter.sendMail(clientMailOptions);
};

module.exports = {
  sendNewTestimonialNotification,
  sendContactMessage,
  sendAutoResponse
};