const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play",
    alias: ["mp3", "ytmp3"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: 'media',
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ ᴘʀᴏᴠɪᴅᴇ ᴛʜᴇ sᴏɴɢ ɴᴀᴍᴇ ᴏʀ ʏᴏᴜᴛᴜʙᴇ ᴜʀʟ!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;
        let videoData;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            videoData = searchResults.results[0];
            id = videoData.videoId;
        } else {
            const searchResults = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
            if (!searchResults?.results?.length) return await reply("❌ Failed to fetch video!");
            videoData = searchResults.results[0];
        }

        // Preload the MP3 without waiting for user choice
        const preloadedAudio = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);

        const { url, title, image, timestamp, ago, views, author } = videoData;

        // Mafia style message
        let info = `💀 *ᴍᴀꜰɪᴀ sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* 💀\n\n` +
            `🎤 *sᴏɴɢ:* ${title || "Unknown"}\n` +
            `⏳ *ᴅᴜʀᴀᴛɪᴏɴ:* ${timestamp || "Unknown"}\n` +
            `👀 *ᴠɪᴇᴡs:* ${views || "Unknown"}\n` +
            `🌏 *ʀᴇʟᴇᴀsᴇ Ago:* ${ago || "Unknown"}\n` +
            `👤 *ʙʏ:* ${author?.name || "Unknown"}\n` +
            `🖇 *Url:* ${url || "Unknown"}\n\n` +
            `💣 *ᴅᴏᴡɴʟᴏᴀᴅ ɪɴᴄᴏᴍɪɴɢ...* 💣`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // No user input, just send the audio directly
        const downloadUrl = preloadedAudio?.result?.download?.url;
        if (!downloadUrl) return await reply("❌ No download link found!");

        // Mafia style download processing
        const msg = await conn.sendMessage(from, { text: "💀 *ᴘʀᴏᴄᴇssɪɴɢ...* 🔥" }, { quoted: mek });
        const type = {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        };

        await conn.sendMessage(from, type, { quoted: mek });
        await conn.sendMessage(from, { text: '💣 *ᴅᴏᴡɴʟᴏᴀᴅ ᴄᴏᴍᴘʟᴇᴛᴇ!* ✅', edit: msg.key });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Something went wrong:* ${error.message || "Error!"}`);
    }
});