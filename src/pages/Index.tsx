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
      subtitle: "of using Enzonic AI?",
    },
    {
      title: "Write code to",
      subtitle: "implement a binary search tree",
    },
    {
      title: "Help me write an essay",
      subtitle: "about artificial intelligence",
    },
    {
      title: "What is the future",
      subtitle: "of machine learning?",
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

    recognitionRef.current = new webkitSpeechRecognition();
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
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-col flex-1 max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Enzonic AI</h1>
          <Button variant="outline" size="sm">
            Deploy with Vercel
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="grid grid-cols-2 gap-4 p-4">
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

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Send a message..."
            className="flex-1"
          />
          <Button
            size="icon"
            variant="outline"
            onClick={toggleListening}
            className={isListening ? "bg-primary text-primary-foreground" : ""}
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>
          <Button size="icon" onClick={handleSend}>
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;