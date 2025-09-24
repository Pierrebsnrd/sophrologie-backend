const nodemailer = require('nodemailer');

// Diagnostic de configuration
const checkEmailConfig = () => {
  const requiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`❌ Variables d'environnement manquantes pour l'email: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ Configuration email détectée');
  return true;
};

// Créer le transporteur avec gestion d'erreur + options anti-spam
let transporter = null;
try {
  if (checkEmailConfig()) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // OPTIONS ANTI-SPAM AJOUTÉES
      secure: true,
      tls: {
        rejectUnauthorized: false
      },
      pool: true, // Utilise un pool de connexions
      maxConnections: 5,
      maxMessages: 10,
      rateLimit: 5 // Max 5 emails par seconde
    });
    
    // Test de connexion
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Erreur configuration email:', error);
        transporter = null;
      } else {
        console.log('✅ Service email Gmail configuré et testé');
      }
    });
  }
} catch (error) {
  console.error('❌ Erreur initialisation service email:', error);
  transporter = null;
}

// Configuration des couleurs et style pour la sophrologie
const emailStyles = {
  primaryColor: '#2c5530',
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
                    📍 Villepreux • 📞 06 11 42 17 65 • 📧 stephaniehabert.sophrologue@gmail.com
                </div>
                <div style="margin-bottom: 15px;">
                    🌐 <a href="#" style="color: ${emailStyles.secondaryColor}; text-decoration: none;">https://www.sophrologuevillepreux.fr/</a>
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
  `;

  // PTIONS ANTI-SPAM POUR TÉMOIGNAGES
  const mailOptions = {
    from: `"Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'Nouveau témoignage en attente de validation',
    html: getBaseTemplate(content, 'Gestion des témoignages'),
    // HEADERS ANTI-SPAM
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'Cabinet Sophrologie Admin',
      'Reply-To': process.env.EMAIL_USER,
      'Return-Path': process.env.EMAIL_USER
    }
  };

  await transporter.sendMail(mailOptions);
};

// Message de contact avec auto-réponse
const sendContactMessage = async ({ name, email, phone, message }) => {
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

  // OPTIONS ANTI-SPAM POUR EMAIL ADMIN
  const adminMailOptions = {
    from: `"Site Web - Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: `Nouveau message de ${name}`,
    html: getBaseTemplate(adminContent, 'Message de contact'),
    // HEADERS ANTI-SPAM
    headers: {
      'X-Priority': '3',
      'X-Mailer': 'Cabinet Sophrologie Contact',
      'Reply-To': email,
      'Return-Path': process.env.EMAIL_USER
    }
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

  // OPTIONS ANTI-SPAM CRITIQUES POUR AUTO-RÉPONSE CLIENT
  const clientMailOptions = {
    from: `"Stephanie Habert - Cabinet de Sophrologie" <${process.env.EMAIL_USER}>`, // ✅ Nom professionnel
    to: email,
    subject: 'Confirmation de reception de votre message',
    html: getBaseTemplate(content, 'Confirmation de votre message'),
    // HEADERS ANTI-SPAM RENFORCÉS
    headers: {
      'X-Priority': '3', // Priorité normale
      'X-Mailer': 'Cabinet Sophrologie',
      'Reply-To': process.env.EMAIL_USER,
      'Return-Path': process.env.EMAIL_USER,
      'MIME-Version': '1.0',
      'Content-Type': 'text/html; charset=utf-8'
    },
    // OPTIONS ENVELOPE POUR SÉCURITÉ
    envelope: {
      from: process.env.EMAIL_USER,
      to: email
    }
  };

  await transporter.sendMail(clientMailOptions);
};

module.exports = {
  sendNewTestimonialNotification,
  sendContactMessage,
  sendAutoResponse
};