import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, ShieldCheck, AlertCircle, KeyRound, 
  Plus, Copy, Check, RefreshCw, Sparkles, Layers, Lock 
} from 'lucide-react';

export default function AdminDashboard({ onOpenCheckInToken }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form for token generation
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('102');
  const [createdToken, setCreatedToken] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    try {
      const res = await fetch('/api/admin/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentName: newName,
          phone: newPhone,
          assignedRoomNumber: selectedRoom
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCreatedToken(json);
      setNewName('');
      setNewPhone('');
      fetchOverview();
    } catch (err) {
      alert(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 16px' }}>
      
      {/* Header & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manager OS • Command Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Real-time state monitoring across Drizzle ORM database, active tokens, KYC audits, and access logs.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchOverview} style={{ padding: '8px 16px' }}>
          <RefreshCw size={16} /> Refresh State
        </button>
      </div>

      {loading && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Drizzle ORM real-time overview...
        </div>
      )}

      {data && (
        <>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Occupancy Rate
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                {data.stats.occupancyRate}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                {data.stats.occupiedRooms} occupied / {data.stats.totalRooms} total rooms
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Available Rooms
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {data.stats.availableRooms}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Ready for instant check-in
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Pending Check-Ins
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
                {data.stats.pendingCheckins}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Active token links issued
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Open Complaints
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px' }}>
                {data.stats.openComplaints}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                AI dispatched tickets
              </div>
            </div>

          </div>

          {/* TOKEN GENERATOR PANEL */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="var(--primary)" /> Issue Self Check-In Token Link
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Property manager creates single-use check-in token for new incoming resident.
            </p>

            <form onSubmit={handleGenerateToken} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Resident Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sundaram"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  placeholder="+91 98123 45678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Assign Available Room</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  {data.rooms.filter(r => r.status === 'AVAILABLE').map(r => (
                    <option key={r.id} value={r.roomNumber}>
                      Room {r.roomNumber} ({r.type}) - ₹{r.priceMonthly}/mo
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px 20px', height: '42px', justifyContent: 'center' }}>
                Generate Token Link
              </button>
            </form>

            {createdToken && (
              <div style={{
                marginTop: '20px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399' }}>✓ Check-In Link Generated for {createdToken.residentName}!</div>
                  <code style={{ fontSize: '0.8rem', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
                    {window.location.origin}/checkin/{createdToken.token}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => copyToClipboard(`${window.location.origin}/checkin/${createdToken.token}`)} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    {copied ? <Check size={14} color="#34d399" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <button className="btn-primary" onClick={() => onOpenCheckInToken(createdToken.token)} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                    Test Check-In Flow
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drizzle ORM Room Inventory */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
              🏠 Drizzle ORM Room Inventory Status
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px' }}>Room #</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Floor</th>
                    <th style={{ padding: '12px' }}>Monthly Rent</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Current Occupant</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rooms.map(room => (
                    <tr key={room.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>Room {room.roomNumber}</td>
                      <td style={{ padding: '12px' }}>{room.type}</td>
                      <td style={{ padding: '12px' }}>Floor {room.floor}</td>
                      <td style={{ padding: '12px', fontWeight: 600, color: 'var(--accent-emerald)' }}>₹{room.priceMonthly.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${room.status === 'AVAILABLE' ? 'badge-emerald' : 'badge-amber'}`}>
                          {room.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: room.currentTenant ? '#fff' : 'var(--text-dim)' }}>
                        {room.currentTenant || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Check-In Tokens Queue & KYC Logs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            
            {/* Tokens Queue */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
                🔑 Issued Check-In Tokens
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>Resident</th>
                      <th style={{ padding: '10px' }}>Room</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Access PIN</th>
                      <th style={{ padding: '10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.checkinTokens.map(tok => (
                      <tr key={tok.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px', fontWeight: 600 }}>{tok.residentName}</td>
                        <td style={{ padding: '10px' }}>Room {tok.assignedRoomNumber}</td>
                        <td style={{ padding: '10px' }}>
                          <span className={`badge ${tok.status === 'CHECKED_IN' ? 'badge-emerald' : 'badge-indigo'}`}>
                            {tok.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: '#a5b4fc', fontWeight: 700 }}>
                          {tok.accessCode || 'Pending'}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <button className="btn-secondary" onClick={() => onOpenCheckInToken(tok.token)} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Complaints Board */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
                🛠️ Maintenance Tickets (AI Auto-Logged)
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px' }}>Ticket #</th>
                      <th style={{ padding: '10px' }}>Category</th>
                      <th style={{ padding: '10px' }}>Room</th>
                      <th style={{ padding: '10px' }}>Priority</th>
                      <th style={{ padding: '10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.complaints.map(comp => (
                      <tr key={comp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fb7185' }}>{comp.ticketId}</td>
                        <td style={{ padding: '10px' }}>{comp.category}</td>
                        <td style={{ padding: '10px' }}>Room {comp.roomNumber}</td>
                        <td style={{ padding: '10px' }}>
                          <span className="badge badge-amber">{comp.priority}</span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span className="badge badge-rose">{comp.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
