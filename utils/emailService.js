const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Envoi de notification pour un nouveau témoignage à l'admin
const sendNewTestimonialNotification = async (temoignageData) => {
  const { name, message } = temoignageData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: '💬 Nouveau témoignage en attente',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2c3e50;">Nouveau témoignage reçu</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Message :</strong></p>
          <blockquote style="margin: 10px 0; padding: 10px; background: #fff; border-left: 4px solid #2c3e50;">${message}</blockquote>
        </div>
        <p style="margin-top: 20px;">Connectez-vous à l'interface admin pour le valider.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

const sendContactMessage = async ({ name, email, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    replyTo: email,
    subject: '📬 Nouveau message via le formulaire de contact',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color: #2c3e50;">Message du site web</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendNewTestimonialNotification,
  sendContactMessage
};