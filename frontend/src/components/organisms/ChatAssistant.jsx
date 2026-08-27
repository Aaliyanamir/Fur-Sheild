import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi there! I am FurBot, your AI veterinary assistant. How can I help your pet today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Logic Engine
    setTimeout(() => {
      let aiResponseText = '';
      let linkAction = null;
      const lowerInput = userMsg.text.toLowerCase();

      // Rule 1: Emergency
      if (lowerInput.match(/vomit|diarrhea|blood|pain|emergency|hurt/)) {
        aiResponseText = "This sounds like a potential medical emergency. Please seek professional veterinary care immediately.";
        linkAction = { text: "Find a Vet Now", url: "/vet" };
      } 
      // Rule 2: Vaccines
      else if (lowerInput.match(/vaccine|shot|immunization/)) {
        aiResponseText = "Vaccinations are crucial! Puppies/kittens usually start shots at 6-8 weeks. Adult pets need annual or 3-year boosters depending on the vaccine. Would you like to check your pet's health records?";
        linkAction = { text: "View Health Records", url: "/dashboard" };
      }
      // Rule 3: Food
      else if (lowerInput.match(/food|diet|eat|hungry/)) {
        aiResponseText = "Nutrition is the foundation of health. Ensure you're feeding high-quality, life-stage appropriate food. Check out our curated selection in the shop!";
        linkAction = { text: "Browse Shop", url: "/shop" };
      }
      // Rule 4: Behavior
      else if (lowerInput.match(/bark|bite|chew|scratch|behavior/)) {
        aiResponseText = "Behavioral issues often stem from anxiety, boredom, or medical issues. Ensure your pet gets enough exercise. You can also read our Care Hub articles for training tips.";
        linkAction = { text: "Read Care Articles", url: "/care-hub" };
      }
      // Fallback
      else {
        aiResponseText = "I'm a learning AI and might not have the exact answer for that. For precise medical advice, I recommend consulting a verified vet on our platform.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiResponseText, link: linkAction }]);
      setIsTyping(false);
    }, 1200); // simulate network delay
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[90] w-16 h-16 rounded-full bg-camel-600 text-white shadow-2xl flex items-center justify-center hover:bg-camel-700 transition-colors ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={28} />
        {/* Unread dot simulation */}
        <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border-2 border-camel-600"></span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] w-[350px] md:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(90,56,37,0.2)] border border-camel-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-espresso-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                  <Bot size={20} className="text-camel-200" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-espresso-900"></span>
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-wide">FurShield AI</h3>
                  <p className="text-[10px] font-medium text-camel-200 uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-5 bg-[#FAF8F5] flex flex-col gap-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-camel-200 text-camel-900' : 'bg-espresso-100 text-espresso-700'}`}>
                      {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-camel-600 text-white rounded-br-sm shadow-sm' 
                        : 'bg-white text-espresso-800 border border-camel-100 rounded-bl-sm shadow-sm'
                    }`}>
                      {msg.text}
                      
                      {/* Action Link for AI */}
                      {msg.link && (
                        <button 
                          onClick={() => { setIsOpen(false); navigate(msg.link.url); }}
                          className="mt-3 w-full py-2 px-4 bg-camel-50 hover:bg-camel-100 text-camel-700 text-xs font-bold rounded-xl transition-colors text-center border border-camel-200"
                        >
                          {msg.link.text}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-espresso-100 text-espresso-700 flex items-center justify-center">
                      <Bot size={14} />
                    </div>
                    <div className="p-4 bg-white border border-camel-100 rounded-2xl rounded-bl-sm flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-camel-300 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-camel-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-camel-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-camel-100 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask FurBot anything..."
                  className="w-full bg-[#FAF8F5] border border-camel-200 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-camel-500 focus:ring-1 focus:ring-camel-500 transition-all"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2 w-8 h-8 bg-camel-600 hover:bg-camel-700 disabled:bg-camel-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                >
                  <Send size={14} className="-ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
