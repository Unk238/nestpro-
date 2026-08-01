import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, MessageSquare, DollarSign, FileText, Home, 
  UserCheck, Phone, CheckCircle2, Upload, Send, ArrowRight, Clock, AlertCircle, Camera 
} from 'lucide-react';
import PublicGuestLayout from './PublicGuestLayout';

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
    <PublicGuestLayout>
      <div style={{ width: '100%' }}>
        
        {/* LIGHTWEIGHT RESIDENT PORTAL HEADER */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#fefce8',
            border: '1px solid #fef08a',
            margin: '0 auto 8px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/nestpro-icon.jpg" alt="NestPro Golden House Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>{resident.property}</h2>
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 800, marginTop: '2px' }}>
            Welcome, {resident.name} (Room {resident.room.split(' ')[0]})
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
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
                flex: 1,
                padding: '10px 8px',
                borderRadius: '10px',
                border: '1px solid #334155',
                background: activeTab === t.id ? '#2563eb' : '#1e293b',
                color: activeTab === t.id ? '#ffffff' : '#94a3b8',
                fontWeight: 700,
                fontSize: '0.775rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textAlign: 'center'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SERVICE 1: RAISE COMPLAINT PORTAL */}
        {activeTab === 'complaint' && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>Raise Maintenance Issue</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>
              Submitting alerts the Owner Dashboard & maintenance team immediately.
            </p>

            {complaintSubmitted ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '14px', textAlign: 'center' }}>
                <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399' }}>Complaint Logged!</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Owner Dashboard notified. Ticket is open on maintenance Kanban.
                </p>
                <button className="btn-secondary" onClick={() => setComplaintSubmitted(false)} style={{ marginTop: '14px', fontSize: '0.8rem' }}>
                  Log Another Issue
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#ffffff', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="Plumbing">Plumbing (Water Leak / Tap)</option>
                    <option value="Electrical">Electrical (Geyser / AC / Power)</option>
                    <option value="Internet">Internet / Wi-Fi</option>
                    <option value="Cleanliness">Room & Housekeeping</option>
                    <option value="Food">Mess & Dining Food</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Description of Issue</label>
                  <textarea
                    rows="4"
                    placeholder="Describe the issue in detail..."
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#ffffff', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={complaintPriority}
                    onChange={(e) => setComplaintPriority(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#ffffff', outline: 'none', fontWeight: 600 }}
                  >
                    <option value="CRITICAL">CRITICAL (Emergency / Leak)</option>
                    <option value="HIGH">HIGH (Urgent)</option>
                    <option value="MEDIUM">MEDIUM (Normal)</option>
                  </select>
                </div>

                {/* Photo Upload Simulator */}
                <div
                  onClick={() => setComplaintPhotoUploaded(true)}
                  style={{ border: '2px dashed #334155', padding: '16px', borderRadius: '10px', textAlign: 'center', background: '#1e293b', cursor: 'pointer' }}
                >
                  <Camera size={24} color="#60a5fa" style={{ margin: '0 auto 4px auto' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
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
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>Monthly Rent Payment</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>
              Pay via UPI / Netbanking to update Owner Payment Ledger instantly.
            </p>

            {paymentCompleted ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '14px' }}>
                <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34d399' }}>Payment Successful!</h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                  ₹{resident.rentDue.toLocaleString()} received via UPI. Digital receipt downloaded.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '20px', borderRadius: '14px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>RENT BALANCE DUE:</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#60a5fa' }}>₹{resident.rentDue.toLocaleString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>Room {resident.room}</div>
                </div>

                <button className="btn-primary" onClick={handlePaymentSubmit} style={{ width: '100%', justifyContent: 'center', padding: '14px', background: '#10b981' }}>
                  <DollarSign size={18} /> Pay ₹{resident.rentDue.toLocaleString()} via UPI
                </button>
              </div>
            )}
          </div>
        )}

        {/* SERVICE 3: ROOM & SMART LOCK PIN */}
        {activeTab === 'room' && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>Room & Smart Key Access</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>Your assigned room details & electronic door lock passcode.</p>

            <div style={{ background: '#1e293b', border: '2px solid #2563eb', padding: '20px', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SMART DOOR LOCK PIN:</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{resident.lockPin}</div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '6px', fontWeight: 700 }}>✓ Key Active for Room {resident.room.split(' ')[0]}</div>
            </div>
          </div>
        )}

        {/* SERVICE 4: VISITOR PASS */}
        {activeTab === 'visitor' && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>Visitor Gate Pass</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '20px' }}>Generate 1-day visitor pass for main gate entrance.</p>

            <button className="btn-primary" onClick={() => alert('Issued Visitor Pass #VIS-402 for Main Gate.')} style={{ width: '100%', justifyContent: 'center' }}>
              Generate Gate Pass QR
            </button>
          </div>
        )}

      </div>
    </PublicGuestLayout>
  );
}
