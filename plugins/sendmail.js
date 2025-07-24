const { cmd } = require('../command');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "sendmail",
  alias: ["sendemail", "mail"],
  desc: "📩 Envoie un email HTML stylisé avec image et signature.",
  category: "Outils",
  use: ".sendmail 1- email 2- sujet 3- message",
  filename: __filename
}, async (conn, m, msg, { text, prefix, command }) => {

  console.log("✅ Plugin sendmail déclenché");

  const to = text.match(/1-\s*([^\n]+?)\s*2-/)?.[1]?.trim();
  const subject = text.match(/2-\s*([^\n]+?)\s*3-/)?.[1]?.trim();
  const messageRaw = text.match(/3-\s*([\s\S]+)/)?.[1]?.trim();

  if (!to || !subject || !messageRaw) {
    return m.reply(`❌ Format invalide.\n\n📌 Exemple :\n${prefix + command} 1- user@gmail.com 2- Sujet 3- Bonjour *client*, voici ton accès.\n_Lien :_ https://site.com`);
  }

  const messageHTML = messageRaw
    .replace(/\n/g, "<br>")
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/_(.*?)_/g, "<em>$1</em>");

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Mafia-MD Notification</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background: #f3f3f3; margin: 0; padding: 0; }
      .email-container { max-width: 680px; margin: 30px auto; background: #fff; border-radius: 10px; box-shadow: 0 0 12px rgba(0,0,0,0.1); overflow: hidden; }
      .email-header img { width: 100%; height: auto; display: block; }
      .email-body { padding: 30px; }
      .email-body h2 { color: #222; font-size: 24px; margin-bottom: 15px; }
      .email-body p { font-size: 16px; line-height: 1.7; color: #333; }
      .highlight { background: #e8f5e9; border-left: 4px solid #2e7d32; padding: 12px; border-radius: 5px; margin: 20px 0; color: #1b5e20; }
      .email-button { display: inline-block; margin-top: 20px; padding: 12px 25px; background-color: #2e7d32; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .email-footer { background: #fafafa; padding: 20px; text-align: center; font-size: 13px; color: #666; }
      .email-footer a { color: #00796b; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <img src="https://files.catbox.moe/6fzj6c.jpg" alt="Mafia-MD Banner">
      </div>
      <div class="email-body">
        <h2>📩 Notification Mafia-MD</h2>
        <p>Bonjour 👋,</p>
        <p class="highlight">Vous avez reçu un nouveau message :</p>
        <p>${messageHTML}</p>
        <a class="email-button" href="mailto:no-reply@mafia-md.com">📬 Répondre / Contacter</a>
        <hr style="margin: 30px 0;">
        <p><strong>ENGLISH VERSION 🇬🇧</strong></p>
        <p>Hello 👋, you have received an automatic message:</p>
        <p>${messageHTML}</p>
        <p>Need help? Contact support or visit our GitHub page.</p>
      </div>
      <div class="email-footer">
        © 2025 <strong>Mafia-MD</strong> | Powered by <strong>MarcTech</strong><br>
        Made with ❤️ by <strong>EMPEROR SUKUNA</strong>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'epay39209@gmail.com',
        pass: 'hcao tpur fonl rpzc'
      }
    });

    await transporter.sendMail({
      from: `"Mafia-MD Mailer" <epay39209@gmail.com>`,
      to,
      subject,
      html: htmlTemplate,
      replyTo: 'no-reply@mafia-md.com',
      attachments: [
        {
          filename: 'mafia-banner.jpg',
          path: 'https://files.catbox.moe/6fzj6c.jpg',
          cid: 'banner@mafia'
        }
      ]
    });

    return m.reply(`✅ Email HTML PREMIUM envoyé à *${to}* avec succès !\n📨 Sujet : ${subject}`);
  } catch (err) {
    console.error("❌ ERREUR DANS SENDMAIL :", err);
    return m.reply(`❌ Erreur lors de l'envoi : ${err.message}`);
  }
});
