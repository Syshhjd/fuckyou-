const axios = require("axios");
const { cmd } = require('../command');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // Application API Key
const API_CLIENT = 'ptlc_mBlly3rDuPUHBCnonb32anVNRXTa3UhFP0E7R30FM5U'; // Client API Key

// ---- CMD ----
cmd({
  pattern: "createpanel",
  desc: "Create a Pterodactyl server with just name & password",
  category: "panel",
  react: "🛠️",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Usage:\n.createpanel <name> <password>");

    const args = q.split(" ");
    if (args.length < 2) {
      return reply("⚠️ You must provide 2 arguments:\n.createpanel <name> <password>");
    }

    // === Inputs ===
    const name = args[0];
    const password = args[1];

    // === Defaults ===
    const memory = 0; // 1GB
    const disk = 0;   // 2GB
    const cpu = 100;     // 100%
    const eggId = 5;     // default egg
    const nestId = 1;    // default nest
    const dockerImage = "ghcr.io/parkervcp/yolks:nodejs_18";

    // === Server Payload ===
    const data = {
      name,
      user: 1, // admin user ID
      egg: eggId,
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

    // === Create server ===
    const res = await axios.post(`${PANEL_URL}/api/application/servers`, data, {
      headers: {
        Authorization: `Bearer ${API_APPLICATION}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const server = res.data.attributes;

    // === Create Client User ===
    const userRes = await axios.post(`${PANEL_URL}/api/application/users`, {
      username: name,
      email: `${name}@vezxa.com`,
      first_name: name,
      last_name: "User",
      password: password
    }, {
      headers: {
        Authorization: `Bearer ${API_APPLICATION}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const user = userRes.data.attributes;

    reply(
      `✅ Panel Created!\n\n` +
      `🔸 Panel: ${PANEL_URL}\n` +
      `👤 User: ${user.username}\n` +
      `📧 Email: ${user.email}\n` +
      `🔑 Password: ${password}\n` +
      `🖥️ Server: ${server.name}\n` +
      `ID: ${server.id}`
    );

  } catch (err) {
    console.error(err?.response?.data || err);
    reply("❌ Error: " + (err?.response?.data?.errors?.[0]?.detail || err.message));
  }
});
