const { createRandomUser, createServerForUser } = require('../pteroAutoServer');
const { cmd } = require('../command');

cmd({
  pattern: "newserver",
  use: ".newserver [NomServeur]",
  desc: "Crée un nouveau serveur avec utilisateur owner auto",
  category: "ptero",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    // Nom du serveur (tout le texte après la commande)
    const serverName = args.length > 0 ? args.join(" ") : "AutoServer";

    // ⚠️ Mets ici les bons IDs de ton panel
    const node = 1;
    const allocation = 1;
    const nest = 1;
    const egg = 1;

    // 1. Créer user aléatoire
    const user = await createRandomUser();

    // 2. Créer serveur avec ce user comme owner
    const server = await createServerForUser(user.id, serverName, node, allocation, nest, egg);

    // 3. Retourner infos au WhatsApp
    reply(
      `✅ *Serveur créé avec succès !*\n\n` +
      `🌐 *Panel:* https://chat.vezxa.com\n` +
      `👤 *Owner:* ${user.username}\n` +
      `📧 *Email:* ${user.email}\n` +
      `📝 *Prénom:* ${user.first_name}\n` +
      `📝 *Nom:* ${user.last_name}\n` +
      `🔑 *Mot de passe:* ${user.password}\n\n` +
      `🖥️ *Server:* ${server.name}\n` +
      `🆔 ID: ${server.id}`
    );

  } catch (e) {
    reply(`❌ Erreur: ${e.response?.data ? JSON.stringify(e.response.data) : e.message}`);
  }
});
