const nodemailer = require('nodemailer');

// Configuration OVH Email
const createOVHTransporter = () => {
  return nodemailer.createTransporter({
    host: 'ssl0.ovh.net', // Serveur SMTP OVH
    port: 587,
    secure: false, // TLS
    auth: {
      user: process.env.OVH_EMAIL_USER, // contact@votre-domaine.fr
      pass: process.env.OVH_EMAIL_PASS  // Mot de passe email OVH
    },
    tls: {
      rejectUnauthorized: false
    },
    // Options anti-spam
    pool: true,
    maxConnections: 3,
    rateLimit: 3 // 3 emails par seconde max
  });
};

// Diagnostic de configuration
const checkEmailConfig = () => {
  const requiredVars = ['OVH_EMAIL_USER', 'OVH_EMAIL_PASS', 'ADMIN_EMAIL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`❌ Variables OVH manquantes: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ Configuration OVH Email détectée');
  return true;
};

let transporter = null;
try {
  if (checkEmailConfig()) {
    transporter = createOVHTransporter();
    
    // Test de connexion
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Erreur configuration OVH Email:', error);
        transporter = null;
      } else {
        console.log('✅ OVH Email configuré et testé avec succès');
      }
    });
  }
} catch (error) {
  console.error('❌ Erreur initialisation OVH Email:', error);
  transporter = null;
}

// Styles email (identique à votre version actuelle)
const emailStyles = {
  primaryColor: '#2c5530',
  secondaryColor: '#6b8e6b',
  accentColor: '#a8c8a8',
  backgroundColor: '#f8fdf8',
  textColor: '#2c3e2c',
  borderRadius: '12px',
  softShadow: '0 4px 12px rgba(44, 85, 48, 0.1)'
};

// Template de base (identique)
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
                    📍 Villepreux • 📞 06 11 42 17 65 • 📧 ${process.env.OVH_EMAIL_USER}
                </div>
                <div style="margin-bottom: 15px;">
                    🌐 <a href="https://www.sophrologuevillepreux.fr/" style="color: ${emailStyles.secondaryColor}; text-decoration: none;">https://www.sophrologuevillepreux.fr/</a>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Auto-réponse optimisée OVH (délivrabilité parfaite)
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
            a été transmis et je m'engage à vous répondre dans les <strong>24 - 48 heures</strong>.
        </p>
    </div>

    <div style="background: white; border: 2px solid ${emailStyles.accentColor}; border-radius: ${emailStyles.borderRadius}; padding: 25px; margin: 25px 0;">
        <h4 style="color: ${emailStyles.primaryColor}; margin: 0 0 15px 0; font-size: 18px;">🧘‍♀️ En attendant ma réponse...</h4>
        <ul style="color: ${emailStyles.textColor}; line-height: 1.8; padding-left: 20px;">
            <li>Consultez mon site web pour découvrir mes services de sophrologie</li>
            <li>Suivez-moi sur les réseaux sociaux pour des conseils bien-être</li>
            <li>En cas d'urgence, n'hésitez pas à me contacter par téléphone au 06 11 42 17 65</li>
        </ul>
    </div>
  `;

  // Options OVH optimisées (délivrabilité parfaite)
  const clientMailOptions = {
    from: `"Stéphanie Habert - Cabinet de Sophrologie" <${process.env.OVH_EMAIL_USER}>`,
    to: email,
    subject: 'Confirmation de réception de votre message',
    html: getBaseTemplate(content, 'Confirmation de votre message'),
    headers: {
      'X-Priority': '3',
      'Reply-To': process.env.OVH_EMAIL_USER,
      'Return-Path': process.env.OVH_EMAIL_USER,
      'X-Mailer': 'Cabinet Sophrologie Villepreux'
    },
    envelope: {
      from: process.env.OVH_EMAIL_USER,
      to: email
    }
  };

  await transporter.sendMail(clientMailOptions);
};

// Message de contact OVH
const sendContactMessage = async ({ name, email, phone, message }) => {
  const dateFormatted = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Email pour l'admin (contenu identique à votre version)
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
                <strong style="color: ${emailStyles.primaryColor};">📞 Téléphone :</strong>
                <a href="tel:${phone}" style="color: ${emailStyles.secondaryColor}; margin-left: 10px; text-decoration: none;">${phone}</a>
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
            • <strong>Répondre par email :</strong> <a href="mailto:${email}" style="color: #0c5460;">Cliquez ici pour répondre</a><br>
            • <strong>Appeler :</strong> <a href="tel:${phone}" style="color: #0c5460;">${phone}</a><br>
        </p>
    </div>
  `;

  const adminMailOptions = {
    from: `"Site Web - Cabinet de Sophrologie" <${process.env.OVH_EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `Nouveau message de ${name}`,
    html: getBaseTemplate(adminContent, 'Message de contact'),
    headers: {
      'X-Priority': '3',
      'Reply-To': email,
      'Return-Path': process.env.OVH_EMAIL_USER
    }
  };

  await transporter.sendMail(adminMailOptions);
  
  // Auto-réponse client
  await sendAutoResponse(name, email);
};

// Notification témoignage (contenu identique)
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
  `;

  const mailOptions = {
    from: `"Cabinet de Sophrologie" <${process.env.OVH_EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'Nouveau témoignage en attente de validation',
    html: getBaseTemplate(content, 'Gestion des témoignages'),
    headers: {
      'X-Priority': '3',
      'Return-Path': process.env.OVH_EMAIL_USER
    }
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendNewTestimonialNotification,
  sendContactMessage,
  sendAutoResponse
};

// ================================
// CONFIGURATION .ENV POUR OVH
// ================================

/* Adresses recommandées :

contact@cabinet-sophrologie-villepreux.fr (formulaire)
stephanie@cabinet-sophrologie-villepreux.fr (personnel)
admin@cabinet-sophrologie-villepreux.fr (administration)
noreply@cabinet-sophrologie-villepreux.fr (auto-réponses) */

/*
# Configuration OVH Email (à ajouter dans votre .env)
OVH_EMAIL_USER=contact@votre-domaine.fr
OVH_EMAIL_PASS=votre_mot_de_passe_email_ovh
ADMIN_EMAIL=stephanie@votre-domaine.fr

# Variables générales
EMAIL_USER=contact@votre-domaine.fr
*/