import React, { useState } from 'react';
import { 
  KeyRound, QrCode, Copy, CheckCircle2, ShieldCheck, UserCheck, 
  Camera, FileText, ArrowRight, Sparkles, RefreshCw, Smartphone, Plus 
} from 'lucide-react';

export default function SelfCheckInManager({ onSelectToken }) {
  const [tokens, setTokens] = useState([
    { id: 'token-881', token: 'demo-checkin-token-88', property: 'Sunrise PG & Residency', status: 'ACTIVE', generatedAt: '10:15 AM', expiresAt: '24 Hours' },
    { id: 'token-882', token: 'chk-token-9942', property: 'Sunrise Luxury Hotel', status: 'ACTIVE', generatedAt: '09:30 AM', expiresAt: '24 Hours' }
  ]);

  const [selectedProp, setSelectedProp] = useState('Sunrise PG & Residency');
  const [copiedToken, setCopiedToken] = useState(null);

  const handleGenerateToken = () => {
    const newTokenStr = `chk-token-${Math.floor(1000 + Math.random() * 9000)}`;
    const newToken = {
      id: `token-${Date.now()}`,
      token: newTokenStr,
      property: selectedProp,
      status: 'ACTIVE',
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresAt: '24 Hours'
    };
    setTokens([newToken, ...tokens]);
    alert(`Generated New Self Check-In Token: ${newTokenStr}`);
  };

  const handleCopyLink = (tokenStr) => {
    navigator.clipboard.writeText(`${window.location.origin}/checkin/${tokenStr}`);
    setCopiedToken(tokenStr);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Self Check-In & Token Manager</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Generate entrance QR tokens, WhatsApp invitation links, visitor passes, and automated liveness checks.
          </p>
        </div>

        <button className="btn-primary" onClick={handleGenerateToken}>
          <Plus size={18} /> Generate New Token
        </button>
      </div>

      {/* 2-Column Layout: Token Control & QR Poster Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px' }}>
        
        {/* Left Column: Tokens List */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
            Active QR & Invitation Tokens
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tokens.map(item => (
              <div key={item.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>{item.token}</span>
                    <span className="badge badge-emerald">{item.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{item.property} • Generated {item.generatedAt}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => handleCopyLink(item.token)} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    <Copy size={14} /> {copiedToken === item.token ? 'Copied Link!' : 'Copy Link'}
                  </button>

                  <button className="btn-primary" onClick={() => onSelectToken(item.token)} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    <ArrowRight size={14} /> Launch Portal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: QR Code Entrance Poster Preview */}
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
          <div className="badge badge-indigo" style={{ marginBottom: '16px' }}>
            📱 ENTRANCE QR POSTER PREVIEW
          </div>

          <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px' }}>NestPro Entrance Scanner</h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
            Scan with smartphone camera to start digital onboarding.
          </p>

          <div style={{ background: '#ffffff', border: '2px solid #2563eb', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)' }}>
            <QrCode size={160} color="#0f172a" />
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', marginTop: '10px' }}>SCAN TO CHECK-IN</div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#475569', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            ✓ Includes Aadhaar OCR • Facial Liveness • E-Signature • Smart Lock PIN
          </div>
        </div>

      </div>

    </div>
  );
}
