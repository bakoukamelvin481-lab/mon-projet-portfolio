// Fallback responses - Utilisé quand OpenAI n'est pas disponible
// C'est une fallback basique pour que le chatbot fonctionne même sans API

const BFA_FALLBACK_RESPONSES = {
  "qu'est-ce que bfa": "BFA (Brush For Always) est une brosse à dents révolutionnaire avec un manche à vie en hêtre français et une tête interchangeable. C'est 95% moins de plastique qu'une brosse classique ! 🌱",
  
  "comment ça marche": "C'est simple: tu achètes un manche BFA une fois (pour la vie!), et tu reçois une nouvelle tête tous les 3 mois via abonnement à 4,90€/mois. La tête se recycle, le manche reste.",
  
  "quel est le prix": "Manche BFA: ~35€ (à vie). Abonnement têtes: 4,90€/mois (une tête tous les 3 mois). Ou acheter les têtes individuellement à la carte.",
  
  "c'est écologique": "Oui! 95% moins de plastique qu'une brosse classique. Manche en hêtre FSC français. Tête en nylon recyclé. Recyclage certifié avec freepost inclus. Éco-score: A+ 🌿",
  
  "comment recycler": "C'est automatique avec l'abonnement! Tu reçois une étiquette freepost avec chaque tête. Tu mets l'ancienne tête dedans et tu la renvoies gratuitement pour un recyclage certifié.",
  
  "où commander": "Tu peux commander directement sur notre site! Clique sur le bouton 'Commander' en haut. Le manche t'arrive sous 3-5 jours.",
  
  "poils souples ou médium": "On propose les deux! Souple pour les gencives sensibles, médium pour le nettoyage standard. Il y a aussi des versions enfants et seniors. Quelle est ta préférence?",
  
  "combien de temps dure une tête": "Une tête dure environ 3 mois en utilisation normale (2 brossages/jour). C'est pour ça que l'abonnement t'envoie une nouvelle tête tous les trimestres.",
  
  "comparé à lamazuna": "Lamazuna c'est bon aussi, mais elle a eu des difficultés en 2024. BFA: tu gardes le manche toute la vie. Lamazuna: il faut racheter le manche chaque fois.",
  
  "vs colgate keep": "Colgate Keep c'est un manche aluminium. BFA c'est mieux: du vrai bois français qui vieillit avec toi! Et notre éco-score (A+) dépasse Colgate (C).",
  
  "je suis gaucher": "Bon point! Notre brosse est 100% ambidextre. Le grip est profileé pour confortable pour les deux mains. 🤝",
  
  "existe pour enfants": "Oui! Une version spéciale enfants avec des poils plus souples et un manche légèrement plus petit. Parfait à partir de 6 ans.",
  
  "existe pour seniors": "Oui aussi! Version senior avec poils extra-souples pour les gencives sensibles et un grip renforcé pour plus de stabilité.",
  
  "abonnement obligatoire": "Non! Tu peux acheter les têtes individuellement à la carte aussi. Mais l'abonnement c'est 15% moins cher et tu reçois auto, c'est plus pratique.",
  
  "annuler abonnement": "Pas de problème! Tu peux l'annuler quand tu veux directement depuis ton compte. Zéro frais, zéro engagement.",
  
  "garantie": "Manche: 20 ans de garantie. Tête: couverte par notre qualité BFA. Si quelque chose va mal, on te remplace gratuitement.",
  
  "fabriqué où": "Le manche est taillé en France à partir de hêtre français. La tête en nylon recyclé. Tout est fait en France pour minimiser l'impact carbone.",
  
  "par qui": "BFA est créée par une équipe de 15 passionnés d'écologie basée en France. On a mis 3 ans à développer ce produit parfait!",
  
  "merci": "De rien! Tu as d'autres questions? Je suis là pour t'aider! 😊",
  
  "default": "Bonne question! C'est sur ce produit écologique génial qu'est BFA. Si tu as une question précise, essaie de la rephrase ou demande plus de détails!"
};

function fallbackResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Chercher une correspondance exacte
  for (const [key, response] of Object.entries(BFA_FALLBACK_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  // Chercher des mots-clés partiels
  const keywords = ['prix', 'coût', 'tarif', 'argent', 'payer'];
  if (keywords.some(kw => lowerMessage.includes(kw))) {
    return BFA_FALLBACK_RESPONSES['quel est le prix'];
  }
  
  const ecoKeywords = ['écolo', 'écologiq', 'environnement', 'plastique', 'durable'];
  if (ecoKeywords.some(kw => lowerMessage.includes(kw))) {
    return BFA_FALLBACK_RESPONSES['c\'est écologique'];
  }
  
  const orderKeywords = ['commander', 'acheter', 'achète', 'où', 'comment commander'];
  if (orderKeywords.some(kw => lowerMessage.includes(kw))) {
    return BFA_FALLBACK_RESPONSES['où commander'];
  }
  
  return BFA_FALLBACK_RESPONSES['default'];
}

// Note: Cette approche fallback est basique.
// Pour une vraie implémentation sans API, considère un chatbot plus complet
// comme Rasa ou similar.js
