
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from '../components/chat/ChatWidget';
import '../index.css';

interface ChatbotConfig {
  widgetId: string;
  domain: string;
  apiEndpoint?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  autoOpen?: boolean;
  showBranding?: boolean;
}

class ChatbotWidgetManager {
  private config: ChatbotConfig | null = null;
  private container: HTMLElement | null = null;
  private root: any = null;

  init(config: ChatbotConfig) {
    try {
      this.config = config;
      this.createContainer();
      this.injectStyles();
      this.renderWidget();
    } catch (error) {
      console.error('Erro ao inicializar chatbot widget:', error);
    }
  }

  private createContainer() {
    // Remove container existente se houver
    const existingContainer = document.getElementById('chatbot-widget-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Criar novo container
    this.container = document.createElement('div');
    this.container.id = 'chatbot-widget-container';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(this.container);
  }

  private injectStyles() {
    if (!this.config) return;

    const styleId = 'chatbot-widget-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Estilos customizados baseados na configuração
    const customStyles = `
      #chatbot-widget-container {
        --chatbot-primary: ${this.config.primaryColor || '#2563eb'};
      }
      
      #chatbot-widget-container *,
      #chatbot-widget-container *::before,
      #chatbot-widget-container *::after {
        box-sizing: border-box;
      }
      
      #chatbot-widget-container {
        all: initial;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        pointer-events: none !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
    `;

    styleElement.textContent = customStyles;
  }

  private renderWidget() {
    if (!this.container) return;

    try {
      // Criar wrapper interno para o widget
      const widgetWrapper = document.createElement('div');
      widgetWrapper.style.cssText = 'pointer-events: auto;';
      this.container.appendChild(widgetWrapper);

      // Renderizar o React component
      this.root = createRoot(widgetWrapper);
      this.root.render(React.createElement(ChatWidget));
    } catch (error) {
      console.error('Erro ao renderizar widget:', error);
    }
  }

  destroy() {
    try {
      if (this.root) {
        this.root.unmount();
      }
      if (this.container) {
        this.container.remove();
      }
      
      // Remover estilos
      const styleElement = document.getElementById('chatbot-widget-styles');
      if (styleElement) {
        styleElement.remove();
      }
    } catch (error) {
      console.error('Erro ao destruir widget:', error);
    }
  }
}

// Expor no window global de forma segura
(() => {
  if (typeof window !== 'undefined') {
    // Definir tipos globais
    (window as any).ChatbotWidget = new ChatbotWidgetManager();

    // Auto-inicializar se config estiver disponível
    if ((window as any).ChatbotConfig) {
      (window as any).ChatbotWidget.init((window as any).ChatbotConfig);
    }
  }
})();
