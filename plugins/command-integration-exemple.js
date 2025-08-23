const panel = require('../panel');
const { cmd } = require('../command');

// Affiche tous les serveurs
cmd({
  pattern: "listservers",
  use: ".listservers",
  desc: "Voir tous les serveurs"
},
async (conn, mek, m, { reply }) => {
  reply(await panel.listServers());
});


// Statut d’un serveur par nom
cmd({
  pattern: "status",
  use: ".status nomDuServeur",
  desc: "Voir le statut d'un serveur"
},
async (conn, mek, m, { reply, args }) => {
  if (!args[0]) return reply("Donne le nom du serveur !\nExemple : .status MonServeur");
  reply(await panel.statusServer(args.join(" ")));
});
