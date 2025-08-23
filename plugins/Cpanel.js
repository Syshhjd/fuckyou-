const axios = require("axios");
const { cmd } = require('../command');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // Application API Key
const API_CLIENT = 'ptlc_mBlly3rDuPUHBCnonb32anVNRXTa3UhFP0E7R30FM5U'; // Client API Key

// === DEFAULT SERVER SETTINGS ===
const DEFAULT_NEST = 5;           // ton nest (ex: NodeJS nest)
const DEFAULT_EGG = 15;           // ton egg (ex: NodeJS 18)
const DEFAULT_IMAGE = "ghcr.io/parkervcp/yolks:nodejs_18";
const DEFAULT_STARTUP = "npm start";

cmd({
  pattern: "createpanel",
  desc: "Create unlimited Pterodactyl panels (name + password only)",
  category: "panel",
  react: "🛠️",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("❌ Usage:\n.createpanel <name> <password>");

    const args = q.split(" ");
    if (args.length < 2) {
      return reply("⚠️ You must provide 2 arguments:\n.createpanel <name> <password>");
    }

    // === Inputs ===
    const name = args[0];
    const password = args[1];

    // === Create User ===
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

    // === Create Server (linked to this user) ===
    const serverRes = await axios.post(`${PANEL_URL}/api/application/servers`, {
      name: `${name}-server`,
      user: user.id,                // 👈 serveur lié au nouvel user
      nest: DEFAULT_NEST,
      egg: DEFAULT_EGG,
      docker_image: DEFAULT_IMAGE,
      startup: DEFAULT_STARTUP,
      limits: {
        memory: 0,  // 1GB
        disk: 0,    // 2GB
        cpu: 0,
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
    }, {
      headers: {
        Authorization: `Bearer ${API_APPLICATION}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const server = serverRes.data.attributes;

    // === Reply ===
    reply(
      `✅ Panel Created!\n\n` +
      `🔸 Panel: ${PANEL_URL}\n` +
      `👤 User: ${user.username}\n` +
      `📧 Email: ${user.email}\n` +
      `🔑 Password: ${password}\n` +
      `🖥️ Server: ${server.name}\n` +
      `📀 Memory: 1024MB | Disk: 2048MB | CPU: 100%`
    );

  } catch (err) {
    console.error(err?.response?.data || err);
    reply("❌ Error: " + (err?.response?.data?.errors?.[0]?.detail || err.message));
  }
});
