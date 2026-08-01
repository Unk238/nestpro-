import React, { useState } from 'react';
import { 
  LayoutGrid, Sparkles, Building2, Users, QrCode, KeyRound, 
  CreditCard, Send, BarChart3, Wrench, UserCheck, ChevronDown, X
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const primaryTabs = [
    { id: 'Overview',   label: 'Overview',    icon: LayoutGrid },
    { id: 'Dashboard',  label: 'Dashboard',   icon: Sparkles },
    { id: 'Resident Ledger', label: 'Residents', icon: Users },
    { id: 'Self Check-in', label: 'Check-In', icon: KeyRound },
    { id: 'Payments',   label: 'Payments',    icon: CreditCard },
    { id: 'WhatsApp Suite', label: 'WhatsApp', icon: Send },
    { id: 'Analytics',  label: 'Analytics',   icon: BarChart3 },
  ];

  const moreTabs = [
    { id: 'Property Portfolio',  label: 'Property Portfolio', icon: Building2 },
    { id: 'Print Room QR Posters', label: 'Print QR Posters', icon: QrCode },
    { id: 'AI Voice Receptionist', label: 'AI Receptionist',  icon: Sparkles },
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #E2E8F0',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      gap: '12px',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
    }}>

      {/* BRAND LOGO */}
      <button
        onClick={() => setActiveTab('Overview')}
        aria-label="NestPro — Go to Overview"
        style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          background: 'none', border: 'none', cursor: 'pointer',
          flexShrink: 0, padding: '4px 0'
        }}
      >
        <div style={{
          width: '34px', height: '34px', borderRadius: '9px',
          overflow: 'hidden', background: '#FEFCE8',
          border: '1.5px solid #FDE68A',
          boxShadow: '0 2px 8px rgba(217,119,6,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <img
            src="/nestpro-icon.jpg"
            alt="NestPro Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '1.05rem', fontWeight: 900,
            color: '#111827', letterSpacing: '-0.025em',
            fontFamily: 'var(--font-sans)'
          }}>NestPro</span>
          <span style={{
            background: '#EFF6FF', color: '#2563EB',
            border: '1px solid #BFDBFE',
            fontSize: '0.6rem', fontWeight: 800,
            padding: '1px 5px', borderRadius: '5px',
            letterSpacing: '0.06em'
          }}>OS</span>
        </div>
      </button>

      {/* PRIMARY NAVIGATION */}
      <nav
        aria-label="Primary navigation"
        style={{
          display: 'flex', alignItems: 'center',
          gap: '2px', flex: 1,
          overflowX: 'auto', padding: '0 8px'
        }}
      >
        {primaryTabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 11px',
                borderRadius: '7px',
                border: 'none',
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? '#ffffff' : '#4B5563',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                minHeight: '36px'
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = '#F8FAFC';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={14} color={isActive ? '#ffffff' : '#6B7280'} strokeWidth={2} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* MORE DROPDOWN */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-label="More navigation options"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '6px 11px',
              borderRadius: '7px',
              border: 'none',
              background: menuOpen ? '#F1F5F9' : 'transparent',
              color: '#4B5563',
              fontWeight: 500,
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minHeight: '36px'
            }}
          >
            More
            <ChevronDown
              size={13}
              style={{ transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="More navigation"
              style={{
                position: 'absolute', top: '42px', left: 0,
                background: '#ffffff',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
                minWidth: '200px',
                zIndex: 500,
                overflow: 'hidden',
                animation: 'fade-in 0.15s ease'
              }}
            >
              {moreTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    role="menuitem"
                    onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '10px 14px',
                      background: activeTab === tab.id ? '#EFF6FF' : 'transparent',
                      border: 'none',
                      color: activeTab === tab.id ? '#2563EB' : '#374151',
                      fontWeight: activeTab === tab.id ? 700 : 500,
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-sans)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = activeTab === tab.id ? '#EFF6FF' : 'transparent'; }}
                  >
                    <Icon size={15} color={activeTab === tab.id ? '#2563EB' : '#6B7280'} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* RIGHT ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          id="nav-test-qr"
          onClick={() => setActiveTab('Instant Scan Complaint')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            borderRadius: '7px',
            background: activeTab === 'Instant Scan Complaint' ? '#EFF6FF' : '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#2563EB',
            fontWeight: 600,
            fontSize: '0.775rem',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minHeight: '36px',
            transition: 'all 0.15s ease'
          }}
        >
          <Wrench size={13} color="#2563EB" />
          Test QR Scan
        </button>

        <button
          id="nav-resident-view"
          onClick={() => setActiveTab('Resident Encrypted Portal')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px',
            borderRadius: '7px',
            background: activeTab === 'Resident Encrypted Portal' ? '#EFF6FF' : '#ffffff',
            border: '1px solid #E2E8F0',
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.775rem',
            fontFamily: 'var(--font-sans)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minHeight: '36px',
            transition: 'all 0.15s ease'
          }}
        >
          <UserCheck size={13} color="#2563EB" />
          Resident View
        </button>
      </div>
    </header>
  );
}
