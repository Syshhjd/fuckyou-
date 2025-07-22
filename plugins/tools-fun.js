const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random laugh from the boss.", // Mafia-style description
  react: "😂", // Keeping this emoji, it works
  category: 'fun',
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    const joke = response.data;

    if (!joke || !joke.setup || !joke.punchline) {
      return reply("❌ *Fuggedaboutit!* Couldn't get a good laugh for ya. The comedian's on a break. Try again."); // Mafia-style failure
    }

    const jokeMessage = `😂 *Here's a little something to lighten the mood, boss!* 😂\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia Emperor branding

    return reply(jokeMessage);
  } catch (error) {
    console.error("❌ Error in joke command:", error);
    return reply("⚠️ *Something went sideways!* Couldn't deliver the punchline. Try again later."); // Mafia-style error
  }
});

// flirt

cmd({
    pattern: "flirt",
    alias: ["masom", "line"],
    desc: "Lay down some smooth lines for the target.", // Mafia-style description
    react: "💘", // Keeping this, it's universal enough
    category: 'fun',
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Define API key and URL
        const shizokeys = 'shizo';
        const apiUrl = `https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`;

        // Fetch data from the API
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`*My contacts are failing me!* API error: ${await res.text()}`); // Mafia-style error
        }

        const json = await res.json();
        if (!json.result) {
            throw new Error("*Bad intel!* Got a funny response from the operation."); // Mafia-style error
        }

        // Extract and send the flirt message
        const flirtMessage = `😏 *Here's a line to charm the mark:*\n\n"${json.result}"\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style intro & branding
        await conn.sendMessage(from, {
            text: flirtMessage,
            mentions: [m.sender],
        }, { quoted: m });

    } catch (error) {
        console.error("Error in flirt command:", error);
        reply("❌ *Fuggedaboutit!* Couldn't come up with a good line. Try again later."); // Mafia-style error
    }
});

//truth

cmd({
    pattern: "truth",
    alias: ["truthquestion"],
    desc: "Get a secret to confess, a truth to uncover.", // Mafia-style description
    react: "🤫", // Changed emoji to 'shushing' for secrets
    category: 'fun',
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apik