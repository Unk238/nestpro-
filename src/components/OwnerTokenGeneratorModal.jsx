import React, { useState } from 'react';
import { 
  KeyRound, QrCode, Send, Copy, ShieldCheck, CheckCircle2, 
  MessageSquare, FileText, ExternalLink, X, Smartphone 
} from 'lucide-react';

export default function OwnerTokenGeneratorModal({ resident, onClose, onLaunchPortal }) {
  const [accessType, setAccessType] = useState('COMPLAINT');
  const [expiryHours, setExpiryHours] = useState(24);
  const [generatedToken, setGeneratedToken] = useState('3JHF82LK');
  const [copied, setCopied] = useState(false);

  const handleGenerateNewToken = () => {
    const newToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedToken(newToken);
  };

  const getEncryptedUrl = () => {
    return `${window.location.origin}/access/${generatedToken}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getEncryptedUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const phone = resident?.phone ? resident.phone.replace(/[^0-9]/g, '') : '919876543210';
    const text = `Welcome to NestPro.\n\nAccess your resident portal here:\n${getEncryptedUrl()}\n\nThis link expires in ${expiryHours} hours.`;
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '16px' }}>
      <div style={{ background: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '20px', padding: '28px', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Digital Access Token Generator</h3>
            <div style={{ fontSize: '0.775rem', color: '#64748b' }}>Resident: <strong>{resident?.name || 'Aarav Patel'}</strong> (Room {resident?.room || '101'})</div>
          </div>

          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Access Type Selector Buttons */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>SELECT ACCESSIBLE RESIDENT SERVICE</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'CHECKIN', label: '🎟️ Check-in QR' },
              { id: 'COMPLAINT', label: '🛠️ Complaint QR' },
              { id: 'PAYMENT', label: '💳 Payment QR' },
              { id: 'VISITOR', label: '🎫 Visitor Pass' },
              { id: 'CHECKOUT', label: '🚪 Checkout Link' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setAccessType(item.id); handleGenerateNewToken(); }}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: accessType === item.id ? '#eff6ff' : '#ffffff',
                  color: accessType === item.id ? '#2563eb' : '#334155',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Token Details & Expiry */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>ENCRYPTED TOKEN URL:</div>
          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#2563eb', wordBreak: 'break-all', marginTop: '4px' }}>
            {getEncryptedUrl()}
          </div>
          <div style={{ fontSize: '0.725rem', color: '#16a34a', marginTop: '6px', fontWeight: 700 }}>
            ✓ Token unique to {resident?.name || 'Resident'} • Expires in {expiryHours} hours
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn-primary" onClick={handleSendWhatsApp} style={{ padding: '12px', justifyContent: 'center', background: '#25d366' }}>
            <MessageSquare size={16} /> Send via WhatsApp to Resident
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={handleCopyLink} style={{ flex: 1, padding: '10px', justifyContent: 'center' }}>
              <Copy size={14} /> {copied ? 'Copied Link!' : 'Copy Encrypted Link'}
            </button>

            <button
              className="btn-primary"
              onClick={() => {
                onClose();
                if (onLaunchPortal) onLaunchPortal(generatedToken, { resident, type: accessType.toLowerCase() });
              }}
              style={{ flex: 1, padding: '10px', justifyContent: 'center' }}
            >
              <ExternalLink size={14} /> Test Resident View
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
