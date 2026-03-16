import { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import { SparklesIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about your events 👋' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    setQuestion('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/ask', { question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I didn't understand that. Please try rephrasing your question."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-12'
            : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110'
        }`}
      >
        {isOpen
          ? <XMarkIcon className="w-6 h-6 text-white" />
          : <SparklesIcon className="w-6 h-6 text-white" />
        }
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          style={{ height: '480px' }}
        >
          {/* Header */}
          <div className="p-5 bg-indigo-600 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm">AI Assistant</h3>
              <p className="text-indigo-200 text-xs">Ask about your events</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleAsk} className="p-4 border-t border-slate-100 flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-400 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}