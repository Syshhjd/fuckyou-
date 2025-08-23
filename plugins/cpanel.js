const { cmd } = require('../command');
const {
  cmd_newserver,
  cmd_listservers,
  cmd_restart,
  cmd_status,
  cmd_start,
  cmd_stop
} = require('../lib/ptero'); // your main script moved to lib/ptero.js

// === ALLOWED NUMBERS ===
const allowedNumbers = ["50947731439", "221786026985", "50948702213"]; // add your 2 numbers here (without @s.whatsapp.net)

function checkAuth(sender, reply) {
  const cleanNumber = sender.replace(/[^0-9]/g, "");
  if (!allowedNumbers.includes(cleanNumber)) {
    reply("⛔ Sorry, you are not allowed to use this command.");
    return false;
  }
  return true;
}

// === CREATE SERVER ===
cmd({
  pattern: "createpanel",
  desc: "Automatically create a panel server",
  category: "panel",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  if (!q) return reply("❌ Please provide a server name.\nExample: .createpanel BotServer");
  const res = await cmd_newserver(q);
  reply(res);
});

// === LIST SERVERS ===
cmd({
  pattern: "listpanel",
  desc: "List all client servers",
  category: "panel",
  react: "📋",
  filename: __filename
},
async (conn, mek, m, { reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  const res = await cmd_listservers();
  reply(res);
});

// === SERVER STATUS ===
cmd({
  pattern: "statuspanel",
  desc: "Check the status of a server",
  category: "panel",
  react: "📊",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  if (!q) return reply("❌ Please provide the server name.\nExample: .statuspanel BotServer");
  const res = await cmd_status(q);
  reply(res);
});

// === START SERVER ===
cmd({
  pattern: "startpanel",
  desc: "Start a server",
  category: "panel",
  react: "▶️",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  if (!q) return reply("❌ Please provide the server name.\nExample: .startpanel BotServer");
  const res = await cmd_start(q);
  reply(res);
});

// === STOP SERVER ===
cmd({
  pattern: "stoppanel",
  desc: "Stop a server",
  category: "panel",
  react: "⏹️",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  if (!q) return reply("❌ Please provide the server name.\nExample: .stoppanel BotServer");
  const res = await cmd_stop(q);
  reply(res);
});

// === RESTART SERVER ===
cmd({
  pattern: "restartpanel",
  desc: "Restart a server",
  category: "panel",
  react: "🔄",
  filename: __filename
},
async (conn, mek, m, { q, reply, sender }) => {
  if (!checkAuth(sender, reply)) return;
  if (!q) return reply("❌ Please provide the server name.\nExample: .restartpanel BotServer");
  const res = await cmd_restart(q);
  reply(res);
});
