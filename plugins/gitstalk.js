const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: 'web',
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɢɪᴛʜᴜʙ ᴜsᴇʀɴᴀᴍᴇ.");
        }
        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        let userInfo = `👤 *ᴜsᴇʀɴᴀᴍᴇ*: ${data.name || data.login}
🔗 *ɢɪᴛʜᴜʙ ᴜʀʟ*:(${data.html_url})
📝 *ʙɪᴏ*: ${data.bio || 'Not available'}
🏙️ *ʟᴏᴄᴀᴛɪᴏɴ*: ${data.location || 'Unknown'}
📊 *ᴘᴜʙʟɪᴄ ʀᴇᴘᴏs*: ${data.public_repos}
👥 *ғᴏʟʟᴏᴡᴇʀs*: ${data.followers} | Following: ${data.following}
📅 *ᴄʀᴇᴀᴛᴇᴅ ᴀᴛ*: ${new Date(data.created_at).toDateString()}
🔭 *ᴘᴜʙʟɪᴄ ɢɪsᴛs*: ${data.public_gists}
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀʀᴄ ᴛᴇᴄʜ*`;
          const sentMsg = await conn.sendMessage(from,{image:{url: data.avatar_url },caption: userInfo },{quoted:mek })
    } catch (e) {
        console.log(e);
        reply(`error: ${e.response ? e.response.data.message : e.message}`);
    }
});