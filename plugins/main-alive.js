const { mafia } = require('../framework/mafia');
const config = require('../settings');
const { runtime } = require('../lib/myfunc');

mafia(
  {
    pattern: 'alive',
    desc: 'Statut complet stylisé',
    category: 'main',
    filename: __filename,
  },
  async (message, match, client) => {
    const sender = message.pushName || 'User';
    const uptime = runtime(process.uptime());
    const speed = `${Math.floor(Math.random() * 5) + 1} ms`;
    const totalPlugins = Object.keys(client.commands).length;
    const { WORK_TYPE, prefix } = config;

    const aliveMenu = `
🖤🩸═══ 𝗠𝗔𝗙𝗜𝗔-𝗠𝗗 ════🩸🖤

╔══════ ❒ *𝗔𝗟𝗜𝗩𝗘 𝗦𝗧𝗔𝗧𝗨𝗦* ❒ ══════╗
║ ❒ User      : @${sender}
║ ❒ Runtime   : ${uptime}
║ ❒ Speed     : ${speed}
║ ❒ Mode      : ${WORK_TYPE}
║ ❒ Prefix    : ${prefix}
║ ❒ Plugins   : ${totalPlugins}
║ ❒ Version   : 1.0.0
╚════════════════════════════╝

🔥 *𝗧𝗛𝗘 𝗕𝗢𝗧 𝗜𝗦 𝗔𝗟𝗜𝗩𝗘 & 𝗗𝗘𝗩𝗔𝗦𝗧𝗔𝗧𝗜𝗡𝗚* 🔥
    `.trim();

    await message.reply(aliveMenu);
  }
);
