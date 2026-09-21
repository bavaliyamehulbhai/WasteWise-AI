import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm WasteWise AI. Ask me anything about recycling, compost, or waste disposal!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiResponse = "I'm not exactly sure, but usually, clean and dry recyclables go in the blue bin! Try scanning it with the camera for a better result.";
      const query = userMessage.content.toLowerCase();

      if (query.includes("battery") || query.includes("batteries")) {
        aiResponse = "Batteries are considered E-Waste! They can spark fires if crushed. Please take them to a designated E-Waste drop-off or hazardous waste facility. Tape the terminals if they are lithium.";
      } else if (query.includes("plastic") || query.includes("bottle")) {
        aiResponse = "Most clean plastic bottles (PET #1, HDPE #2) are highly recyclable! Make sure to empty all liquids and rinse them out before tossing them in the blue bin.";
      } else if (query.includes("pizza") || query.includes("box")) {
        aiResponse = "If the pizza box is greasy or has cheese stuck to it, it goes in the COMPOST (green bin). If the top half is completely clean, you can tear it off and recycle the top!";
      } else if (query.includes("glass")) {
        aiResponse = "Glass bottles and jars are perfectly recyclable! Just empty them out and remove the lids (lids can usually be recycled separately). Do not recycle broken glass or mirrors in the standard bin.";
      } else if (query.includes("coffee") || query.includes("cup")) {
        aiResponse = "Disposable coffee cups usually have a thin plastic lining, meaning they belong in the trash. However, the cardboard sleeve can be recycled, and the plastic lid might be recyclable depending on your local rules!";
      }

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-[90] ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 w-[calc(100vw-32px)] md:w-96 h-[500px] max-h-[calc(100vh-120px)] bg-surface-card border border-border-default rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-[100] ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-default shrink-0 bg-brand text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">WasteWise AI</h3>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-page scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'bg-text-muted text-white' : 'bg-brand/20 text-brand'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-text-primary text-surface-card rounded-tr-sm' : 'bg-surface-card border border-border-default text-text-primary rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex gap-2 max-w-[85%] flex-row">
                <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-1 bg-brand/20 text-brand">
                  <Bot size={12} />
                </div>
                <div className="p-3 rounded-2xl bg-surface-card border border-border-default rounded-tl-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border-default shrink-0 bg-surface-card rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a recycling question..."
              className="flex-1 bg-surface-page border border-border-default rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-text-primary"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 shrink-0 bg-brand text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-hover transition-colors"
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
