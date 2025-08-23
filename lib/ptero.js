const axios = require('axios');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // admin
const API_CLIENT = 'ptlc_mBlly3rDuPUHBCnonb32anVNRXTa3UhFP0E7R30FM5U'; // clé API CLIENT du user qui possède les serveurs

// ---- APPLICATION SCOPE (admin) : créer users et serveurs ----
const axiosApp = axios.create({
  baseURL: `${PANEL_URL}/api/application`,
  headers: {
    Authorization: `Bearer ${API_APPLICATION}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- CLIENT SCOPE (user) : contrôle serveur ----
const axiosClient = axios.create({
  baseURL: `${PANEL_URL}/api/client`,
  headers: {
    Authorization: `Bearer ${API_CLIENT}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---- UTILS RANDOM ----
function randomString(len = 8) {
  return Math.random().toString(36).slice(-len);
}
function randomUsername() {
  return 'user' + Math.floor(Math.random() * 1000000);
}
function randomFirstName() {
  const names = ['Alex', 'Chris', 'Sam', 'Jordan', 'Pat', 'Taylor', 'Casey', 'Jamie', 'Morgan', 'Riley'];
  return names[Math.floor(Math.random() * names.length)];
}
function randomLastName() {
  const names = ['Smith', 'Lee', 'Brown', 'Taylor', 'Walker', 'Johnson', 'White', 'Martin', 'Moore', 'Clark'];
  return names[Math.floor(Math.random() * names.length)];
}

// ---- CREATION UTILISATEUR ----
async function createRandomUser() {
  try {
    const username = randomUsername();
    const email = `${username}@vezxa.com`;
    const password = randomString(10);
    const first_name = randomFirstName();
    const last_name = randomLastName();
    const language = 'en';

    const res = await axiosApp.post('/users', {
      username,
      email,
      first_name,
      last_name,
      password,
      language
    });
    const user = res.data.attributes;
    return { id: user.id, username, email, password, first_name, last_name };
  } catch (e) {
    throw new Error(
      e.response?.data?.errors?.[0]?.detail ||
      e.response?.data?.errors?.[0]?.meta?.error ||
      e.message ||
      'Erreur inconnue lors de la création du user'
    );
  }
}

// ---- CREATION SERVEUR AVEC ENVIRONMENT ----
const DEFAULT_NODE = 1;
const DEFAULT_ALLOCATION = 7; // Mets ici ton ID allocation node 1
const DEFAULT_NEST = 5;
const DEFAULT_EGG = 15;
const DEFAULT_IMAGE = "ghcr.io/pterodactyl/yolks:nodejs_18";
const DEFAULT_STARTUP = "npm start";

const DEFAULT_ENV = {
  GIT_ADDRESS: "",
  BRANCH: "main",
  USER_UPLOAD: "1",
  AUTO_UPDATE: "0",
  NODE_PACKAGES: "",
  USERNAME: "",
  ACCESS_TOKEN: "",
  UNNODE_PACKAGES: "",
  CMD_RUN: "npm start",
  NODE_ARGS: ""
};

async function createServerForUser(userId, serverName) {
  try {
    const res = await axiosApp.post('/servers', {
      name: serverName,
      user: userId,
      description: "Serveur créé automatiquement",
      egg: DEFAULT_EGG,
      nest: DEFAULT_NEST,
      docker_image: DEFAULT_IMAGE,
      startup: DEFAULT_STARTUP,
      limits: { memory: 0, swap: -1, disk: 0, io: 500, cpu: 0 },
      feature_limits: { databases: 0, allocations: 0, backups: 0 },
      allocation: { default: DEFAULT_ALLOCATION },
      environment: { ...DEFAULT_ENV }
    });
    return res.data.attributes;
  } catch (e) {
    throw new Error(
      e.response?.data?.errors?.[0]?.detail ||
      e.response?.data?.errors?.[0]?.meta?.error ||
      e.message ||
      'Erreur inconnue lors de la création du serveur'
    );
  }
}

// ---- FONCTIONS CLIENT : LISTE, STATUS, START/STOP/RESTART ----
async function listClientServers() {
  try {
    const res = await axiosClient.get('/servers');
    const list = res.data.data.map(s => {
      return `• *${s.attributes.name}* (ID: ${s.attributes.id})\n  - Identifier: ${s.attributes.identifier}`;
    });
    if (!list.length) return "Aucun serveur trouvé pour ce compte.";
    return "🖥️ *Liste de vos serveurs*\n\n" + list.join('\n\n');
  } catch (e) {
    return `❌ Erreur : ${e.message}`;
  }
}

async function getClientServerByName(name) {
  const res = await axiosClient.get('/servers');
  const servers = res.data.data;
  const found = servers.find(s => s.attributes.name.toLowerCase() === name.toLowerCase());
  if (!found) throw new Error("Aucun serveur trouvé avec ce nom.");
  return found.attributes;
}

async function powerClientServer(serverName, signal) {
  try {
    const server = await getClientServerByName(serverName);
    const url = `/servers/${server.identifier}/power`;
    await axiosClient.post(url, { signal });
    let txtSignal = "";
    if (signal === "start") txtSignal = "démarrage";
    else if (signal === "stop") txtSignal = "arrêt";
    else if (signal === "restart") txtSignal = "redémarrage";
    else txtSignal = `action ${signal}`;
    return `✅ Serveur *${server.name}* : ${txtSignal} demandé !`;
  } catch (e) {
    if (
      e.response?.data?.errors?.[0]?.detail &&
      e.response.data.errors[0].detail.includes("You are attempting to use an application API key")
    ) {
      return `❌ Erreur : Cette action nécessite une clé API client ("ptlc_..."). Vérifie ta configuration.`;
    }
    return `❌ Erreur action ${signal} : ${e.response?.data?.errors?.[0]?.detail || e.message}`;
  }
}

async function statusClientServer(serverName) {
  try {
    const server = await getClientServerByName(serverName);
    const url = `/servers/${server.identifier}/resources`;
    const res = await axiosClient.get(url);
    const status = res.data.attributes.current_state;
    return `🟢 Statut du serveur *${server.name}* : ${status}`;
  } catch (e) {
    if (
      e.response?.data?.errors?.[0]?.detail &&
      e.response.data.errors[0].detail.includes("You are attempting to use an application API key")
    ) {
      return `❌ Erreur : Cette action nécessite une clé API client ("ptlc_..."). Vérifie ta configuration.`;
    }
    return `❌ Erreur statut : ${e.response?.data?.errors?.[0]?.detail || e.message}`;
  }
}

// ---- COMMANDES POUR TON BOT ----

async function cmd_newserver(serverName = "") {
  let user, server;
  try {
    user = await createRandomUser();
  } catch (e) {
    return `❌ Création user échouée : ${e.message}`;
  }
  // Si aucun nom donné, on génère ! Sinon on prend le nom fourni
  const nameToUse = serverName && serverName.trim().length > 0 ? serverName.trim() : user.email;
  try {
    server = await createServerForUser(user.id, nameToUse);
  } catch (e) {
    return `❌ Création serveur échouée : ${e.message}`;
  }
  return (
    `✅ Serveur créé !\n` +
    `🔸Panel: ${PANEL_URL}\n` +
    `🔸Owner: ${user.username}\n` +
    `🔸Email: ${user.email}\n` +
    `🔸Prénom: ${user.first_name}\n` +
    `🔸Nom: ${user.last_name}\n` +
    `🔸Mot de passe: ${user.password}\n` +
    `🔸Server name: ${server.name}\n` +
    `ID: ${server.id}`
  );
}

async function cmd_listservers() {
  return await listClientServers();
}

async function cmd_restart(serverName) {
  return await powerClientServer(serverName, "restart");
}

async function cmd_status(serverName) {
  return await statusClientServer(serverName);
}

async function cmd_start(serverName) {
  return await powerClientServer(serverName, "start");
}

async function cmd_stop(serverName) {
  return await powerClientServer(serverName, "stop");
}

module.exports = {
  cmd_newserver,
  cmd_listservers,
  cmd_restart,
  cmd_status,
  cmd_start,
  cmd_stop,
};
