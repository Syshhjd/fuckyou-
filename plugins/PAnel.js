const panel = require('../lib/ptero');
const cmd = require('../command')
// .newserver NomServeur
cmd({
  pattern: "newserver",
  use: ".newserver NomServeur",
  desc: "Crée un nouvel utilisateur et serveur Pterodactyl"
}, async (conn, mek, m, { reply, args }) => {
  reply(await panel.cmd_newserver(args.join(" ") || "AutoServer"));
});

// .listservers
cmd({
  pattern: "listservers",
  use: ".listservers",
  desc: "Liste tous tes serveurs"
}, async (conn, mek, m, { reply }) => {
  reply(await panel.cmd_listservers());
});

// .restart NomServeur
cmd({
  pattern: "restart",
  use: ".restart NomServeur",
  desc: "Redémarre le serveur"
}, async (conn, mek, m, { reply, args }) => {
  if (!args.length) return reply('Utilisation : .restart NomDuServeur');
  reply(await panel.cmd_restart(args.join(" ")));
});

// .status NomServeur
cmd({
  pattern: "status",
  use: ".status NomServeur",
  desc: "Statut du serveur"
}, async (conn, mek, m, { reply, args }) => {
  if (!args.length) return reply('Utilisation : .status NomDuServeur');
  reply(await panel.cmd_status(args.join(" ")));
});

// .start NomServeur
cmd({
  pattern: "start",
  use: ".start NomServeur",
  desc: "Démarre le serveur"
}, async (conn, mek, m, { reply, args }) => {
  if (!args.length) return reply('Utilisation : .start NomDuServeur');
  reply(await panel.cmd_start(args.join(" ")));
});

// .stop NomServeur
cmd({
  pattern: "stop",
  use: ".stop NomServeur",
  desc: "Arrête le serveur"
}, async (conn, mek, m, { reply, args }) => {
  if (!args.length) return reply('Utilisation : .stop NomDuServeur');
  reply(await panel.cmd_stop(args.join(" ")));
});
