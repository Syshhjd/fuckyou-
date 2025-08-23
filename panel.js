const axios = require('axios');

const PTERO_API_URL = 'https://chat.vezxa.com/api/application';
const PTERO_API_KEY = 'ptla_qIGcfH10YQtqqICF1nM6xRVQ7f6ag4tRW2UhWJidAw5';

const axiosPanel = axios.create({
  baseURL: PTERO_API_URL,
  headers: {
    Authorization: `Bearer ${PTERO_API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

async function getAllServers() {
  try {
    const res = await axiosPanel.get('/servers?per_page=100');
    return res.data.data.map(s => ({
      id: s.attributes.id,
      name: s.attributes.name,
      identifier: s.attributes.identifier,
      status: s.attributes.status,
      ownerId: s.attributes.user,
      node: s.attributes.node,
    }));
  } catch (e) {
    throw new Error(e.response?.data?.errors?.[0]?.detail || e.message);
  }
}

async function getServerByName(name) {
  try {
    const servers = await getAllServers();
    const found = servers.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!found) throw new Error("Aucun serveur trouvé avec ce nom.");
    return found;
  } catch (e) {
    throw e;
  }
}

async function restartServerByIdentifier(identifier) {
  try {
    // On utilise l'API "client" pour envoyer une action (power)
    const url = `https://chat.vezxa.com/api/client/servers/${identifier}/power`;
    await axios.post(url, { signal: 'restart' }, {
      headers: {
        Authorization: `Bearer ${PTERO_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return true;
  } catch (e) {
    throw new Error(e.response?.data?.errors?.[0]?.detail || e.message);
  }
}

async function getServerStatusByIdentifier(identifier) {
  try {
    const url = `https://chat.vezxa.com/api/client/servers/${identifier}/resources`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${PTERO_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return res.data.attributes.current_state; // running / offline / starting / ...
  } catch (e) {
    throw new Error(e.response?.data?.errors?.[0]?.detail || e.message);
  }
}

// Export pour intégration WhatsApp
module.exports = {
  // Commande pour voir tous les serveurs
  listServers: async () => {
    try {
      const servers = await getAllServers();
      if (!servers.length) return "Aucun serveur trouvé.";
      let txt = "🖥️ *Liste des serveurs :*\n";
      servers.forEach(s => {
        txt += `\n• *${s.name}* (ID: ${s.id})\n  - Status: ${s.status || "?"}\n  - Node: ${s.node}\n`;
      });
      txt += `\n💡 Pour redémarrer : .restart nomDuServeur\n💡 Pour statut : .status nomDuServeur`;
      return txt;
    } catch (e) {
      return `❌ Erreur : ${e.message}`;
    }
  },

  // Commande pour restart un serveur par nom
  restartServer: async (serverName) => {
    try {
      const server = await getServerByName(serverName);
      await restartServerByIdentifier(server.identifier);
      return `🔄 Serveur *${server.name}* en cours de redémarrage !`;
    } catch (e) {
      return `❌ Erreur redémarrage : ${e.message}`;
    }
  },

  // Commande pour voir le statut d'un serveur par nom
  statusServer: async (serverName) => {
    try {
      const server = await getServerByName(serverName);
      const status = await getServerStatusByIdentifier(server.identifier);
      return `🟢 Statut du serveur *${server.name}* : ${status}`;
    } catch (e) {
      return `❌ Erreur statut : ${e.message}`;
    }
  }
};
