const { cmd } = require('../command'); // Ne pas changer ce chemin

cmd({
  pattern: "sendmail",
  alias: ["sendemail", "mail"],
  desc: "📩 Envoie un email depuis le bot.",
  category: "Outils",
  use: ".sendmail 1- email 2- sujet 3- message",
  filename: __filename
}, async (conn, m, msg, { text, prefix, command }) => {

  console.log("✅ Plugin sendmail déclenché"); // Log de test console

  const nodemailer = require('nodemailer');

  const to = text.match(/1-\s*([^\n]+?)\s*2-/)?.[1]?.trim();
  const subject = text.match(/2-\s*([^\n]+?)\s*3-/)?.[1]?.trim();
  const message = text.match(/3-\s*([\s\S]+)/)?.[1]?.trim();

  if (!to || !subject || !message) {
    return m.reply(`❌ Format invalide.\n\n📌 Exemple :\n${prefix + command} 1- email@exemple.com 2- Sujet ici 3- Message ici`);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'epay39209@gmail.com',
        pass: 'hcao tpur fonl rpzc' // mot de passe d'application Gmail
      }
    });

    await transporter.sendMail({
      from: `"Mafia-MD Mailer" <epay39209@gmail.com>`,
      to,
      subject,
      text: message,
      replyTo: 'no-reply@mafia-md.com'
    });

    return m.reply(`✅ Email envoyé à *${to}* avec succès !\n\n📨 *Sujet* : ${subject}\n💬 *Message* :\n${message}`);
  } catch (err) {
    console.error("[❌ Erreur sendmail]", err);
    return m.reply(`❌ Erreur lors de l'envoi : ${err.message}`);
  }
});
