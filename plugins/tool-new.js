const { sleep } = require('../lib/functions');
const {cmd , commands} = require('../command')

cmd({
    pattern: "rcolor",
    desc: "Generate a random color with name and code.",
    category: 'ai',
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const colorNames = [
            "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
            "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
        ];
        
        const randomColorHex = "#" + Math.floor(Math.random()*16777215).toString(16);
        const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

        reply(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
    } catch (e) {
        console.error("Error in .randomcolor command:", e);
        reply("❌ An error occurred while generating the random color.");
    }
});

cmd({
    pattern: "binary",
    desc: "Convert text into binary format.",
    category: 'ai',
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the text to convert to binary.");

        const textToConvert = args.join(" ");
        const binaryText = textToConvert.split('').map(char => {
            return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
        }).join(' ');

        reply(`🔑 *Binary Representation:* \n${binaryText}`);
    } catch (e) {
        console.error("Error in .binary command:", e);
        reply("❌ An error occurred while converting to binary.");
    }
});

cmd({
    pattern: "dbinary",
    desc: "Decode binary string into text.",
    category: 'ai',
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the binary string to decode.");

        const binaryString = args.join(" ");
        const textDecoded = binaryString.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');

        reply(`🔓 *Decoded Text:* \n${textDecoded}`);
    } catch (e) {
        console.error("Error in .binarydecode command:", e);
        reply("❌ An error occurred while decoding the binary string.");
    }
});


cmd({
    pattern: "base64",
    desc: "Encode text into Base64 format.",
    category: 'ai',
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provided some text
        if (!args.length) return reply("❌ Please provide the text to encode into Base64.");

        const textToEncode = args.join(" ");
        
        // Encode the text into Base64
        const encodedText = Buffer.from(textToEncode).toString('base64');
        
        // Send the encoded Base64 text
        reply(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
    } catch (e) {
        console.error("Error in .base64 command:", e);
    