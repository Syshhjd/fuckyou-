const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "kicks"],
    desc: "Retire un membre du groupe via tag, numéro ou réponse à un message",
    category: 'group',
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, isOwner, reply, quoted, senderNumber
}) => {
    if (!isGroup) return reply("❌ Cette commande ne s'utilise que dans les groupes.");
    if (!isOwner) return reply("❌ Seul le propriétaire du bot peut utiliser cette commande.");
    if (!isBotAdmins) return reply("❌ Je dois être admin pour utiliser cette commande.");

    let number;

    // Si reply à un message
    if (m.quoted) {
        number = m.quoted.sender?.split("@")[0];
    }
    // Si mention/tag
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        number = m.mentionedJid[0].split("@")[0];
    }
    // Si numéro directement dans le message
    else if (q && q.match(/\d{5,}/)) {
        number = q.match(/\d{5,}/)[0];
    }
    else {
        return reply("❌ Merci de tag, donner le numéro ou répondre à un message pour retirer quelqu'un.");
    }

    // Empêcher auto-kick & kick du bot
    if (number === senderNumber) return reply("❌ Tu ne peux pas te retirer toi-même.");
    if (number === conn.user?.id?.split('@')[0]) return reply("❌ Je ne peux pas me retirer moi-même !");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        reply(`✅ Utilisateur @${number} retiré avec succès.`, { mentions: [jid] });
    } catch (error) {
        console.error("Erreur lors du kick :", error);
        reply("❌ Impossible de retirer cet utilisateur (peut-être admin ou erreur de droits).");
    }
});