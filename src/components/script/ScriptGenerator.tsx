
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, ExternalLink, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ScriptGenerator = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState("meusite.com.br");
  const [widgetId, setWidgetId] = useState("widget-" + Math.random().toString(36).substr(2, 9));

  const generateScript = () => {
    return `<!-- Chatbot Widget Script -->
<script>
  (function() {
    // Configuração do Widget
    window.ChatbotConfig = {
      widgetId: "${widgetId}",
      domain: "${domain}",
      apiEndpoint: "https://api.seuservico.com",
      // Personalização
      primaryColor: "#2563eb",
      position: "bottom-right",
      autoOpen: false,
      showBranding: true
    };

    // Criar elemento do widget
    const script = document.createElement('script');
    script.src = 'https://cdn.seuservico.com/chatbot-widget.js';
    script.async = true;
    script.onload = function() {
      window.ChatbotWidget.init(window.ChatbotConfig);
    };
    
    // Inserir script na página
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  })();
</script>

<!-- CSS do Widget (opcional - para customização extra) -->
<style>
  #chatbot-widget {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  #chatbot-widget .custom-theme {
    --chatbot-primary: #2563eb;
    --chatbot-secondary: #f3f4f6;
    --chatbot-text: #111827;
  }
</style>`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Script copiado para a área de transferência.",
    });
  };

  const downloadScript = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot-${widgetId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code size={20} />
            Gerador de Script de Integração
          </CardTitle>
          <CardDescription>
            Configure e gere o código para integrar o chatbot em seu website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domínio do Website</Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="widgetId">ID do Widget</Label>
              <Input
                id="widgetId"
                value={widgetId}
                onChange={(e) => setWidgetId(e.target.value)}
                placeholder="widget-id"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Script Gerado</CardTitle>
          <CardDescription>
            Cole este código no HTML do seu website, antes do fechamento da tag &lt;/body&gt;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={generateScript()}
              readOnly
              className="font-mono text-sm min-h-[300px] resize-none"
            />
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(generateScript())}
            >
              <Copy size={14} />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => copyToClipboard(generateScript())}>
              <Copy size={16} className="mr-2" />
              Copiar Código
            </Button>
            <Button variant="outline" onClick={downloadScript}>
              <Download size={16} className="mr-2" />
              Baixar Arquivo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções de Instalação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">1. Copie o script</h4>
              <p className="text-sm text-gray-600">
                Use o botão "Copiar Código" acima para copiar o script gerado.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">2. Cole no seu website</h4>
              <p className="text-sm text-gray-600">
                Adicione o código no HTML do seu site, antes do fechamento da tag &lt;/body&gt;.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">3. Configure seu domínio</h4>
              <p className="text-sm text-gray-600">
                Certifique-se de que o domínio configurado está correto para permitir o funcionamento do widget.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">4. Teste o funcionamento</h4>
              <p className="text-sm text-gray-600">
                Acesse seu website e verifique se o chatbot aparece e funciona corretamente.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Dica Importante</h4>
            <p className="text-sm text-yellow-700">
              Para funcionar em produção, você precisará hospedar o arquivo JavaScript do widget
              em um CDN ou servidor próprio. Este é apenas um exemplo de integração.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
