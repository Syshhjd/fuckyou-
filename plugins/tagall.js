const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagall",
    react: "🔊",
    alias: ["gc_tagall"],
    desc: "To Tag all Members",
    category: 'moderation',
    use: '.tagall [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜsᴇᴅ ɪɴ ɢʀᴏᴜᴘs.");
        
        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("❌ ᴏɴʟʏ ɢʀᴏᴜᴘ ᴀᴅᴍɪɴs ᴏʀ ᴛʜᴇ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.");
        }

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ ғᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ɢʀᴏᴜᴘ ɪɴғᴏʀᴍᴀᴛɪᴏɴ.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ ɴᴏ ᴍᴇᴍʙᴇʀs ғᴏᴜɴᴅ ɪɴ ᴛʜɪs ɢʀᴏᴜᴘ.");

        let emojis = ['🎭', '🎭', '🎭', '🎭', '🎭', '🥷', '🖤', '🎭', '🎭', '🎭', '🥷', '🥷', '🎭', '🎭', '🙂‍↕️', '💸', '🎭', '🎭', '🎭', '🥷', '🥷', '🥷', '🥷', '🥷', '🥷', '🥷', '🥷', '🥷'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "𝐀𝐓𝐓𝐄𝐍𝐓𝐈𝐎𝐍 𝐄𝐕𝐄𝐑𝐘𝐎𝐍𝐄 𝐌𝐀𝐅𝐈𝐀-𝐌𝐃 𝐓𝐀𝐆𝐆𝐄𝐃 𝐘𝐎𝐔 𝐇𝐄𝐑𝐄!"; // Default message

        let teks = `▢ ɢʀᴏᴜᴘ : *${groupName}*\n▢ ᴍᴇᴍʙᴇʀs : *${totalMembers}*\n▢ ᴍᴇssᴀɢᴇ: *${message}*\n\n┌───⊷ *ᴍᴇɴᴛɪᴏɴs*\n`;

        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──○ 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 ●──";

        conn.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: mek });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});
