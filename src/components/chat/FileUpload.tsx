
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, FileText, Video } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const triggerFileSelect = (accept?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept || "*/*";
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerFileSelect("image/*")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Image size={16} />
          <span className="text-xs">Imagem</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerFileSelect(".pdf,.doc,.docx,.txt")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <FileText size={16} />
          <span className="text-xs">Documento</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerFileSelect("video/*")}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Video size={16} />
          <span className="text-xs">Vídeo</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => triggerFileSelect()}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Upload size={16} />
          <span className="text-xs">Qualquer</span>
        </Button>
      </div>
    </div>
  );
};
