const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "tagadmins",
    react: "👑",
    alias: ["gc_tagadmins"],
    desc: "To Tag all Admins of the Group",
    category: "group",
    use: '.tagadmins [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, prefix, command, args, body }) => {
    try {
        if (!isGroup) return reply("Fuggedaboutit! This ain't a group, so this command is outta line. Go find a real family gathering.");
        
        const botOwner = conn.user.id.split(":")[0]; // Extract bot owner's number
        const senderJid = senderNumber + "@s.whatsapp.net";

        // Ensure group metadata is fetched properly
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("Listen up, I can't even get the lowdown on this crew. Something's fishy.");

        let groupName = groupInfo.subject || "Unknown Crew";
        let admins = await getGroupAdmins(participants);
        let totalAdmins = admins ? admins.length : 0;
        if (totalAdmins === 0) return reply("What, no bosses in this outfit? Ain't nobody runnin' this show?");

        let emojis = ['👑', '💰', '🥃', '♠️', '🕴️', '🎩', '🚬', '🚨', '💼', '🔫']; // Mafia-style emojis
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "Time to get down to business, capisce?"; // Default mafia message

        let teks = `*Alright, listen up, you wise guys and dolls!* \n\n`;
        teks += `*Crew:* *${groupName}*\n`;
        teks += `*The Brass:* *${totalAdmins}* strong\n`;
        teks += `*The Word:* "${message}"\n\n`;
        teks += `*Here's the roll call for the top brass:*\n`;

        for (let admin of admins) {
            if (!admin) continue; // Prevent undefined errors
            teks += `${randomEmoji} @${admin.split('@')[0]}\n`;
        }

        teks += "\n*Now get back to work. Don't make me ask twice.*"; // Mafia closing

        conn.sendMessage(from, { text: teks, mentions: admins }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`*Whoa, a problem, see?* Something went sideways here. \n\n*Error:* ${e.message || e}\n\nWe'll get to the bottom of this, believe me.`);
    }
});
