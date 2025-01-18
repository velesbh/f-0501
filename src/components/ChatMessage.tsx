import { cn } from "@/lib/utils";
import { MessageActions } from "./MessageActions";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export function ChatMessage({ message, isUser = false }: ChatMessageProps) {
  const formatMessage = (text: string) => {
    // Basic markdown-style formatting
    return text
      .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
      .replace(/:([\w+-]+):/g, (match, emoji) => `${emoji}`); // You might want to use an emoji library here
  };

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
        isUser ? "bg-[#18181B]" : "bg-[#18181B]"
      )}>
        <div dangerouslySetInnerHTML={{ __html: formatMessage(message) }} />
        {!isUser && <MessageActions message={message} />}
      </div>
    </div>
  );
}