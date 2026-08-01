import React from 'react';
import { 
  Building2, ShieldCheck, Bot, Sparkles, KeyRound, ArrowRight, CheckCircle2, 
  TrendingUp, Users, DollarSign, Smartphone, Layers, Lock, MessageSquare, ChevronRight
} from 'lucide-react';
import CuteRoboMascot from './CuteRoboMascot';

export default function OverviewPage({ onNavigate }) {
  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '56px 24px 48px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          
          {/* CUTE ANIMATED ROBO MASCOT */}
          <CuteRoboMascot />

          {/* HIGH-CONTRAST VISIBLE HEADING */}
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            color: '#0f172a',
            marginBottom: '16px'
          }}>
            Replace Physical Front Desk with a <span style={{ color: '#2563eb' }}>100% Virtual Operating System</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#475569',
            maxWidth: '780px',
            margin: '0 auto 32px auto',
            fontWeight: 500
          }}>
            NestPro automates walk-in inquiries, bed vacancy checks, KYC document verification, digital rental agreements, payment collections, and smart door access PINs for Paying Guest (PG) accommodations, hostels, and co-living properties.
          </p>

          {/* Primary CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => onNavigate('Dashboard')}
              style={{ padding: '16px 32px', fontSize: '1rem', borderRadius: '12px' }}
            >
              Launch NestPro Command Center <ArrowRight size={18} />
            </button>

            <button
              className="btn-secondary"
              onClick={() => onNavigate('Self Check-in')}
              style={{ padding: '16px 28px', fontSize: '1rem', borderRadius: '12px' }}
            >
              <KeyRound size={18} color="#2563eb" /> Test Self Check-In Portal
            </button>
          </div>
        </div>
      </section>

      {/* 4 CORE OPERATIONAL PILLARS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>
            How NestPro Replaces Front Desk Operations
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
            Four interconnected automation modules running 24/7 without manual intervention.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          {/* Pillar 1 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Bot size={24} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              1. 24/7 AI Virtual Receptionist
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
              Handles walk-in inquiries over WhatsApp and phone. Checks bed availability live from Drizzle ORM and answers house rules automatically.
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <KeyRound size={24} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              2. Token-Gated Self Check-In
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
              Guests scan entrance QR code, complete 5-step onboarding, verify Aadhaar OCR, sign e-agreement, and receive an instant IoT room lock PIN.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <DollarSign size={24} color="#d97706" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              3. Automated Rent Collection
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
              Auto-collects rent via UPI and Razorpay. Sends automated 1-click WhatsApp reminders for pending balances and generates PDF receipts.
            </p>
          </div>

          {/* Pillar 4 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Layers size={24} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              4. Owner Command Center OS
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
              Real-time multi-property portfolio management. Track live occupancy %, vacant beds, maintenance tickets, and AI dispatches in one unified control room.
            </p>
          </div>

        </div>
      </section>

      {/* INTERACTIVE GETTING STARTED STEPS */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>
              Getting Started with NestPro in 4 Easy Steps
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Set up your accommodation business in under 10 minutes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '6px' }}>STEP 01</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Setup Portfolio & Rooms</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Define properties, floors, room types, and pricing models in Property Portfolio.</p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '6px' }}>STEP 02</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Enable AI Receptionist</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Activate 24/7 AI chat & voice call routing for instant walk-in inquiry answers.</p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '6px' }}>STEP 03</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Print Entrance QR Code</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Display Self Check-In QR posters at entrance doors and send via WhatsApp.</p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '20px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginBottom: '6px' }}>STEP 04</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>Auto Collect & Monitor</h4>
              <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Sit back while NestPro verifies KYC, signs agreements, and collects rent payments.</p>
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section style={{ padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '48px 32px', borderRadius: '24px', color: '#ffffff', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px' }}>
            Ready to Automate Your Accommodation Business?
          </h2>
          <p style={{ fontSize: '1rem', color: '#dbeafe', marginBottom: '28px' }}>
            Join hundreds of PG and hostel owners running 100% Virtual Front Desks.
          </p>

          <button className="btn-secondary" onClick={() => onNavigate('Dashboard')} style={{ padding: '14px 32px', fontSize: '1rem', background: '#ffffff', color: '#1d4ed8', fontWeight: 800, border: 'none' }}>
            Go to Owner Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </section>

    </div>
  );
}
