const { cmd, commands } = require('../command');
const config = require('../config');  // Si tu utilises une configuration globale
const { performance } = require('perf_hooks');

cmd({
  pattern: "share",
  alias: ["setting"],
  use: '.share',
  desc: "Share a new message from the creator to all users",
  category: "admin",
  react: "📣",
  filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
  try {
    // Message du créateur que tu veux partager
    const creatorMessage = "new message from the creator: ..."; // Personnalise ici le message
    const creatorPhoneNumber = "+1234567890"; // Remplace avec ton numéro WhatsApp

    // Création du message à envoyer
    const shareMessage = `
      📣 *NEW MESSAGE FROM THE CREATOR* 📣

      👤 *Message from ${pushname}*:

      *"${creatorMessage}"*

      📞 Contact the creator directly: wa.me/${creatorPhoneNumber}
    `;

    // Envoi du message à tous les utilisateurs (cela peut être modifié en fonction de la gestion des contacts)
    const allContacts = await conn.getAllContacts(); // Si tu as accès à la liste des contacts

    // Envoi du message à tous les contacts
    for (const contact of allContacts) {
      try {
        await conn.sendMessage(contact.id, { text: shareMessage });
      } catch (err) {
        console.error(`Error sending message to ${contact.id}:`, err);
      }
    }

    reply(`✅ Message partagé avec tous les utilisateurs !`);

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
