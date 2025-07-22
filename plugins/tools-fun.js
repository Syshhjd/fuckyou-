const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

cmd({
  pattern: "joke",
  desc: "😂 Get a random laugh from the boss.", // Mafia-style description
  react: "😂", // Keeping this emoji, it works
  category: "utility",
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
    category: "utility",
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
    category: "utility",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);

        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`*My contacts are failing me!* API request failed with status ${res.status}`); // Mafia-style error
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("*Bad intel!* Invalid API response: No 'result' field found."); // Mafia-style error
        }

        const truthText = `🤫 *Time to spill the beans, wise guy:*\n\n"${json.result}"\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style intro & branding
        await conn.sendMessage(from, {
            text: truthText,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error("Error in truth command:", error);
        reply("❌ *Fuggedaboutit!* Couldn't get a straight answer. Try again later."); // Mafia-style error
    }
});

// dare

cmd({
    pattern: "dare",
    alias: ["truthordare"],
    desc: "Receive a challenge from the family.", // Mafia-style description
    react: "👊", // Changed emoji to 'fist punch' for challenge
    category: "utility",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        // API Key
        const shizokeys = 'shizo';

        // Fetch dare text from the API
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);

        if (!res.ok) {
            console.error(`API request failed with status ${res.status}`);
            throw new Error(`*My contacts are failing me!* API request failed with status ${res.status}`); // Mafia-style error
        }

        const json = await res.json();

        if (!json.result) {
            console.error("Invalid API response: No 'result' field found.");
            throw new Error("*Bad intel!* Invalid API response: No 'result' field found."); // Mafia-style error
        }

        // Format the dare message
        const dareText = `👊 *You got a dare, tough guy:*\n\n"${json.result}"\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style intro & branding

        // Send the dare to the chat
        await conn.sendMessage(from, {
            text: dareText,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error("Error in dare command:", error);
        reply("❌ *Fuggedaboutit!* Couldn't get a proper dare. Try again later."); // Mafia-style error
    }
});

cmd({
  pattern: "fact",
  desc: "🧠 Get some solid intel, a random fact.", // Mafia-style description
  react: "🧠", // Keeping this, it's universal enough
  category: "utility",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/random.json?language=en");
    const fact = response.data.text;

    if (!fact) {
      return reply("❌ *Fuggedaboutit!* Couldn't dig up a solid fact. The files are empty. Try again."); // Mafia-style failure
    }

    const factMessage = `🧠 *Here's a piece of intel for ya:*\n\n"${fact}"\n\nIsn't that interesting? 😄\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style intro & branding

    return reply(factMessage);
  } catch (error) {
    console.error("❌ Error in fact command:", error);
    return reply("⚠️ *Something went sideways!* Couldn't fetch the intel. Try again later."); // Mafia-style error
  }
});

cmd({
    pattern: "pickupline",
    alias: ["pickup"],
    desc: "Get a strategic pick-up line for your operations.", // Mafia-style description
    react: "😏", // Changed emoji to 'smirking face'
    category: "utility",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch pickup line from the API
        const res = await fetch('https://api.popcat.xyz/pickuplines');

        if (!res.ok) {
            throw new Error(`*My contacts are failing me!* API request failed with status ${res.status}`); // Mafia-style error
        }

        const json = await res.json();

        // Log the API response (for debugging purposes)
        console.log('JSON response:', json);

        // Format the pickup line message
        const pickupLine = `😏 *Here's a line to sweet-talk your mark:*\n\n"${json.pickupline}"\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style intro & branding

        // Send the pickup line to the chat
        await conn.sendMessage(from, { text: pickupLine }, { quoted: m });

    } catch (error) {
        console.error("Error in pickupline command:", error);
        reply("❌ *Fuggedaboutit!* Couldn't come up with a strategic line. Try again later."); // Mafia-style error
    }
});

// char

