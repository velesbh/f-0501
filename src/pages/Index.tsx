import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { ExampleQuestion } from "@/components/ExampleQuestion";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const exampleQuestions = [
    {
      title: "What are the advantages",
      subtitle: "of using Next.js?",
    },
    {
      title: "Write code to",
      subtitle: "demonstrate dijkstra's algorithm",
    },
    {
      title: "Help me write an essay",
      subtitle: "about silicon valley",
    },
    {
      title: "What is the weather",
      subtitle: "in San Francisco?",
    },
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    // Simulate AI response - in a real app, you'd call your API here
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "Thanks for your message! This is a demo response from Enzonic AI.", 
        isUser: false 
      }]);
    }, 1000);
    
    setInput("");
  };

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

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A]">
      <div className="flex items-center justify-between p-3 border-b border-[#27272A]">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium">Chatbot</h1>
          <Button variant="outline" size="icon" className="w-6 h-6">
            <span className="text-xs">+</span>
          </Button>
          <Button variant="outline" size="icon" className="w-6 h-6">
            <span className="text-xs">□</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-7 px-3 text-xs">
            GPT 4.0 mini
          </Button>
          <Button variant="outline" className="h-7 px-3 text-xs">
            Private
          </Button>
          <Button variant="outline" className="h-7 px-3 text-xs gap-1">
            <span className="text-xs">▲</span>
            Deploy with Vercel
          </Button>
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