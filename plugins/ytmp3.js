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
    desc: "Téléchargement rapide Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Veuillez fournir une URL ou un nom de chanson!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;
        let videoData;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ Aucune chanson trouvée!");
            videoData = searchResults.results[0];
            id = videoData.videoId;
        } else {
            const searchResults = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
            if (!searchResults?.results?.length) return await reply("❌ Impossible de récupérer la vidéo!");
            videoData = searchResults.results[0];
        }

        // Préchargement rapide du MP3
        const preloadedAudio = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);

        const { title, image } = videoData;

        // Simplification du message
        let info = `💀 *Mᴀꜰɪᴀ Sᴏɴɢ Dᴏᴡɴʟᴏᴀᴅᴇʀ* 💀\n\n` +
            `🎤 *Chanson:* ${title || "Inconnue"}\n` +
            `💣 *Téléchargement en cours...* 💣`;

        // Envoyer uniquement l'audio sans interaction supplémentaire
        const downloadUrl = preloadedAudio?.result?.download?.url;
        if (!downloadUrl) return await reply("❌ Lien de téléchargement introuvable!");

        await conn.sendMessage(from, { text: info }, { quoted: mek });

        // Envoi direct du fichier audio
        const msg = await conn.sendMessage(from, { text: "💀 *Traitement...* 🔥" }, { quoted: mek });
        const type = {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        };

        // Envoi de l'audio en moins de 20 secondes
        await conn.sendMessage(from, type, { quoted: mek });
        await conn.sendMessage(from, { text: '💣 *Téléchargement terminé!* ✅', edit: msg.key });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *Erreur:* ${error.message || "Erreur!"}`);
    }
});
