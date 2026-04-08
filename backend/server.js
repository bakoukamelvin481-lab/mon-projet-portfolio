/**
 * 🔒 Backend sécurisé pour ChatBot BFA
 * =====================================
 * 
 * Exemple de serveur Node.js/Express pour appeler OpenAI de manière sécurisée
 * 
 * Installation:
 *   npm install express openai dotenv cors cors 
 * 
 * Variables d'env (.env):
 *   OPENAI_API_KEY=sk-...
 *   PORT=3000
 * 
 * Lancer:
 *   npm start
 *   ou: node backend/server.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Init OpenAI
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// Rate limiter simple (en production, utilise redis)
const rateLimiter = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const userLimit = rateLimiter.get(ip) || [];
  
  // Forget old requests (> 1 hour)
  const recentRequests = userLimit.filter(t => now - t < 3600000);
  
  if (recentRequests.length >= 100) {  // Max 100 requests par heure
    return false;
  }
  
  recentRequests.push(now);
  rateLimiter.set(ip, recentRequests);
  return true;
}

// Context for BFA product
const BFA_SYSTEM_PROMPT = `Tu es un assistant intelligent pour Brush For Always (BFA), une brosse à dents écologique révolutionnaire.

INFORMATIONS SUR BFA:
- Manche à vie en hêtre français certifié FSC
- Tête interchangeable en nylon recyclé (durée de vie 3 mois)
- Anneau magnétique en biopolymère certifié
- Abonnement tête à partir de 4,90€/mois
- Made in France
- Éco-score: A+ (meilleur du marché)
- Recyclage certifié avec freepost inclus
- Segments: souple, médium, enfants, seniors

Tu dois:
1. Répondre aux questions sur BFA de manière claire et précise
2. Mettre en avant les avantages écologiques
3. Être honnête sur les tarifs
4. Suggérer des produits complémentaires quand approprié
5. Diriger vers la commande quand le client est intéressé
6. Répondre en français
7. Être amical et professionnel`;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // Rate limiting
    const ip = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ 
        error: 'Trop de requêtes. Essaie plus tard.' 
      });
    }

    const { messages } = req.body;
    
    // Validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages invalides' });
    }
    
    // Ajouter le system prompt
    const messagesWithSystem = [
      { role: 'system', content: BFA_SYSTEM_PROMPT },
      ...messages
    ];
    
    // Appeler OpenAI
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messagesWithSystem,
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || 0.7),
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || 500),
      timeout: parseInt(process.env.API_TIMEOUT || 30000),
    });
    
    const message = response.data?.choices?.[0]?.message?.content;
    
    if (!message) {
      return res.status(500).json({ error: 'Pas de réponse OpenAI' });
    }
    
    res.json({ message });
    
  } catch (error) {
    console.error('Erreur API:', error.message);
    
    // Erreurs spécifiques OpenAI
    if (error.message.includes('401')) {
      return res.status(401).json({ error: 'Clé API invalide' });
    }
    if (error.message.includes('429')) {
      return res.status(429).json({ error: 'Limite API dépassée' });
    }
    if (error.message.includes('timeout')) {
      return res.status(504).json({ error: 'Timeout OpenAI' });
    }
    
    res.status(500).json({ 
      error: 'Erreur serveur. Essaie plus tard.' 
    });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur interne serveur' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur ChatBot BFA sur port ${PORT}`);
  console.log(`📍 Endpoint: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
