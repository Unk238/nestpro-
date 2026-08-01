import React, { useState, useEffect } from 'react';
import {
  Bot, KeyRound, DollarSign, Layers, ArrowRight,
  CheckCircle2, Sparkles, Shield, Smartphone,
  MessageSquare, TrendingUp, Building2, Zap
} from 'lucide-react';
import CuteRoboMascot from './CuteRoboMascot';

// ── Live counter animation hook ───────────────────────────────────────────────
function useCounter(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 50;
    const step = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function StatCounter({ value, label, suffix = '' }) {
  const animated = useCounter(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1 }}>
        {animated.toLocaleString('en-IN')}{suffix}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px', fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function PillarCard({ number, icon: Icon, iconBg, iconColor, title, description, badge }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        border: `1px solid ${hovered ? '#BFDBFE' : '#E2E8F0'}`,
        borderRadius: '14px',
        padding: '28px 24px',
        boxShadow: hovered ? '0 12px 32px rgba(37,99,235,0.10)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
        display: 'flex', flexDirection: 'column', gap: '14px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} color={iconColor} strokeWidth={2} />
        </div>
        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.06em' }}>0{number}</span>
      </div>
      <div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', marginBottom: '6px', lineHeight: '1.3' }}>{title}</h3>
        <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.65', margin: 0 }}>{description}</p>
      </div>
      {badge && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700 }}>
          <CheckCircle2 size={11} /> {badge}
        </div>
      )}
    </div>
  );
}

