const axios = require("axios");
const { cmd } = require("../command");

// Command: bible
cmd({
    pattern: "bible",
    desc: "Fetch Bible verses by reference.",
    category: "utility",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifiez si une référence est fournie
        if (args.length === 0) {
            return reply(`⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ʙɪʙʟᴇ ʀᴇғᴇʀᴇɴᴄᴇ.*\n\n📝 *ᴇxᴀᴍᴘʟᴇ:*\n.ʙɪʙʟᴇ ᴊᴏʜɴ 1:1`);
        }

        // Joindre les arguments pour former la référence
        const reference = args.join(" ");

        // Appeler l'API avec la référence
        const apiUrl = `https://bible-api.com/${encodeURIComponent(reference)}`;
        const response = await axios.get(apiUrl);

        // Vérifiez si la réponse contient des données
        if (response.status === 200 && response.data.text) {
            const { reference: ref, text, translation_name } = response.data;

            // Envoyez la réponse formatée avec des emojis
            reply(
                `📜 *ʙɪʙʟᴇ ᴠᴇʀsᴇ ғᴏᴜɴᴅ!*\n\n` +
                `📖 *ʀᴇғᴇʀᴇɴᴄᴇ:* ${ref}\n` +
                `📚 *ᴛᴇxᴛ:* ${text}\n\n` +
                `🗂️ *ᴛʀᴀɴsʟᴀᴛɪᴏɴ:* ${translation_name}\n\n> © 𝐌𝐀𝐅𝐈𝐀-𝐌𝐃 𝐁𝐈𝐁𝐋𝐄`
            );
        } else {
            reply("❌ *Verse not found.* Please check the reference and try again.");
        }
    } catch (error) {
        console.error(error);
        reply("⚠️ *An error occurred while fetching the Bible verse.* Please try again.");
    }
});
