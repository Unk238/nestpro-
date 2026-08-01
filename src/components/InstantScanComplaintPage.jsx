import React, { useState } from 'react';
import { 
  QrCode, Wrench, Send, CheckCircle2, Camera, AlertCircle, Building2, Smartphone 
} from 'lucide-react';

export default function InstantScanComplaintPage({ onSubmitToOwner }) {
  const [roomNo, setRoomNo] = useState('101');
  const [residentName, setResidentName] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description) return;

    const generatedId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedId);

    const newTicket = {
      id: generatedId,
      resident: residentName || `Resident (Room ${roomNo})`,
      room: roomNo,
      title: `${category}: ${description.slice(0, 40)}`,
      category,
      priority,
      status: 'OPEN',
      time: 'Just now'
    };

    if (onSubmitToOwner) {
      onSubmitToOwner(newTicket);
    }

    setIsSubmitted(true);
  };

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', fontFamily: 'var(--font-sans)', padding: '20px 16px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        
        {/* LIGHTWEIGHT SCAN-AND-COMPLAIN HEADER (NO APP / NO LOGIN NEEDED) */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 8px auto' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>Sunrise PG & Residency</h2>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> Instant QR Complaint Portal (No App Needed)
          </div>
        </div>

        {isSubmitted ? (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
              Complaint Sent to Owner!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
              Ticket <strong>#{ticketId}</strong> has been logged directly onto the Owner Dashboard & Maintenance Kanban.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'left', marginBottom: '20px' }}>
              <div><strong>Room:</strong> {roomNo}</div>
              <div><strong>Category:</strong> {category}</div>
              <div><strong>Status:</strong> <span className="badge badge-emerald">SENT TO OWNER</span></div>
            </div>

            <button className="btn-primary" onClick={() => setIsSubmitted(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Log Another Issue
            </button>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <QrCode size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>1-Tap Maintenance Request</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.785rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Room No.</label>
                  <input
                    type="text"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, textAlign: 'center' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.785rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav"
                    value={residentName}
                    onChange={(e) => setResidentName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.785rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                >
                  <option value="Plumbing">🚰 Plumbing (Tap, Leak, Washroom)</option>
                  <option value="Electrical">⚡ Electrical (Geyser, AC, Power)</option>
                  <option value="Internet">📶 Wi-Fi / Internet Not Working</option>
                  <option value="Cleanliness">🧹 Housekeeping & Cleaning</option>
                  <option value="Food">🍲 Mess & Food Issue</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.785rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Describe What's Wrong</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Tap leaking in bathroom..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              {/* Attach Photo Simulator */}
              <div
                onClick={() => setPhotoUploaded(true)}
                style={{ border: '2px dashed #cbd5e1', padding: '14px', borderRadius: '10px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer' }}
              >
                <Camera size={20} color="#2563eb" style={{ margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '0.785rem', fontWeight: 700, color: '#0f172a' }}>
                  {photoUploaded ? '✓ Photo Attached' : 'Attach Photo of Issue (Optional)'}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '14px', justifyContent: 'center', fontSize: '0.95rem' }}>
                <Send size={18} /> Submit Complaint to Owner
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
