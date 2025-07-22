module.exports = {
  name: "channelreact",
  alias: ["reactchannel", "chanreact"],
  category: "utility",
  description: "Réagit aux messages de la chaîne WhatsApp et envoie un lien d'invitation",
  usage: "",

  async run({ m, sock, args, isOwner }) {
    const emojis = ["😂", "🔥", "🫶", "❤️", "🥲", "😏"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const targetChannel = "120363400378648653@newsletter";
    const inviteLink = "https://whatsapp.com/channel/0029Vb6J7O684Om8DdNfvL2N";

    // Réaction manuelle (commande)
    try {
      await sock.sendMessage(targetChannel, {
        react: {
          text: randomEmoji,
          key: m.key
        }
      });
      await m.reply("✅ Emoji réagi sur la chaîne !");
    } catch (err) {
      await m.reply("❌ Erreur lors de la réaction : " + err.message);
    }

    // Envoi du lien de la chaîne
    try {
      await sock.sendMessage(m.chat, {
        text: `🔥 Voici le lien de la chaîne officielle : ${inviteLink}`
      });
    } catch (err) {
      console.log("Erreur d'envoi du lien :", err);
    }
  }
};
