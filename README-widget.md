
# Chatbot Widget - Guia de Deploy

## Como gerar o arquivo chatbot-widget.js

### 1. Build da biblioteca

**Windows (Prompt/PowerShell):**
```cmd
# Usando arquivo .bat
scripts\build-widget.bat

# Ou usando Node.js
node scripts/build-widget.js

# Ou manualmente
npx vite build --config vite.widget.config.ts
```

**Linux/Mac:**
```bash
# Usando script Node.js
node scripts/build-widget.js

# Ou manualmente
vite build --config vite.widget.config.ts
```

### 2. Arquivo gerado
- **Localização**: `dist/chatbot-widget.iife.js`
- **Formato**: IIFE (Immediately Invoked Function Expression)
- **Dependências**: Todas incluídas no bundle

### 3. Upload para CDN
1. Faça upload do arquivo `dist/chatbot-widget.iife.js` para seu CDN
2. Renomeie para `chatbot-widget.js` no CDN
3. Configure CORS se necessário:
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET
   ```

### 4. Como usar em websites
```html
<!-- Script de integração -->
<script>
  window.ChatbotConfig = {
    widgetId: "widget-123",
    domain: "meusite.com.br",
    primaryColor: "#2563eb",
    position: "bottom-right",
    autoOpen: false
  };
</script>
<script src="https://cdn.seuservico.com/chatbot-widget.js"></script>
```

### 5. API disponível
```javascript
// Inicializar manualmente
window.ChatbotWidget.init({
  widgetId: "widget-123",
  domain: "meusite.com.br"
});

// Destruir widget
window.ChatbotWidget.destroy();
```

### 6. Configurações disponíveis
- `widgetId`: ID único do widget
- `domain`: Domínio do website
- `apiEndpoint`: Endpoint da API (opcional)
- `primaryColor`: Cor primária do widget
- `position`: Posição ('bottom-right' | 'bottom-left')
- `autoOpen`: Abrir automaticamente
- `showBranding`: Mostrar marca do chatbot

## Estrutura de arquivos
- `src/widget/widget-entry.tsx`: Entry point da biblioteca
- `vite.widget.config.ts`: Configuração de build
- `scripts/build-widget.js`: Script de build (multiplataforma)
- `scripts/build-widget.bat`: Script de build específico para Windows

## Comandos de build por plataforma

### Windows
```cmd
REM Opção 1: Arquivo .bat
scripts\build-widget.bat

REM Opção 2: Node.js
node scripts\build-widget.js

REM Opção 3: Manual
npx vite build --config vite.widget.config.ts
```

### Linux/Mac
```bash
# Opção 1: Node.js
node scripts/build-widget.js

# Opção 2: Manual
vite build --config vite.widget.config.ts
```
