import React, { useState } from 'react';
import { QrCode, Smartphone, Bot, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function EntranceKiosk({ onLaunchCheckIn, onLaunchAi }) {
  const [scanned, setScanned] = useState(false);

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 16px', textAlign: 'center' }}>
      
      {/* Physical Entrance Kiosk Header */}
      <div style={{ marginBottom: '32px' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '12px', padding: '6px 14px' }}>
          PHYSICAL ENTRANCE DISPLAY SIMULATOR
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          NestPro Entrance Virtual Front Desk 🚪
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Physical receptionists are replaced with touchless QR scan self check-in and 24/7 AI Kiosk.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Pillar 1: QR Code Scan for Self Check-In */}
        <div className="glass-panel-glow" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <QrCode size={34} color="#fff" />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
            1. Scan QR / Click Check-In Link
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Incoming residents scan the entrance QR code or click their WhatsApp magic link to open token-gated `/checkin/:token`.
          </p>

          {/* QR Box */}
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${window.location.origin}/checkin/demo-checkin-token-88`} 
              alt="Entrance QR Code"
              style={{ width: '160px', height: '160px', display: 'block' }}
            />
          </div>

          <button
            onClick={() => onLaunchCheckIn('demo-checkin-token-88')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <ShieldCheck size={18} /> Simulate QR Scan & Open Check-In
          </button>
        </div>

        {/* Pillar 2: AI Virtual Receptionist Kiosk */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Bot size={34} color="#fff" />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
            2. AI Receptionist Touch Kiosk
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Walk-in guests interact with the AI Receptionist (`/api/ai/chat`) for room availability, house rules, pricing, or instant booking.
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            width: '100%',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
              🤖 AI KIOSK CAPABILITIES
            </div>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', listStyle: 'none', lineHeight: '1.8' }}>
              <li>✓ Instant Room Inventory & Rates</li>
              <li>✓ Curfew & Guest Policy Assistant</li>
              <li>✓ On-Demand Payment Link Generator</li>
              <li>✓ Auto Maintenance Ticket Dispatch</li>
            </ul>
          </div>

          <button
            onClick={onLaunchAi}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Bot size={18} /> Launch AI Receptionist Kiosk <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}
