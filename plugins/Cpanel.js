const axios = require("axios");
const { cmd } = require('../command');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // Application API Key

// === DEFAULT SERVER SETTINGS ===
const DEFAULT_NEST = 5;           
const DEFAULT_EGG = 15;           
const DEFAULT_IMAGE = "ghcr.io/parkervcp/yolks:nodejs_18";
const DEFAULT_STARTUP = "npm start";
const DEFAULT_ALLOCATION = 42; // 👈 mets ici ton allocation_id exact (trouvé avec .listalloc)


// === CMD: Lister Allocations ===
cmd({
  pattern: "listalloc",
  desc: "Liste toutes les allocations d’un node",
  category: "panel",
  react: "📡",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("❌ Usage:\n.listalloc <nodeId>");

    const res = await axios.get(`${PANEL_URL}/api/application/nodes/${q}/allocations`, {
      headers: {
        Authorization: `Bearer ${API_APPLICATION}`,
        Accept: 'application/json'
      }
    });

    const allocs = res.data.data;
    if (!allocs.length) return reply("⚠️ Aucune allocation trouvée pour ce node.");

    let msg = "📡 **Allocations disponibles**\n\n";
    allocs.forEach(a => {
      msg += `🆔 ID: ${a.attributes.id}\n🌐 ${a.attributes.ip}:${a.attributes.port}\n\n`;
    });

    reply(msg);
  } catch (err) {
    console.error(err?.response?.data || err);
    reply("❌ Error: " + (err?.response?.data?.errors?.[0]?.detail || err.message));
  }
});


// === CMD: Créer Panel (User + Server) ===
cmd({
  pattern: "createpanel",
  desc: "Crée un panel illimité avec juste nom + password",
  category: "panel",
  react: "🛠️",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("❌ Usage:\n.createpanel <name> <password>");

    const args = q.split(" ");
    if (args.length < 2) {
      return reply("⚠️ Tu dois donner 2 arguments:\n.createpanel <name> <password>");
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
      user: user.id,                
      nest: DEFAULT_NEST,
      egg: DEFAULT_EGG,
      docker_image: DEFAULT_IMAGE,
      startup: DEFAULT_STARTUP,
      limits: {
        memory: 0,  // illimité
        disk: 0,    // illimité
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
      },
      allocation: {
        default: DEFAULT_ALLOCATION  // 👈 important
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
      `✅ Panel Créé avec succès!\n\n` +
      `🔸 Panel: ${PANEL_URL}\n` +
      `👤 User: ${user.username}\n` +
      `📧 Email: ${user.email}\n` +
      `🔑 Password: ${password}\n` +
      `🖥️ Server: ${server.name}\n` +
      `🌐 Allocation: ${DEFAULT_ALLOCATION}\n`
    );

  } catch (err) {
    console.error(err?.response?.data || err);
    reply("❌ Error: " + (err?.response?.data?.errors?.[0]?.detail || err.message));
  }
});
