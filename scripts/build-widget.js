
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Iniciando build do widget...');

try {
  // Comando compatível com Windows e Unix
  const buildCommand = os.platform() === 'win32' 
    ? 'npx vite build --config vite.widget.config.ts'
    : 'vite build --config vite.widget.config.ts';

  execSync(buildCommand, { 
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true
  });

  // Verificar se o arquivo foi gerado
  const outputPath = path.join(process.cwd(), 'dist', 'chatbot-widget.iife.js');
  
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    const fileSize = (stats.size / 1024).toFixed(2);
    
    console.log(`✅ Widget build concluído!`);
    console.log(`📦 Arquivo: dist${path.sep}chatbot-widget.iife.js`);
    console.log(`📏 Tamanho: ${fileSize} KB`);
    console.log(`🌐 Pronto para upload para CDN`);
    console.log('');
    console.log('Para usar o widget, faça upload do arquivo para seu CDN e use:');
    console.log('<script src="https://cdn.seuservico.com/chatbot-widget.js"></script>');
  } else {
    console.error('❌ Erro: Arquivo de output não foi encontrado');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
