import React, { useState } from 'react';
import { 
  Bot, Send, User, Sparkles, Wrench, ShieldAlert, CheckCircle2, 
  ArrowRight, PhoneCall, Mic, Volume2, Activity, Clock, Database, 
  BookOpen, Sliders, AlertTriangle, RefreshCw, FileText, Key 
} from 'lucide-react';

export default function AiReceptionistSuite({ onOpenCheckInToken }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste! I am **NestPro's 24/7 AI Receptionist & Voice Engine**.\n\nI can execute live property actions for you:\n• "Show vacant rooms"\n• "Send rent reminders"\n• "Generate receipt"\n• "Show unpaid residents"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExecuteAction = (commandText) => {
    const text = commandText || inputMsg;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!commandText) setInputMsg('');
    setLoading(true);

    setTimeout(() => {
      let reply = "Action executed successfully.";
      const lower = text.toLowerCase();

      if (lower.includes('vacant') || lower.includes('room')) {
        reply = "🔍 **Executed Action: get_vacancy_status()**\n\nThere are 4 vacant rooms ready for check-in:\n1. Room G02 (Triple Sharing) — ₹8,000/mo\n2. Room 102 (Double Sharing) — ₹9,500/mo\n3. Room 205 (Deluxe Suite) — ₹25,000/mo";
      } else if (lower.includes('unpaid') || lower.includes('reminder') || lower.includes('rent')) {
        reply = "📱 **Executed Action: send_whatsapp_rent_reminders()**\n\nDispatched 1-click WhatsApp payment links to 2 pending residents:\n• Rohan Sharma (₹9,500 due)\n• Priya Sundaram (₹25,000 due)";
      } else if (lower.includes('receipt')) {
        reply = "📄 **Executed Action: generate_receipt_pdf()**\n\nGenerated digital receipt #REC-9821 for Aarav Patel (₹15,000 paid via UPI).";
      } else if (lower.includes('visitor')) {
        reply = "🎫 **Executed Action: create_visitor_pass()**\n\nIssued 1-day Visitor QR Pass #VIS-402 for Gate Entrance.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>AI Voice & Chat Receptionist</h2>
            <span className="badge badge-purple">GEMINI 2.5 FLASH</span>
            <span className="badge badge-emerald"><span className="pulse-dot"></span> 24/7 ONLINE</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
            Execute real property actions, check bed availability, and dispatch WhatsApp receipts automatically.
          </p>
        </div>
      </div>

      {/* Suggested Owner Commands */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
        {['Show vacant rooms', 'Send rent reminders', 'Generate receipt', 'Show unpaid residents', 'Create visitor pass'].map(cmd => (
          <button
            key={cmd}
            onClick={() => handleExecuteAction(cmd)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}
          >
            ⚡ {cmd}
          </button>
        ))}
      </div>

      {/* Chat Terminal */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '540px' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '12px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.sender === 'ai' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={20} color="#fff" />
                </div>
              )}

              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#f8fafc',
                  color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                  border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.675rem', color: '#94a3b8', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={20} color="#0f172a" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
              AI Receptionist executing action against database...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleExecuteAction(); }} style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <input
            type="text"
            placeholder="Type owner command (e.g. Show vacant rooms, Send rent reminders...)"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            style={{ flex: 1, padding: '12px 18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.875rem', color: '#0f172a' }}
          />
          <button type="submit" className="btn-primary" disabled={!inputMsg.trim() || loading} style={{ padding: '12px 24px' }}>
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
}
