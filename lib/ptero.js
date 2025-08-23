const axios = require('axios');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // admin

// ---- APPLICATION SCOPE (admin) : créer users et serveurs ----
const axiosApp = axios.create({
  baseURL: `${PANEL_URL}/api/application`,
  headers: {
    Authorization: `Bearer ${API_APPLICATION}`,
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
// À ADAPTER : mets ici ton vrai allocation ID dispo pour node 1 !
const DEFAULT_NODE = 1;
const DEFAULT_ALLOCATION = 7; // <-- Mets ici l'ID allocation dispo trouvé dans le panel !
const DEFAULT_NEST = 5;    // ID numérique (vu dans l’URL nest)
const DEFAULT_EGG = 15;    // ID numérique (vu dans l’URL egg)
const DEFAULT_IMAGE = "ghcr.io/pterodactyl/yolks:nodejs_18";
const DEFAULT_STARTUP = "npm start";

// ---- À ADAPTER si tu veux changer les valeurs par défaut ! ----
const DEFAULT_ENV = {
  GIT_ADDRESS: "",       // Adresse du dépôt git (ex: https://github.com/tonrepo/tonbot.git)
  BRANCH: "main",        // Branche git
  USER_UPLOAD: "1",      // 1 = activé, 0 = désactivé
  AUTO_UPDATE: "0",      // 1 = activé, 0 = désactivé
  NODE_PACKAGES: "",     // noms de paquets à installer (ex: "discord.js axios")
  USERNAME: "",          // nom d'utilisateur git si privé
  ACCESS_TOKEN: "",      // token d'accès git si privé
  UNNODE_PACKAGES: "",   // paquets à désinstaller
  CMD_RUN: "npm start",  // commande de lancement
  NODE_ARGS: ""          // arguments nodejs
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

// ---- EXEMPLE D'UTILISATION ----
async function cmd_newserver(serverName = "AutoServer") {
  let user, server;
  try {
    user = await createRandomUser();
  } catch (e) {
    return `❌ Création user échouée : ${e.message}`;
  }
  try {
    server = await createServerForUser(user.id, serverName);
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

// ---- EXPORT POUR TON BOT OU TEST ----
module.exports = {
  cmd_newserver,
};
