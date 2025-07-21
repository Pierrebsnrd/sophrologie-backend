const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRdvNotification = async (rdvData) => {
  const { name, email, date, message } = rdvData;
  
  // Email à l'admin
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: '🗓️ Nouvelle demande de rendez-vous',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2c3e50;">Nouvelle demande de rendez-vous</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Date souhaitée :</strong> ${new Date(date).toLocaleString('fr-FR')}</p>
          <p><strong>Message :</strong> ${message || 'Aucun message'}</p>
        </div>
      </div>
    `,
  };

  // Email de confirmation au client
  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '✅ Demande de rendez-vous reçue',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #27ae60;">Votre demande a été reçue</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre demande de rendez-vous pour le <strong>${new Date(date).toLocaleString('fr-FR')}</strong>.</p>
        <p>Nous vous confirmerons rapidement la disponibilité de ce créneau.</p>
        <p>Cordialement,<br>Cabinet de Sophrologie</p>
      </div>
    `,
  };

  await Promise.all([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(clientMailOptions)
  ]);
};

const sendStatusUpdate = async (rdvData, status) => {
  const { name, email, date } = rdvData;
  const statusText = status === 'confirmed' ? 'confirmé' : 'annulé';
  const statusColor = status === 'confirmed' ? '#27ae60' : '#e74c3c';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${status === 'confirmed' ? '✅' : '❌'} Rendez-vous ${statusText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: ${statusColor};">Rendez-vous ${statusText}</h2>
        <p>Bonjour ${name},</p>
        <p>Votre rendez-vous du <strong>${new Date(date).toLocaleString('fr-FR')}</strong> a été <strong>${statusText}</strong>.</p>
        ${status === 'confirmed' ? 
          '<p>Nous vous attendons à cette date. N\'hésitez pas à nous contacter si vous avez des questions.</p>' : 
          '<p>N\'hésitez pas à reprendre un nouveau rendez-vous si vous le souhaitez.</p>'
        }
        <p>Cordialement,<br>Cabinet de Sophrologie</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRdvNotification,
  sendStatusUpdate
};