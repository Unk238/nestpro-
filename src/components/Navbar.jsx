import React from 'react';
import { 
  Building2, Sparkles, Activity, Layers, Users, Home, CreditCard, 
  Settings, KeyRound, QrCode, ShieldCheck, UserCheck, LayoutGrid, Wrench 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: LayoutGrid },
    { id: 'Dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'Property Portfolio', label: 'Property Portfolio', icon: Building2 },
    { id: 'Resident Ledger', label: 'Resident Ledger', icon: Users },
    { id: 'Print Room QR Posters', label: 'Print QR Posters', icon: QrCode },
    { id: 'Self Check-in', label: 'Self Check-in', icon: KeyRound },
    { id: 'Payments', label: 'Payments', icon: CreditCard },
    { id: 'AI Voice Receptionist', label: 'AI Receptionist', icon: Sparkles },
    { id: 'Command Center', label: 'Command Center', icon: Activity },
    { id: 'WhatsApp Suite', label: 'WhatsApp Suite', icon: QrCode },
    { id: 'Analytics', label: 'Analytics', icon: Layers },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 20px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
    }}>
      {/* Brand Logo & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
        }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', lineHeight: '1.2' }}>
            NestPro PG Management
          </div>
          <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Owner-First Accommodation OS
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? '#ffffff' : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mode Switchers: Scan-and-Complain vs Resident Portal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('Instant Scan Complaint')}
          style={{
            background: activeTab === 'Instant Scan Complaint' ? '#eff6ff' : '#f8fafc',
            border: activeTab === 'Instant Scan Complaint' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
            color: activeTab === 'Instant Scan Complaint' ? '#2563eb' : '#475569',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Wrench size={14} color="#2563eb" /> Test QR Scan & Complain (`/scan-complaint`)
        </button>
      </div>

    </header>
  );
}
