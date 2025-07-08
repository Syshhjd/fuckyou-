const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Infos du repaire (GitHub)",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/MRC-Tech999/MAFIA-MD';

    try {
        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Le lien vers le repaire est foireux, capo...");

        const [, username, repoName] = match;

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: {
                'User-Agent': 'MAFIA-MD'
            }
        });

        if (response.status === 503) {
            return reply("❌ GitHub est dans les vapes... Attends un peu, soldat.");
        }

        if (!response.ok) {
            return reply(`❌ T’as été bloqué à la porte du repaire. Code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `
╔══════════════╗
║ 🕴️ 𝗟𝗘 𝗥𝗘𝗣𝗔𝗜𝗥𝗘 𝗗𝗘 𝗟𝗔 𝗠𝗔𝗙𝗜𝗔 🕴️
╠══════════════════════════════
║ 🏷️ Nom : ${repoData.name}
║ 🔫 Parrain : ${repoData.owner.login}
║ ⭐ Influence : ${repoData.stargazers_count} étoiles
║ 🍴 Clones : ${repoData.forks_count}
║ 🔗 Repaire : ${repoData.html_url}
║ 📜 Code secret : ${repoData.description || 'Aucun message...'}
╚══════════════════════════════╝
🔒 *Protégé par le cercle de l’Empereur Sukuna*
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
        console.error("Erreur dans la commande 'repo' :", error);
        reply("❌ Une ombre s’est glissée dans la mission. Impossible d’atteindre le repaire.");
    }
});
