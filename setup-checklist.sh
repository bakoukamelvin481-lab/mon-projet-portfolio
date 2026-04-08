#!/usr/bin/env bash
# 🚀 Installation ChatBot BFA - Script de vérification

echo "=================================="
echo "   🤖 ChatBot BFA - Vérification"
echo "=================================="
echo ""

# Vérifier les fichiers
echo "📋 Vérification des fichiers..."
files=(
  "chatbot/config.js"
  "chatbot/chatbot.js"
  "chatbot/styles.css"
  "chatbot/fallback.js"
  "chatbot/README.md"
  "CHATBOT_GUIDE.md"
  "CHATBOT_SUMMARY.txt"
  "backend/server.js"
  "backend/package.json"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (MANQUANT!)"
  fi
done

echo ""
echo "📝 Prochaines étapes:"
echo "========================"
echo ""
echo "1️⃣  CONFIGURATION RAPIDE (5 min)"
echo "   - Va sur: https://platform.openai.com/api-keys"
echo "   - Crée une clé API"
echo "   - Édite: chatbot/config.js"
echo "   - Ajoute ta clé à la place de 'sk-YOUR_API_KEY_HERE'"
echo "   - Rafraîchis ton site!"
echo ""

echo "2️⃣  PERSONNALISATION (10 min)"
echo "   - Édite: chatbot/config.js"
echo "   - Change: welcomeMessage"
echo "   - Change: suggestions"
echo "   - Mets à jour: systemPrompt avec tes infos BFA"
echo ""

echo "3️⃣  SÉCURITÉ EN PRODUCTION (30 min)"
echo "   - Crée un compte Render/Heroku"
echo "   - Installe Node.js"
echo "   - Fais: npm install dans le dossier backend/"
echo "   - Crée: backend/.env avec ta clé API"
echo "   - Fais: npm start"
echo "   - Déploie sur ton serveur!"
echo ""

echo "4️⃣  MONITORING (ongoing)"
echo "   - Suivi des coûts: https://platform.openai.com/account/billing"
echo "   - Logs du serveur"
echo "   - Questions fréquentes"
echo ""

echo "📚 Documents d'aide:"
echo "========================"
echo "   - CHATBOT_GUIDE.md     → Guide complet (FR)"
echo "   - CHATBOT_SUMMARY.txt  → Résumé rapide"
echo "   - chatbot/README.md    → Docs techniques"
echo "   - backend/README.md    → Backend guide"
echo ""

echo "✅ Premier test?"
echo "========================"
echo "Ouvre: index.html dans un navigateur"
echo "Cherche: Le 💬 en bas à droite"
echo "Clique: dessus!"
echo "Si ça ne marche pas (sans erreur): Ajoute ta clé API!"
echo ""

echo "❓ Besoin d'aide?"
echo "========================"
echo "Console (F12 → Console) pour les erreurs"
echo "Vérifie ta clé API sur: https://platform.openai.com/api-keys"
echo ""

echo "================================"
echo "🎉 C'est prêt! Bonne chance!"
echo "================================"
