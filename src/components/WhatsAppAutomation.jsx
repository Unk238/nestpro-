import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, CheckCircle2, Copy, Smartphone, Phone, ArrowRight, User, 
  RefreshCw, AlertCircle, Mail, MessageCircle, Clock, ShieldCheck, Check, Sparkles, ExternalLink 
} from 'lucide-react';

export default function WhatsAppAutomation({ onOpenCheckInToken }) {
  const [recipientPhone, setRecipientPhone] = useState('+91 98765 43210');
  const [residentName, setResidentName] = useState('Aarav Patel');
  const [templateType, setTemplateType] = useState('CHECKIN_LINK');
  const [expiryHours, setExpiryHours] = useState(24);
  const [customText, setCustomText] = useState('');
  
  // Real Delivery Status & Message Log History State
  const [deliveryStatus, setDeliveryStatus] = useState(null); // 'SENDING', 'SENT', 'DELIVERED', 'FAILED'
  const [messageLogs, setMessageLogs] = useState([]);
  const [lastCheckInUrl, setLastCheckInUrl] = useState(null);
  const [lastToken, setLastToken] = useState('demo-checkin-token-88');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Message Logs on Mount
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/whatsapp/messages');
      const data = await res.json();
      if (data.success && data.messages) {
        setMessageLogs(data.messages);
      }
    } catch (err) {
      console.log('Using state logs');
    }
  };

  // 1. Send Check-In Link Function (Calls Real Backend API)
  const handleSendCheckInLink = async () => {
    if (!recipientPhone) return alert('Please enter recipient mobile phone number.');

    setLoading(true);
    setDeliveryStatus('SENDING');

    try {
      const res = await fetch('/api/whatsapp/send-checkin-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: recipientPhone,
          residentName,
          expiryHours
        })
      });
      const data = await res.json();

      if (!res.ok || !data?.success || !data.checkInUrl || !data.token) {
        throw new Error(data?.error || 'Unable to generate a valid check-in link.');
      }

      setDeliveryStatus('DELIVERED');
      setLastCheckInUrl(data.checkInUrl);
      setLastToken(data.token);
      fetchLogs();
    } catch (err) {
      console.error('Failed to generate WhatsApp check-in link:', err);
      setDeliveryStatus('FAILED');
    } finally {
      setLoading(false);
    }
  };

  // 2. Open WhatsApp Web / App Direct Sender (wa.me link)
  const handleOpenWhatsAppNativeApp = () => {
    const rawPhone = recipientPhone.replace(/[^0-9]/g, '');
    const textToSend = getTemplatePreview();
    const encodedText = encodeURIComponent(textToSend);
    const waUrl = `https://wa.me/${rawPhone}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  // 3. Send Automated Template Function
  const handleSendTemplate = async () => {
    if (!recipientPhone) return alert('Please enter recipient mobile phone number.');

    setLoading(true);
    setDeliveryStatus('SENDING');

    try {
      const res = await fetch('/api/whatsapp/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: recipientPhone,
          residentName,
          templateType,
          customText
        })
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to send template message.');
      }

      setDeliveryStatus('DELIVERED');
      fetchLogs();
    } catch (err) {
      console.error('Failed to send WhatsApp template:', err);
      setDeliveryStatus('FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCheckInUrl = () => {
    const targetUrl = lastCheckInUrl || `${window.location.origin}/checkin/${lastToken}`;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Template Formatted Text Preview
  const getTemplatePreview = () => {
    if (templateType === 'CHECKIN_LINK') {
      const url = lastCheckInUrl || `${window.location.origin}/checkin/${lastToken}`;
      return `Welcome to NestPro.\n\nComplete your digital check-in here:\n${url}\n\nThis link expires in ${expiryHours} hours.`;
    }
    if (templateType === 'WELCOME_MESSAGE') {
      return `Namaste ${residentName}! Welcome to NestPro.\n\nYour smart door lock PIN is 441392.\nWifi Password: NestPro2026\nBreakfast: 7:30-9:30 AM in 1st Floor Dining.`;
    }
    if (templateType === 'RENT_REMINDER') {
      return `Dear ${residentName}, your monthly rent of ₹15,000 for Room 101 is due. Pay via instant UPI: ${window.location.origin}/pay/REC-9812`;
    }
    if (templateType === 'PAYMENT_RECEIPT') {
      return `Payment Received! ₹15,000 rent payment for Room 101 received via UPI. Digital receipt downloaded: REC-2026-01.`;
    }
    if (templateType === 'COMPLAINT_UPDATE') {
      return `Complaint Update: Ticket #TKT-101 (AC Water Leakage) has been resolved by Ramesh (Plumber).`;
    }
    if (templateType === 'CHECKOUT_REMINDER') {
      return `Dear ${residentName}, your lease period expires tomorrow. Security deposit refund of ₹15,000 has been initiated.`;
    }
    return customText || `Namaste ${residentName}, welcome to NestPro.`;
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>WhatsApp Business API & Direct Link Center</h2>
            <span className="badge badge-emerald">ACTIVE LINK ENGINE</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
            Generate token-gated WhatsApp check-in links, test portal links live, or open directly in WhatsApp App.
          </p>
        </div>
      </div>

      {/* 2-Column Workstation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '24px', marginBottom: '28px' }}>
        
        {/* Left Column: Dispatch Controls */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>WhatsApp Link Generator</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Resident Phone & Name Selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Resident Name</label>
                <select
                  value={residentName}
                  onChange={(e) => {
                    setResidentName(e.target.value);
                    if (e.target.value === 'Aarav Patel') setRecipientPhone('+91 98765 43210');
                    if (e.target.value === 'Rohan Sharma') setRecipientPhone('+91 98123 99999');
                    if (e.target.value === 'Priya Sundaram') setRecipientPhone('+91 99000 88888');
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
                >
                  <option value="Aarav Patel">Aarav Patel (Room 101)</option>
                  <option value="Rohan Sharma">Rohan Sharma (Room G01)</option>
                  <option value="Priya Sundaram">Priya Sundaram (Room 201)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>WhatsApp Mobile Number</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>
            </div>

            {/* Template Selector */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Select WhatsApp Template</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
              >
                <option value="CHECKIN_LINK">🔗 Unique Token Check-In Link (24h Expiry)</option>
                <option value="WELCOME_MESSAGE">🔑 Welcome Message & Smart Lock PIN</option>
                <option value="RENT_REMINDER">💰 Rent Payment Reminder</option>
                <option value="PAYMENT_RECEIPT">📄 Payment Confirmation & Receipt</option>
                <option value="COMPLAINT_UPDATE">🛠️ Complaint Resolution Update</option>
                <option value="CHECKOUT_REMINDER">🚪 Checkout & Deposit Refund</option>
              </select>
            </div>

            {/* Primary Delivery Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {templateType === 'CHECKIN_LINK' ? (
                <button className="btn-primary" onClick={handleSendCheckInLink} disabled={loading} style={{ flex: 1, minWidth: '200px', padding: '12px', justifyContent: 'center' }}>
                  <Send size={16} /> Generate & Dispatch Link
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSendTemplate} disabled={loading} style={{ flex: 1, minWidth: '200px', padding: '12px', justifyContent: 'center' }}>
                  <Send size={16} /> Send Template Message
                </button>
              )}

              {/* DIRECT WHATSAPP WEB / APP LAUNCHER (wa.me) */}
              <button
                className="btn-primary"
                onClick={handleOpenWhatsAppNativeApp}
                style={{ background: '#25d366', color: '#ffffff', padding: '12px 20px', minWidth: '200px', justifyContent: 'center', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)' }}
              >
                <MessageSquare size={16} /> Open in WhatsApp App <ExternalLink size={14} />
              </button>
            </div>

            {/* DIRECT TEST IN APP PORTAL LINK */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: '12px', marginTop: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8', marginBottom: '4px' }}>
                🔗 LIVE CHECK-IN PORTAL LINK
              </div>
              <div style={{ fontSize: '0.775rem', fontFamily: 'var(--font-mono)', color: '#2563eb', wordBreak: 'break-all', marginBottom: '10px' }}>
                {lastCheckInUrl || `${window.location.origin}/checkin/${lastToken}`}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (onOpenCheckInToken) {
                      onOpenCheckInToken(lastToken);
                    } else {
                      window.open(lastCheckInUrl || `${window.location.origin}/checkin/${lastToken}`, '_blank');
                    }
                  }}
                  style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                >
                  <Sparkles size={14} /> Test Open Check-In Portal Directly
                </button>

                <button className="btn-secondary" onClick={handleCopyCheckInUrl} style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
                  <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Real Delivery Status Badge */}
            {deliveryStatus && (
              <div style={{
                background: deliveryStatus === 'DELIVERED' ? '#f0fdf4' : deliveryStatus === 'SENDING' ? '#eff6ff' : '#fee2e2',
                border: deliveryStatus === 'DELIVERED' ? '1px solid #bbf7d0' : deliveryStatus === 'SENDING' ? '1px solid #bfdbfe' : '1px solid #fecdd3',
                padding: '14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {deliveryStatus === 'DELIVERED' && <CheckCircle2 size={20} color="#16a34a" />}
                  {deliveryStatus === 'SENDING' && <RefreshCw size={20} color="#2563eb" className="spin" />}
                  {deliveryStatus === 'FAILED' && <AlertCircle size={20} color="#ef4444" />}
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: deliveryStatus === 'DELIVERED' ? '#16a34a' : deliveryStatus === 'SENDING' ? '#2563eb' : '#ef4444' }}>
                      Status: {deliveryStatus}
                    </strong>
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      {deliveryStatus === 'DELIVERED' && 'Message delivered to WhatsApp phone number.'}
                      {deliveryStatus === 'SENDING' && 'Connecting to WhatsApp Business API...'}
                      {deliveryStatus === 'FAILED' && 'Could not reach the backend. Please retry before sharing a link.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: WhatsApp Live Message Preview */}
        <div style={{ background: '#0b141a', borderRadius: '24px', padding: '24px', color: '#ffffff', display: 'flex', flexDirection: 'column', height: '520px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem' }}>
              WA
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>NestPro Official WhatsApp</div>
              <div style={{ fontSize: '0.7rem', color: '#25d366' }}>• Business Cloud API Connected</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ background: '#056162', padding: '14px 16px', borderRadius: '12px', fontSize: '0.85rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.1)' }}>
              {getTemplatePreview()}
            </div>

            <div style={{ fontSize: '0.675rem', color: 'rgba(255,255,255,0.6)', marginTop: '6px', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Delivered <Check size={14} color="#34d399" />
            </div>
          </div>
        </div>

      </div>

      {/* Outgoing WhatsApp Communication History Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Outgoing WhatsApp Communication Logs</h3>
          <span className="badge badge-emerald">{messageLogs.length} Messages Logged</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Timestamp</th>
              <th style={{ padding: '12px' }}>Recipient Name</th>
              <th style={{ padding: '12px' }}>WhatsApp Number</th>
              <th style={{ padding: '12px' }}>Template</th>
              <th style={{ padding: '12px' }}>Delivery Status</th>
              <th style={{ padding: '12px' }}>Test Open Link</th>
            </tr>
          </thead>
          <tbody>
            {messageLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', color: '#64748b', fontSize: '0.75rem' }}>{log.timestamp}</td>
                <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>{log.residentName}</td>
                <td style={{ padding: '12px' }}>{log.phone}</td>
                <td style={{ padding: '12px' }}><span className="badge badge-indigo">{log.templateType}</span></td>
                <td style={{ padding: '12px' }}><span className="badge badge-emerald">✓ {log.status}</span></td>
                <td style={{ padding: '12px' }}>
                  {log.checkInUrl ? (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        const tokenPart = log.checkInUrl.split('/checkin/')[1] || 'demo-checkin-token-88';
                        if (onOpenCheckInToken) onOpenCheckInToken(tokenPart);
                      }}
                      style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                    >
                      <Sparkles size={12} /> Test Open Portal
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.725rem', color: '#94a3b8' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
