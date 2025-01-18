import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
}

export function ChatMessage({ message, isUser = false }: ChatMessageProps) {
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
        {message}
      </div>
    </div>
  );
}