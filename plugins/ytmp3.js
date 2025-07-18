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
    desc: "Fast Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a song name or YouTube URL!");

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

        // Quick MP3 Preload
        const preloadedAudio = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);

        const { url, title, image, timestamp, ago, views, author } = videoData;

        // Mafia style message
        let info = `💀 *Mᴀꜰɪᴀ Sᴏɴɢ Dᴏᴡɴʟᴏᴀᴅᴇʀ* 💀\n\n` +
            `🎤 *Song:* ${title || "Unknown"}\n` +
            `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `👀 *Views:* ${views || "Unknown"}\n` +
            `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `👤 *By:* ${author?.name || "Unknown"}\n` +
            `🖇 *Url:* ${url || "Unknown"}\n\n` +
            `💣 *Download incoming...* 💣`;

        // Send minimal info with the image
        await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });

        // Quick audio download link
        const downloadUrl = preloadedAudio?.result?.download?.url;
        if (!downloadUrl) return await reply("❌ Download link not found!");

        // Immediately send the audio without additional interaction
        await conn.sendMessage(from, { text: "💀 *Processing...* 🔥" }, { quoted: mek });
        const type = {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        };

        // Send audio directly, aiming for under 10 seconds
        await conn.sendMessage(from, type, { quoted: mek });
        await conn.sendMessage(from, { text: '💣 *Download complete!* ✅' });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
