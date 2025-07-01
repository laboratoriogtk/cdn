
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, MessageSquare, Settings, Bell } from "lucide-react";

export const AdminPanel = () => {
  const [config, setConfig] = useState({
    botName: "Assistente Virtual",
    welcomeMessage: "Olá! Como posso ajudá-lo hoje?",
    primaryColor: "#2563eb",
    position: "bottom-right",
    enableFileUpload: true,
    enableFeedback: true,
    showTypingIndicator: true,
    autoOpenDelay: 0,
    offlineMessage: "No momento estamos offline. Deixe sua mensagem!"
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Configurações do Chatbot
          </CardTitle>
          <CardDescription>
            Personalize a aparência e comportamento do seu chatbot
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="features">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={18} />
                Personalização Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="botName">Nome do Bot</Label>
                  <Input
                    id="botName"
                    value={config.botName}
                    onChange={(e) => handleConfigChange('botName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => handleConfigChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Posição na Tela</Label>
                <Select value={config.position} onValueChange={(value) => handleConfigChange('position', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Inferior Direito</SelectItem>
                    <SelectItem value="bottom-left">Inferior Esquerdo</SelectItem>
                    <SelectItem value="top-right">Superior Direito</SelectItem>
                    <SelectItem value="top-left">Superior Esquerdo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Comportamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autoOpenDelay">Abrir Automaticamente (segundos)</Label>
                <Input
                  id="autoOpenDelay"
                  type="number"
                  min="0"
                  value={config.autoOpenDelay}
                  onChange={(e) => handleConfigChange('autoOpenDelay', parseInt(e.target.value))}
                />
                <p className="text-sm text-gray-500">0 = não abre automaticamente</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Indicador de Digitação</Label>
                  <p className="text-sm text-gray-500">Mostrar quando o bot está "digitando"</p>
                </div>
                <Switch
                  checked={config.showTypingIndicator}
                  onCheckedChange={(checked) => handleConfigChange('showTypingIndicator', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare size={18} />
                Mensagens Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcomeMessage"
                  value={config.welcomeMessage}
                  onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offlineMessage">Mensagem Offline</Label>
                <Textarea
                  id="offlineMessage"
                  value={config.offlineMessage}
                  onChange={(e) => handleConfigChange('offlineMessage', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Upload de Arquivos</Label>
                  <p className="text-sm text-gray-500">Permitir anexar imagens, documentos e vídeos</p>
                </div>
                <Switch
                  checked={config.enableFileUpload}
                  onCheckedChange={(checked) => handleConfigChange('enableFileUpload', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sistema de Feedback</Label>
                  <p className="text-sm text-gray-500">Avaliações com estrelas e curtidas</p>
                </div>
                <Switch
                  checked={config.enableFeedback}
                  onCheckedChange={(checked) => handleConfigChange('enableFeedback', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" size="lg">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
