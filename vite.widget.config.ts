
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuração específica para build da biblioteca widget
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Definir variáveis que podem causar problemas no browser
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    global: 'globalThis',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/widget-entry.tsx'),
      name: 'ChatbotWidget',
      fileName: 'chatbot-widget',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        // Incluir todas as dependências no bundle
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
      external: [],
    },
    // Otimizações para produção
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Garantir compatibilidade com browsers
    target: 'es2015',
    sourcemap: false,
  },
});
