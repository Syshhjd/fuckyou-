const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "ssweb",
  alias: ["ss", "captura", "screenshot"],
  use: '.ssweb <url>',
  desc: "Prendre une capture d'écran d'une page web",
  category: 'tools',
  react: "📸",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply(`❌ Veuillez fournir une URL.\n\n📌 Utilisation : *.ssweb <url>*\n\n**Exemples :**\n• .ssweb google.com\n• .ssweb https://github.com\n• .ss youtube.com`);
    
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    reply('📸 Capture d\'écran en cours... Veuillez patienter...');
    
    // Vérifier et formater l'URL
    let url = /https?:\/\//.test(q) ? q : 'https://' + q;
    
    try {
      // Première API - Screenshot API
      let res = await fetch(`https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1024x768&format=png`);
      
      if (res.ok) {
        let buffer = await res.buffer();
        
        const caption = `*╭─『 WEB SCREENSHOT 』*
*│* 🌐 **URL** : ${url}
*│* 📱 **Résolution** : 1024x768
*│* 📅 **Date** : ${new Date().toLocaleDateString('fr-FR')}
*│* 👤 **Demandé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*`;
        
        await conn.sendMessage(from, {
          image: buffer,
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
        throw new Error('Première API échouée');
      }
      
    } catch (apiError) {
      console.log('Première API échouée, tentative avec API de secours...');
      
      try {
        // API de secours
        let res2 = await fetch(`https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(url)}&format=png&width=1024&height=768`);
        
        if (res2.ok) {
          let buffer2 = await res2.buffer();
          
          await conn.sendMessage(from, {
            image: buffer2,
            caption: `✅ Capture d'écran de : ${url}`,
            contextInfo: {
              mentionedJid: [m.sender]
            }
          }, { quoted: mek });
          
        } else {
          throw new Error('API de secours également échouée');
        }
        
      } catch (fallbackError) {
        try {
          // Troisième tentative avec une API différente
          let res3 = await fetch(`https://image.thum.io/get/width/1024/crop/768/${encodeURIComponent(url)}`);
          
          if (res3.ok) {
            let buffer3 = await res3.buffer();
            
            await conn.sendMessage(from, {
              image: buffer3,
              caption: `✅ Capture d'écran de : ${url}`,
            }, { quoted: mek });
            
          } else {
            throw new Error('Toutes les APIs ont échoué');
          }
          
        } catch (finalError) {
          return reply(`❌ Impossible de prendre une capture d'écran de cette page.\n\n💡 **Raisons possibles :**\n• URL invalide ou inaccessible\n• Site protégé contre les captures\n• Service temporairement indisponible\n\n🔄 Réessayez avec une autre URL`);
        }
      }
    }
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    
  } catch (e) {
    console.error('Erreur dans ssweb:', e);
    reply(`❌ Erreur: ${e.message}\n\n💡 **Conseils :**\n• Vérifiez que l'URL est correcte\n• Ajoutez http:// ou https:// si nécessaire\n• Réessayez avec une autre URL`);
  }
});

// Version complète (pleine page)
cmd({
  pattern: "sswebf",
  alias: ["ssf", "fullscreen"],
  use: '.sswebf <url>',
  desc: "Prendre une capture d'écran complète d'une page web",
  category: 'tools',
  react: "🖼️",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply(`❌ Veuillez fournir une URL.\n\n📌 Utilisation : *.sswebf <url>*\n\n**Exemples :**\n• .sswebf google.com\n• .sswebf https://github.com`);
    
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    reply('🖼️ Capture d\'écran complète en cours... Cela peut prendre quelques secondes...');
    
    // Vérifier et formater l'URL
    let url = /https?:\/\//.test(q) ? q : 'https://' + q;
    
    try {
      // API pour capture complète
      let res = await fetch(`https://api.screenshotmachine.com/?key=demo&url=${encodeURIComponent(url)}&dimension=1920x1080&format=png&full_page=1`);
      
      if (res.ok) {
        let buffer = await res.buffer();
        
        const caption = `*╭─『 FULL WEB SCREENSHOT 』*
*│* 🌐 **URL** : ${url}
*│* 📱 **Type** : Page complète
*│* 📅 **Date** : ${new Date().toLocaleDateString('fr-FR')}
*│* 👤 **Demandé par** : @${m.sender.split('@')[0]}
*╰────────────────⟢*`;
        
        await conn.sendMessage(from, {
          image: buffer,
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
        throw new Error('API échouée');
      }
      
    } catch (apiError) {
      try {
        // API de secours pour pleine page
        let res2 = await fetch(`https://htmlcsstoimage.com/demo_run?url=${encodeURIComponent(url)}&selector=body&ms_delay=1000&viewport_width=1920&viewport_height=1080`);
        
        if (res2.ok) {
          let buffer2 = await res2.buffer();
          
          await conn.sendMessage(from, {
            image: buffer2,
            caption: `✅ Capture complète de : ${url}`,
          }, { quoted: mek });
          
        } else {
          throw new Error('Toutes les APIs ont échoué');
        }
        
      } catch (fallbackError) {
        return reply(`❌ Impossible de prendre une capture complète de cette page.\n\n💡 Utilisez *.ssweb ${q}* pour une capture standard`);
      }
    }
    
    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    
  } catch (e) {
    console.error('Erreur dans sswebf:', e);
    reply(`❌ Erreur: ${e.message}`);
  }
});
