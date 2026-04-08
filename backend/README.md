# 🔒 Backend Sécurisé ChatBot BFA

Ce dossier contient un serveur Node.js sécurisé pour exécuter les appels OpenAI.

## ⚠️ Pourquoi un backend?

**Problème:**
- Si tu mets la clé API dans le code client, tout le monde peut la voir
- Quelqu'un malveillant peut l'utiliser et vider tes crédits

**Solution:**
- Mets la clé sur le serveur (invisible aux clients)
- Le site appelle le serveur, qui appelle OpenAI

```
Client → Ton Serveur → OpenAI
         ↑
      Clé API
      cachée!
```

## 🚀 Installation (5 minutes)

### 1. **Installer Node.js**

Télécharge depuis https://nodejs.org (version LTS)

Vérifie:
```bash
node --version
npm --version
```

### 2. **Installer les dépendances**

```bash
cd backend
npm install
```

### 3. **Configurer l'API Key**

Copie `.env.example` en `.env`:
```bash
cp .env.example .env
```

Édite `.env` et remplace:
```
OPENAI_API_KEY=sk-YOUR_API_KEY_HERE
```

Par ta vraie clé (obtiens-la sur https://platform.openai.com/api-keys)

### 4. **Tester localement**

```bash
npm start
```

Tu devrais voir:
```
🚀 Serveur ChatBot BFA sur port 3000
📍 Endpoint: http://localhost:3000/api/chat
```

### 5. **Configurer le client**

Dans `chatbot/chatbot.js`, remplace:

```javascript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${this.config.apiKey}`,
    ...
  },
```

Par:

```javascript
const response = await fetch('/api/chat', {  // Ton serveur!
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ messages: [...] })
});
```

## 📝 Endpoints disponibles

### **GET /health**

Vérifie que le serveur fonctionne.

```bash
curl http://localhost:3000/health
# Réponse: { "status": "ok" }
```

### **POST /api/chat**

Envoie un message et reçoit une réponse IA.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Qu'est-ce que BFA?"
    }
  ]
}
```

**Response:**
```json
{
  "message": "BFA est une brosse à dents écologique avec un manche à vie..."
}
```

## 🛡️ Fonctionnalités de sécurité

✅ **Rate Limiting**
- Max 100 requêtes par IP par heure
- Évite les abus

✅ **CORS Configuré**
- Accepte uniquement tes domaines
- Configure dans `.env`: `ALLOWED_ORIGINS`

✅ **Input Validation**
- Vérifie que les messages sont valides
- Évite les injections

✅ **Error Handling**
- Erreurs OpenAI gérées correctement
- Pas de leaks d'info sensible

## 🌐 Déployer en production

### **Option 1: Heroku (gratuit, lent)**

```bash
# 1. Crée un compte sur https://heroku.com
# 2. Installe Heroku CLI

heroku create mon-chatbot-bfa
git push heroku main
heroku config:set OPENAI_API_KEY=sk-...
```

### **Option 2: Render (recommandé, gratuit)**

```bash
# 1. Va sur https://render.com
# 2. Crée un "Web Service"
# 3. Connecte ton GitHub
# 4. Ajoute les variables d'env
# 5. Deploy!
```

### **Option 3: DigitalOcean (5$/mois)**

```bash
# 1. Crée un App Platform sur DigitalOcean
# 2. Connecte ton GitHub
# 3. Ajoute les env vars
# 4. C'est prêt!
```

### **Option 4: AWS/Google Cloud**

Plus complexe mais plus puissant. Consulte leur documentation.

## 🧪 Tester l'endpoint

**Avec curl:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Quel est le prix de BFA?"}
    ]
  }'
```

**Avec JavaScript:**
```javascript
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Qu\'est-ce que BFA?' }
    ]
  })
})
.then(r => r.json())
.then(data => console.log(data.message))
```

## 🐛 Dépannage

**"Cannot find module 'openai'"**
→ Fais `npm install`

**"OPENAI_API_KEY not set"**
→ Crée un `.env` et ajoute ta clé

**"Model gpt-3.5-turbo does not exist"**
→ Change le modèle dans `.env`: `OPENAI_MODEL=gpt-4`

**"Timed out"**
→ OpenAI est lent. Augmente `API_TIMEOUT` dans `.env`

**Rate limit exceeded**
→ Tu as trop de requêtes. OpenAI a une limite.

## 💡 Tips

**Pour développement local:**
```bash
npm run dev  # Utilise nodemon (auto-reload)
```

**Pour logs détaillés:**
Modifie `server.js` et ajoute `console.log()` un peu partout

**Pour monitorer:**
```bash
# Voir les requêtes en temps réel
npm install -g httping
httping -G -p http://localhost:3000/api/chat
```

## 📊 Monitoring

En production, ajoute du monitoring:
- **Error tracking:** Sentry
- **Performance:** New Relic
- **Logs:** Papertrail ou Logtail
- **Uptime:** UptimeRobot

## Next steps

1. ✅ Configure `.env`
2. ✅ Teste localement
3. ✅ Mets à jour le client `chatbot.js`
4. ✅ Déploie sur Render/Heroku
5. ✅ Configure CORS pour ton domaine
6. ✅ Monitor les coûts OpenAI

---

**Tu es prêt? Lance le serveur et profile ton IA! 🚀**
