const { cmd, commands } = require('../command');
const { performance } = require('perf_hooks'); // Pour le calcul de la vitesse

cmd({
  pattern: "react",
  alias: ["react-every-message"],
  use: '.react',
  desc: "Réagit à chaque message sur la chaîne WhatsApp avec un emoji aléatoire",
  category: "settings",
  react: "💬",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    // Liste des emojis possibles
    const emojis = ["💬", "❤️", "🔥", "😎", "💥", "✨", "🌟", "🎉", "🙌", "👍"];
    
    // Fonction pour choisir un emoji aléatoire
    const getRandomEmoji = () => {
      const randomIndex = Math.floor(Math.random() * emojis.length);
      return emojis[randomIndex];
    };

    // ID de la chaîne WhatsApp
    const channelId = '120363400378648653@newsletter'; // ID spécifique de la chaîne

    // Fonction pour réagir à chaque message
    const reactToMessages = async (message) => {
      const reactEmoji = getRandomEmoji(); // Choisir un emoji au hasard
      try {
        // Réagir au message avec l'emoji choisi
        await conn.sendMessage(channelId, { react: { text: reactEmoji, key: message.key } });
      } catch (err) {
        console.error(err);
      }
    };

    // Détection de chaque message et envoi d'une réaction
    conn.on('message-new', (message) => {
      if (message.key.remoteJid === channelId) {
        reactToMessages(message);
      }
    });

    reply(`✅ Réaction automatique activée sur la chaîne WhatsApp: ${channelId}`);
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
