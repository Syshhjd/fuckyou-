module.exports = {
  name: "sendmail",
  alias: ["sendemail", "mail"],
  description: "📩 Envoie un email à un destinataire depuis le bot.",
  category: "Outils",
  usage: ".sendmail 1- destinataire 2- sujet 3- contenu",
  cooldown: 10,

  code: async (m, { text, prefix, command }) => {
    const to = text.match(/1-\s*([^\n]+?)\s*2-/)?.[1]?.trim();
    const subject = text.match(/2-\s*([^\n]+?)\s*3-/)?.[1]?.trim();
    const message = text.match(/3-\s*([\s\S]+)/)?.[1]?.trim();

    if (!to || !subject || !message) {
      return m.reply(`❌ Format incorrect.\nUtilisation : ${prefix + command} 1- destinataire 2- sujet 3- contenu`);
    }

    let nodemailer;
    try {
      nodemailer = require('nodemailer');
    } catch (e) {
      return m.reply("❌ Le module 'nodemailer' n'est pas installé. Fais : *npm install nodemailer*");
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'epay39209@gmail.com',
        pass: 'hcao tpur fonl rpzc' // mot de passe d'application
      }
    });

    const mailOptions = {
      from: `"Mafia-MD Mailer" <epay39209@gmail.com>`,
      to: to,
      subject: subject,
      text: message,
      replyTo: 'no-reply@mafia-md.com'
    };

    try {
      await transporter.sendMail(mailOptions);
      return m.reply(`✅ Email envoyé à *${to}* avec succès.\n📨 Sujet : *${subject}*`);
    } catch (err) {
      console.error(err);
      return m.reply(`❌ Erreur lors de l'envoi : ${err.message}`);
    }
  }
};
