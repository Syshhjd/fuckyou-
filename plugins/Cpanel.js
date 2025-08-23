const { cmd } = require('../command');
const axios = require('axios');

// ---- CONFIGURATION ----
const PANEL_URL = 'https://chat.vezxa.com';
const API_APPLICATION = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5'; // admin

// ⚠️ Mets ici les bons IDs récupérés avec .listnests / .listeggs / .listallocs
const DEFAULT_NODE = 1;
const DEFAULT_ALLOCATION = 1;
const DEFAULT_NEST = 5;   // ex: NodeJS
const DEFAULT_EGG = 12;   // ex: NodeJS 18
const DEFAULT_IMAGE = "ghcr.io/pterodactyl/yolks:nodejs_18";
const DEFAULT_STARTUP = "npm start";

// ---- AXIOS ADMIN ----
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
  const names = ['Alex', 'Chris', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Jamie', 'Riley'];
  return names[Math.floor(Math.random() * names.length)];
}
function randomLastName() {
  const names = ['Smith', 'Lee', 'Brown', 'Taylor', 'Walker', 'Johnson', 'White'];
  return names[Math.floor(Math.random() * names.length)];
}

// ---- CREATION UTILISATEUR ----
async function createRandomUser() {
  const username = randomUsername();
  const email = `${username}@vezxa.com`;
  const password = randomString(10);
  const first_name = randomFirstName();
  const last_name = randomLastName();

  const res = await axiosApp.post('/users', {
    username,
    email,
    first_name,
    last_name,
    password,
    language: "en"
  });

  return { id: res.data.attributes.id, username, email, password, first_name, last_name };
}

// ---- CREATION SERVEUR ----
async function createServerForUser(userId, serverName) {
  const res = await axiosApp.post('/servers', {
    name: serverName,
    user: userId,
    description: "Serveur généré automatiquement",
    egg: DEFAULT_EGG,
    nest: DEFAULT_NEST,
    docker_image: DEFAULT_IMAGE,
    startup: DEFAULT_STARTUP,
    limits: { memory: 0, swap: -1, disk: 0, io: 500, cpu: 0 },
    feature_limits: { databases: 0, allocations: 0, backups: 0 },
    allocation: { default: DEFAULT_ALLOCATION }
  });

  return res.data.attributes;
}

// ---- COMMANDE BOT ----
cmd({
  pattern: "createpanel",
  alias: ["newpanel", "genpanel"],
  desc: "Créer un compte + serveur Pterodactyl",
  category: "panel",
  react: "🖥️",
  filename: __filename
},
async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("⚠️ Utilisation: *.createpanel NomServeur*");

    // Crée un user random
    const user = await createRandomUser();
    // Crée un serveur pour ce user
    const server = await createServerForUser(user.id, q);

    const txt = 
      `✅ *Panel créé avec succès !*\n\n` +
      `🔗 Panel: ${PANEL_URL}\n\n` +
      `👤 Identifiants:\n` +
      ` • Username: ${user.username}\n` +
      ` • Email: ${user.email}\n` +
      ` • Password: ${user.password}\n` +
      ` • Prénom: ${user.first_name}\n` +
      ` • Nom: ${user.last_name}\n\n` +
      `🖥️ Serveur:\n` +
      ` • Nom: ${server.name}\n` +
      ` • ID: ${server.id}`;

    reply(txt);

  } catch (e) {
    reply(`❌ Erreur lors de la création: ${e.response?.data?.errors?.[0]?.detail || e.message}`);
  }
});
