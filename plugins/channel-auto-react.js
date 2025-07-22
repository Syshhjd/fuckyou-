const { cmd } = require('../command');

cmd({
    name: "channel-auto-react",
    category: "utility",
    type: "event",
    filename: __filename,
    description: "Réagit automatiquement à chaque message de ta chaîne WhatsApp"
}, async (conn, m) => {
    try {
        if (!m || !m.key || !m.key.remoteJid) return;

        const channelId = "120363400378648653@newsletter";

        if (m.key.remoteJid !== channelId) return;

        const emojis = ["😂", "🔥", "🫶", "❤️", "🥲", "😏"];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        const msgId = m.key.id;

        await conn.newsletterReactMessage(channelId, msgId, randomEmoji);

        console.log(`✅ Réaction ${randomEmoji} envoyée sur le message ${msgId}`);
    } catch (e) {
        console.error("❌ Erreur de réaction auto chaîne :", e);
    }
});
