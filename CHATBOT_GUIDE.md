# 🤖 Guide d'Installation - ChatBot BFA

Bienvenue! Ce guide te montre comment mettre en place ton assistant IA personnel pour ton site BFA.

## ✅ Installation rapide (5 minutes)

### Étape 1: Obtenir une clé API OpenAI

1. Va sur https://platform.openai.com/account/api-keys
2. Crée un compte (ou connecte-toi)
3. Clique sur "Create new secret key"
4. **Copie la clé** - Tu ne pourras pas la revoir après!

### Étape 2: Ajouter la clé à ton site

Ouvre `chatbot/config.js` et remplace cette ligne:

```javascript
apiKey: 'sk-YOUR_API_KEY_HERE',
```

Par ta clé réelle. Par exemple:

```javascript
apiKey: 'sk-proj-abcdef123456...',
```

### Étape 3: C'est tout! 🎉

Rafraîchis ton site. Le chatbot apparaît dans le coin inférieur droit.

---

## 🎨 Personnalisations

### Changer le message de bienvenue

Dans `config.js`:

```javascript
welcomeMessage: 'Coucou! 👋 Je suis l\'assistant BFA. Comment je peux t\'aider?',
```

### Modifier les suggestions

```javascript
suggestions: [
  'C\'est quoi BFA?',
  'Quel prix?',
  'Vous livrez où?',
  'Garantie?',
]
```

### Changer la couleur (vert → autre couleur)

```javascript
brandColor: '#FF6B6B',  // Rouge
brandColor: '#4ECDC4',  // Turquoise
brandColor: '#1558d6',  // Bleu
```

---

## 📚 Contexte produit

Le chatbot connaît BFA grâce au `systemPrompt` dans `config.js`.

Pour qu'il réponde mieux à TES questions spécifiques, mets à jour:

```javascript
systemPrompt: `Tu es un assistant pour BFA...

INFORMATIONS SUR BFA:
- Nouveau feature: ...
- Nouveau prix: ...
- Nouveau competitor: ...

Tu dois...`
```

---

## 🚀 Déploiement en production

⚠️ **IMPORTANT**: Ne mets JAMAIS ta clé API dans le code public!

### Utiliser un backend (Plus sûr)

**Problem**: Si on voit ta clé API dans le code, quelqu'un peut l'utiliser et vider tes crédits.

**Solution**: Passe par ton serveur!

#### Backend Node.js (Express)

1. **Crée `server.js`:**

```javascript
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY  // Clé sécurisée
}));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });
    
    res.json({ 
      message: response.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => {
  console.log('Serveur sur port 3000');
});
```

2. **Mets à jour `chatbot.js`:**

```javascript
async callOpenAI(userMessage) {
  const response = await fetch('/api/chat', {  // Ton serveur!
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: this.config.systemPrompt },
        ...this.conversationHistory,
        { role: 'user', content: userMessage }
      ]
    })
  });
  
  const data = await response.json();
  return data.message;
}
```

3. **Deploy sur Heroku/Vercel/Render**

---

## 💬 Fallback (Réponses de secours)

Si OpenAI ne répond pas (panne, crédit épuisé), le chatbot utilise `fallback.js`.

Édite `fallback.js` pour ajouter tes propres réponses:

```javascript
const BFA_FALLBACK_RESPONSES = {
  "ta question": "Ta réponse ici",
  "une autre": "Une autre réponse",
};
```

---

## 🐛 Dépannage

**Le chatbot n'apparaît pas?**
- Ouvre la console (F12 → Console)
- Vérifie les erreurs rouges
- Assure-toi que les fichiers `chatbot/` existent

**Pas de réponses?**
- Clé API correcte?
- Il y a de l'argent sur ton compte OpenAI?
- Pas de typo dans la clé?

**Réponses bizarres?**
- Améliore le `systemPrompt`
- Change `temperature` (0 = exact, 1 = créatif)
- Essaie GPT-4 à la place de GPT-3.5

**Trop coûteux?**
- Réduis `maxTokens` (maintenant 500)
- Utilise moins de suggestions
- Utilise le `fallback` pour les questions fréquentes

---

## 💰 Coûts estimés

**GPT-3.5 (par 1K tokens):** ~$0.0005-0.0015

**Estimation mensuelle:**
- 10 conversations/jour de 200 tokens = ~$1-3/mois
- 50 conversations/jour = ~$5-15/mois
- 1000 conversations/jour = ~$100-300/mois

**Suivi en temps réel:** https://platform.openai.com/account/billing/overview

---

## 🎓 Modèles disponibles

- **gpt-3.5-turbo** (rapide, ~$0.5k tokens) ← Recommandé
- **gpt-4** (intelligent, ~$3k tokens)
- **gpt-4-turbo** (très rapide & intelligent)

Change dans `config.js`:

```javascript
model: 'gpt-4',  // Au lieu de gpt-3.5-turbo
```

---

## 🔒 Bonnes pratiques de sécurité

✅ **À faire:**
- Mets la clé API dans les variables d'environnement: `process.env.OPENAI_API_KEY`
- Utilise un backend pour appeler OpenAI
- Rate-limit les appels: max 10 par IP/jour
- Sauvegarde les conversations de l'utilisateur de manière sécurisée

❌ **À ne pas faire:**
- Partager la clé API
- La mettre dans Git (ajoute `config.js` à `.gitignore`)
- La montrer au client directement
- Pas de chiffrement des conversations

---

## 🚀 Prochaines étapes

1. ✅ Ajoute la clé API
2. ✅ Personnalise le `systemPrompt`
3. ✅ Teste avec quelques questions
4. ✅ Passe à un backend en production
5. ✅ Monitor les coûts sur OpenAI

---

## 📞 Questions?

- **OpenAI Docs:** https://platform.openai.com/docs
- **GitHub Issues:** Pose une question sur GitHub
- **Console:** F12 → Regarde les erreurs

---

**Tu es prêt? Lance le chatbot! 🚀**
