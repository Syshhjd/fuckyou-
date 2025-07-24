const nodemailer = require('nodemailer');

module.exports = {
  name: "sendmail",
  alias: ["sendemail", "mail"],
  description: "📩 Envoie un email à un destinataire.",
  category: "Outils", // ← cette catégorie doit exister pour que `.menu outils` l’affiche
  usage: ".sendmail 1- destinataire 2- sujet 3- contenu",
  cooldown: 10,

  async code(m, { text, prefix, command }) {
    const to = text.match(/1-\s*([^\n]+?)\s*2-/)?.[1]?.trim();
    const subject = text.match(/2-\s*([^\n]+?)\s*3-/)?.[1]?.trim();
    const message = text.match(/3-\s*([\s\S]+)/)?.[1]?.trim();

    if (!to || !subject || !message) {
      return m.reply(`❌ Format invalide.\nUtilisation : ${prefix + command} 1- destinataire 2- sujet 3- contenu`);
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'epay39209@gmail.com',
          pass: 'hcao tpur fonl rpzc'
        }
      });

      const mailOptions = {
        from: `"Mafia-MD Mailer" <epay39209@gmail.com>`,
        to: to,
        subject: subject,
        text: message,
        replyTo: 'no-reply@mafia-md.com'
      };

      await transporter.sendMail(mailOptions);
      return m.reply(`✅ Email envoyé à *${to}* avec succès.`);
    } catch (err) {
      console.error(err);
      return m.reply(`❌ Échec de l'envoi : ${err.message}`);
    }
  }
};
