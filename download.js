const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// MP4 video download

cmd({
    pattern: "mp4",
    alias: ["video", "ytmp4"],
    react: "🎥",
    desc: "Download YouTube video",
    category: "download",
    use: '.mp4 < Yt url or Name >',
    filename: __filename
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => {
    try {
        if (!q) {
            // Direct and firm request for input
            return await reply("🔫 *Listen up, wise guy!* You gotta tell me which video you're lookin' for. A YouTube URL or a name, capiche?");
        }

        const yt = await ytsearch(q);
        if (yt.results.length < 1) {
            // No results, clear and dismissive
            return reply("🚫 *Fuggedaboutit!* No videos found matching that. Try a different lead.");
        }

        let yts = yt.results[0];
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data.status !== 200 || !data.success || !data.result.download_url) {
            // Failure with a hint of suspicion
            return reply("🔫 *Something went south!* Couldn't get that video for ya. Looks like a botched job. Try again later.");
        }

        let ytmsg = `📹 *The Picture Show*
🎬 *The Feature:* ${yts.title}
⏳ *Running Time:* ${yts.timestamp}
👀 *Eyes On It:* ${yts.views}
👤 *Director's Cut By:* ${yts.author.name}
🔗 *The Hideout:* ${yts.url}

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`;

        // Send video directly with caption – direct action, no fuss
        await conn.sendMessage(
            from,
            {
                video: { url: data.result.download_url },
                caption: ytmsg,
                mimetype: "video/mp4"
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        // Firm error message, with a mob warning
        reply("❌ *Fuggedaboutit!* An unexpected problem popped up. Better try again, or you'll be sleeping with the fishes.");
    }
});

// MP3 song download

cmd({
    pattern: "song",
    alias: ["play", "mp3", "ytmp3"],
    react: "🎶",
    desc: "Download YouTube song",
    category: "download",
    use: '.song <query>',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, q }) => {
    try {
        if (!q) {
            // Direct demand for input
            return reply("🔫 *Hold on a minute, wise guy!* You gotta tell me which tune you're lookin' for.");
        }

        const yt = await ytsearch(q);
        if (!yt.results.length) {
            // Dismissive if no results
            return reply("🚫 *Fuggedaboutit!* No tracks found matching that. Try a different lead.");
        }

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;

        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) {
            // Failure with a direct, warning tone
            return reply("🔫 *Hold on a minute, wise guy!* Couldn't get my hands on that track. Looks like a botched job. Try again later, capiche?");
        }

        await conn.sendMessage(from, {
            audio: { url: data.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
                    body: "Join our Family Channel",
                    mediaType: 1,
                    thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
                    sourceUrl: 'https://whatsapp.com/channel/0029Vb6J7O684Om8DdNfvL2N',
                    mediaUrl: 'https://whatsapp.com/channel/0029Vb6J7O684Om8DdNfvL2N',
                    showAdAttribution: true,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        // Ultimate warning for a final error
        reply("❌ *Fuggedaboutit!* Something went south trying to get that music. Better try again, or you'll be sleeping with the fishes.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*");
    }
});
