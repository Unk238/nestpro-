import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, DollarSign, FileText, Home, 
  UserCheck, Phone, CheckCircle2, Upload, Send, ArrowRight, Clock, AlertCircle, Camera 
} from 'lucide-react';

export default function ResidentPortal({ token, tokenData, onSubmitComplaint, onPayRent }) {
  const [activeTab, setActiveTab] = useState(tokenData?.type || 'complaint');

  // Resident Information from Token
  const resident = tokenData?.resident || {
    name: 'Aarav Patel',
    room: '101 (Single Luxury)',
    property: 'Sunrise PG & Residency',
    rentDue: 15000,
    lockPin: '441392'
  };

  // Complaint Form State
  const [complaintCategory, setComplaintCategory] = useState('Maintenance');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPriority, setComplaintPriority] = useState('HIGH');
  const [complaintPhotoUploaded, setComplaintPhotoUploaded] = useState(false);
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  // Payment Form State
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintDesc) return;

    if (onSubmitComplaint) {
      onSubmitComplaint({
        id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
        resident: resident.name,
        room: resident.room.split(' ')[0],
        title: `${complaintCategory}: ${complaintDesc.slice(0, 40)}`,
        category: complaintCategory,
        priority: complaintPriority,
        status: 'OPEN',
        time: 'Just now'
      });
    }

    setComplaintSubmitted(true);
    alert('Complaint Submitted Successfully! Owner Dashboard notified.');
  };

  const handlePaymentSubmit = () => {
    if (onPayRent) {
      onPayRent({
        resident: resident.name,
        room: resident.room.split(' ')[0],
        amount: resident.rentDue
      });
    }
    setPaymentCompleted(true);
    alert('Rent Payment Completed! Receipt generated and Owner Ledger updated.');
  };

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'var(--font-sans)', padding: '24px 16px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        
        {/* LIGHTWEIGHT RESIDENT PORTAL HEADER (NO OWNER DASHBOARD ACCESS) */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 8px auto' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{resident.property}</h2>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 800, marginTop: '2px' }}>
            Welcome, {resident.name} (Room {resident.room.split(' ')[0]})
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
            🔒 Token-Protected Resident Access Portal (`/access/${token || '3JHF82LK'}`)
          </div>
        </div>

        {/* RESIDENT SERVICES NAV TABS (ONLY OWNER ENABLED SERVICES) */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '20px' }}>
          {[
            { id: 'complaint', label: '🛠️ Raise Complaint' },
            { id: 'payment', label: '💳 Pay Rent' },
            { id: 'room', label: '🏠 Room & Key PIN' },
            { id: 'visitor', label: '🎫 Visitor Pass' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: activeTab === t.id ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
                color: activeTab === t.id ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SERVICE 1: RAISE COMPLAINT PORTAL */}
        {activeTab === 'complaint' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Raise Maintenance Issue</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
              Submitting alerts the Owner Dashboard & maintenance team immediately.
            </p>

            {complaintSubmitted ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>Complaint Logged!</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  Owner Dashboard notified. Ticket is open on maintenance Kanban.
                </p>
                <button className="btn-secondary" onClick={() => setComplaintSubmitted(false)} style={{ marginTop: '14px', fontSize: '0.8rem' }}>
                  Log Another Issue
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="Plumbing">Plumbing (Water Leak / Tap)</option>
                    <option value="Electrical">Electrical (Geyser / AC / Power)</option>
                    <option value="Internet">Internet / Wi-Fi</option>
                    <option value="Cleanliness">Room & Housekeeping</option>
                    <option value="Food">Mess & Dining Food</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Description of Issue</label>
                  <textarea
                    rows="4"
                    placeholder="Describe the issue in detail..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="CRITICAL">CRITICAL (Emergency / Leak)</option>
                    <option value="HIGH">HIGH (Urgent)</option>
                    <option value="MEDIUM">MEDIUM (Normal)</option>
                  </select>
                </div>

                {/* Photo Upload Simulator */}
                <div
                  onClick={() => setComplaintPhotoUploaded(true)}
                  style={{ border: '2px dashed #cbd5e1', padding: '16px', borderRadius: '10px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}
                >
                  <Camera size={24} color="#2563eb" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                    {complaintPhotoUploaded ? '✓ Issue Photo Uploaded' : 'Attach Photo of Issue (Optional)'}
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '12px', justifyContent: 'center' }}>
                  <Send size={16} /> Submit Complaint to Owner Dashboard
                </button>
              </form>
            )}
          </div>
        )}

        {/* SERVICE 2: PAY RENT PORTAL */}
        {activeTab === 'payment' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Monthly Rent Payment</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>
              Pay via UPI / Netbanking to update Owner Payment Ledger instantly.
            </p>

            {paymentCompleted ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '14px' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a' }}>Payment Successful!</h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                  ₹{resident.rentDue.toLocaleString()} received via UPI. Digital receipt downloaded.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>RENT BALANCE DUE:</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2563eb' }}>₹{resident.rentDue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>Room {resident.room}</div>
                </div>

                <button className="btn-primary" onClick={handlePaymentSubmit} style={{ width: '100%', justifyContent: 'center', padding: '14px', background: '#16a34a' }}>
                  <DollarSign size={18} /> Pay ₹{resident.rentDue.toLocaleString()} via UPI
                </button>
              </div>
            )}
          </div>
        )}

        {/* SERVICE 3: ROOM & SMART LOCK PIN */}
        {activeTab === 'room' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Room & Smart Key Access</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Your assigned room details & electronic door lock passcode.</p>

            <div style={{ background: '#f8fafc', border: '2px solid #2563eb', padding: '20px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SMART DOOR LOCK PIN:</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{resident.lockPin}</div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '6px', fontWeight: 700 }}>✓ Key Active for Room {resident.room.split(' ')[0]}</div>
            </div>
          </div>
        )}

        {/* SERVICE 4: VISITOR PASS */}
        {activeTab === 'visitor' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>Visitor Gate Pass</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Generate 1-day visitor pass for main gate entrance.</p>

            <button className="btn-primary" onClick={() => alert('Issued Visitor Pass #VIS-402 for Main Gate.')} style={{ width: '100%', justifyContent: 'center' }}>
              Generate Gate Pass QR
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
