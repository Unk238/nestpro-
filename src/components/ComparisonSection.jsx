import React from 'react';
import { Sparkles, XCircle, CheckCircle2 } from 'lucide-react';

export function ComparisonSection() {
  return (
    <div style={{ margin: '48px 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
      {/* Old Way */}
      <div style={{
        borderRadius: '24px',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        backgroundColor: 'rgba(244, 63, 94, 0.05)',
        padding: '28px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px' }}>
          TRADITIONAL FRONT DESK
        </div>
        <h4 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 800, color: '#fda4af' }}>
          Traditional PG Operations
        </h4>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#fecdd3' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f43f5e', fontWeight: 800 }}>❌</span> Manual physical receipts & Bahi-Khata books
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f43f5e', fontWeight: 800 }}>❌</span> Chasing tenants for rent over manual WhatsApp calls
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f43f5e', fontWeight: 800 }}>❌</span> Unorganized physical ID copies & paper C-Forms
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f43f5e', fontWeight: 800 }}>❌</span> Front desk receptionist salary overhead (₹18,000/mo)
          </li>
        </ul>
      </div>

      {/* NestPro Way */}
      <div style={{
        borderRadius: '24px',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        padding: '28px',
        boxShadow: '0 0 35px rgba(99, 102, 241, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '140px',
          height: '140px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          border: '1px solid rgba(99, 102, 241, 0.5)',
          padding: '4px 12px',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#a5b4fc',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} /> NestPro Powered
        </span>

        <h4 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
          100% Virtual Operating System
        </h4>

        <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, fontSize: '0.9rem', color: '#e2e8f0' }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#34d399', fontWeight: 800 }}>⚡</span> Automated UPI rent collection & receipt generation
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#34d399', fontWeight: 800 }}>⚡</span> Token-gated digital self check-in via entrance QR code
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#34d399', fontWeight: 800 }}>⚡</span> AI Receptionist answering tenant queries 24/7
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#34d399', fontWeight: 800 }}>⚡</span> Instant IoT door lock PIN code generation & access pass
          </li>
        </ul>
      </div>
    </div>
  );
}
