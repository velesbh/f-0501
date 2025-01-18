import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { ExampleQuestion } from "@/components/ExampleQuestion";
import { Mic, MicOff, Send, Plus, Square, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useUser, SignInButton } from "@clerk/clerk-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const exampleQuestions = [
  {
    title: "What is Enzonic Flash?",
    subtitle: "Learn about our latest AI model",
  },
  {
    title: "How can I use Enzonic Flash?",
    subtitle: "Get started with basic instructions",
  },
  {
    title: "What are the key features?",
    subtitle: "Discover the capabilities",
  },
  {
    title: "Tell me about pricing",
    subtitle: "Learn about our pricing plans",
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [model, setModel] = useState("Enzonic Flash");
  const [isPrivate, setIsPrivate] = useState(true);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setInput(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error(event.error);
      stopListening();
    };

    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    if (!user && !isPrivate) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use public mode",
        variant: "destructive",
      });
      return;
    }
    
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! This is a demo response from Enzonic AI.", 
        isUser: false 
      }]);
    }, 1000);
    
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                {model}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setModel("Enzonic Flash")}>
                Enzonic Flash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            <Square className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="ghost"
              className="h-7 px-3 text-xs"
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? "Private" : "Public"}
            </Button>
          ) : (
            <SignInButton>
              <Button variant="ghost" className="h-7 px-3 text-xs">
                Sign in
              </Button>
            </SignInButton>
          )}
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-[40vh]">
            {exampleQuestions.map((q, i) => (
              <ExampleQuestion
                key={i}
                title={q.title}
                subtitle={q.subtitle}
                onClick={(question) => setInput(question)}
              />
            ))}
          </div>
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} message={msg.text} isUser={msg.isUser} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 max-w-2xl mx-auto w-full">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a message..."
            className="bg-[#18181B] border-0 focus-visible:ring-0 text-sm py-6"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleListening}
              className={`h-8 w-8 ${isListening ? "text-primary" : ""}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="ghost" onClick={handleSend} className="h-8 w-8">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;