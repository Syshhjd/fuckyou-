const axios = require('axios');

const PTERO_API_URL = 'https://chat.vezxa.com/api/application';
const PTERO_API_KEY = 'ptla_YMZaRilAmOEz571dZDPsQbCdZJmcTTHvN53MnFYl3Qf';

// Génère un mot de passe random (8 caractères)
function randomPassword() {
  return Math.random().toString(36).slice(-8);
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

async function createRandomUser() {
  const username = randomUsername();
  const email = `${username}@vezxa.com`;
  const password = randomPassword();
  const first_name = randomFirstName();
  const last_name = randomLastName();
  const language = 'en'; // ou 'fr' si tu veux

  const res = await axios.post(
    `${PTERO_API_URL}/users`,
    {
      username,
      email,
      first_name,
      last_name,
      password,
      language
    },
    {
      headers: {
        Authorization: `Bearer ${PTERO_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  const user = res.data.attributes;
  return { id: user.id, username, email, password, first_name, last_name };
}

// Créer un serveur pour ce user
async function createServerForUser(userId, serverName, node, allocation, nest, egg) {
  const res = await axios.post(
    `${PTERO_API_URL}/servers`,
    {
      name: serverName,
      user: userId,
      description: "Serveur créé automatiquement",
      egg,
      nest,
      docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",   // À adapter selon l'egg
      startup: "npm start",                                   // À adapter selon l'egg
      limits: { memory: 0, swap: -1, disk: 0, io: 500, cpu: 0 },
      feature_limits: { databases: 0, allocations: 0, backups: 0 },
      allocation: { default: allocation }
    },
    {
      headers: {
        Authorization: `Bearer ${PTERO_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data.attributes;
}

module.exports = { createRandomUser, createServerForUser };
