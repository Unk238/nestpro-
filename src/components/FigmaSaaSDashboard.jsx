import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, ShieldCheck, AlertCircle, KeyRound, 
  TrendingUp, TrendingDown, CheckCircle2, Clock, 
  Layers, ArrowRight, MessageSquare, Sparkles, Activity,
  Search, Bell, ChevronDown, MoreVertical, Download, Calendar,
  Home, CreditCard, BarChart3, Settings, Send, Bot,
  ArrowUpRight, LayoutGrid
} from 'lucide-react';

import ResidentLedger from './ResidentLedger';
import RoomsManager from './RoomsManager';
import PaymentsLedger from './PaymentsLedger';
import AiReceptionistSuite from './AiReceptionistSuite';
import ComplaintsKanban from './ComplaintsKanban';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import WhatsAppAutomation from './WhatsAppAutomation';

// ── Animated metric card ──────────────────────────────────────────────────────
function MetricCard({ label, value, trend, trendLabel, icon: Icon, iconBg, iconColor, accent }) {
  const [displayed, setDisplayed] = useState(0);
  const target = parseInt(String(value).replace(/[^0-9]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 28);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setDisplayed(start);
      if (start >= target) clearInterval(timer);
    }, 32);
    return () => clearInterval(timer);
  }, [target]);

  const displayValue = typeof value === 'string' && value.includes('₹')
    ? `₹${displayed.toLocaleString('en-IN')}`
    : String(value).includes('%')
    ? `${displayed}%`
    : displayed;

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1px solid #E2E8F0`,
        borderTop: `3px solid ${accent}`,
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6B7280', fontFamily: 'var(--font-sans)' }}>
          {label}
        </span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '9px',
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} color={iconColor} strokeWidth={2} />
        </div>
      </div>

      <div style={{
        fontSize: '1.875rem', fontWeight: 900,
        color: '#111827', lineHeight: 1,
        fontFamily: 'var(--font-sans)', letterSpacing: '-0.025em',
        marginBottom: '10px',
        animation: 'counter-up 0.4s ease'
      }}>
        {displayValue}
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '3px 8px', borderRadius: '5px',
        background: trend === 'up' ? '#F0FDF4' : '#FEF2F2',
        color: trend === 'up' ? '#166534' : '#991B1B',
        fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)'
      }}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trendLabel}
      </div>
    </div>
  );
}

