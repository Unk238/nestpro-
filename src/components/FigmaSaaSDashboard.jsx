import React, { useState } from 'react';
import { 
  Building2, Users, ShieldCheck, AlertCircle, KeyRound, 
  TrendingUp, TrendingDown, PhoneCall, CheckCircle2, Clock, DollarSign, 
  Layers, Plus, ArrowRight, RefreshCw, MessageSquare, Sparkles, Activity,
  Search, Bell, ChevronDown, MoreVertical, Filter, Download, LayoutGrid, Calendar,
  ArrowUpRight, ArrowDownRight, Home, CreditCard, BarChart3, Settings, Send, User, Bot, HelpCircle
} from 'lucide-react';

import ResidentLedger from './ResidentLedger';
import RoomsManager from './RoomsManager';
import PaymentsLedger from './PaymentsLedger';
import AiReceptionistSuite from './AiReceptionistSuite';
import ComplaintsKanban from './ComplaintsKanban';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import WhatsAppAutomation from './WhatsAppAutomation';

export default function FigmaSaaSDashboard({ onOpenCheckInToken }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'user', text: 'Show me vacant rooms', time: '10:42 AM' },
    { 
      sender: 'ai', 
      text: `3 rooms are currently vacant and ready for check-in:

• Room 102 — Standard, Floor 1
• Room 205 — Deluxe, Floor 2
• Room 306 — Deluxe, Floor 3

Would you like to assign a guest to one of these rooms or generate a QR check-in link?`, 
      time: '10:42 AM' 
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleSendChat = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || aiLoading) return;

    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setAiLoading(true);

    setTimeout(() => {
      let aiReply = "I have checked the database. Occupancy is currently at 89% with 4 vacant beds available across Floor 1 and Floor 2.";
      if (text.toLowerCase().includes('revenue') || text.toLowerCase().includes('payment')) {
        aiReply = "Total collection for this month is ₹67.4K with ₹14.5K pending rent auto-reminders scheduled.";
      } else if (text.toLowerCase().includes('complaint')) {
        aiReply = "There are 2 open complaints logged: Room 101 AC leak (Critical) and Floor 2 WiFi router reset.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setAiLoading(false);
    }, 600);
  };

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'var(--font-sans)', display: 'flex' }}>
      
      {/* 1. EXACT FIGMA LEFT SIDEBAR */}
      <aside style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          {/* Logo Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingLeft: '4px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
            }}>
              <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>
                NestPro OS
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                NestPro Grand
              </div>
            </div>
          </div>

          {/* MENU Section Label */}
          <div style={{ fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', padding: '0 10px 8px 10px', letterSpacing: '0.08em' }}>
            MENU
          </div>

          {/* Sidebar Menu Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'Dashboard', label: 'Dashboard', icon: LayoutGrid, count: null },
              { id: 'Residents', label: 'Residents', icon: Users, count: null },
              { id: 'Rooms', label: 'Rooms', icon: Home, count: null },
              { id: 'Payments', label: 'Payments', icon: CreditCard, count: null },
              { id: 'AI Receptionist', label: 'AI Receptionist', icon: Sparkles, count: null },
              { id: 'Complaints', label: 'Complaints', icon: MessageSquare, count: 2 },
              { id: 'WhatsApp Automation', label: 'WhatsApp Suite', icon: Send, count: null },
              { id: 'Analytics', label: 'Analytics', icon: BarChart3, count: null },
              { id: 'Settings', label: 'Settings', icon: Settings, count: null }
            ].map(item => {
              const isActive = activeMenu === item.id;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#475569',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {item.count && (
                    <span style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.count}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#6366f1',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0f172a' }}>Amit Kapoor</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Owner</div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CANVAS WITH MULTI-PAGE SUB-ROUTING */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* TOP BREADCRUMB & HEADER BAR */}
        <header style={{
          height: '64px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Breadcrumb Navigation */}
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>NestPro OS</span>
            <span>/</span>
            <strong style={{ color: '#0f172a', fontWeight: 800 }}>{activeMenu}</strong>
          </div>

          {/* Central Search Bar */}
          <div style={{ position: 'relative', width: '360px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search rooms, guests, invoices..."
              style={{
                width: '100%',
                padding: '8px 40px 8px 36px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '0.825rem',
                color: '#0f172a',
                outline: 'none'
              }}
            />
            <span style={{
              position: 'absolute',
              right: '10px',
              top: '7px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#94a3b8',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '1px 6px',
              borderRadius: '4px'
            }}>⌘K</span>
          </div>

          {/* Right Header Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1px solid #bbf7d0',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span className="pulse-dot"></span> AI Online
            </div>

            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#64748b" />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 800,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>3</span>
            </div>

            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#6366f1',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              A
            </div>
          </div>
        </header>

        {/* DYNAMIC MULTI-PAGE SUB-ROUTING */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          
          {activeMenu === 'Dashboard' && (
            <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
              {/* LEFT 2-COLUMNS: METRIC CARDS & CHARTS */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
                
                {/* 3 TOP METRIC CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                  
                  {/* Card 1: Check-ins Today */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Check-ins Today</span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', cursor: 'pointer' }}>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', lineHeight: '1' }}>4</div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#16a34a', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingUp size={14} /> 2 more expected tonight
                    </div>
                  </div>

                  {/* Card 2: Vacant Rooms */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Vacant Rooms</span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <Home size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', lineHeight: '1' }}>4</div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#ef4444', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingDown size={14} /> 2 under maintenance
                    </div>
                  </div>

                  {/* Card 3: Open Complaints */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Open Complaints</span>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                        <MessageSquare size={16} />
                      </div>
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', lineHeight: '1' }}>2</div>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#ef4444', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingDown size={14} /> 1 critical · needs review
                    </div>
                  </div>

                </div>

                {/* CHARTS ROW */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  
                  {/* Revenue Trend */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Revenue Trend</h4>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly performance - 2026</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>₹67.4K</div>
                        <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px' }}>
                          ↗ Aug
                        </span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: '160px', marginTop: '10px' }}>
                      <svg width="100%" height="130" viewBox="0 0 300 120" preserveAspectRatio="none">
                        <path d="M0 80 Q 50 40, 100 60 T 200 45 T 300 15" fill="none" stroke="#2563eb" strokeWidth="3" />
                      </svg>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#94a3b8', marginTop: '8px' }}>
                        <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy This Week */}
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Occupancy This Week</h4>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Daily fill rate</div>
                      </div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '9999px' }}>
                        Avg 89%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', paddingTop: '10px' }}>
                      {[
                        { day: 'Mon', height: '75%' },
                        { day: 'Tue', height: '80%' },
                        { day: 'Wed', height: '88%' },
                        { day: 'Thu', height: '72%' },
                        { day: 'Fri', height: '92%' },
                        { day: 'Sat', height: '100%' },
                        { day: 'Sun', height: '85%' }
                      ].map((bar, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                          <div style={{ width: '24px', height: bar.height, background: '#10b981', borderRadius: '6px 6px 0 0' }} />
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT AI CHAT PANEL */}
              <div style={{ width: '360px', flexShrink: 0 }}>
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', height: '560px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Sparkles size={18} color="#2563eb" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>AI Receptionist</div>
                        <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>• Online · GPT-4o</div>
                      </div>
                    </div>
                    <span style={{ background: '#f3e8ff', color: '#7c3aed', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>Beta</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                        <div style={{
                          display: 'inline-block',
                          maxWidth: '90%',
                          padding: '12px 14px',
                          borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: msg.sender === 'user' ? '#2563eb' : '#f8fafc',
                          color: msg.sender === 'user' ? '#ffffff' : '#0f172a',
                          border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                          fontSize: '0.825rem',
                          lineHeight: '1.5',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {msg.text}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '3px' }}>{msg.time}</div>
                      </div>
                    ))}
                    {aiLoading && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>AI Receptionist thinking...</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '10px 0', borderTop: '1px solid #f1f5f9' }}>
                    {['Vacant rooms', "Today's revenue", 'Pending payments', 'Complaints'].map(chip => (
                      <button key={chip} onClick={() => handleSendChat(chip)} style={{ padding: '4px 10px', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '0.7rem', color: '#475569', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {chip}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSendChat(); }} style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input type="text" placeholder="Ask the AI anything..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.825rem', outline: 'none' }} />
                    <button type="submit" disabled={!inputMsg.trim() || aiLoading} style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#2563eb', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Residents' && <ResidentLedger />}

          {activeMenu === 'Rooms' && <RoomsManager />}

          {activeMenu === 'Payments' && <PaymentsLedger />}

          {activeMenu === 'AI Receptionist' && <AiReceptionistSuite onOpenCheckInToken={onOpenCheckInToken} />}

          {activeMenu === 'Complaints' && <ComplaintsKanban />}

          {activeMenu === 'WhatsApp Automation' && <WhatsAppAutomation />}

          {activeMenu === 'Analytics' && <AnalyticsView />}

          {activeMenu === 'Settings' && <SettingsView />}

        </div>

      </div>

    </div>
  );
}
