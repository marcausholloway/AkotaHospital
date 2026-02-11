
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Specialty } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIChatbot: React.FC<{ onSpecialtySelect: (s: Specialty) => void }> = ({ onSpecialtySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your HealPoint Assistant. Describe your symptoms, and I can suggest the right specialist for you.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful hospital triage assistant. 
        A patient says: "${userMessage}". 
        Based on these symptoms, identify which medical specialty they likely need. 
        Available specialties are: Cardiologist, Dermatologist, Pediatrician, Orthopedic Surgeon, Neurologist, General Physician.
        Respond with a friendly recommendation and EXPLICITLY mention the name of the specialty in your response. 
        Keep it concise (max 2 sentences). Include a disclaimer that you are an AI and not a doctor.`,
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check your network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 text-black">
          <div className="bg-[#1e6db2] p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-robot"></i>
              <span className="font-bold">Health Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)}><i className="fa-solid fa-xmark"></i></button>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-[#1e6db2] text-white rounded-tr-none shadow-sm' : 'bg-white text-black shadow-sm rounded-tl-none border border-gray-100 font-medium'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 animate-pulse text-gray-500 text-xs font-bold">
                  Assistant is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type symptoms..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-500"
            />
            <button 
              onClick={handleSend}
              className="bg-[#1e6db2] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#1e6db2] text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all hover:rotate-12 active:scale-95 group"
        >
          <i className="fa-solid fa-comment-medical text-2xl group-hover:animate-bounce"></i>
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white font-bold">AI</span>
        </button>
      )}
    </div>
  );
};
