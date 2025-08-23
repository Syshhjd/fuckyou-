const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');
const { performance } = require('perf_hooks'); // Pour le calcul de la vitesse
const version = '1.0.0'; // Version du bot

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
  category: 'ai',
  react: "🕶️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const startTime = performance.now(); // Début du calcul de la vitesse

    const speedMs = (performance.now() - startTime).toFixed(3);

    // En-tête creator
    let text = `
⟣──────────────────⟢
▧ *ᴄʀᴇᴀᴛᴏʀ* : MARCTECH
▧ *ᴍᴏᴅᴇ* : *${config.MODE}* 
▧ *ᴘʀᴇғɪx* : *${config.PREFIX}*
▧ *ʀᴀᴍ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB 
▧ *ᴠᴇʀsɪᴏɴ* : *${version}* 
▧ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())} 
▧ *ᴄᴏᴍᴍᴀɴᴅs* : ${totalCommands}
⟣──────────────────⟢
`;

    const category = {};
    for (const cmd of commands) {
      if (!cmd.category || cmd.category === "owner") continue; // Exclure la catégorie "owner"
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();

    for (const k of keys) {
      text += `\n*╭─『 ${k.toUpperCase()} 』*\n`;
      category[k]
        .filter(c => c.pattern)
        .sort((a, b) => a.pattern.localeCompare(b.pattern))
        .forEach(c => {
          const usage = c.pattern.split('|')[0];
          text += `*│* ■ ${usage}\n`;
        });
      text += `*╰────────────────⟢*\n`;
    }

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/ctrbmt.jpg' },
      caption: text,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400378648653@newsletter',
          newsletterName: '𝗠𝗔𝗙𝗜𝗔-𝗠𝗗',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
