const { cmd } = require('../command');
const {
  cmd_newserver,
  cmd_listservers,
  cmd_restart,
  cmd_status,
  cmd_start,
  cmd_stop
} = require('../lib/ptero');

// === ALLOWED OWNER NUMBERS ===
const owners = ["50947731439", "221786026985"]; // only 2 numbers

// === CHECK IF SENDER IS OWNER ===
function isOwner(sender) {
  const number = sender.replace(/[^0-9]/g, ''); // keep only digits
  return owners.includes(number);
}

// === CREATE PANEL SERVER ===
cmd({
  pattern: "createpanel",
  desc: "Automatically create a panel server",
  category: "panel",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
  if (!q) return reply("❌ Please provide a server name.\nExample: .createpanel BotServer");
  const res = await cmd_newserver(q);
  reply(res);
});

// === LIST PANEL SERVERS ===
cmd({
  pattern: "listpanel",
  desc: "List all servers of the client",
  category: "panel",
  react: "📋",
  filename: __filename
},
async (conn, mek, m, { reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
  const res = await cmd_listservers();
  reply(res);
});

// === SERVER STATUS ===
cmd({
  pattern: "statuspanel",
  desc: "Check server status",
  category: "panel",
  react: "📊",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
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
async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
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
async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
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
async (conn, mek, m, { q, reply }) => {
  if (!isOwner(m.sender)) return reply("❌ You are not authorized to use this command!");
  if (!q) return reply("❌ Please provide the server name.\nExample: .restartpanel BotServer");
  const res = await cmd_restart(q);
  reply(res);
});
