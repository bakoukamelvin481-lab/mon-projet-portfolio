// Chatbot BFA - Logique principale

class BFAChatbot {
  constructor(config) {
    this.config = config;
    this.messages = [];
    this.isOpen = false;
    this.isLoading = false;
    this.conversationHistory = [];
    this.init();
  }

  init() {
    this.createDOM();
    this.attachEventListeners();
    this.showWelcomeMessage();
  }

  createDOM() {
    // Créer le widget HTML
    const widget = document.createElement('div');
    widget.className = 'bfa-chat-widget';
    widget.innerHTML = `
      <button class="bfa-chat-button" id="bfa-chat-button">
        💬
      </button>
      
      <div class="bfa-chat-window" id="bfa-chat-window">
        <div class="bfa-chat-header">
          <span>BFA Assistant</span>
          <button class="bfa-chat-header-close" id="bfa-chat-close">✕</button>
        </div>
        
        <div class="bfa-chat-messages" id="bfa-chat-messages">
          <!-- Les messages vont ici -->
        </div>
        
        <div class="bfa-chat-suggestions" id="bfa-chat-suggestions">
          <!-- Les suggestions vont ici -->
        </div>
        
        <div class="bfa-chat-input-area">
          <input 
            type="text" 
            class="bfa-chat-input" 
            id="bfa-chat-input" 
            placeholder="Écris ta question..."
            autocomplete="off"
          />
          <button class="bfa-chat-send-button" id="bfa-chat-send">→</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    
    // Références aux éléments
    this.elements = {
      button: document.getElementById('bfa-chat-button'),
      window: document.getElementById('bfa-chat-window'),
      closeBtn: document.getElementById('bfa-chat-close'),
      messagesContainer: document.getElementById('bfa-chat-messages'),
      suggestionsContainer: document.getElementById('bfa-chat-suggestions'),
      input: document.getElementById('bfa-chat-input'),
      sendButton: document.getElementById('bfa-chat-send'),
    };
  }

  attachEventListeners() {
    // Ouvrir/fermer le chat
    this.elements.button.addEventListener('click', () => this.toggleChat());
    this.elements.closeBtn.addEventListener('click', () => this.toggleChat());
    
    // Envoyer le message
    this.elements.sendButton.addEventListener('click', () => this.sendMessage());
    
    // Envoyer avec Entrée
    this.elements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    // Auto-resize textarea
    this.elements.input.addEventListener('input', () => {
      this.elements.input.style.height = 'auto';
      this.elements.input.style.height = Math.min(this.elements.input.scrollHeight, 80) + 'px';
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.elements.window.classList.add('open');
      this.elements.button.classList.add('active');
      this.elements.input.focus();
    } else {
      this.elements.window.classList.remove('open');
      this.elements.button.classList.remove('active');
    }
  }

  showWelcomeMessage() {
    this.appendMessage(this.config.welcomeMessage, 'bot');
    this.showSuggestions();
  }

  showSuggestions() {
    this.elements.suggestionsContainer.innerHTML = '';
    
    this.config.suggestions.forEach((suggestion) => {
      const btn = document.createElement('button');
      btn.className = 'bfa-suggestion-button';
      btn.textContent = suggestion;
      btn.addEventListener('click', () => {
        this.elements.input.value = suggestion;
        this.sendMessage();
      });
      this.elements.suggestionsContainer.appendChild(btn);
    });
  }

  appendMessage(text, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `bfa-message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `bfa-message-content ${sender}`;
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    this.elements.messagesContainer.appendChild(messageDiv);
    
    // Scroll vers le bas
    this.elements.messagesContainer.scrollToAssignTop = this.elements.messagesContainer.scrollHeight;
    
    // Stocker le message
    this.messages.push({ text, sender, timestamp: new Date() });
  }

  appendLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bfa-message bot loading';
    messageDiv.id = 'loading-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'bfa-message-content bot';
    contentDiv.innerHTML = `
      <div class="bfa-typing-dot"></div>
      <div class="bfa-typing-dot"></div>
      <div class="bfa-typing-dot"></div>
    `;
    
    messageDiv.appendChild(contentDiv);
    this.elements.messagesContainer.appendChild(messageDiv);
    this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
  }

  removeLoadingMessage() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) loadingMsg.remove();
  }

  async sendMessage() {
    const userInput = this.elements.input.value.trim();
    
    if (!userInput) return;
    
    // Afficher le message utilisateur
    this.appendMessage(userInput, 'user');
    this.elements.input.value = '';
    this.elements.input.style.height = 'auto';
    
    // Ajouter à l'historique
    this.conversationHistory.push({ role: 'user', content: userInput });
    
    // Afficher le chargement
    this.appendLoadingMessage();
    this.elements.sendButton.disabled = true;
    this.elements.sendButton.classList.add('sending');
    
    // Masquer les suggestions
    this.elements.suggestionsContainer.innerHTML = '';
    
    try {
      const response = await this.callOpenAI(userInput);
      this.removeLoadingMessage();
      this.appendMessage(response, 'bot');
      
      // Ajouter la réponse à l'historique
      this.conversationHistory.push({ role: 'assistant', content: response });
    } catch (error) {
      this.removeLoadingMessage();
      this.appendMessage(
        '❌ Désolé, je ne peux pas répondre pour le moment. Vérifie que ta clé API est correctement configurée.',
        'bot'
      );
      console.error('Erreur chatbot:', error);
    } finally {
      this.elements.sendButton.disabled = false;
      this.elements.sendButton.classList.remove('sending');
    }
  }

  async callOpenAI(userMessage) {
    // Vérifier si la clé API est configurée
    if (!this.config.apiKey || this.config.apiKey === 'sk-YOUR_API_KEY_HERE') {
      console.warn('Clé API OpenAI non configurée, utilisation du fallback');
      
      // Utiliser la réponse fallback si disponible
      if (typeof fallbackResponse === 'function') {
        return fallbackResponse(userMessage);
      }
      
      throw new Error('Clé API OpenAI non configurée');
    }
    
    const messages = [
      { 
        role: 'system', 
        content: this.config.systemPrompt 
      },
      ...this.conversationHistory,
      { role: 'user', content: userMessage }
    ];
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      }),
    });
    
    if (!response.ok) {
      // En cas d'erreur API, essayer le fallback
      console.warn('Erreur API OpenAI, tentative fallback');
      if (typeof fallbackResponse === 'function') {
        return fallbackResponse(userMessage);
      }
      throw new Error(`Erreur API OpenAI: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// Initialiser le chatbot quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  if (typeof BFA_CHATBOT_CONFIG !== 'undefined') {
    window.bfaChatbot = new BFAChatbot(BFA_CHATBOT_CONFIG);
  } else {
    console.error('BFA_CHATBOT_CONFIG non trouvé. Assure-toi que config.js est chargé.');
  }
});
