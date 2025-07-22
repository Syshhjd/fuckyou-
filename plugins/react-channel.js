module.exports = {
  name: "react-channel",
  type: "event",
  description: "Auto-react + Channel invite",

  async onLoad(bot) {
    // 🔔 Envoi dans tous les groupes une seule fois au démarrage
    try {
      const groups = await bot.groupFetchAllParticipating();
      const inviteLink = "https://whatsapp.com/channel/0029Vb6J7O684Om8DdNfvL2N";
      for (const jid in groups) {
        await bot.sendMessage(jid, {
          text: `🔥 Rejoins notre chaîne WhatsApp officielle : ${inviteLink}`
        });
      }
      console.log("📣 Invitations envoyées à tous les groupes.");
    } catch (e) {
      console.error("Erreur en envoyant le lien de la chaîne:", e);
    }

    // 🔁 Réaction automatique aux messages de chaîne
    bot.ev.on("messages.upsert", async (msgEvent) => {
      const msg = msgEvent.messages[0];
      if (!msg || !msg.key || !msg.key.remoteJid) return;

      if (msg.key.remoteJid === "120363400378648653@newsletter") {
        try {
          const emojis = ["😂", "🔥", "🫶", "❤️", "🥲", "😏"];
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

          await bot.sendMessage(msg.key.remoteJid, {
            react: {
              text: randomEmoji,
              key: msg.key,
            },
          });
        } catch (err) {
          console.error("Erreur de réaction:", err);
        }
      }
    });
  },
};
