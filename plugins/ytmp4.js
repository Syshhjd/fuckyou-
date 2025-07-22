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
    pattern: "ytv",
    alias: ["mp4", "video"],
    react: "🎬",
    desc: "Download Ytmp4",
    category: 'media',
    use: ".video <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇʀʏ ᴏʀ ʏᴏᴜᴛᴜʙᴇ ᴜʀʟ!");

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

        // Preload the MP4 without waiting for user choice
        const preloadedVideo = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
        
        // Log the response from ytmp4 API for debugging
        console.log("Preloaded Video Response:", preloadedVideo);

        const { url, title, image, timestamp, ago, views, author } = videoData;

        // Mafia style message
        let info = `🎥 *𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁* 🎥\n\n` +
            `🎬 *ᴛɪᴛʟᴇ:* ${title || "Unknown"}\n` +
            `⏱ *ᴅᴜʀᴀᴛɪᴏɴ:* ${timestamp || "Unknown"}\n` +
            `👁 *ᴠɪᴇᴡs:* ${views || "Unknown"}\n` +
            `📅 *ʀᴇʟᴇᴀsᴇ ᴀɢᴏ:* ${ago || "Unknown"}\n` +
            `👤 *ᴀᴜᴛʜᴏʀ:* ${author?.name || "Unknown"}\n` +
            `🔗 *ᴜʀʟ:* ${url || "Unknown"}\n\n` +
            `🎞 *ᴘʀᴏᴄᴇssɪɴɢ ᴠɪᴅᴇᴏ...* 🎞`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎥', key: sentMsg.key } });

        // Directly process and send the video without any user choice
        const downloadUrl = preloadedVideo?.result?.download?.url;
        
        // Log the download URL to check if it's being retrieved correctly
        console.log("Download URL:", downloadUrl);
        
        if (!downloadUrl) {
            // Provide more detailed error feedback
            return await reply("❌ No download link found! The video might not be downloadable at the moment.");
        }

        // Mafia style download processing message
        const msg = await conn.sendMessage(from, { text: "💀 *ᴘʀᴏᴄᴇssɪɴ