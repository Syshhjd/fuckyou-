const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: 'media',
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");
        
        reply("ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ᴠɪᴅᴇᴏ, ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("Failed to fetch TikTok video.");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = `🎵 *ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ* 🎵\n\n` +
                        `👤 *ᴜsᴇʀ:* ${author.nickname} (@${author.username})\n` +
                        `📖 *ᴛɪᴛʟᴇ:* ${title}\n` +
                        `👍 *ʟɪᴋᴇs:* ${like}\n💬 *ᴄᴏᴍᴍᴇɴᴛs:* ${comment}\n🔁 *sʜᴀʀᴇs:* ${share}`;
        
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "tt2",
    alias: ["ttdl2", "ttv2", "tiktok2"],
    desc: "Download TikTok video without watermark",
    category: 'media',
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
    try {
        // Validate input
        const url = q || m.quoted?.text;
        if (!url || !url.includes("tiktok.com")) {
            return reply("❌ Please provide/reply to a TikTok link");
        }

        // Show processing reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Fetch video from BK9 API
        const { data } = await axios.get(`https://bk9.fun/download/tiktok2?url=${encodeURIComponent(url)}`);
        
        if (!data?.status || !data.BK9?.video?.noWatermark) {
            throw new Error("No video found in API response");
        }

        // Send video with minimal caption
        await conn.sendMessage(from, {
            video: { url: data.BK9.video.noWatermark },
            caption: `- *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀᴄ ᴛᴇᴄʜ 💜*`
        }, { quoted: mek });

        // Success reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error('TT2 Error:', error);
        reply("❌ Download failed. Invalid link or API error");
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
                
cmd({
  pattern: "tt3",
  al