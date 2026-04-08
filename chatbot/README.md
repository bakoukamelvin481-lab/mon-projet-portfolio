# 🤖 ChatBot BFA - Assistant Intelligent

Un assistant conversationnel intelligent pour répondre aux questions sur votre produit **Brush For Always** en temps réel.

## 🚀 Caractéristiques

✨ **Interface élégante** - Widget flottant dans le coin inférieur droit  
🧠 **Powered by OpenAI** - Réponses dynamiques et intelligentes  
💬 **Conversation contextuelle** - Mémorise l'historique de conversation  
📱 **Responsive** - Fonctionne sur desktop et mobile  
🎨 **Design cohérent** - Respecte l'identité visuelle de BFA  

## 📋 Configuration

### 1. **Obtenir une clé API OpenAI**

1. Accède à [platform.openai.com](https://platform.openai.com)
2. Crée un compte ou connecte-toi
3. Va dans "API Keys" → "Create new secret key"
4. Copie la clé

### 2. **Ajouter la clé API au chatbot**

Ouvre le fichier `chatbot/config.js` et remplace :

```javascript
apiKey: 'sk-YOUR_API_KEY_HERE',
```

Par ta clé réelle :

```javascript
apiKey: 'sk-proj-xxxxxxxxxxxxx...',
```

⚠️ **Important** : Ne partage jamais ta clé API publiquement ! Considère utiliser un backend secret pour les appels API en production.

### 3. **Personnaliser le chatbot**

Dans `chatbot/config.js`, tu peux modifier :

- `systemPrompt` : Instructions pour l'IA
- `suggestions` : Questions suggérées
- `welcomeMessage` : Message d'accueil
- `model` : Modèle OpenAI utilisé (gpt-3.5-turbo, gpt-4, etc.)
- `temperature` : Créativité des réponses (0-1)
- `maxTokens` : Longueur max des réponses

### 4. **C'est tout !**

Le chatbot devrait maintenant apparaître dans le coin inférieur droit de ton site.

## 📂 Structure des fichiers

```
chatbot/
├── config.js          # 🔧 Configuration et contexte produit
├── chatbot.js         # 💡 Logique principale du chatbot
└── styles.css         # 🎨 Styling du widget
```

## 🛠️ Personnalisation avancée

### Changer la couleur du branding

Modifie dans `config.js` les couleurs CSS Variables :

```javascript
brandColor: '#22c98a',       // Couleur verte BFA
secondaryColor: '#1d1d1f',  // Noir
accentColor: '#1558d6'      // Bleu
```

### Mettre à jour le contexte produit

Édite `config.js` et mets à jour la section `systemPrompt` avec :
- Nouvelles fonctionnalités du produit
- Tarifs à jour
- Nouveaux competitors
- Processus de commande actualisé

### Ajouter plus de suggestions

```javascript
suggestions: [
  'Qu\'est-ce que BFA?',
  'Comment ça marche?',
  'Quel est le prix?',
  'C\'est écologique?',
  // Ajoute les tiennes ici
]
```

## 🔐 Sécurité

⚠️ **IMPORTANT POUR LA PRODUCTION** :

Ne stocke PAS ta clé API côté client. À la place :

1. Crée un backend (Node.js, Python, etc.)
2. Appelle l'API OpenAI depuis le backend
3. Le frontend communique avec ton backend

Exemple avec backend Node.js :

```javascript
// Frontend - chatbot.js
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage })
});

// Backend - server.js
app.post('/api/chat', async (req, res) => {
  const response = await openai.createChatCompletion({
    messages: [...],
    apiKey: process.env.OPENAI_API_KEY // Clé sécurisée
  });
  res.json({ message: response.data.choices[0].message.content });
});
```

## 💰 Coûts OpenAI

- **GPT-3.5-Turbo** : ~$0.0015 par 1K tokens
- **GPT-4** : ~$0.03 par 1K tokens

Avec 10 conversations courtes/jour : ~$0.45/mois pour GPT-3.5

Monitor ton usage sur [platform.openai.com/account/usage](https://platform.openai.com/account/usage)

## 🐛 Dépannage

**Le chatbot ne s'ouvre pas ?**
- Vérifie la console (F12 → Console) pour les erreurs
- Assure-toi que `config.js` et `chatbot.js` sont chargés

**Pas de réponses de l'IA ?**
- Vérifie que la clé API est correcte
- Vérifie qu'il y a de l'argent sur ton compte OpenAI
- Regarde les erreurs dans la console

**Réponses en mauvais français ?**
- Améliore le `systemPrompt` dans `config.js`
- Augmente la temperature pour plus de créativité
- Utilise un modèle plus puissant (GPT-4)

## 📞 Support

Si tu as des questions :
- Consulte la [documentation OpenAI](https://platform.openai.com/docs)
- Vérifie les erreurs dans la console du navigateur (F12)
- Loggue l'historique de conversation pour debuguer

## 🎉 C'est prêt !

Ton chatbot BFA est maintenant opérationnel. Tes visiteurs peuvent poser des questions sur ton produit 24/7 ! 🚀

---

**Made with ❤️ for Brush For Always**
