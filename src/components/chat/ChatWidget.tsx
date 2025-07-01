import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { FileUpload } from "./FileUpload";

// Define specific types for different message content types
type TextContent = string;
type ButtonContent = {
  text: string;
  buttons: Array<{ text: string; value: string }>;
};
type SelectContent = {
  text: string;
  options: Array<{ text: string; value: string }>;
};
type CarouselContent = {
  items: Array<{
    title?: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
  }>;
};
type FileContent = {
  fileName: string;
  fileSize: number;
  fileType: string;
};
type FeedbackContent = {
  text: string;
  feedbackId: string;
};
type InputContent = string;

type MessageContent = 
  | TextContent 
  | ButtonContent 
  | SelectContent 
  | CarouselContent 
  | FileContent 
  | FeedbackContent 
  | InputContent;

export interface Message {
  id: string;
  type: 'TEXT' | 'BUTTON' | 'SELECT' | 'CAROUSEL' | 'FILE' | 'FEEDBACK' | 'INPUT';
  content: MessageContent;
  sender: 'bot' | 'user';
  timestamp: Date;
}

// Define the backend response type
interface BackendResponse {
  refId?: number;
  stepId?: number;
  type: 'TEXT' | 'BUTTON' | 'SELECT' | 'CAROUSEL' | 'FILE' | 'FEEDBACK' | 'INPUT';
  message?: string;
  messages?: string[];
  buttons?: Array<{ text: string; value: string }>;
  options?: Array<{ text: string; value: string }>;
  items?: Array<{
    title?: string;
    description?: string;
    image?: string;
    [key: string]: unknown;
  }>;
  id?: number | string;
  finish?: boolean;
  integration?: boolean;
}

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getApiEndpoint = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:3000' : 'https://api.seuservico.com';
};

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [sessionId] = useState(() => generateUUID());
  const [currentRefId, setCurrentRefId] = useState<number | null>(null);
  const [currentStepId, setCurrentStepId] = useState<number | null>(null);  
  const [isConversationFinished, setIsConversationFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Enviar mensagem inicial para o backend
      sendMessageToBackend("Olá");
    }
  }, [isOpen]);

  useEffect(() => {
    const processMessageQueue = async () => {
      if (messageQueue.length > 0 && !isProcessingQueue) {
        setIsProcessingQueue(true);
        const message = messageQueue[0];
        
        setMessages(prev => [...prev, message]);
        
        // Espera 1 segundo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMessageQueue(prev => prev.slice(1));
        setIsProcessingQueue(false);
      }
    };

    processMessageQueue();
  }, [messageQueue, isProcessingQueue]);

  const sendMessageToBackend = async (message: string, refId: number | null = null, stepId: number | null = null) => {
    try {
      setIsTyping(true);
      
      const apiEndpoint = getApiEndpoint();
      const response = await fetch(`${apiEndpoint}/talk/web/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkRFRkFVTFQiLCJ0eXBlIjoiTk9STUFMIiwiaWF0IjoxNzQ5OTIwNzE5fQ.B0cVLTP-_4st-EhKa1NLKKCPNSU35WzftdIcFZjvexI`
        },
        body: JSON.stringify({
          sessionId,
          message,
          refId: refId || currentRefId,
          stepId: stepId || currentStepId
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: BackendResponse = await response.json();

      //console.log("data => ",data);
      
      // Atualizar o refId para próximas chamadas
      setCurrentRefId(data.refId || 1);
      setCurrentStepId(data.stepId || 1);
      
      // Verificar se há array de messages para processar
      if (data.messages && Array.isArray(data.messages)) {
        await processMessagesArray(data.messages);
      } else {
        // Adicionar resposta do bot (comportamento original)
        addBotMessage({
          type: data.type,
          content: formatBackendResponse(data)
        });
      }

      // Se o tipo for TEXT, chamar o endpoint novamente
      if (data.type === 'TEXT') {
        await sendMessageToBackend(data.message || '', data.refId, data.stepId);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      addBotMessage({
        type: 'TEXT',
        content: 'Desculpe, ocorreu um erro. Tente novamente.'
      });
    } finally {
      setIsTyping(false);
    }
  };

  const processMessagesArray = async (messages: string[]) => {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Adicionar mensagem à fila
      const newMessage: Message = {
        id: `${Date.now()}-${i}`,
        type: 'TEXT',
        content: message,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessageQueue(prev => [...prev, newMessage]);
      
      // Aguardar um delay aleatório entre 1 e 4 segundos antes da próxima mensagem
      // Exceto na última mensagem
      if (i < messages.length - 1) {
        const randomDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 segundos
        await new Promise(resolve => setTimeout(resolve, randomDelay));
      }
    }
  };

  const formatBackendResponse = (data: BackendResponse): MessageContent => {
    switch (data.type) {
      case 'TEXT':
        return data.message || '';
      case 'BUTTON':
        return {
          text: data.message || '',
          buttons: data.buttons || []
        };
      case 'SELECT':
        return {
          text: data.message || '',
          options: data.options || []
        };
      case 'CAROUSEL':
        return {
          items: data.items || []
        };
      case 'FEEDBACK':
        return {
          text: data.message || '',
          feedbackId: data.id?.toString() || ''
        };
      case 'INPUT':
        return data.message || '';
      default:
        return data.message || '';
    }
  };

  const addBotMessage = (content: { type: Message['type']; content: MessageContent }) => {
    // Don't add message if type is INPUT
    if (content.type === 'INPUT') {
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: content.type,
      content: content.content,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessageQueue(prev => [...prev, newMessage]);
  };

  const addUserMessage = (content: MessageContent, type: Message['type'] = 'TEXT') => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      content,
      sender: 'user',
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      const messageToSend = inputValue;
      setInputValue("");
      
      // Enviar para o backend
      sendMessageToBackend(messageToSend);
    }
  };

  const handleButtonClick = (action: string) => {
    addUserMessage(`Clicou em: ${action}`, 'TEXT');
    sendMessageToBackend(action);
  };

  const handleSelectChange = (value: string) => {
    addUserMessage(`Selecionou: ${value}`, 'TEXT');
    sendMessageToBackend(value);
  };

  const handleFileUpload = (file: File) => {
    addUserMessage({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    }, 'FILE');
    
    setShowFileUpload(false);
    
    // Enviar informação do arquivo para o backend
    sendMessageToBackend(`Arquivo enviado: ${file.name}`);
  };

  const handleFeedback = (rating: number, feedbackId: string) => {
    addUserMessage(`Avaliação: ${rating} estrelas`, 'TEXT');
    // Converter feedbackId string para number
    const feedbackIdNumber = parseInt(feedbackId, 10);
    sendMessageToBackend(`Feedback: ${rating}`, feedbackIdNumber);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 transition-all duration-300",
          "bg-blue-600 hover:bg-blue-700 text-white",
          isOpen && "rotate-180"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </Button>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-40 transition-all duration-300",
        "border border-gray-200",
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      )}>
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <h3 className="font-semibold">Assistente Virtual</h3>
              <p className="text-blue-100 text-sm">Online agora</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 h-80 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onButtonClick={handleButtonClick}
              onSelectChange={handleSelectChange}
              onFeedback={handleFeedback}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="flex-shrink-0"
              disabled={isConversationFinished}
            >
              <Paperclip size={16} />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isConversationFinished ? "Conversa finalizada" : "Digite sua mensagem..."}
              onKeyPress={(e) => e.key === 'Enter' && !isConversationFinished && handleSendMessage()}
              className="flex-1"
              disabled={isConversationFinished}
            />
            <Button 
              onClick={handleSendMessage} 
              size="sm" 
              className="flex-shrink-0"
              disabled={isConversationFinished}
            >
              <Send size={16} />
            </Button>
          </div>
          
          {showFileUpload && !isConversationFinished && (
            <div className="mt-2">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