cmd({
    pattern: "character",
    alias: ["char"],
    desc: "Check the character of a member of the family.", // Mafia-style description
    react: "🤵", // Changed emoji to 'man in tuxedo'
    category: "utility",
    filename: __filename,
},
async (conn, mek, m, { from, isGroup, text, reply }) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) {
            return reply("🚫 *This ain't for solo operations, wise guy!* This command can only be used in groups."); // Mafia-style group check
        }

        // Extract the mentioned user
        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("🔫 *Who are you talking about?* You gotta mention a member whose character you want me to gauge."); // Mafia-style mention prompt
        }

        // Define character traits
        const userChar = [
            "A True Sigma (Boss-in-training)", // Mafia-style traits
            "Generous (Always pays his dues)",
            "Grumpy (Tough exterior, but family)",
            "Overconfident (Thinks he runs the show)",
            "Obedient (Follows orders, no questions asked)",
            "Good (For a civilian)",
            "Simp (Needs to toughen up)",
            "Kind (Might get whacked for it)",
            "Patient (Waits for the right moment)",
            "Pervert (Keep an eye on him)",
            "Cool (Smooth operator)",
            "Helpful (When it benefits the family)",
            "Brilliant (A sharp mind for the books)",
            "Sexy (Distracts the competition)",
            "Hot (Got a temper)",
            "Gorgeous (Makes a good impression)",
            "Cute (But don't tell him I said that)",
            "A Wise Guy (Knows the ropes)",
            "A Made Man (Reliable)",
            "A Rat (Watch your back)",
            "Honorable (Rare, but respected)",
            "Ruthless (Gets the job done)"
        ];

        // Randomly select a character trait
        const userCharacterSelection =
            userChar[Math.floor(Math.random() * userChar.length)];

        // Message to send
        const message = `🤵 *The dossier on @${mentionedUser.split("@")[0]}:*\n\nTheir character is *${userCharacterSelection}* 🔥⚡\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style message & branding

        // Send the message with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
        }, { quoted: m });

    } catch (e) {
        console.error("Error in character command:", e);
        reply("❌ *Something went south!* Couldn't assess the character. Try again later."); // Mafia-style error
    }
});

cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Send a message repeatedly, no questions asked.", // Mafia-style description
  category: "utility",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) {
      return reply("🔫 *Listen up!* You gotta tell me how many times and what to say.\n*Example:* .repeat 10,This is a message, capiche?"); // Mafia-style prompt
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 300) {
      return reply("🚫 *Fuggedaboutit!* Give me a number between 1 and 300. Don't waste my time."); // Mafia-style count error
    }

    if (!message) {
      return reply("❌ *What's the message, wise guy?* You gotta tell me what to repeat."); // Mafia-style message error
    }

    const repeatedMessage = Array(count).fill(message).join("\n");

    reply(`🔄 *Orders received! Repeating ${count} times:*\n\n${repeatedMessage}\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`); // Mafia-style intro & branding
  } catch (error) {
    console.error("❌ Error in repeat command:", error);
    reply("❌ *Something went south!* Couldn't carry out the repeated order. Try again."); // Mafia-style error
  }
});

cmd({
  pattern: "send",
  desc: "Deliver a message multiple times, one by one, for the boss only.", // Mafia-style description
  category: "utility",
  filename: __filename
}, async (conn, m, store, { args, reply, senderNumber }) => {
  try {
    const botOwner = conn.user.id.split(":")[0]; // Get bot owner's number

    if (senderNumber !== botOwner) {
      return reply("🚫 *Hold on a minute!* This operation is for the boss only. You ain't cleared for this."); // Mafia-style owner check
    }

    if (!args[0]) {
      return reply("🔫 *Boss, give the orders!* Tell me how many times and what message to send.\n *Example:* .send 10,Consider this done"); // Mafia-style prompt
    }

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (isNaN(count) || count <= 0 || count > 100) {
      return reply("🚫 *Boss, a number between 1 and 100, please.* Don't make me ask twice."); // Mafia-style count error
    }

    if (!message) {
      return reply("❌ *What's the message, boss?* You gotta give me something to send."); // Mafia-style message error
    }

    reply(`⏳ *Executing orders:* Sending "${message}" ${count} times. This might take a moment, boss...`); // Mafia-style confirmation

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(m.from, { text: message }, { quoted: m });
      await sleep(1000); // 1-second delay
    }

    reply(`✅ *Orders completed!* Message sent ${count} times, boss.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`); // Mafia-style success & branding
  } catch (error) {
    console.error("❌ Error in send command:", error);
    reply("❌ *Fuggedaboutit!* Something went wrong with the delivery. Try again later, boss.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*"); // Mafia-style error & branding
  }
});

cmd({
  pattern: "readmore",
  alias: ["rm", "rmore", "readm"],
  desc: "Create a disguised message for intel drops.", // Mafia-style description
  category: "utility", // Changed category to 'covert'
  use: ".readmore <text>",
  react: "📝", // Keeping this emoji
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    // Vérifie si du texte est fourni
    if (!args.length) return reply("❌ *You gotta give me the message, wise guy!* What's the intel you want to hide?\n\n_Use: .readmore Your top-secret information_"); // Mafia-style prompt

    const inputText = args.join(" ");
    const readMore = String.fromCharCode(8206).repeat(4001); // Unicode invisible "gap"

    const finalMessage = `📝 *Here's your hidden message:*\n\n${inputText}${readMore}*...Continue Reading the Dossier...* 🕵️‍♂️\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*`; // Mafia-style format & branding

    await conn.sendMessage(m.from, { text: finalMessage }, { quoted: m });
  } catch (error) {
    console.error("❌ Error in .readmore command:", error);
    reply("❌ *Something went south!* Couldn't set up that hidden message. Try again later.\n\n> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀғɪᴀ ᴇᴍᴘᴇʀᴏʀ*"); // Mafia-style error & branding
  }
});
