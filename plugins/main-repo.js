const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Info about the repository (GitHub)",
    react: "📂",
    category: 'admin',
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/MRC-Tech999/MAFIA-MD';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ The link to the repository is broken, capo...");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: {
                'User-Agent': 'MAFIA-MD'
            }
        });

        if (response.status === 503) {
            return reply("❌ GitHub is down... Wait a bit, soldier.");
        }

        if (!response.ok) {
            return reply(`❌ You’ve been blocked from the repository. Code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `
╔══════════════╗
║ 🕴️ 𝗧𝗛𝗘 𝗠𝗔𝗙𝗜𝗔 𝗥𝗘𝗣𝗢 🕴️
╠═══════════════════════════
║ 🏷️ ɴᴀᴍᴇ: ${repoData.name}
║ 🔫 ɢᴏᴅғᴀᴛʜᴇʀ: ${repoData.owner.login}
║ ⭐ ɪɴғʟᴜᴇɴᴄᴇ: ${repoData.stargazers_count} stars
║ 🍴 ғᴏʀᴋs: ${repoData.forks_count}
║ 🔗 ʀᴇᴘᴏsɪᴛᴏʀʏ: ${repoData.html_url}
╚══════════════════════════════╝
🔒 *ᴘʀᴏᴛᴇᴄᴛᴇᴅ ʙʏ ᴛʜᴇ ᴄɪʀᴄʟᴇ ᴏғ ᴍᴀʀᴄ ᴛᴇᴄʜ*
`;

        await conn.sendMessage(from, {
            image: { url: repoData.owner.avatar_url },
            caption: message.trim(),
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400378648653@newsletter',
                    newsletterName: 'MAFIA-MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in the 'repo' command:", error);
        reply("❌ A shadow slipped into the mission. Unable to reach the repository.");
    }
});