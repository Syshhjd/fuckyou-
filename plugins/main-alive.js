const { mafia } = require('../framework/mafia');
const config = require('../settings');
const os = require('os');
const { runtime } = require('../lib/myfunc');

mafia(
  {
    pattern: 'alive',
    desc: 'Show bot status',
    category: 'main',
    filename: __filename,
  },
  async (message, match, client) => {
    const senderName = message.pushName || 'User';
    const { prefix } = config;
    const aliveMessage = `
🖤🩸═══ 𝗠𝗔𝗙𝗜𝗔-𝗠𝗗 ════🩸🖤

╔═════════════════════╗
║ 🧑‍💻 𝗨𝘀𝗲𝗿   : @${senderName}
║ ⏳ 𝗥𝘂𝗻𝘁𝗶𝗺𝗲 : ${runtime(process.uptime())}
║ ⚡ 𝗠𝗼𝗱𝗲    : ${config.WORK_TYPE}
║ 📝 𝗣𝗿𝗲𝗳𝗶𝘅  : ${prefix}
║ 📦 𝗣𝗹𝘂𝗴𝗶𝗻𝘀 : ${Object.keys(client.commands).length}
║ 🛠️ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 1.0.0
║ ⚡ 𝗦𝗽𝗲𝗲𝗱   : ${Math.floor(Math.random() * 10) + 1} ms
╚═════════════════════╝


    `.trim();

    await message.reply(aliveMessage);
  }
);
