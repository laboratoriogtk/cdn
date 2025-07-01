
import { useState } from "react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ScriptGenerator } from "@/components/script/ScriptGenerator";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Settings, Code } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("widget");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Widget de Chatbot Inteligente
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie experiências conversacionais ricas com componentes interativos,
            feedbacks e integração fácil em qualquer website.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="widget" className="flex items-center gap-2">
              <MessageSquare size={16} />
              Widget Demo
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings size={16} />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="script" className="flex items-center gap-2">
              <Code size={16} />
              Script de Integração
            </TabsTrigger>
          </TabsList>

          <TabsContent value="widget" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Preview do Widget</h2>
              <p className="text-gray-600 mb-6">
                Veja como o chatbot aparecerá no seu website. Teste todos os componentes interativos.
              </p>
              <div className="relative h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <p className="text-white text-lg font-medium">Seu Website</p>
                </div>
                <ChatWidget />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="script" className="space-y-6">
            <ScriptGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
