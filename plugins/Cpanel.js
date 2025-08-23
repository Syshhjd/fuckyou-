const axios = require("axios");
const { cmd } = require('../command');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // Application API Key
const API_CLIENT = 'ptlc_mBlly3rDuPUHBCnonb32anVNRXTa3UhFP0E7R30FM5U'; // Client API Key

// ---- CMD ----
cmd({
  pattern: "createpanel",
  desc: "Create a Pterodactyl server (requires at least 3 args)",
  category: "panel",
  react: "🛠️",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Usage:\n.createpanel <name> <memory> <disk> <cpu> [eggId] [nestId]");

    const args = q.split(" ");
    if (args.length < 3) {
      return reply("⚠️ You must provide at least 3 arguments:\n.createpanel <name> <memory> <disk> <cpu>");
    }

    // Required args
    const name = args[0];
    const memory = parseInt(args[1]);
    const disk = parseInt(args[2]);
    const cpu = args[3] ? parseInt(args[3]) : 100; // default 100%
    
    // Optional args
    const eggId = args[4] ? parseInt(args[4]) : 5;   // default egg
    const nestId = args[5] ? parseInt(args[5]) : 1;  // default nest
    const dockerImage = "ghcr.io/parkervcp/yolks:nodejs_18"; // default image

    // Build server payload
    const data = {
      name,
      user: 1, // default admin user
      egg: eggId,
      nest: nestId,
      docker_image: dockerImage,
      startup: "npm start",
      limits: {
        memory,
        disk,
        cpu,
        swap: 0,
        io: 500
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1
      },
      environment: {
        NODE_ENV: "production"
      }
    };

    // API Request
    const res = await axios.post(`${PANEL_URL}/api/application/servers`, {
      name: data.name,
      user: data.user,
      egg: data.egg,
      docker_image: data.docker_image,
      startup: data.startup,
      limits: data.limits,
      feature_limits: data.feature_limits,
      environment: data.environment
    }, {
      headers: {
        Authorization: `Bearer ${API_APPLICATION}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const server = res.data.attributes;

    reply(`✅ Server Created!\n\n📌 Name: ${server.name}\n🖥️ ID: ${server.id}\n💾 Memory: ${memory}MB\n📀 Disk: ${disk}MB\n⚙️ CPU: ${cpu}%\n🥚 Egg: ${eggId}\n🗂 Nest: ${nestId}`);

  } catch (err) {
    console.error(err?.response?.data || err);
    reply("❌ Error while creating the server: " + (err?.response?.data?.errors?.[0]?.detail || err.message));
  }
});
