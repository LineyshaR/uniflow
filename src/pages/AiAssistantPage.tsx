import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user?.name?.split(' ')[0] || 'Student'}! 👋 I'm your UniFlow AI Academic & Student Life Advisor.\n\nI can help you with course syllabi, attendance requirements, canteen recommendations, exam guidelines, or campus grievance procedures. What can I help you with today?`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'What attendance is mandatory for mid-sems?',
    'What are today\'s best food court specials?',
    'How do I request an official Bonafide Certificate?',
    'Explain Producer-Consumer problem in OS Lab 4',
    'When does the CodeStorm Hackathon start?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (presetQuery?: string) => {
    const textToSend = presetQuery || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!presetQuery) setInput('');
    setIsLoading(true);

    // Knowledge-base campus response generation
    setTimeout(() => {
      let reply = '';
      const q = textToSend.toLowerCase();

      if (q.includes('attendance') || q.includes('mandatory') || q.includes('shortage')) {
        reply = `**University Attendance Regulations (Academic Council Rule 4.2):**\n\n- Minimum overall attendance required is **75.0%** to be eligible to sit for Mid-Semester and End-Semester exams.\n- If your attendance is between **65% and 74.9%**, a medical certificate verified by the Campus Health Centre or prior Dean approval is mandatory.\n- Your current attendance is **${user?.attendanceOverall || 88.5}%**, which is safely above the threshold!`;
      } else if (q.includes('canteen') || q.includes('food') || q.includes('special') || q.includes('eat') || q.includes('breakfast')) {
        reply = `**Canteen Recommendations at Central Food Court:**\n\n- **Chef's Pick:** Paneer Butter Masala Thali (₹130) or Crispy Masala Dosa with Sambar (₹65)\n- **Quick Study Fuel:** Cold Coffee with Choco Fudge (₹55) or Grilled Chicken Sub (₹110)\n- You currently have **₹${user?.walletBalance ?? 0}** in your Campus Wallet. You can place your order from the Canteen tab to skip the line!`;
      } else if (q.includes('bonafide') || q.includes('certificate') || q.includes('document') || q.includes('noc')) {
        reply = `**How to Request Official Campus Documents:**\n\n1. Head over to the **Document Portal** from the left navigation.\n2. Click "Request New Document" and select **Bonafide Certificate** or **NOC**.\n3. Mention your reason (Passport, Visa, Education Loan, or Internship).\n4. Processing takes 24-48 hours and you will receive a digitally signed PDF with official university watermark.`;
      } else if (q.includes('os') || q.includes('producer') || q.includes('consumer') || q.includes('semaphore') || q.includes('lab 4')) {
        reply = `**Operating Systems (CS501) - Lab 4 Guide:**\n\nIn the Producer-Consumer problem:\n- Use **3 semaphores**:\n  1. \`sem_t empty\` initialized to buffer size $N$\n  2. \`sem_t full\` initialized to $0$\n  3. \`pthread_mutex_t mutex\` for critical section lock\n- Make sure the producer calls \`sem_wait(&empty)\` before locking the mutex to prevent deadlocks!\n- Dr. Rao expects clean POSIX compilation without gcc warnings.`;
      } else if (q.includes('hackathon') || q.includes('codestorm') || q.includes('event')) {
        reply = `**CodeStorm 2026 Details:**\n\n- **Dates:** October 17 - 19, 2026 (36 Hours)\n- **Venue:** Campus Innovation Center & Labs\n- **Prizes:** $10,000 cash pool + Cloud GPU credits\n- You can RSVP and download your digital entry pass from the **Events & Fests** section!`;
      } else {
        reply = `Here is what I found in the UniFlow university database regarding "${textToSend}":\n\n- For academic schedules and syllabus topics, please check the **Academics** tab.\n- For official administrative decisions, see the verified circulars in **Campus Notices**.\n- Need personal assistance? Dr. Vikramaditya Rao holds office consultation hours on Tuesdays & Thursdays from 3:30 PM to 4:30 PM in Faculty Block Room 402.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] text-xs font-semibold font-mono border border-[#047857]/20">
              UNIFLOW AI ADVISOR
            </span>
            <span className="text-xs text-[#526059] dark:text-[#94A3B8]">• 24/7 Academic Support</span>
          </div>
          <h1 className="font-apple text-2xl font-bold text-[#141B18] dark:text-[#F3F7F5] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#047857] dark:text-[#34D399]" />
            UniFlow Campus AI Companion
          </h1>
          <p className="text-xs text-[#526059] dark:text-[#94A3B8]">
            Instant institutional guidance on regulations, syllabus, labs, food court, and procedures.
          </p>
        </div>

        <div className="hidden sm:block">
          <BrandLogo size="sm" subtitle="AI Intelligence" />
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1B14] border border-[#047857]/20 shadow-2xs flex flex-col h-[580px] overflow-hidden">
        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F6F8F6]/60 dark:bg-[#07130E]/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-[#047857] text-white shadow-2xs'
                    : 'bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] dark:text-[#34D399] border border-[#047857]/20'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-[#047857] text-white rounded-tr-xs'
                    : 'bg-white dark:bg-[#0E281E] text-[#141B18] dark:text-[#F3F7F5] border border-black/[0.06] dark:border-white/[0.08] rounded-tl-xs whitespace-pre-wrap'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 ${
                    m.sender === 'user' ? 'text-white/70 text-right' : 'text-[#526059] dark:text-[#94A3B8]'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] dark:bg-[#062318] text-[#047857] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-3xl bg-white dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[#526059] dark:text-[#94A3B8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#047857] animate-ping" />
                <span>Consulting UniFlow database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-white dark:bg-[#0B1B14] border-t border-black/[0.06] dark:border-white/[0.08] overflow-x-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#047857] dark:text-[#34D399] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-[#047857] dark:text-[#34D399]" /> Prompts:
          </span>
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="px-3.5 py-1.5 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] hover:bg-[#E2E8E4] border border-black/[0.04] dark:border-white/[0.06] text-[#047857] dark:text-[#F3F7F5] text-xs font-medium transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-[#0B1B14] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask UniFlow about syllabus, attendance, canteen specials, lab assignments, or fests..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 p-2.5 px-4 rounded-full bg-[#F6F8F6] dark:bg-[#0E281E] border border-black/[0.06] dark:border-white/[0.08] text-xs sm:text-sm text-[#141B18] dark:text-[#F3F7F5] placeholder:text-[#526059] focus:outline-none focus:ring-2 focus:ring-[#047857]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-full bg-[#047857] hover:bg-[#065F46] disabled:opacity-50 text-white font-bold transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
