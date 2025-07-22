//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
// Credits MarcTech

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id) || !Array.isArray(update.participants)) return;

        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const groupDesc = metadata.desc || "Confidential ☠️";
        const groupMembersCount = metadata.participants.length;
        const groupPP = await conn.profilePictureUrl(update.id, 'image').catch(() => fallbackPP);
        const timeZone = config.TIMEZONE || 'America/New_York';

        const action = update.action;
        const author = update.author;
        const participants = update.participants;

        // 🔒 Protection anti-promotion
        if (action === "promote" && config.ANTI_ADMIN_PROMOTE === "true") {
            const toDemote = [author, ...participants];

            await conn.groupParticipantsUpdate(update.id, toDemote, 'demote');
            await conn.sendMessage(update.id, {
                text: `🚨 Promotion non autorisée !\n🔻 @${author.split('@')[0]} et @${participants[0].split('@')[0]} ont été rétrogradés.`,
                mentions: toDemote,
            });
            return;
        }

        // 🔒 Protection anti-kick massif
        if (action === "remove" && config.ANTI_MASS_KICK === "true") {
            if (participants.length >= 2) {
                await conn.groupParticipantsUpdate(update.id, [author], 'demote');
                await conn.sendMessage(update.id, {
                    text: `⚠️ @${author.split('@')[0]} a été rétrogradé pour avoir expulsé plusieurs membres.`,
                    mentions: [author],
                });
                return;
            }
        }

        // 👉 Ensuite boucle normale pour messages de bienvenue, promotion, etc.
        for (const userJid of participants) {
            const userName = userJid.split('@')[0];
            const timestamp = moment().tz(timeZone).format('YYYY-MM-DD hh:mm A z');

            if (action === "add" && config.WELCOME === "true") {
                const welcomeText = `
╭─────[ 🎩 𝐍𝐄𝐖 𝐌𝐄𝐌𝐁𝐄𝐑 ]─────╮
│ 🕴️ @${userName} just joined the syndicate...
│ 🏛️ Welcome to *${groupName}*
│ 🔢 Member #${groupMembersCount}
│ 🕰️ Arrived at: *${timestamp}*
│ 📜 Code of Conduct:
│ ${groupDesc}
╰────[ ☠️ 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 ☠️ ]────╯`;

                await conn.sendMessage(update.id, {
                    image: { url: groupPP },
                    caption: welcomeText.trim(),
                    mentions: [userJid],
                    contextInfo: getContextInfo({ sender: userJid }),
                });
            }

            if (action === "remove" && config.WELCOME === "true") {
                const goodbyeText = `
╭────[ 🕳️ 𝐄𝐗𝐈𝐓 ]────╮
│ 😔 @${userName} has left the family...
│ 🕰️ Time of departure: *${timestamp}*
│ 👥 Family size: ${groupMembersCount} soldiers
╰────[ ⚰️ 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 ⚰️ ]────╯`;

                await conn.sendMessage(update.id, {
                    image: { url: groupPP },
                    caption: goodbyeText.trim(),
                    mentions: [userJid],
                    contextInfo: getContextInfo({ sender: userJid }),
                });
            }

            if (action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoteText = `
╭───[ ⛔ 𝐃𝐄𝐌𝐎𝐓𝐄𝐃 ]───╮
│ 🔻 Don @${author.split('@')[0]} has stripped @${userName} of power
│ 🕰️ At: *${timestamp}*
│ 🏛️ Family: *${groupName}*
╰────[ ⚠️ 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 ⚠️ ]────╯`;

                await conn.sendMessage(update.id, {
                    text: demoteText.trim(),
                    mentions: [author, userJid],
                    contextInfo: getContextInfo({ sender: author }),
                });
            }

            if (action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoteText = `
╭───[ 🎖️ 𝐏𝐑𝐎𝐌𝐎𝐓𝐄𝐃 ]───╮
│ 🔺 Don @${author.split('@')[0]} has honored @${userName}
│ 🕰️ Time: *${timestamp}*
│ 🏛️ Family: *${groupName}*
╰────[ 💼 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 💼 ]────╯`;

                await conn.sendMessage(update.id, {
                    text: promoteText.trim(),
                    mentions: [author, userJid],
                    contextInfo: getContextInfo({ sender: author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};
