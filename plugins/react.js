const { cmd, commands } = require('../command');
const { performance } = require('perf_hooks'); // Pour le calcul de la vitesse

cmd({
  pattern: "react",
  alias: ["react-every-message"],
  use: '.react',
  desc: "Répond à chaque message sur la chaîne WhatsApp avec plusieurs emojis aléatoires",
  category: "settings",
  react: "💬",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    // Liste des emojis possibles
    const emojis = ["👍", "❤️", "🔥", "💥", "✨", "💪", "🌟", "🎉", "😎", "🧠"];
    
    // Fonction pour choisir plusieurs emojis au hasard
    const getRandomEmojis = () => {
      const randomIndex1 = Math.floor(Math.random() * emojis.length);
      const randomIndex2 = Math.floor(Math.random() * emojis.length);
      const randomIndex3 = Math.floor(Math.random() * emojis.length);
      return `${emojis[randomIndex1]} ${emojis[randomIndex2]} ${emojis[randomIndex3]}`;
    };

    // ID de la chaîne WhatsApp
    const channelId = '120363400378648653@newsletter'; // ID spécifique de la chaîne

    // Fonction pour répondre à chaque message avec plusieurs emojis
    const autoReplyWithEmojis = async (message) => {
      const emojiReply = getRandomEmojis(); // Choisir plusieurs emojis au hasard
      try {
        // Répondre au message avec les emojis choisis
        await conn.sendMessage(channelId, { text: emojiReply, quoted: message });
      } catch (err) {
        console.error(err);
      }
    };

    // Détection de chaque message et réponse avec des emojis
    conn.on('message-new', (message) => {
      if (message.key.remoteJid === channelId) {
        autoReplyWithEmojis(message);
      }
    });

    reply(`✅ Réponse automatique activée sur la chaîne WhatsApp: ${channelId}`);
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
