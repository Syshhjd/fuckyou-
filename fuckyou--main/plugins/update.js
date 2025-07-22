const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("This command is only for the bot owner.");

    try {
        await reply("🔍 𝐂𝐇𝐄𝐂𝐊𝐈𝐍𝐆 𝐅𝐎𝐑 𝐌𝐀𝐅𝐈𝐀-𝐌𝐃 𝐔𝐏𝐃𝐀𝐓𝐄𝐒...");

        // Fetch the latest commit hash from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/MRC-Tech999/MAFIA-MD/commits/main");
        const latestCommitHash = commitData.sha;

        // Get the stored commit hash from the database
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("*✅ 𝐘𝐎𝐔𝐑 𝐌𝐀𝐅𝐈𝐀-𝐌𝐃 𝐈𝐒 𝐀𝐋𝐑𝐄𝐀𝐃𝐘 𝐔𝐏-𝐓𝐎-𝐃𝐀𝐓𝐄!*");
        }

        await reply("> 𝐌𝐀𝐅𝐈𝐀 𝐌𝐃 𝐔𝐏𝐃𝐀𝐓𝐈𝐍𝐆 𝐖𝐀𝐈𝐓 𝐏𝐋𝐒 👨‍💻...");

        // Download the latest code
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/MRC-Tech999/MAFIA-MD/archive/main.zip", { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP file
        await reply("📦 ᴇxᴛʀᴀᴄᴛɪɴɢ ᴛʜᴇ ʟᴀᴛᴇsᴛ ᴄᴏᴅᴇ...");
        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copy updated files, preserving config.js and app.json
        await reply("🔄 ʀᴇᴘʟᴀᴄɪɴɢ ғɪʟᴇs...");
        const sourcePath = path.join(extractPath, "MAFIA-MD-main");
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Save the latest commit hash to the database
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("𝐔𝐏𝐃𝐀𝐓𝐄 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐄! 𝐑𝐄𝐒𝐓𝐀𝐑𝐓𝐈𝐍𝐆 𝐓𝐇𝐄 𝐁𝐎𝐓...");
        process.exit(0);
    } catch (error) {
        console.error("Update error:", error);
        return reply("❌ UPDATE FAILED. PLEASE TRY MANUALLY.");
    }
});

// Helper function to copy directories while preserving config.js and app.json
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip config.js and app.json
        if (item === "config.js" || item === "app.json" || item === "package.json" || item === "index.js") {
            console.log(`Skipping ${item} to preserve custom settings.`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
