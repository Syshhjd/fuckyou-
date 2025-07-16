const { cmd } = require("../command");

cmd({
  pattern: "vv3",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // Vérifie si l'utilisateur est bien le créateur
    if (!isCreator) {
      return; // Si l'utilisateur n'est pas le créateur, on ne fait rien
    }

    // Vérifie si le message est une citation
    if (!match.quoted) {
      return; // Si aucun message cité, on ne fait rien
    }

    const quotedMessage = match.quoted;

    // Vérifie que le message cité contient bien un média (image, vidéo, audio)
    if (!quotedMessage || !quotedMessage.mtype) {
      return; // Si le type du message cité n'est pas valide, on ne fait rien
    }

    // Télécharge le contenu du message cité
    const buffer = await quotedMessage.download();
    const mtype = quotedMessage.mtype; // Type de message (image, vidéo, audio)

    // Préparation du contenu en fonction du type de message
    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: quotedMessage.text || '', // Texte associé à l'image
          mimetype: quotedMessage.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: quotedMessage.text || '', // Texte associé à la vidéo
          mimetype: quotedMessage.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quotedMessage.ptt || false // Vérifie si c'est un message audio vocal (ptt)
        };
        break;
      default:
        return; // Si le type de message n'est pas supporté, on ne fait rien
    }

    // Envoi du contenu du message cité à l'utilisateur sans message supplémentaire
    await client.sendMessage(message.sender, messageContent);
  } catch (error) {
    console.error("vv2 Error:", error);
    // Si une erreur survient, on log l'erreur mais ne renvoie pas de message
  }
});
