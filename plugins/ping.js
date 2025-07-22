const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: 'utility',
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*𝐏𝐈𝐍𝐆𝐈𝐍𝐆...*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `> *𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 𝐒𝐏𝐄𝐄𝐃: ${ping}𝐦𝐬*` }, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})