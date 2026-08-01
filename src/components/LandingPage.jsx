import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Bot, QrCode, Smartphone, Sparkles, 
  ArrowRight, Zap, CheckCircle2, Lock, KeyRound, MessageSquare 
} from 'lucide-react';
import { ValueFeatureCard } from './ValueFeatureCard';
import { ComparisonSection } from './ComparisonSection';
import { PhoneFrame } from './PhoneFrame';
import { MobileTenantCheckIn } from './MobileTenantCheckIn';
import { MobileOwnerDashboard } from './MobileOwnerDashboard';

export default function LandingPage({ onNavigateTab, onOpenCheckInToken }) {
  const [mobileSimulatorMode, setMobileSimulatorMode] = useState('tenant'); // 'tenant' or 'owner'

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '40px 16px' }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 60px auto' }}>
        <div className="badge badge-indigo" style={{ padding: '6px 16px', fontSize: '0.8rem', marginBottom: '16px' }}>
          <Sparkles size={14} /> REVOLUTIONIZING PG & HOSTEL OPERATIONS
        </div>

        <h1 style={{
          fontSize: '3.2rem',
          fontWeight: 900,
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #818cf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Replace Physical Front Desks with a 100% Virtual Operating System
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
          NestPro automates contactless self check-in via entrance QR codes, dispatches Gemini 2.5 Flash AI Receptionist 24/7, and generates automated WhatsApp rent collection reminders.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={() => onNavigateTab('checkin')}
            style={{ padding: '14px 28px', fontSize: '0.95rem' }}
          >
            <ShieldCheck size={20} /> Launch Self Check-In Portal <ArrowRight size={18} />
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => onNavigateTab('ai')}
            style={{ padding: '14px 24px', fontSize: '0.95rem' }}
          >
            <Bot size={20} color="var(--accent-cyan)" /> Try AI Receptionist
          </button>
        </div>
      </div>

      {/* FEATURE CARDS HIGHLIGHT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '64px' }}>
        <ValueFeatureCard
          icon={QrCode}
          title="Token-Gated QR Check-In"
          description="Prospective residents scan entrance QR code or click WhatsApp link to complete digital KYC, e-signature, and instant payment."
          tag="Zero Receptionist"
        />

        <ValueFeatureCard
          icon={Bot}
          title="AI Virtual Receptionist"
          description="Handles walk-in inquiries 24/7, queries Drizzle ORM room inventory, answers house rules, and logs maintenance tickets directly."
          tag="Gemini Powered"
        />

        <ValueFeatureCard
          icon={KeyRound}
          title="IoT Smart Access Codes"
          description="Automated 6-digit PIN code issuance upon payment confirmation. Unlocks main smart gate and individual room door locks."
          tag="Automated Access"
        />

        <ValueFeatureCard
          icon={MessageSquare}
          title="WhatsApp Rent Reminders"
          description="One-click automated WhatsApp rent collection reminders with instant digital receipt generation for property owners."
          tag="Instant UPI"
        />
      </div>

      {/* SMART PROPERTY VS TRADITIONAL PG COMPARISON SECTION */}
      <div style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            Smart Virtual Property vs Traditional PG
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            See why modern PG owners are switching to 100% autonomous front desk management.
          </p>
        </div>

        <ComparisonSection />
      </div>

      {/* LIVE INTERACTIVE MOBILE DEVICE SIMULATOR */}
      <div style={{ margin: '64px 0', padding: '40px', background: 'rgba(18, 24, 38, 0.6)', border: '1px solid var(--border-color)', borderRadius: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '12px' }}>
            <Smartphone size={14} /> LIVE MOBILE EXPERIENCE DEMO
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>
            Test the Mobile User Experience
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '20px' }}>
            Switch between the **Tenant Self Check-In View** and **Owner Bed Explorer & Rent Ledger**.
          </p>

          {/* Toggle Pills */}
          <div style={{ display: 'inline-flex', padding: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setMobileSimulatorMode('tenant')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: mobileSimulatorMode === 'tenant' ? 'var(--primary)' : 'transparent',
                color: mobileSimulatorMode === 'tenant' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📱 Tenant Check-In View
            </button>
            <button
              onClick={() => setMobileSimulatorMode('owner')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: mobileSimulatorMode === 'owner' ? 'var(--primary)' : 'transparent',
                color: mobileSimulatorMode === 'owner' ? '#fff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Owner Rent Ledger View
            </button>
          </div>
        </div>

        {/* Embedded Realistic Phone Frame */}
        <PhoneFrame>
          {mobileSimulatorMode === 'tenant' ? (
            <MobileTenantCheckIn
              token="demo-checkin-token-88"
              onComplete={() => onNavigateTab('checkin')}
            />
          ) : (
            <MobileOwnerDashboard
              onOpenCheckInToken={onOpenCheckInToken}
            />
          )}
        </PhoneFrame>
      </div>

    </div>
  );
}
