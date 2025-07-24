const { cmd } = require('../command');
const nodemailer = require('nodemailer');

cmd({
  pattern: "sendmail",
  alias: ["sendemail", "mail"],
  desc: "📩 Envoie un email HTML stylisé avec image, signature et design professionnel.",
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

  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>${subject}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

      body {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        background: #f2f4f7;
        color: #333;
      }

      .email-container {
        max-width: 700px;
        margin: 40px auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      }

      .email-header img {
        width: 100%;
        height: auto;
        display: block;
      }

      .badge {
        display: inline-block;
        background: #2e7d32;
        color: white;
        font-size: 12px;
        font-weight: bold;
        padding: 4px 10px;
        border-radius: 5px;
        margin-bottom: 15px;
      }

      .email-body {
        padding: 30px;
      }

      .email-body h2 {
        font-size: 26px;
        margin-top: 0;
        color: #222;
      }

      .email-body p {
        font-size: 16px;
        line-height: 1.7;
      }

      .highlight {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 12px;
        border-radius: 5px;
        margin: 20px 0;
      }

      .email-button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 30px;
        background: #1565c0;
        color: #fff !important;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }

      .divider {
        margin: 35px 0;
        border-top: 1px solid #e0e0e0;
      }

      .email-footer {
        background: #f5f5f5;
        padding: 25px;
        font-size: 13px;
        text-align: center;
        color: #777;
      }

      .footer-signature {
        font-weight: bold;
        font-size: 15px;
        color: #222;
      }

      .footer-signature span {
        background: linear-gradient(90deg, #43cea2, #185a9d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
      }

      .email-footer a {
        color: #0288d1;
        text-decoration: none;
      }

      @media (prefers-color-scheme: dark) {
        body { background: #121212; color: #eee; }
        .email-container { background: #1e1e1e; }
        .email-footer { background: #121212; color: #999; }
        .highlight { background: #333; border-left-color: #64b5f6; }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <img src="https://files.catbox.moe/6fzj6c.jpg" alt="Mafia Banner">
      </div>
      <div class="email-body">
        <div class="badge">MAFIA PROTECTED</div>
        <h2>📬 Nouvelle notification</h2>
        <p>📅 Envoyé le : <strong>${date}</strong></p>
        <div class="highlight">
          <p>${messageHTML}</p>
        </div>
        <a class="email-button" href="mailto:no-reply@mafia-md.com">✉️ Répondre / Contact</a>

        <div class="divider"></div>

        <h3>🇬🇧 English Version</h3>
        <p>This is an automatic message sent by the Mafia-MD system:</p>
        <p>${messageHTML}</p>
        <p>Need help? Contact our team or visit <a href="https://github.com/MRC-Tech999/MAFIA-MD" target="_blank">our GitHub</a>.</p>
      </div>
      <div class="email-footer">
        <div class="footer-signature">Made with ❤️ by <span>EMPEROR SUKUNA</span> — Powered by <strong>MarcTech</strong></div>
        <br>
        &copy; 2025 Mafia-MD • Tous droits réservés.
      </div>
    </div>
  </body>
  </html>`;

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
      replyTo: 'no-reply@mafia-md.com'
    });

    return m.reply(`✅ *Email PREMIUM+* envoyé à *${to}* avec succès !\n\n📨 Sujet : *${subject}*`);
  } catch (err) {
    console.error("❌ ERREUR DANS SENDMAIL :", err);
    return m.reply(`❌ Erreur lors de l'envoi : ${err.message}`);
  }
});
