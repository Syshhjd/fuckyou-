const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

// Commande de recherche XNXX
cmd({
  pattern: "xnxx",
  alias: ["xnxxsearch"],
  use: '.xnxx <recherche>',
  desc: "Rechercher du contenu XNXX",
  category: 'nsfw',
  react: "🔞",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply(`❌ Veuillez fournir un terme de recherche.\n\n📌 Utilisation : *.xnxx <recherche>*`);
    
    // Vérification NSFW (vous pouvez ajuster selon votre système)
    // if (!chat.nsfw) return reply(`🚫 Ce groupe ne supporte pas le contenu NSFW.`);
    
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    
    let res = await fetch(`https://api.example.com/xnxxsearch?q=${encodeURIComponent(q)}`);
    let json = await res.json();
    
    if (!json.result || json.result.length === 0) {
      return reply('❌ Aucun résultat trouvé pour votre recherche.');
    }
    
    let text = `*╭─『 XNXX SEARCH RESULTS 』*\n`;
    text += `*│* 🔍 Recherche : *${q}*\n`;
    text += `*│* 📊 Résultats : ${json.result.length}\n`;
    text += `*╰────────────────⟢*\n\n`;
    
    json.result.slice(0, 10).forEach((v, index) => {
      text += `*${index + 1}.* ${v.title}\n`;
      text += `🔗 Lien : ${v.link}\n`;
      text += `⏱️ Durée : ${v.duration || 'N/A'}\n`;
      text += `📌 Pour télécharger : *.xnxxdl ${v.link}*\n\n`;
    });
    
    await conn.sendMessage(from, {
      text: text,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400378648653@newsletter',
          newsletterName: '𝐌𝐀𝐅𝐈𝐀-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    
  } catch (e) {
    console.error(e);
    reply(`❌ Erreur: ${e.message}`);
  }
});

// Commande de téléchargement XNXX
cmd({
  pattern: "xnxxdl",
  alias: ["xnxxdownload"],
  use: '.xnxxdl <lien>',
  desc: "Télécharger une vidéo XNXX",
  category: 'nsfw',
  react: "📥",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply(`❌ Veuillez fournir un lien XNXX valide.\n\n📌 Utilisation : *.xnxxdl <lien>*`);
    
    if (!q.includes('xnxx.com')) {
      return reply('❌ Veuillez fournir un lien XNXX valide');
    }
    
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    
    let res = await fetch(`https://api.example.com/xnxxdl?url=${encodeURIComponent(q)}`);
    let json = await res.json();
    
    if (!json.result || !json.result.files) {
      return reply('❌ Impossible de télécharger cette vidéo');
    }
    
    const caption = `*╭─『 XNXX DOWNLOADER 』*
*│* 📌 **Titre** : ${json.result.title}
*│* ⏱️ **Durée** : ${json.result.duration}
*│* 🎞️ **Qualité** : ${json.result.quality}
*│* 📥 **Téléchargé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*`;
    
    await conn.sendMessage(from, {
      video: { url: json.result.files.high || json.result.files.low },
      caption: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400378648653@newsletter',
          newsletterName: '𝐌𝐀𝐅𝐈𝐀-𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    
  } catch (e) {
    console.error(e);
    reply(`❌ Erreur: Lien invalide ou vidéo indisponible`);
  }
});
