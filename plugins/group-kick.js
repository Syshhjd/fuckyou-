const { cmd } = require('../command');

cmd({
    pattern: "remove",
    alias: ["kick", "kicks"],
    desc: "Removes a member from the group",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, isOwner, reply, quoted, senderNumber
}) => {
    // Doit être utilisé dans un groupe
    if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans les groupes.");

    // Seul le propriétaire du bot peut l'utiliser
    if (!isOwner) return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");

    // Le bot doit être admin
    if (!isBotAdmins) return reply("❌ Je dois être admin pour utiliser cette commande.");

    let number;
    if (m.quoted) {
        number = m.quoted.sender?.split("@")[0];
    } else if (q && q.match(/\d{5,}/)) {
        // Prend le premier numéro trouvé dans le texte
        number = q.match(/\d{5,}/)[0];
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        number = m.mentionedJid[0].split("@")[0];
    } else {
        return reply("❌ Merci de répondre à un message ou de mentionner l'utilisateur à retirer.");
    }

    // Empêcher le bot ou soi-même d'être kické
    if (number === senderNumber) return reply("❌ Tu ne peux pas te retirer toi-même.");
    if (number === conn.user?.id?.split('@')[0]) return reply("❌ Je ne peux pas me retirer moi-même !");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ Utilisateur @${number} retiré avec succès.`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur lors du kick :", error);
        if (error?.data?.status === 403) {
            reply("❌ Impossible de retirer cet utilisateur (peut-être admin ou erreur de droits).");
        } else {
            reply("❌ Échec du retrait de l'utilisateur.");
        }
    }
});
