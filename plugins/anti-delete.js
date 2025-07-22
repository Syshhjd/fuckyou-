const config = require("../config");
const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'antid'],
    desc: "Configure le système AntiDelete",
    category: 'moderation',
    filename: __filename
},
async (conn, mek, m, { reply, q, isOwner }) => {
    if (!isOwner) {
      return await client.sendMessage(from, {
        text: "*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ.*"
      }, { quoted: message });
    }
    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴀᴄᴛɪᴠé ᴘᴏᴜʀ ʟᴇs groupes et messages privés._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_AntiDelete désactivé pour les groupes._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_AntiDelete désactivé pour les messages privés._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_AntiDelete groupe maintenant ${!gcStatus ? 'activé' : 'désactivé'}._`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_AntiDelete DM maintenant ${!dmStatus ? 'activé' : 'désactivé'}._`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete activé pour tous les chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`_Statut AntiDelete_\n\n*DM:* ${currentDmStatus ? 'Activé' : 'Désactivé'}\n*Groupes:* ${currentGcStatus ? 'Activé' : 'Désactivé'}`);

            default:
                return reply(`-- *ɢᴜɪᴅ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ* --
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏɴ\`\` – ᴀᴄᴛɪᴠᴇ ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ɢʟᴏʙᴀʟᴇᴍᴇɴᴛ
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏғғ ɢᴄ\`\` – Desactivate for group
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ ᴏғғ ᴅᴍ\`\` – Desactivat for DM
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ sᴇᴛ ɢᴄ\`\` – ᴀᴄᴛɪᴠᴀᴛᴇ/ᴅᴇsᴀᴄᴛɪᴠᴀᴛᴇ ғᴏʀ ɢʀᴏᴜᴘs
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ sᴇᴛ ᴅᴍ\`\` – ᴀᴄᴛɪᴠᴀᴛᴇ/ᴅᴇsᴀᴄᴛɪᴠᴀᴛᴇ ғᴏʀ ᴅᴍ
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ sᴇᴛ ᴀʟʟ\`\` – ᴀᴄᴛɪᴠᴀᴛᴇ ғᴏʀ ᴀʟʟ ᴄʜᴀᴛs
• \`\`.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ sᴛᴀᴛᴜs\`\` – ᴠᴇʀɪғɪᴇᴅ ᴛʜᴇ sᴛᴀᴛᴜs`);
        }
    } catch (e) {
        console.error("Erreur antidelete:", e);
        return reply("Une erreur est survenue.");
    }
});