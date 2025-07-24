const nodemailer = require('nodemailer');
const { cmd } = require('../command');

cmd({
  pattern: "sendmail",
  alias: ["sendemail", "mail"],
  desc: "📩 Envoie un email à un destinataire.",
  category: "Outils",
  use: ".sendmail 1- email 2- sujet 3- message",
  filename: __filename
}, async (conn, m, msg, { text, prefix, command }) => {
  try {
    const to = text.match(/1-\s*([^\n]+?)\s*2-/)?.[1]?.trim();
    const subject = text.match(/2-\s*([^\n]+?)\s*3-/)?.[1]?.trim();
    const message = text.match(/3-\s*([\s\S]+)/)?.[1]?.trim();

    if (!to || !subject || !message) {
      return m.reply(`❌ Format invalide.\nExemple :\n${prefix + command} 1- user@gmail.com 2- Hello 3- Bienvenue sur Mafia-MD !`);
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'epay39209@gmail.com',
        pass: 'hcao tpur fonl rpzc'
      }
    });

    await transporter.sendMail({
      from: `"Mafia-MD" <epay39209@gmail.com>`,
      to,
      subject,
      text: message,
      replyTo: 'no-reply@mafia-md.com'
    });

    return m.reply(`✅ Email envoyé à *${to}* avec succès.`);
  } catch (e) {
    console.error("❌ Plugin sendmail error:", e);
    return m.reply(`❌ Erreur lors de l'envoi : ${e.message}`);
  }
});
