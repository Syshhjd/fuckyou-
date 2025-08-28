const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');
const { performance } = require('perf_hooks');
const version = '1.0.0';

// Fonction uptime formatée
const runtime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h}h ${m}m ${s}s`;
};

cmd({
  pattern: "menu",
  alias: ["help", "Mafia"],
  use: '.menu',
  desc: "Show all bot commands",
  category: 'main',
  react: "🕶️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const sender = m?.sender || mek?.key?.participant || mek?.key?.remoteJid || 'unknown@s.whatsapp.net';
    const totalCommands = commands.length;
    const startTime = performance.now();
    const speedMs = (performance.now() - startTime).toFixed(3);

    // ─── HEADER ───
    let text = `
╭━〔 *𝐌𝐀𝐅𝐈𝐀-𝐌𝐃* 〕━┈⊷
┃╭─────────────────
┃│ *ᴜsᴇʀ* : @${sender.split("@")[0]}
┃│ *ᴍᴏᴅᴇ* : *${config.MODE}*
┃│ *ᴘʀᴇғɪx* : *${config.PREFIX}*
┃│ *ᴠᴇʀsɪᴏɴ* : *${version}*
┃│ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())}
┃│ *ᴄᴏᴍᴍᴀɴᴅs* : ${totalCommands}
┃│ *ᴄʀᴇᴀᴛᴏʀ* : ᴍᴀʀᴄᴛᴇᴄʜ
┃╰─────────────────
╰━━━━━━━━━━━━━━━━━━
`;

    // ─── AUTO-CATEGORIES ───
    const category = {};
    for (const cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();

    for (const k of keys) {
      text += `
╭────────────────❏
├❍ *\`${k.toUpperCase()} MENU\`*
├────────────────❏`;

      category[k].forEach(c => {
        if (!c.pattern) return;
        const usage = c.pattern.split('|')[0];
        text += `\n├➩ ${usage}`;
      });

      text += `\n┕────────────────❍\n`;
    }

    text += `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀᴄᴛᴇᴄʜ`;

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/ctrbmt.jpg' },
      caption: text,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400378648653@newsletter',
          newsletterName: '𝐌𝐀𝐅𝐈𝐀-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
