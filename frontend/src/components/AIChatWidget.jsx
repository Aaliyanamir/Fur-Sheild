import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, User, ShieldCheck, Heart, AlertCircle, RefreshCw } from 'lucide-react';

const presetPrompts = [
  'What foods are toxic to dogs?',
  'How often should cats get vaccinated?',
  'What are early signs of pet heatstroke?',
  'Best diet tips for senior pets?'
];

const mockAiResponses = {
  toxic: "⚠️ Foods toxic to dogs and cats include chocolate, onions, garlic, grapes/raisins, xylitol (sweetener), caffeine, and macadamia nuts. If ingested, contact an emergency vet immediately!",
  vaccine: "💉 Core feline vaccines (FVRCP) are typically administered every 1-3 years depending on lifestyle. Rabies is required by law annually or every 3 years.",
  heatstroke: "🌡️ Symptoms of heatstroke include excessive panting, drooling, bright red gums, lethargy, and vomiting. Move your pet to a cool shade, apply lukewarm water to paws, and seek immediate vet care.",
  diet: "🥗 Senior pets benefit from high-digestibility protein, reduced calories, glucosamine for joint health, and Omega-3 fatty acids for cognitive and coat health.",
  default: "🐾 I am your FurShield AI Assistant! I recommend consulting your registered veterinarian for urgent medical concerns. How else can I assist with your pet's routine care today?"
};

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello! I am your FurShield AI Care Assistant 🐾. Ask me anything about pet nutrition, symptom alerts, or preventive health tips!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking & response
    setTimeout(() => {
      let responseText = mockAiResponses.default;
      const lower = text.toLowerCase();
      if (lower.includes('toxic') || lower.includes('food') || lower.includes('eat')) responseText = mockAiResponses.toxic;
      else if (lower.includes('vaccine') || lower.includes('booster') || lower.includes('shot')) responseText = mockAiResponses.vaccine;
      else if (lower.includes('heat') || lower.includes('stroke') || lower.includes('panting')) responseText = mockAiResponses.heatstroke;
      else if (lower.includes('diet') || lower.includes('senior') || lower.includes('nutrition')) responseText = mockAiResponses.diet;

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* FLOATING TRIGGER BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-brand-dark text-white p-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-brand-darker transition-all border-2 border-brand-sage/40 group"
          >
            <div className="relative">
              <Bot className="w-7 h-7 text-brand-sage group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-ping" />
            </div>
            <span className="font-extrabold text-xs tracking-wider pr-1 hidden sm:inline">
              FurShield AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT DRAWER / WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-dark p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md">
                  <Bot className="w-6 h-6 text-brand-sage" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                    FurShield AI Care Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-current" />
                  </h3>
                  <span className="text-[10px] text-emerald-200 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full inline-block" />
                    Online • AI Pet Health Advisor
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-bg-soft">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="bg-brand-dark text-white p-1.5 rounded-lg text-xs font-bold flex-shrink-0 mt-1">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-dark text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                  <div className="bg-brand-dark text-white p-1.5 rounded-lg text-[10px] font-bold">
                    AI
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {presetPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-bg-soft hover:bg-brand-light hover:text-brand-dark text-slate-600 text-[10px] font-bold rounded-lg whitespace-nowrap border border-slate-200 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask FurShield AI about pet care..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-bg-soft rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-dark"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-brand-dark hover:bg-brand-darker disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatWidget;
