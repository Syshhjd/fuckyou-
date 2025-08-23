const { createRandomUser, createServerForUser } = require('./pteroAutoServer');

cmd({
  pattern: "newserver",
  use: ".newserver [NomServeur]",
  desc: "Crée un nouveau serveur avec utilisateur owner auto"
},
async (conn, mek, m, { from, reply, args }) => {
  try {
    const serverName = args[0] || "AutoServer";
    // À ADAPTER : remplace les 1 par les bons IDs (voir ton panel)
    const node = 1, allocation = 1, nest = 1, egg = 1;

    // 1. Créer user aléatoire
    const user = await createRandomUser();

    // 2. Créer serveur avec ce user en owner
    const server = await createServerForUser(user.id, serverName, node, allocation, nest, egg);

    // 3. Retourner infos au WhatsApp
    reply(
      `✅ Serveur créé !\n` +
      `🔸Panel: https://chat.vezxa.com\n` +
      `🔸Owner: ${user.username}\n` +
      `🔸Email: ${user.email}\n` +
      `🔸Prénom: ${user.first_name}\n` +
      `🔸Nom: ${user.last_name}\n` +
      `🔸Mot de passe: ${user.password}\n` +
      `🔸Server name: ${server.name}\n` +
      `ID: ${server.id}`
    );
  } catch (e) {
    reply(`❌ Erreur: ${e.response ? JSON.stringify(e.response.data) : e.message}`);
  }
});
