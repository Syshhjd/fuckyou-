// plugins/panel.js
"use strict";

const axios = require("axios");
const { cmd } = require("../command");

// ================== CONFIG ==================
const PANEL_URL = "https://chat.vezxa.com";         // <-- your panel URL
const API_APPLICATION = "ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5";     // <-- your Application API key (admin)
const DEFAULT_NODE_ID = 1;                           // <-- your node id (e.g. NODE MARC)
const DEFAULT_NEST_ID = 5;                           // <-- your Nest id (e.g. NodeJS nest)
const DEFAULT_EGG_ID = 21;                           // <-- your Egg id (NodeJS 21 on your panel)
const DEFAULT_DOCKER_IMAGE = "ghcr.io/parkervcp/yolks:nodejs_21"; // image for NodeJS 21
const DEFAULT_STARTUP = "npm start";                 // startup command
// =============================================

const api = axios.create({
  baseURL: `${PANEL_URL}/api/application`,
  headers: {
    Authorization: `Bearer ${API_APPLICATION}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ----- helpers -----
const errMsg = (e) =>
  e?.response?.data?.errors?.[0]?.detail ||
  e?.response?.data?.errors?.[0]?.meta?.source ||
  e?.response?.data?.errors?.[0]?.code ||
  e?.message ||
  "Unknown error";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findFirstFreeAllocation(nodeId) {
  const { data } = await api.get(`/nodes/${nodeId}/allocations`);
  const list = data?.data || [];
  const free = list.find((a) => a?.attributes?.assigned === false);
  if (!free) return null;
  return {
    id: free.attributes.id,
    ip: free.attributes.ip,
    port: free.attributes.port,
  };
}

function buildNode21Environment() {
  // Fill required variables for your NodeJS 21 egg
  return {
    GIT_REPO_ADDRESS: "",
    INSTALL_BRANCH: "main",
    USER_UPLOADED_FILES: "1",
    AUTO_UPDATE: "0",
    ADDITIONAL_NODE_PACKAGES: "",
    GIT_USERNAME: "",
    GIT_ACCESS_TOKEN: "",
    UNINSTALL_NODE_PACKAGES: "",
    COMMAND_RUN: "npm start",
    ADDITIONAL_ARGUMENTS: "",
  };
}

function randomSuffix(n = 4) {
  const s = Math.random().toString(36).slice(2, 2 + n);
  return s || Date.now().toString().slice(-n);
}

// ============== listnodes =================
cmd({
  pattern: "listnodes",
  desc: "List all nodes (id, name)",
  category: "panel",
  react: "🧭",
  filename: __filename
}, async (_conn, _mek, _m, { reply }) => {
  try {
    const { data } = await api.get(`/nodes`);
    const nodes = data?.data || [];
    if (!nodes.length) return reply("No nodes found.");
    let out = "🧭 Nodes:\n\n";
    for (const n of nodes) {
      const a = n.attributes;
      out += `• ID: ${a.id} | ${a.name}\n`;
    }
    reply(out);
  } catch (e) {
    reply("❌ " + errMsg(e));
  }
});

// ============== listalloc =================
cmd({
  pattern: "listalloc",
  desc: "List allocations for a node: .listalloc <nodeId>",
  category: "panel",
  react: "📡",
  filename: __filename
}, async (_conn, _mek, _m, { q, reply }) => {
  try {
    if (!q) return reply("Usage: .listalloc <nodeId>");
    const nodeId = q.trim();
    const { data } = await api.get(`/nodes/${nodeId}/allocations`);
    const allocs = data?.data || [];
    if (!allocs.length) return reply("No allocations on this node.");
    let out = `📡 Allocations (node ${nodeId}):\n\n`;
    for (const a of allocs) {
      const at = a.attributes;
      out += `ID: ${at.id} | ${at.ip}:${at.port} | ${at.assigned ? "busy" : "free"}\n`;
    }
    reply(out);
  } catch (e) {
    reply("❌ " + errMsg(e));
  }
});

// ============== listeggs ==================
cmd({
  pattern: "listeggs",
  desc: "List eggs for a nest: .listeggs <nestId>",
  category: "panel",
  react: "🥚",
  filename: __filename
}, async (_conn, _mek, _m, { q, reply }) => {
  try {
    if (!q) return reply("Usage: .listeggs <nestId>");
    const nestId = q.trim();
    const { data } = await api.get(`/nests/${nestId}/eggs`);
    const eggs = data?.data || [];
    if (!eggs.length) return reply("No eggs in this nest.");
    let out = `🥚 Eggs (nest ${nestId}):\n\n`;
    for (const e of eggs) {
      const a = e.attributes;
      out += `ID: ${a.id} | ${a.name}\n`;
    }
    reply(out);
  } catch (e) {
    reply("❌ " + errMsg(e));
  }
});

// ============= createpanel =================
cmd({
  pattern: "createpanel",
  desc: "Create unlimited panel: .createpanel <name> <password>",
  category: "panel",
  react: "🛠️",
  filename: __filename
}, async (_conn, _mek, _m, { q, reply }) => {
  try {
    if (!q) return reply("Usage:\n.createpanel <name> <password>");
    const [rawName, rawPass] = q.split(" ").filter(Boolean);
    if (!rawName || !rawPass) return reply("Usage:\n.createpanel <name> <password>");

    // --- ensure unique username/email (avoid 422 conflicts)
    let username = String(rawName).trim();
    const password = String(rawPass).trim();
    const email = `${username}${Date.now()}@vezxa.com`;

    // 1) Create user
    let userRes;
    try {
      userRes = await api.post(`/users`, {
        username,
        email,
        first_name: username,
        last_name: "User",
        password
      });
    } catch (e) {
      // if username already taken, append random suffix then retry once
      if (e?.response?.status === 422) {
        username = `${username}_${randomSuffix()}`;
        userRes = await api.post(`/users`, {
          username,
          email,
          first_name: username,
          last_name: "User",
          password
        });
      } else {
        throw e;
      }
    }
    const user = userRes.data?.attributes;

    // 2) Pick a free allocation on DEFAULT_NODE_ID
    let alloc = await findFirstFreeAllocation(DEFAULT_NODE_ID);
    // small retry if panel is slow to refresh assignment flags
    if (!alloc) {
      await sleep(600);
      alloc = await findFirstFreeAllocation(DEFAULT_NODE_ID);
    }
    if (!alloc) {
      return reply("❌ No free allocation on this node. Add more ports in Admin → Nodes → Allocations.");
    }

    // 3) Create server
    const serverPayload = {
      name: `${username}-server`,
      user: user.id,
      egg: DEFAULT_EGG_ID,
      docker_image: DEFAULT_DOCKER_IMAGE,
      startup: DEFAULT_STARTUP,
      environment: buildNode21Environment(),
      limits: {
        memory: 0, // unlimited
        swap: 0,
        disk: 0,   // unlimited
        io: 500,
        cpu: 0,    // unlimited
      },
      feature_limits: {
        databases: 1,
        allocations: 1,
        backups: 1,
      },
      allocation: {
        default: alloc.id,
      },
      // Optional flags you may want:
      // oom_disabled: true,
      // skip_scripts: false,
    };

    const serverRes = await api.post(`/servers`, serverPayload);
    const server = serverRes.data?.attributes;

    reply(
      [
        "✅ Panel created!",
        `🔗 Panel: ${PANEL_URL}`,
        `👤 User: ${username}`,
        `📧 Email: ${email}`,
        `🔑 Password: ${password}`,
        `🖥️ Server: ${server?.name} (ID ${server?.id})`,
        `🌐 Allocation: ${alloc.ip}:${alloc.port} (id ${alloc.id})`,
        `🥚 Egg: ${DEFAULT_EGG_ID} | Nest: ${DEFAULT_NEST_ID}`,
        `🐳 Image: ${DEFAULT_DOCKER_IMAGE}`,
        `▶️ Startup: ${DEFAULT_STARTUP}`,
      ].join("\n")
    );

  } catch (e) {
    console.error(e?.response?.data || e);
    return reply("❌ Error: " + errMsg(e));
  }
});
