import React from 'react';
import { 
  Building2, Sparkles, Activity, Layers, Users, Home, CreditCard, 
  Settings, KeyRound, QrCode, ShieldCheck, UserCheck, LayoutGrid, Wrench, Send 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: LayoutGrid },
    { id: 'Dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'Property Portfolio', label: 'Portfolio', icon: Building2 },
    { id: 'Resident Ledger', label: 'Ledger', icon: Users },
    { id: 'Print Room QR Posters', label: 'Print QR', icon: QrCode },
    { id: 'Self Check-in', label: 'Self Check-in', icon: KeyRound },
    { id: 'Payments', label: 'Payments', icon: CreditCard },
    { id: 'WhatsApp Suite', label: 'WhatsApp', icon: Send },
    { id: 'AI Voice Receptionist', label: 'AI Robo', icon: Sparkles },
    { id: 'Analytics', label: 'Analytics', icon: Layers }
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
    }}>
      
      {/* 1. OFFICIAL GOLDEN HOUSE NEST EMBLEM BRAND LOGO */}
      <div 
        onClick={() => setActiveTab('Overview')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#fefce8',
          border: '1px solid #fef08a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(217, 119, 6, 0.2)'
        }}>
          <img 
            src="/nestpro-icon.jpg" 
            alt="NestPro Golden House Emblem" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} 
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            NestPro
          </span>
          <span style={{
            background: '#eff6ff',
            color: '#2563eb',
            border: '1px solid #bfdbfe',
            fontSize: '0.675rem',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '6px',
            letterSpacing: '0.05em'
          }}>
            OS
          </span>
        </div>
      </div>

      {/* 2. CENTER NAVIGATION TABS */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', padding: '0 12px' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                lineHeight: 1
              }}
            >
              <Icon size={15} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3. RIGHT DESKTOP ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab('Instant Scan Complaint')}
          style={{
            background: activeTab === 'Instant Scan Complaint' ? '#eff6ff' : '#ffffff',
            border: '1px solid #cbd5e1',
            color: '#2563eb',
            padding: '7px 12px',
            borderRadius: '8px',
            fontSize: '0.775rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            lineHeight: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Wrench size={14} color="#2563eb" /> Test QR Scan
        </button>

        <button
          onClick={() => setActiveTab('Resident Encrypted Portal')}
          style={{
            background: activeTab === 'Resident Encrypted Portal' ? '#eff6ff' : '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#475569',
            padding: '7px 12px',
            borderRadius: '8px',
            fontSize: '0.775rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}
        >
          <UserCheck size={14} color="#2563eb" /> Resident View
        </button>
      </div>

    </header>
  );
}