function StepCard({ step, title, description, action, onAction }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#2563EB', letterSpacing: '0.08em' }}>STEP {step.toString().padStart(2, '0')}</div>
      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h4>
      <p style={{ fontSize: '0.8125rem', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>{description}</p>
      {action && (
        <button
          onClick={onAction}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer', padding: 0, marginTop: '2px' }}
        >
          {action} <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

export default function OverviewPage({ onNavigate }) {
  return (
    <div style={{ background: '#F8FAFC', color: '#111827', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #ffffff 0%, #F1F5F9 100%)', borderBottom: '1px solid #E2E8F0', padding: '56px 24px 52px' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>

          {/* Status pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '5px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '24px' }}>
            <span style={{ width: '7px', height: '7px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
            AI Virtual Front Desk — Live 24/7
          </div>

          {/* Mascot */}
          <CuteRoboMascot />

          {/* H1 */}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: '1.12', letterSpacing: '-0.03em', color: '#111827', marginBottom: '20px', marginTop: '8px' }}>
            Replace Physical Front Desk with a{' '}
            <span style={{ color: '#2563EB' }}>100% Virtual Operating System</span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '1.0625rem', lineHeight: '1.7', color: '#4B5563', maxWidth: '700px', margin: '0 auto 36px', fontWeight: 400 }}>
            NestPro automates walk-in inquiries, bed vacancy checks, KYC verification, digital agreements, rent collection, and smart lock access for PGs, hostels, and co-living properties — with zero human intervention.
          </p>

          {/* Primary CTA row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              id="hero-cta-dashboard"
              onClick={() => onNavigate('Dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px',
                borderRadius: '10px',
                background: '#2563EB',
                color: '#ffffff',
                fontWeight: 700, fontSize: '0.9375rem',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37,99,235,0.32)',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: '48px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1D4ED8'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.42)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563EB'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.32)'; }}
            >
              <Sparkles size={17} /> Open Dashboard
            </button>

            <button
              id="hero-cta-checkin"
              onClick={() => onNavigate('Self Check-in')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 24px',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#374151',
                fontWeight: 600, fontSize: '0.9375rem',
                border: '1px solid #D1D5DB', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-sans)',
                minHeight: '48px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#9CA3AF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
            >
              <KeyRound size={17} color="#2563EB" /> Test Self Check-In
            </button>
          </div>

          {/* Social proof badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {[
              { icon: Shield, label: 'WCAG AA Compliant' },
              { icon: Zap,    label: 'Zero App Required' },
              { icon: Bot,    label: 'AI-Powered 24/7' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>
                <Icon size={14} color="#94A3B8" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)', padding: '36px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
          <StatCounter value={250}  label="Properties Managed"  suffix="+" />
          <StatCounter value={12400} label="Guests Processed"    suffix="+" />
          <StatCounter value={98}   label="Check-In Automation"  suffix="%" />
          <StatCounter value={4}    label="Avg Setup Minutes"     suffix="" />
        </div>
      </section>

      {/* ── CORE PILLARS ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px' }}>
            <Layers size={13} /> PLATFORM OVERVIEW
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', marginBottom: '10px', letterSpacing: '-0.025em' }}>
            How NestPro Replaces Front Desk Operations
          </h2>
          <p style={{ fontSize: '1rem', color: '#6B7280', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            Four interconnected automation modules running 24/7 without a single manual intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <PillarCard
            number={1} icon={Bot} iconBg="#EFF6FF" iconColor="#2563EB"
            title="24/7 AI Virtual Receptionist"
            description="Handles walk-in inquiries via WhatsApp and phone. Checks live bed availability and answers house rules automatically — no human required."
            badge="WhatsApp-native"
          />
          <PillarCard
            number={2} icon={KeyRound} iconBg="#F0FDF4" iconColor="#16A34A"
            title="Token-Gated Self Check-In"
            description="Guests scan entrance QR, complete 5-step onboarding, verify Aadhaar OCR, sign e-agreement, and get an instant IoT room lock PIN."
            badge="Zero-App Required"
          />
          <PillarCard
            number={3} icon={DollarSign} iconBg="#FFFBEB" iconColor="#D97706"
            title="Automated Rent Collection"
            description="Auto-collects rent via UPI and Razorpay. Sends 1-click WhatsApp reminders for pending balances and generates instant PDF receipts."
            badge="UPI + Razorpay"
          />
          <PillarCard
            number={4} icon={Layers} iconBg="#F3E8FF" iconColor="#7C3AED"
            title="Owner Command Center OS"
            description="Real-time multi-property management. Track live occupancy %, vacant beds, maintenance tickets, and AI dispatches in one unified view."
            badge="Multi-property"
          />
        </div>
      </section>

      {/* ── GETTING STARTED STEPS ────────────────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', marginBottom: '10px', letterSpacing: '-0.025em' }}>
              Go Live in Under 10 Minutes
            </h2>
            <p style={{ fontSize: '1rem', color: '#6B7280', lineHeight: '1.7' }}>
              Four steps to a fully automated accommodation business.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <StepCard step={1} title="Setup Portfolio & Rooms" description="Define properties, floors, room types, and pricing models in the Property Portfolio." action="Open Portfolio" onAction={() => onNavigate('Property Portfolio')} />
            <StepCard step={2} title="Enable AI Receptionist" description="Activate 24/7 AI chat & voice call routing for instant walk-in inquiry responses." action="Configure AI" onAction={() => onNavigate('AI Voice Receptionist')} />
            <StepCard step={3} title="Print Entrance QR Code" description="Display Self Check-In QR posters at entrance doors or send via WhatsApp to guests." action="Print QR Posters" onAction={() => onNavigate('Print Room QR Posters')} />
            <StepCard step={4} title="Auto Collect & Monitor" description="Sit back while NestPro verifies KYC, signs agreements, and collects rent automatically." action="View Payments" onAction={() => onNavigate('Payments')} />
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)', padding: '52px 40px', borderRadius: '20px', boxShadow: '0 16px 48px rgba(37,99,235,0.28)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '20px' }}>
              <Sparkles size={12} /> FOR HACKATHON JUDGES
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px', letterSpacing: '-0.025em', lineHeight: '1.2' }}>
              Ready to See NestPro in Action?
            </h2>
            <p style={{ fontSize: '1rem', color: '#BFDBFE', marginBottom: '32px', lineHeight: '1.7' }}>
              Experience the complete Owner Dashboard, WhatsApp AI suite, and Zero-App QR check-in flow live.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                id="cta-dashboard"
                onClick={() => onNavigate('Dashboard')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#ffffff', color: '#1E40AF', fontWeight: 800, fontSize: '0.9375rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.12)', transition: 'all 0.2s ease', minHeight: '48px', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.16)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.12)'; }}
              >
                <Sparkles size={17} color="#2563EB" /> Open Owner Dashboard
              </button>
              <button
                id="cta-whatsapp"
                onClick={() => onNavigate('WhatsApp Suite')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s ease', minHeight: '48px', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.20)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                <MessageSquare size={17} /> WhatsApp Suite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #E2E8F0', padding: '24px', textAlign: 'center', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', overflow: 'hidden', background: '#FEFCE8', border: '1px solid #FDE68A' }}>
            <img src="/nestpro-icon.jpg" alt="NestPro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 800, color: '#111827', fontSize: '0.875rem' }}>NestPro OS</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#9CA3AF', margin: 0 }}>
          Zero-App QR Complaint Scanner · AI Receptionist · Owner-First Operating System
        </p>
      </footer>
    </div>
  );
}
