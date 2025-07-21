const { mafia } = require('../framework/mafia');
const config = require('../settings');
const { runtime } = require('../lib/myfunc');

mafia(
  {
    pattern: 'alive',
    desc: 'Statut stylisé comme un menu',
    category: 'main',
    filename: __filename,
  },
  async (message, match, client) => {
    try {
      const sender = message.pushName || 'User';
      const uptime = runtime(process.uptime());
      const speed = `${Math.floor(Math.random() * 10) + 1} ms`;
      const totalPlugins = Object.keys(client.commands).length;
      const { WORK_TYPE, prefix } = config;

      const aliveText = `
🖤🩸═══ 𝗠𝗔𝗙𝗜𝗔-𝗠𝗗 ════🩸🖤

╔══════ ❒ *𝗔𝗟𝗜𝗩𝗘* ❒ ══════╗
║ ❒ 𝗨𝘀𝗲𝗿     : @${sender}
║ ❒ 𝗨𝗽𝘁𝗶𝗺𝗲   : ${uptime}
║ ❒ 𝗦𝗽𝗲𝗲𝗱    : ${speed}
║ ❒ 𝗠𝗼𝗱𝗲     : ${WORK_TYPE}
║ ❒ 𝗣𝗿𝗲𝗳𝗶𝘅   : ${prefix}
║ ❒ 𝗣𝗹𝘂𝗴𝗶𝗻𝘀  : ${totalPlugins}
║ ❒ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻  : 1.0.0
╚════════════════════════════╝

🔥 *𝗧𝗛𝗘 𝗕𝗢𝗧 𝗜𝗦 𝗔𝗟𝗜𝗩𝗘 & 𝗥𝗘𝗔𝗗𝗬* 🔥
      `.trim();

      await message.reply(aliveText);
    } catch (err) {
      console.error("Erreur dans la commande .alive :", err);
      await message.reply("❌ Une erreur s’est produite lors de l’exécution de `.alive`.");
    }
  }
);
