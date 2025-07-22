const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    desc: "Fetch detailed information about a movie.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        // Properly extract the movie name from arguments
        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        
        if (!movieName) {
            return reply("🔫 *Listen up, wise guy!* You gotta tell me which picture you're lookin' for.\n_Example: .movie The Godfather_");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.movie) {
            return reply("🚫 *ғᴜɢɢᴇᴅᴀʙᴏᴜᴛɪᴛ!* ᴄᴏᴜʟᴅɴ'ᴛ ғɪɴᴅ ᴛʜᴀᴛ ғʟɪᴄᴋ. ᴅᴏᴜʙʟᴇ-ᴄʜᴇᴄᴋ ᴛʜᴇ ɴᴀᴍᴇ ᴀɴᴅ ᴛʀʏ ᴀɢᴀɪɴ, ᴄᴀᴘɪᴄʜᴇ?");
        }

        const movie = response.data.movie;
        
        // Format the caption with a mafia style
        const dec = `
🎬 *${movie.title}* (${movie.year}) ${movie.rated || ''}

⭐ *ᴛʜᴇ sᴄᴏʀᴇ:* ${movie.imdbRating || 'N/A'} | 🍅 *ᴛʜᴇ ʀᴏᴛᴛᴇɴ ᴛᴏᴍᴀᴛᴏᴇs ʜɪᴛ:* ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'} | 💰 *The Take:* ${movie.boxoffice || 'N/A'}

📅 *ʀᴇʟᴇᴀsᴇᴅ ᴏɴ:* ${new Date(movie.released).toLocaleDateString()}
⏳ *ʀᴜɴɴɪɴɢ ᴛɪᴍᴇ:* ${movie.runtime}
🎭 *ᴛʜᴇ ɢɪɢ:* ${movie.genres}

📝 *ᴛʜᴇ ʟᴏᴡᴅᴏᴡɴ:* ${movie.plot}

🎥 *ᴛʜᴇ ʙᴏss ʙᴇʜɪɴᴅ ɪᴛ:* ${movie.director}
✍️ *ᴛʜᴇ ᴘᴇɴᴍᴀɴ:* ${movie.writer}
🌟 *ᴛʜᴇ ᴄʀᴇᴡ:* ${movie.actors}

🌍 *ʜᴏᴍᴇʟᴀɴᴅ:* ${movie.country}
🗣️ *ᴛʜᴇ ʟɪɴɢᴏ:* ${movie.languages}
🏆 *ᴛʜᴇ ʀɪᴄʜᴇs:* ${movie.awards || 'None to speak of'}

[sᴇᴇ ᴛʜᴇ ᴅᴏssɪᴇʀ ᴏɴ ɪᴍᴅʙ](${movie.imdbUrl})

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀᴄ ᴛᴇᴄʜ*`;

        // Send message with the requested format
        await conn.sendMessage(
            from,
            {
                image: { 
                    url: movie.poster && movie.poster !== 'N/A' ? movie.poster : 'https://files.catbox.moe/rful77.jpg'
                },
                caption: dec,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363400378648653@newsletter',
                        newsletterName: 'MAFIA-MD',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Movie command error:', e);
        reply(`❌ *Something went south, boss:* ${e.message}`);
    }
});
