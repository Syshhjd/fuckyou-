const { cmd } = require('../command');

cmd({
  pattern: "sendmail",
  alias: ["sendemail", "mail"],
  desc: "📩 Envoie un email HTML stylé depuis le bot.",
  category: "Outils",
  use: ".sendmail 1- email 2- sujet 3- message",
  filename: __filename
}, async (conn, m, msg, { text, prefix, command }) => {

  console.log("✅ Plugin sendmail déclenché");

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
        pass: 'hcao tpur fonl rpzc'
      }
    });

    // HTML stylé avec image et classes CSS
    const htmlMessage = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <img src="https://files.catbox.moe/6fzj6c.jpg" alt="Header" style="width: 100%; height: auto;">
        <div style="padding: 20px;">
          <h2 style="color: #3e3e3e;">📬 Nouveau message depuis Mafia-MD</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #444;">
            ${message.replace(/\n/g, '<br>')}
          </p>
          <hr style="margin: 20px 0;">
          <footer style="text-align: center; font-size: 12px; color: #888;">
            Powered by <strong>Mafia-MD</strong> | <a href="https://github.com/MRC-Tech999/MAFIA-MD">Voir le projet</a>
          </footer>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Mafia-MD Mailer" <epay39209@gmail.com>`,
      to,
      subject,
      html: htmlMessage,
      replyTo: 'no-reply@mafia-md.com'
    });

    return m.reply(`✅ Email HTML envoyé à *${to}* avec succès !\n\n📨 *Sujet* : ${subject}`);
  } catch (err) {
    console.error("[❌ Erreur sendmail]", err);
    return m.reply(`❌ Erreur lors de l'envoi : ${err.message}`);
  }
});