export default function FigmaSaaSDashboard({ onOpenCheckInToken }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'user', text: 'Show me vacant rooms', time: '10:42 AM' },
    {
      sender: 'ai',
      text: `3 rooms are currently vacant and ready for check-in:\n\n• Room 102 — Standard, Floor 1\n• Room 205 — Deluxe, Floor 2\n• Room 306 — Deluxe, Floor 3\n\nShall I generate a QR check-in link?`,
      time: '10:42 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, aiLoading]);

  const handleSendChat = (textToSend) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || aiLoading) return;

    const userMsg = { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setAiLoading(true);

    setTimeout(() => {
      let aiReply = 'Occupancy is at 89% — 4 vacant beds across Floor 1 and Floor 2. Shall I assign one?';
      if (text.toLowerCase().includes('revenue') || text.toLowerCase().includes('payment'))
        aiReply = 'August collection: ₹67,400 received. ₹14,500 pending across 3 guests. Auto-reminder scheduled for tonight.';
      else if (text.toLowerCase().includes('complaint'))
        aiReply = '2 open complaints: Room 101 — AC leak (Critical), Floor 2 — WiFi router offline. Shall I escalate to maintenance?';
      else if (text.toLowerCase().includes('check') || text.toLowerCase().includes('token'))
        aiReply = 'I can generate a self check-in QR token instantly. Which room should I assign?';
      else if (text.toLowerCase().includes('vacant'))
        aiReply = '3 rooms vacant: Room 102 (Std), Room 205 (Deluxe), Room 306 (Deluxe). Shall I generate a check-in token?';

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setAiLoading(false);
    }, 800);
  };

  const sidebarItems = [
    { id: 'Dashboard',           label: 'Dashboard',       icon: LayoutGrid },
    { id: 'Residents',           label: 'Residents',        icon: Users,          count: null },
    { id: 'Rooms',               label: 'Rooms',            icon: Home },
    { id: 'Payments',            label: 'Payments',         icon: CreditCard },
    { id: 'AI Receptionist',     label: 'AI Receptionist',  icon: Sparkles },
    { id: 'Complaints',          label: 'Complaints',       icon: MessageSquare,  count: 2 },
    { id: 'WhatsApp Automation', label: 'WhatsApp Suite',   icon: Send },
    { id: 'Analytics',           label: 'Analytics',        icon: BarChart3 },
    { id: 'Settings',            label: 'Settings',         icon: Settings },
  ];

  const metrics = [
    { label: 'Check-ins Today',  value: '4',    trend: 'up',   trendLabel: '2 more expected',  icon: CheckCircle2, iconBg: '#EFF6FF', iconColor: '#2563EB', accent: '#2563EB' },
    { label: 'Monthly Revenue',  value: '67400', trend: 'up',   trendLabel: '↗ 12% vs last mo', icon: TrendingUp,   iconBg: '#F0FDF4', iconColor: '#16A34A', accent: '#16A34A', prefix: '₹' },
    { label: 'Vacant Rooms',     value: '4',    trend: 'down', trendLabel: '2 maintenance',     icon: Home,         iconBg: '#FFF7ED', iconColor: '#D97706', accent: '#D97706' },
    { label: 'Open Complaints',  value: '2',    trend: 'down', trendLabel: '1 critical',        icon: AlertCircle,  iconBg: '#FEF2F2', iconColor: '#DC2626', accent: '#DC2626' },
  ];

  return (
    <div style={{ display: 'flex', background: '#F8FAFC', minHeight: 'calc(100vh - 60px)', fontFamily: 'var(--font-sans)', color: '#111827' }}>

      {/* ─── LEFT SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside style={{
        width: '228px', minWidth: '228px',
        background: '#0F172A',
        borderRight: '1px solid #1E293B',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 10px'
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 16px 8px', borderBottom: '1px solid #1E293B', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', background: '#FEFCE8', border: '1px solid #FDE68A', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/nestpro-icon.jpg" alt="NestPro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#F8FAFC', letterSpacing: '-0.01em' }}>NestPro OS</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Owner Dashboard</div>
            </div>
          </div>

          {/* Section label */}
          <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', padding: '0 8px 8px 8px' }}>MENU</div>

          {/* Nav items */}
          <nav aria-label="Dashboard navigation" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sidebarItems.map(item => {
              const isActive = activeMenu === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`sidebar-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setActiveMenu(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 10px', borderRadius: '8px',
                    background: isActive ? 'rgba(37,99,235,0.18)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(37,99,235,0.28)' : 'transparent'}`,
                    color: isActive ? '#93C5FD' : '#94A3B8',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    textAlign: 'left',
                    minHeight: '40px'
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#E2E8F0'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8'; } }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} color={isActive ? '#93C5FD' : '#64748B'} strokeWidth={2} />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span style={{ background: '#EF4444', color: '#fff', fontSize: '0.6rem', fontWeight: 800, width: '17px', height: '17px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Owner profile footer */}
        <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '10px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366F1', color: '#fff', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#F1F5F9' }}>Amit Kapoor</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Property Owner</div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Sub-header */}
        <header style={{ height: '56px', background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: '0.8125rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
            <span>NestPro OS</span>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ color: '#111827', fontWeight: 700 }}>{activeMenu}</span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="search"
              aria-label="Search rooms, guests, invoices"
              placeholder="Search rooms, guests, invoices…"
              style={{
                width: '100%', padding: '8px 38px 8px 34px',
                borderRadius: '8px', background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '0.8125rem', color: '#111827', outline: 'none'
              }}
              onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.10)'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
            />
            <kbd style={{ position: 'absolute', right: '9px', top: '8px', fontSize: '0.625rem', fontWeight: 700, color: '#94A3B8', background: '#fff', border: '1px solid #E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>⌘K</kbd>
          </div>

          {/* Right badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
              AI Online
            </div>

            <div style={{ position: 'relative', cursor: 'pointer' }} aria-label="3 notifications">
              <Bell size={19} color="#64748B" />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#EF4444', color: '#fff', fontSize: '0.55rem', fontWeight: 800, width: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
            </div>

            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366F1', color: '#fff', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Account: Amit Kapoor">A</div>
          </div>
        </header>

        {/* DYNAMIC CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* ── DASHBOARD HOME ─────────────────────────────────────────────────── */}
          {activeMenu === 'Dashboard' && (
            <div style={{ padding: '24px', display: 'flex', gap: '20px', minHeight: '100%' }}>

              {/* LEFT: metrics + charts */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

                {/* Page title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h1 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#111827', marginBottom: '2px' }}>Good Morning, Amit 👋</h1>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>Here's what's happening at NestPro Grand today.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm">
                      <Download size={14} /> Export
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      <Calendar size={14} /> Aug 2026
                    </button>
                  </div>
                </div>

                {/* Metric cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {metrics.map(m => (
                    <MetricCard key={m.label} {...m} />
                  ))}
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

                  {/* Revenue Trend */}
                  <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Revenue Trend</h3>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0 0' }}>Monthly performance · 2026</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827' }}>₹67.4K</div>
                        <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#166534', background: '#F0FDF4', padding: '2px 7px', borderRadius: '4px' }}>↗ Aug</span>
                      </div>
                    </div>
                    <svg width="100%" height="110" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 80 Q50 50,100 60 T200 42 T300 15" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M0 80 Q50 50,100 60 T200 42 T300 15 V100 H0 Z" fill="url(#revGrad)" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8', marginTop: '6px' }}>
                      {['Feb','Mar','Apr','May','Jun','Jul','Aug'].map(m => <span key={m}>{m}</span>)}
                    </div>
                  </div>

                  {/* Occupancy Bars */}
                  <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Occupancy This Week</h3>
                        <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0 0' }}>Daily fill rate</p>
                      </div>
                      <span style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }}>Avg 89%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '110px', gap: '6px' }}>
                      {[
                        { day: 'Mon', pct: 75, color: '#60A5FA' },
                        { day: 'Tue', pct: 80, color: '#60A5FA' },
                        { day: 'Wed', pct: 88, color: '#60A5FA' },
                        { day: 'Thu', pct: 72, color: '#60A5FA' },
                        { day: 'Fri', pct: 92, color: '#2563EB' },
                        { day: 'Sat', pct: 100, color: '#16A34A' },
                        { day: 'Sun', pct: 85, color: '#60A5FA' },
                      ].map(bar => (
                        <div key={bar.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                          <div
                            title={`${bar.day}: ${bar.pct}%`}
                            style={{ width: '100%', height: `${bar.pct}%`, background: bar.color, borderRadius: '5px 5px 0 0', transition: 'all 0.3s ease' }}
                          />
                          <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600 }}>{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent activity table */}
                <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#111827', margin: 0 }}>Recent Activity</h3>
                    <button onClick={() => setActiveMenu('Residents')} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View all <ArrowRight size={13} />
                    </button>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        <th style={{ padding: '9px 20px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', borderBottom: '1px solid #E2E8F0' }}>Guest</th>
                        <th style={{ padding: '9px 16px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', borderBottom: '1px solid #E2E8F0' }}>Room</th>
                        <th style={{ padding: '9px 16px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', borderBottom: '1px solid #E2E8F0' }}>Event</th>
                        <th style={{ padding: '9px 16px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', borderBottom: '1px solid #E2E8F0' }}>Status</th>
                        <th style={{ padding: '9px 16px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', borderBottom: '1px solid #E2E8F0' }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Aarav Patel',     room: '101', event: 'Check-in Completed', status: 'success', time: '10:42 AM' },
                        { name: 'Priya Sharma',    room: '205', event: 'Rent Payment ₹12,000', status: 'success', time: '09:18 AM' },
                        { name: 'Rohan Mehta',     room: '306', event: 'Complaint Opened',    status: 'warning', time: '08:55 AM' },
                        { name: 'Sneha Gupta',     room: '102', event: 'KYC Auto-Approved',   status: 'success', time: '08:30 AM' },
                        { name: 'Kiran Verma',     room: '404', event: 'Rent Overdue',         status: 'danger',  time: 'Yesterday' },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                {row.name[0]}
                              </div>
                              <span style={{ fontWeight: 600, color: '#111827' }}>{row.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>Room {row.room}</td>
                          <td style={{ padding: '12px 16px', color: '#374151', fontWeight: 500 }}>{row.event}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '4px',
                              padding: '3px 9px', borderRadius: '999px',
                              fontSize: '0.6875rem', fontWeight: 700,
                              background: row.status === 'success' ? '#F0FDF4' : row.status === 'warning' ? '#FFFBEB' : '#FEF2F2',
                              color: row.status === 'success' ? '#166534' : row.status === 'warning' ? '#92400E' : '#991B1B'
                            }}>
                              {row.status === 'success' ? '✓' : row.status === 'warning' ? '!' : '✕'}
                              {row.status === 'success' ? 'Done' : row.status === 'warning' ? 'Open' : 'Overdue'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '0.75rem' }}>{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT: AI Chat */}
              <div style={{ width: '340px', flexShrink: 0 }}>
                <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '14px', display: 'flex', flexDirection: 'column', height: '600px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

                  {/* Chat header */}
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Sparkles size={17} color="#2563EB" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111827' }}>AI Receptionist</div>
                        <div style={{ fontSize: '0.6875rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
                          Online · Gemini Pro
                        </div>
                      </div>
                    </div>
                    <span style={{ background: '#F3E8FF', color: '#7C3AED', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', border: '1px solid #DDD6FE' }}>BETA</span>
                  </div>

                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div>
                          <div style={{
                            maxWidth: '260px',
                            padding: '10px 13px',
                            borderRadius: msg.sender === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                            background: msg.sender === 'user' ? '#2563EB' : '#F8FAFC',
                            color: msg.sender === 'user' ? '#fff' : '#111827',
                            border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                            fontSize: '0.8125rem', lineHeight: '1.55', whiteSpace: 'pre-wrap'
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: '0.625rem', color: '#94A3B8', marginTop: '3px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                        </div>
                      </div>
                    ))}

                    {aiLoading && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Sparkles size={14} color="#2563EB" />
                        </div>
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 14px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[0,1,2].map(i => (
                              <span key={i} style={{ width: '6px', height: '6px', background: '#94A3B8', borderRadius: '50%', display: 'inline-block', animation: `pulse-dot 1.2s ${i * 0.2}s infinite` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick chips */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '8px 14px', borderTop: '1px solid #F1F5F9' }}>
                    {['Vacant rooms', "Today's revenue", 'Complaints', 'Generate Token'].map(chip => (
                      <button
                        key={chip}
                        onClick={() => handleSendChat(chip)}
                        style={{ padding: '4px 10px', borderRadius: '999px', border: '1px solid #E2E8F0', background: '#fff', fontSize: '0.7rem', color: '#4B5563', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.12s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={e => { e.preventDefault(); handleSendChat(); }}
                    style={{ padding: '12px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '8px' }}
                    aria-label="Chat input"
                  >
                    <input
                      type="text"
                      placeholder="Ask AI anything…"
                      value={inputMsg}
                      onChange={e => setInputMsg(e.target.value)}
                      aria-label="Message to AI receptionist"
                      style={{ flex: 1, padding: '9px 13px', borderRadius: '9px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '0.8125rem', outline: 'none', transition: 'border-color 0.15s' }}
                      onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
                      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
                    />
                    <button
                      type="submit"
                      disabled={!inputMsg.trim() || aiLoading}
                      aria-label="Send message"
                      style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#2563EB', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputMsg.trim() && !aiLoading ? 'pointer' : 'not-allowed', opacity: inputMsg.trim() && !aiLoading ? 1 : 0.5, flexShrink: 0, transition: 'all 0.15s' }}
                    >
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Residents'           && <ResidentLedger />}
          {activeMenu === 'Rooms'               && <RoomsManager />}
          {activeMenu === 'Payments'            && <PaymentsLedger />}
          {activeMenu === 'AI Receptionist'     && <AiReceptionistSuite onOpenCheckInToken={onOpenCheckInToken} />}
          {activeMenu === 'Complaints'          && <ComplaintsKanban />}
          {activeMenu === 'WhatsApp Automation' && <WhatsAppAutomation />}
          {activeMenu === 'Analytics'           && <AnalyticsView />}
          {activeMenu === 'Settings'            && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
