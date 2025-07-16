const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');
const { performance } = require('perf_hooks'); // Pour le calcul de la vitesse

cmd({
  pattern: "menu",
  alias: ["help", "Mafia"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "🕶️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const startTime = performance.now(); // Début du calcul de la vitesse

    const uptime = () => {
      const sec = process.uptime();
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // Simulation de la vitesse
    const speedMs = (performance.now() - startTime).toFixed(3);

    let text = `
🖤🩸═══ 𝗠𝗔𝗙𝗜𝗔-𝗠𝗗 ════🩸🖤

╔═════════════════════╗
║ 🧑‍💻 𝗨𝘀𝗲𝗿   : @${m.sender.split("@")[0]}
║ ⏳ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 : ${uptime()}
║ ⚡ 𝗠𝗼𝗱𝗲    : ${config.MODE}
║ 📝 𝗣𝗿𝗲𝗳𝗶𝘅  : [${config.PREFIX}]
║ 📦 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 : ${totalCommands}
║ 🛠️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.0
║ ⚡ 𝗦𝗽𝗲𝗲𝗱   : ${speedMs} ms
╚═════════════════════╝

🔥 *WELCOME TO MAFIA-MD* 🔥
`;

    const category = {};
    for (const cmd of commands) {
      if (!cmd.category || cmd.category === "owner") continue; // Exclure la catégorie "owner"
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();

    for (const k of keys) {
      text += `\n╔══════ ❒ *${k.toUpperCase()}* ❒ ══════╗\n`;
      category[k]
        .filter(c => c.pattern)
        .sort((a, b) => a.pattern.localeCompare(b.pattern))
        .forEach(c => {
          const usage = c.pattern.split('|')[0];
          text += `║ ❒ ${usage}\n`;
        });
      text += `╚════════════════════════════╝\n`;
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
