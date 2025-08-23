const axios = require("axios");

// ⚠️ Mets les infos de ton panel ici
const PTERO_API = "https://chat.vezxa.com/api/application";
const API_KEY = "ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5"; // API admin (Application API Key)

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
  Accept: "application/json"
};

// Générateur simple
function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// === 1. Créer un utilisateur random ===
async function createRandomUser() {
  const username = "user" + randomString(6);
  const email = username.toLowerCase() + "@gmail.com";
  const password = randomString(10);

  const payload = {
    email,
    username,
    first_name: "Auto",
    last_name: "User",
    password,
    language: "en"
  };

  const res = await axios.post(`${PTERO_API}/users`, payload, { headers });
  return { ...res.data.attributes, password };
}

// === 2. Créer un serveur pour un user ===
async function createServerForUser(userId, name, node, allocation, nest, egg) {
  const payload = {
    name,
    user: userId,
    egg,
    docker_image: "ghcr.io/parkervcp/yolks:nodejs_18", // ⚠️ adapte selon ton egg
    startup: "npm start", // ⚠️ adapte selon ton egg
    environment: {
      SERVER_PORT: "3000"
    },
    limits: {
      memory: 1024,
      swap: 0,
      disk: 10240,
      io: 500,
      cpu: 100
    },
    feature_limits: {
      databases: 1,
      allocations: 1,
      backups: 1
    },
    allocation: {
      default: allocation
    },
    nest,
    node
  };

  const res = await axios.post(`${PTERO_API}/servers`, payload, { headers });
  return res.data.attributes;
}

module.exports = {
  createRandomUser,
  createServerForUser
};
