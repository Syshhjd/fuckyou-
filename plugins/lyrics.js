const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "lyrics",
  alias: ["letra", "letras", "paroles"],
  use: '.lyrics <nom de la chanson>',
  desc: "Obtenir les paroles d'une chanson",
  category: 'tools',
  react: "🎵",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    let teks = q ? q : m.quoted && m.quoted.text ? m.quoted.text : '';
    
    if (!teks) return reply(`❌ Veuillez entrer le nom d'une chanson.\n\n📌 Utilisation : *.lyrics <nom de la chanson>*\n\n**Exemples :**\n• .lyrics Bohemian Rhapsody\n• .lyrics Shape of You\n• .letras Despacito`);
    
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    reply('🎵 Recherche des paroles en cours...');
    
    try {
      // Première API - Some Random API
      let res = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(teks)}`);
      
      if (res.ok) {
        let json = await res.json();
        
        if (json.title && json.lyrics) {
          const caption = `*╭─『 SONG LYRICS 』*
*│* 🎵 **Titre** : ${json.title}
*│* 👤 **Artiste** : ${json.author}
*│* 📅 **Recherché le** : ${new Date().toLocaleDateString('fr-FR')}
*│* 👤 **Demandé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*

${json.lyrics}

*🎼 Paroles trouvées via Genius*`;
          
          // Envoyer avec image si disponible
          if (json.thumbnail && json.thumbnail.genius) {
            await conn.sendMessage(from, {
              image: { url: json.thumbnail.genius },
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
          } else {
            // Envoyer sans image
            await conn.sendMessage(from, {
              text: caption,
              contextInfo: {
                mentionedJid: [m.sender]
              }
            }, { quoted: mek });
          }
          
        } else {
          throw new Error('Paroles non trouvées dans la réponse');
        }
        
      } else {
        throw new Error('Première API échouée');
      }
      
    } catch (apiError) {
      console.log('Première API échouée, tentative avec API de secours...');
      
      try {
        // API de secours - Lyrics.ovh
        let res2 = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(teks.split(' ')[0])}/${encodeURIComponent(teks)}`);
        
        if (res2.ok) {
          let json2 = await res2.json();
          
          if (json2.lyrics) {
            const caption = `*╭─『 SONG LYRICS 』*
*│* 🎵 **Recherche** : ${teks}
*│* 📅 **Date** : ${new Date().toLocaleDateString('fr-FR')}
*│* 👤 **Demandé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*

${json2.lyrics}

*🎼 Paroles trouvées via Lyrics.ovh*`;
            
            await conn.sendMessage(from, {
              text: caption,
              contextInfo: {
                mentionedJid: [m.sender]
              }
            }, { quoted: mek });
            
          } else {
            throw new Error('Paroles non trouvées');
          }
          
        } else {
          throw new Error('API de secours échouée');
        }
        
      } catch (fallbackError) {
        try {
          // Troisième tentative avec une API différente
          let res3 = await fetch(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(teks)}`);
          
          if (res3.ok) {
            let json3 = await res3.json();
            
            if (json3.lyrics) {
              const caption = `*╭─『 SONG LYRICS 』*
*│* 🎵 **Titre** : ${json3.title || teks}
*│* 👤 **Artiste** : ${json3.artist || 'Inconnu'}
*│* 📅 **Date** : ${new Date().toLocaleDateString('fr-FR')}
*│* 👤 **Demandé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*

${json3.lyrics}`;
              
              await conn.sendMessage(from, {
                text: caption,
                contextInfo: {
                  mentionedJid: [m.sender]
                }
              }, { quoted: mek });
              
            } else {
              throw new Error('Aucune parole trouvée');
            }
            
          } else {
            throw new Error('Toutes les APIs ont échoué');
          }
          
        } catch (finalError) {
          return reply(`❌ Impossible de trouver les paroles pour "${teks}".\n\n💡 **Conseils :**\n• Vérifiez l'orthographe du titre\n• Essayez avec "Artiste - Titre"\n• Utilisez le titre exact de la chanson\n• Réessayez plus tard\n\n🎵 **Exemple :** .lyrics Eminem Lose Yourself`);
        }
      }
    }
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    
  } catch (e) {
    console.error('Erreur dans lyrics:', e);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    reply(`❌ Erreur: ${e.message}\n\n💡 **Réessayez avec :**\n• Un titre plus précis\n• Format "Artiste - Titre"\n• Vérifier l'orthographe`);
  }
});
