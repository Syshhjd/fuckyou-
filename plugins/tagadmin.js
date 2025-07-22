const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagadmins",
    react: "👑",
    alias: ["gc_tagadmins"],
    desc: "To Tag all Admins of the Group",
    category: 'moderation',
    use: '.tagadmins [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("ғᴜɢɢᴇᴅᴀʙᴏᴜᴛɪᴛ! ᴛʜɪs ᴀɪɴ'ᴛ ᴀ ɢʀᴏᴜᴘ, sᴏ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ᴏᴜᴛᴛᴀ ʟɪɴᴇ. ɢᴏ ғɪɴᴅ ᴀ ʀᴇᴀʟ ғᴀᴍɪʟʏ ɢᴀᴛʜᴇʀɪɴɢ.");
        
        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("ʟɪsᴛᴇɴ ᴜᴘ, I ᴄᴀɴ'ᴛ ᴇᴠᴇɴ ɢᴇᴛ ᴛʜᴇ ʟᴏᴡᴅᴏᴡɴ ᴏɴ ᴛʜɪs ᴄʀᴇᴡ. sᴏᴍᴇᴛʜɪɴɢ's ғɪsʜʏ.");

        let groupName = groupInfo.subject || "Unknown Crew";
        let admins = await getGroupAdmins(participants);
        let totalAdmins = admins ? admins.length : 0;
        if (totalAdmins === 0) return reply("ᴡʜᴀᴛ, ɴᴏ ʙᴏssᴇs ɪɴ ᴛʜɪs ᴏᴜᴛғɪᴛ? ᴀɪɴ'ᴛ ɴᴏʙᴏᴅʏ ʀᴜɴɴɪɴ' ᴛʜɪs sʜᴏᴡ?");

        let emojis = ['👑', '💰', '🥃', '♠️', '🕴️', '🎩', '🚬', '🚨', '💼', '🔫']; // Mafia-style emojis
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "ᴛɪᴍᴇ ᴛᴏ ɢᴇᴛ ᴅᴏᴡɴ -to ʙᴜsɪɴᴇss, ᴄᴀᴘɪsᴄᴇ?"; // Default mafia message

        let teks = `*ᴀʟʀɪɢʜᴛ, ʟɪsᴛᴇɴ up, ʏᴏᴜ ᴡɪsᴇ ɢᴜʏs ᴀɴᴅ ᴅᴏʟʟs!* \n\n`;
        teks += `*ᴄʀᴇᴡ:* *${groupName}*\n`;
        teks += `*ᴛʜᴇ ʙʀᴀss:* *${totalAdmins}* strong\n`;
        teks += `*ᴛʜᴇ ᴡᴏʀᴅ:* "${message}"\n\n`;
        teks += `*ʜᴇʀᴇ's ᴛʜᴇ ʀᴏʟʟ ᴄᴀʟʟ ғᴏʀ ᴛʜᴇ ᴛᴏᴘ ʙʀᴀss:*\n`;

        for (let admin of admins) {
            if (!admin) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${admin.split('@')[0]}\n`;
        }

        teks += "\n*ɴᴏᴡ ɢᴇᴛ ʙᴀᴄᴋ ᴛᴏ ᴡᴏʀᴋ. ᴅᴏɴ'ᴛ ᴍᴀᴋᴇ ᴍᴇ ᴀsᴋ ᴛᴡɪᴄᴇ.*"; // Mafia closing

        conn.sendMessage(from, { text: teks, mentions: admins }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`*Whoa, a problem, see?* Something went sideways here. \n\n*Error:* ${e.message || e}\n\nWe'll get to the bottom of this, believe me.`);
    }
});
