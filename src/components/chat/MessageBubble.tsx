
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Message } from "./ChatWidget";
import { useState } from "react";

interface MessageBubbleProps {
  message: Message;
  onButtonClick?: (action: string) => void;
  onSelectChange?: (value: string) => void;
  onFeedback?: (rating: number, feedbackId: string) => void;
}

export const MessageBubble = ({ message, onButtonClick, onSelectChange, onFeedback }: MessageBubbleProps) => {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const isBot = message.sender === 'bot';

  const renderContent = () => {
    switch (message.type) {
      case 'TEXT':
        return <p className="whitespace-pre-wrap">{message.content}</p>;

      case 'BUTTON':
        return (
          <div className="space-y-3">
            <p>{message.content.text}</p>
            <div className="flex flex-wrap gap-2">
              {message.content.buttons?.map((button: any, idx: number) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => onButtonClick?.(button.action || button.text)}
                  className="text-xs"
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'SELECT':
        return (
          <div className="space-y-3">
            <p>{message.content.text}</p>
            <Select onValueChange={onSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {message.content.options?.map((option: any, idx: number) => (
                  <SelectItem key={idx} value={option.value || option.label}>
                    {option.label || option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'CAROUSEL':
        return (
          <div className="space-y-3">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {message.content.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex-shrink-0 w-48 bg-gray-50 rounded-lg overflow-hidden">
                  {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                    {item.price && <p className="font-bold text-green-600 mb-2">{item.price}</p>}
                    <div className="space-y-1">
                      {item.buttons?.map((button: any, btnIdx: number) => (
                        <Button
                          key={btnIdx}
                          variant="outline"
                          size="sm"
                          onClick={() => onButtonClick?.(button.action || button.text)}
                          className="w-full text-xs"
                        >
                          {button.text}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'FILE':
        return (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                📎
              </div>
              <div>
                <p className="font-medium text-sm">{message.content.fileName}</p>
                <p className="text-xs text-gray-500">
                  {(message.content.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        );

      case 'FEEDBACK':
        return (
          <div className="space-y-3">
            <p>{message.content.text}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => {
                    setSelectedRating(rating);
                    onFeedback?.(rating, message.content.feedbackId);
                  }}
                  className={cn(
                    "p-1 transition-colors",
                    selectedRating >= rating ? "text-yellow-400" : "text-gray-300"
                  )}
                >
                  <Star size={20} fill="currentColor" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <ThumbsUp size={14} className="mr-1" />
                Útil
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <ThumbsDown size={14} className="mr-1" />
                Não útil
              </Button>
            </div>
          </div>
        );

      default:
        return <p>{JSON.stringify(message.content)}</p>;
    }
  };

  return (
    <div className={cn(
      "flex",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-xs rounded-lg px-3 py-2 shadow-sm",
        isBot
          ? "bg-gray-100 text-gray-900"
          : "bg-blue-600 text-white"
      )}>
        {renderContent()}
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isBot ? "text-gray-500" : "text-blue-100"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
