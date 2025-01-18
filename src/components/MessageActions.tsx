import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Speaker, Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MessageActionsProps {
  message: string;
}

export function MessageActions({ message }: MessageActionsProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    toast({
      description: "Message copied to clipboard",
    });
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSpeak}>
        <Speaker className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}