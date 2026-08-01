import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, Wrench, ShieldAlert, CheckCircle2, 
  ArrowRight, PhoneCall, Mic, Volume2, Activity, Clock, Database, 
  BookOpen, Sliders, AlertTriangle, RefreshCw, FileText 
} from 'lucide-react';

export default function AiReceptionist({ onOpenCheckInToken }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Namaste! 👋 I am **NestPro's 24/7 AI Receptionist & Voice Dispatcher**.\n\nI can check live bed vacancies (\`get_vacancy_status\`), issue digital check-in links (\`generate_checkin_link\`), answer house rules, or log maintenance tickets (\`create_complaint\`).\n\nHow may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'voice', 'knowledge', 'logs'
  const chatEndRef = useRef(null);

  // Live Stats Bar State
  const [stats, setStats] = useState({
    totalInquiries: 148,
    aiResolutionRate: '94.2%',
    avgLatency: '120ms',
    activeCalls: 2
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (msgToSend) => {
    const text = msgToSend || inputMsg;
    if (!text.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!msgToSend) setInputMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          propertyId: 101,
          guestContext: { guestId: 108, phone: '+91 98765 43210' }
        })
      });
      const data = await res.json();

      const aiMessage = {
        sender: 'ai',
        text: data.reply || 'Processing request...',
        actionTaken: data.actionTaken,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
      setStats(prev => ({ ...prev, totalInquiries: prev.totalInquiries + 1 }));
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Unable to connect to NestPro AI Receptionist engine.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const extractCheckinToken = (text) => {
    const match = text.match(/\/checkin\/([a-zA-Z0-9-]+)/);
    return match ? match[1] : null;
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '32px auto', padding: '0 20px' }}>
      
      {/* FIGMA REDESIGNED AI RECEPTIONIST HEADER & LIVE STATS BAR */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(168, 85, 247, 0.45)'
          }}>
            <Bot size={28} color="#fff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                NestPro AI Receptionist Suite
              </h2>
              <span className="badge badge-purple">GEMINI 2.5 FLASH</span>
              <span className="badge badge-emerald"><span className="pulse-dot"></span> 24/7 ACTIVE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Automated Walk-In Inquiries • Function Calling • Voice Calls • Complaint Dispatch
            </p>
          </div>
        </div>

        {/* Live System Performance KPI Bar */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Inquiries Today</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a5b4fc' }}>{stats.totalInquiries}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>AI Resolution</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stats.aiResolutionRate}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Avg Latency</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.avgLatency}</div>
          </div>
        </div>

      </div>

      {/* WORKSPACE NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'chat' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'chat' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Bot size={16} /> 24/7 Virtual Front Desk Chat
        </button>

        <button
          onClick={() => setActiveTab('voice')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'voice' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'voice' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Mic size={16} color="var(--accent-cyan)" /> AI Voice Call Dispatcher
        </button>

        <button
          onClick={() => setActiveTab('knowledge')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'knowledge' ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
            color: activeTab === 'knowledge' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <BookOpen size={16} color="var(--accent-purple)" /> Knowledge Base Rules
        </button>
      </div>

      {/* TAB 1: DUAL-PANE AI WORKSTATION (CHAT + LIVE TOOL INSPECTOR) */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
          
          {/* LEFT PANE: LIVE CHAT ENGINE */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '580px', overflow: 'hidden' }}>
            
            {/* Messages Stream */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, index) => {
                const tokenFound = msg.sender === 'ai' ? extractCheckinToken(msg.text) : null;

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {msg.sender === 'ai' && (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Bot size={20} color="#fff" />
                      </div>
                    )}

                    <div style={{ maxWidth: '80%' }}>
                      {/* Action Taken Tool Banner */}
                      {msg.actionTaken && (
                        <div style={{
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.35)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontFamily: 'var(--font-mono)',
                          color: '#c084fc',
                          marginBottom: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Wrench size={14} color="#c084fc" />
                          <span>Executed Tool: <strong>{msg.actionTaken.toolName}()</strong></span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div style={{
                        background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.04)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                        padding: '14px 18px',
                        borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        color: '#fff',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {msg.text}

                        {tokenFound && (
                          <div style={{ marginTop: '16px' }}>
                            <button
                              onClick={() => onOpenCheckInToken(tokenFound)}
                              className="btn-primary"
                              style={{
                                width: '100%',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              }}
                            >
                              <Sparkles size={16} /> Open Self Check-In Portal ({tokenFound}) <ArrowRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <User size={20} color="#fff" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="#fff" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px 18px', borderRadius: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    AI Receptionist reasoning & invoking tool calling functions...
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
              <button onClick={() => handleSendMessage('Check double sharing bed vacancy status')} style={{ padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)', color: '#c7d2fe', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                🏠 get_vacancy_status
              </button>
              <button onClick={() => handleSendMessage('Generate a self check-in link for a new resident')} style={{ padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)', color: '#c7d2fe', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                🔗 generate_checkin_link
              </button>
              <button onClick={() => handleSendMessage('Log a maintenance complaint about AC leaking in Room 101')} style={{ padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)', color: '#c7d2fe', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                🛠️ create_complaint
              </button>
              <button onClick={() => handleSendMessage('Check my resident status and rent details')} style={{ padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.04)', color: '#c7d2fe', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                👤 get_guest_details
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ padding: '16px 20px', background: 'rgba(9, 13, 22, 0.95)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Ask AI Receptionist about vacancies, rules, checkin links, or complaints..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                style={{ flex: 1, padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" disabled={loading || !inputMsg.trim()} className="btn-primary" style={{ padding: '12px 20px' }}>
                <Send size={18} />
              </button>
            </form>

          </div>

          {/* RIGHT PANE: REAL-TIME AI TOOL CALLING & KNOWLEDGE INSPECTOR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Tool Execution Inspector Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={16} color="var(--accent-purple)" /> Real-Time Tool Inspector
                </h4>
                <span className="badge badge-purple">LIVE DRIZZLE ORM</span>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.2)', minHeight: '140px' }}>
                {messages[messages.length - 1]?.actionTaken ? (
                  <div>
                    <div style={{ color: '#34d399', fontWeight: 700 }}>✓ Tool Executed: {messages[messages.length - 1].actionTaken.toolName}()</div>
                    <div style={{ color: '#94a3b8', marginTop: '6px' }}>Params: {JSON.stringify(messages[messages.length - 1].actionTaken.parameters)}</div>
                    <div style={{ color: '#a5b4fc', marginTop: '6px' }}>Result: {JSON.stringify(messages[messages.length - 1].actionTaken.result)}</div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', paddingTop: '40px', textAlign: 'center' }}>
                    Waiting for next function call execution...
                  </div>
                )}
              </div>
            </div>

            {/* Knowledge Base Rules Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} color="var(--accent-cyan)" /> Knowledge Base Vector Rules
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#fff' }}>Curfew Policy:</strong> Main gate locks auto at 10:30 PM.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#fff' }}>Visitor Policy:</strong> Day visitors 9 AM - 8 PM only.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: '#fff' }}>Meal Timings:</strong> Breakfast 7:30-9:30 AM, Dinner 8-10 PM.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: AI VOICE CALL DISPATCHER */}
      {activeTab === 'voice' && (
        <div className="glass-panel-glow" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="badge badge-purple" style={{ marginBottom: '16px', padding: '6px 16px' }}>
            🎙️ AI VOICE CALL DISPATCHER
          </div>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '10px' }}>
            24/7 AI Voice Phone Receptionist
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
            Answers incoming walk-in phone calls, checks room availability live over voice stream, and sends instant check-in links to callers over WhatsApp.
          </p>

          {/* Voice Call Simulator Sphere */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: voiceActive ? 'radial-gradient(circle, #a855f7 0%, #6366f1 100%)' : 'rgba(255,255,255,0.05)',
            border: '2px solid var(--primary)',
            boxShadow: voiceActive ? '0 0 40px rgba(168, 85, 247, 0.8)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px auto',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} onClick={() => setVoiceActive(!voiceActive)}>
            <Mic size={48} color="#fff" />
          </div>

          <button
            className="btn-primary"
            onClick={() => setVoiceActive(!voiceActive)}
            style={{ padding: '14px 28px', background: voiceActive ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)' }}
          >
            <PhoneCall size={18} /> {voiceActive ? 'End AI Voice Call' : 'Simulate AI Phone Call Dispatch'}
          </button>
        </div>
      )}

      {/* TAB 3: KNOWLEDGE BASE RULES CONFIGURATOR */}
      {activeTab === 'knowledge' && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            AI Knowledge Base & Guardrail Policies
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Configure system prompt guardrails, house rules, and privacy bounds enforced by the AI Receptionist.
          </p>

          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>✓ Privacy Guardrail Rule #3</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                NEVER disclose full government ID numbers (Aadhaar/Passport) or emergency contacts of other guests under any circumstances.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '16px 20px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>✓ Complaint Routing Rule #4</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                When guest reports maintenance/cleanliness/food issues, automatically invoke `create_complaint` and log into 5-stage Kanban board.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
