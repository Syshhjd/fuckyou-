const { cmd } = require('../command');
const {
  cmd_newserver
} = require('../lib/pteroAutoServer'); // <-- ton fichier avec les fonctions

cmd({
  pattern: "createpanel",
  alias: ["newpanel", "addpanel"],
  desc: "Créer un user + serveur automatiquement sur le panel",
  category: "panel",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("⚠️ Merci de préciser un nom de serveur.\n\nExemple: *.createpanel MyBot*");

    const res = await cmd_newserver(q);

    await reply(res);
  } catch (e) {
    reply(`❌ Erreur: ${e.message}`);
  }
});
