import React, { useState } from 'react';
import { 
  MessageSquare, Wrench, AlertTriangle, CheckCircle2, Clock, 
  User, Plus, Search, Filter, ArrowRight, QrCode, Printer, X, Sparkles 
} from 'lucide-react';

export default function ComplaintsKanban({ onNavigateToQrPosters }) {
  const [complaints, setComplaints] = useState([
    { id: 'TKT-101', resident: 'Rohan Sharma', room: '101', title: 'AC Water Leakage', category: 'Plumbing', priority: 'CRITICAL', status: 'IN_PROGRESS', staff: 'Ramesh (Plumber)', createdAt: '2 hours ago' },
    { id: 'TKT-102', resident: 'Aarav Patel', room: 'G01', title: 'Floor 2 Wi-Fi Router Reset', category: 'Internet', priority: 'HIGH', status: 'OPEN', staff: 'Unassigned', createdAt: '4 hours ago' },
    { id: 'TKT-103', resident: 'Priya Sundaram', room: '201', title: 'Hot Water Geyser Tripping', category: 'Electrical', priority: 'MEDIUM', status: 'RESOLVED', staff: 'Suresh (Electrician)', createdAt: '1 day ago' }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedRoomForQr, setSelectedRoomForQr] = useState('101');

  const [newTitle, setNewTitle] = useState('');
  const [newRoom, setNewRoom] = useState('101');
  const [newPriority, setNewPriority] = useState('HIGH');

  const handleStatusChange = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleAddComplaint = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      resident: 'Walk-In / Resident',
      room: newRoom,
      title: newTitle,
      category: 'Maintenance',
      priority: newPriority,
      status: 'OPEN',
      staff: 'Unassigned',
      createdAt: 'Just now'
    };

    setComplaints([newTicket, ...complaints]);
    setNewTitle('');
    setIsAddModalOpen(false);
    alert('Logged Maintenance Complaint Ticket!');
  };

  const columns = [
    { id: 'OPEN', label: 'Open Tickets', color: '#ef4444' },
    { id: 'IN_PROGRESS', label: 'In Progress', color: '#f59e0b' },
    { id: 'RESOLVED', label: 'Resolved', color: '#10b981' }
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Maintenance & Complaints Kanban</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            5-stage ticket tracking, staff assignment, ticket resolution, and instant room QR poster generator.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* DIRECT GENERATE QR SCANNER BUTTON IN COMPLAINTS SECTION */}
          <button className="btn-primary" onClick={() => setIsQrModalOpen(true)} style={{ background: '#2563eb' }}>
            <QrCode size={18} /> Generate Room Complaint QR Scanner
          </button>

          <button className="btn-secondary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} /> Log Manual Ticket
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {columns.map(col => {
          const colTickets = complaints.filter(c => c.status === col.id);
          return (
            <div key={col.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: `2px solid ${col.color}` }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{col.label}</span>
                <span style={{ background: col.color, color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                  {colTickets.length}
                </span>
              </div>

              {/* Tickets Stream */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {colTickets.map(tkt => (
                  <div key={tkt.id} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>{tkt.id}</span>
                      <span className={`badge ${tkt.priority === 'CRITICAL' ? 'badge-rose' : tkt.priority === 'HIGH' ? 'badge-amber' : 'badge-indigo'}`}>
                        {tkt.priority}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>{tkt.title}</h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                      Room {tkt.room} • {tkt.resident}
                    </div>

                    <div style={{ fontSize: '0.75rem', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                      👷 Assigned: <strong>{tkt.staff}</strong>
                    </div>

                    {/* Column Movement Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {col.id === 'OPEN' && (
                        <button className="btn-primary" onClick={() => handleStatusChange(tkt.id, 'IN_PROGRESS')} style={{ padding: '4px 10px', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}>
                          Start Progress <ArrowRight size={12} />
                        </button>
                      )}

                      {col.id === 'IN_PROGRESS' && (
                        <button className="btn-primary" onClick={() => handleStatusChange(tkt.id, 'RESOLVED')} style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#16a34a', width: '100%', justifyContent: 'center' }}>
                          <CheckCircle2 size={12} /> Mark Resolved
                        </button>
                      )}

                      {col.id === 'RESOLVED' && (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 800 }}>✓ Resolved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* GENERATE COMPLAINT QR POSTER MODAL (INSIDE COMPLAINTS SECTION) */}
      {isQrModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '20px', padding: '28px', border: '1px solid #cbd5e1', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>Room Complaint QR Poster</h3>
              </div>
              <button onClick={() => setIsQrModalOpen(false)} style={{ background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={18} color="#64748b" />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
              Print this QR poster to stick inside Room {selectedRoomForQr}. Residents scan with their phone camera to report tap leaks or Wi-Fi issues without downloading any app.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Select Target Room</label>
              <select
                value={selectedRoomForQr}
                onChange={(e) => setSelectedRoomForQr(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
              >
                <option value="101">Room 101 (Floor 1)</option>
                <option value="102">Room 102 (Floor 1)</option>
                <option value="201">Room 201 (Floor 2)</option>
                <option value="G01">Room G01 (Ground Floor)</option>
              </select>
            </div>

            {/* Generated QR Poster Card */}
            <div style={{ background: '#f8fafc', border: '2px dashed #0f172a', borderRadius: '16px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2563eb', marginBottom: '4px' }}>SCAN QR TO REPORT ISSUES</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginBottom: '12px' }}>ROOM {selectedRoomForQr}</div>

              <div style={{ border: '3px solid #0f172a', padding: '12px', borderRadius: '12px', display: 'inline-block', background: '#ffffff' }}>
                <svg width="120" height="120" viewBox="0 0 100 100" fill="#0f172a">
                  <path d="M0,0 h30 v30 h-30 z M40,0 h20 v20 h-20 z M70,0 h30 v30 h-30 z M0,40 h20 v20 h-20 z M30,30 h40 v40 h-40 z M0,70 h30 v30 h-30 z M70,70 h30 v30 h-30 z" />
                  <rect x="10" y="10" width="10" height="10" fill="#2563eb" />
                  <rect x="80" y="10" width="10" height="10" fill="#2563eb" />
                  <rect x="10" y="80" width="10" height="10" fill="#2563eb" />
                </svg>
              </div>

              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 800, marginTop: '8px' }}>
                ✓ Zero App Download • Zero Login
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={() => window.print()} style={{ flex: 1, justifyContent: 'center' }}>
                <Printer size={16} /> Print A4 Room Poster
              </button>

              <button className="btn-secondary" onClick={() => setIsQrModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '16px', padding: '28px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px', color: '#0f172a' }}>Log Maintenance Ticket</h3>

            <form onSubmit={handleAddComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Complaint Title</label>
                <input type="text" placeholder="e.g. Geyser not heating water" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Room Number</label>
                <input type="text" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Priority</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Ticket</button>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
