const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "aivoice",
    alias: ["vai", "voicex", "voiceai"],
    desc: "Text to speech with different AI voices",
    category: 'ai',
    react: "🪃",
    filename: __filename
},
async (conn, mek, m, { 
    from, 
    quoted, 
    body, 
    isCmd, 
    command, 
    args, 
    q, 
    isGroup, 
    sender, 
    senderNumber, 
    botNumber2, 
    botNumber, 
    pushname, 
    isMe, 
    isOwner, 
    groupMetadata, 
    groupName, 
    participants, 
    groupAdmins, 
    isBotAdmins, 
    isAdmins, 
    reply 
}) => {
    try {
        // Check if args[0] exists (user provided text)
        if (!args[0]) {
            return reply("ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴛᴇxᴛ ᴀғᴛᴇʀ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ.\nExample: .ᴀɪᴠᴏɪᴄᴇ ʜᴇʟʟᴏ");
        }

        // Get the full input text
        const inputText = args.join(' ');

        // Send initial reaction
        await conn.sendMessage(from, {  
            react: { text: '⏳', key: m.key }  
        });

        // Voice model menu
        const voiceModels = [
            { number: "1", name: "Hatsune Miku", model: "miku" },
            { number: "2", name: "Nahida (Exclusive)", model: "nahida" },
            { number: "3", name: "Nami", model: "nami" },
            { number: "4", name: "Ana (Female)", model: "ana" },
            { number: "5", name: "Optimus Prime", model: "optimus_prime" },
            { number: "6", name: "Goku", model: "goku" },
            { number: "7", name: "Taylor Swift", model: "taylor_swift" },
            { number: "8", name: "Elon Musk", model: "elon_musk" },
            { number: "9", name: "Mickey Mouse", model: "mickey_mouse" },
            { number: "10", name: "Kendrick Lamar", model: "kendrick_lamar" },
            { number: "11", name: "Angela Adkinsh", model: "angela_adkinsh" },
            { number: "12", name: "Eminem", model: "eminem" }
        ];

        // Create menu text
        let menuText = "╭━━━〔 *𝐀𝐈 𝐕𝐎𝐈𝐂𝐄 𝐌𝐎𝐃𝐄𝐋𝐒* 〕━━━⊷\n";
        voiceModels.forEach(model => {
            menuText += `┃▸ ${model.number}. ${model.name}\n`;
        });
        menuText += "╰━━━⪼\n\n";
        menuText += `📌 *ʀᴇᴘʟʏ ᴡɪᴛʜ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ sᴇʟᴇᴄᴛ ᴠᴏɪᴄᴇ ᴍᴏᴅᴇʟ ғᴏʀ:*\n"${inputText}"`;

        // Send menu message with image
        const sentMsg = await conn.sendMessage(from, {  
            image: { url: "https://files.catbox.moe/85c6a7.jpg" },
            caption: menuText
        }, { quoted: m });

        const messageID = sentMsg.key.id;
        let handlerActive = true;

        // Set timeout to remove handler after 2 minutes
        const handlerTimeout = setTimeout(() => {
            handlerActive = false;
            conn.ev.off("messages.upsert", messageHandler);
            reply("⌛ Voice selection timed out. Please try the command again.");
        }, 120000);

        // Message handler function
        const messageHandler = async (msgData) => {  
            if (!handlerActive) return;
            
      