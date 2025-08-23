

/*const { cmd } = require('../command');
const {
  cmd_newserver,
  cmd_listservers,
  cmd_restart,
  cmd_status,
  cmd_start,
  cmd_stop
} = require('../lib/ptero'); // ton script principal déplacé dans lib/ptero.js

// === CRÉER UN SERVEUR PANEL ===
cmd({
  pattern: "createpanel",
  desc: "Créer un serveur panel automatiquement",
  category: "panel",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Donne un nom pour ton serveur.\nExemple: .createpanel BotServer");
  const res = await cmd_newserver(q);
  reply(res);
});

// === LISTER LES SERVEURS ===
cmd({
  pattern: "listpanel",
  desc: "Lister tous les serveurs du client",
  category: "panel",
  react: "📋",
  filename: __filename
},
async (conn, mek, m, { reply }) => {
  const res = await cmd_listservers();
  reply(res);
});

// === STATUT ===
cmd({
  pattern: "statuspanel",
  desc: "Vérifier le statut d’un serveur",
  category: "panel",
  react: "📊",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Donne le nom du serveur.\nExemple: .statuspanel BotServer");
  const res = await cmd_status(q);
  reply(res);
});

// === START ===
cmd({
  pattern: "startpanel",
  desc: "Démarrer un serveur",
  category: "panel",
  react: "▶️",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Donne le nom du serveur.\nExemple: .startpanel BotServer");
  const res = await cmd_start(q);
  reply(res);
});

// === STOP ===
cmd({
  pattern: "stoppanel",
  desc: "Arrêter un serveur",
  category: "panel",
  react: "⏹️",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Donne le nom du serveur.\nExemple: .stoppanel BotServer");
  const res = await cmd_stop(q);
  reply(res);
});

// === RESTART ===
cmd({
  pattern: "restartpanel",
  desc: "Redémarrer un serveur",
  category: "panel",
  react: "🔄",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Donne le nom du serveur.\nExemple: .restartpanel BotServer");
  const res = await cmd_restart(q);
  reply(res);
});
