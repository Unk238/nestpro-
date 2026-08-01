import React, { useState } from 'react';
import { 
  Settings, User, Shield, Bell, CreditCard, Building2, Users, Plus, Key, CheckCircle2 
} from 'lucide-react';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('business');
  
  // Team Members State
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Suresh Nair', email: 'suresh@nestpro.com', role: 'Owner (Full Access)', status: 'ACTIVE' },
    { id: 2, name: 'Rajesh Kumar', email: 'rajesh.k@nestpro.com', role: 'Property Manager', status: 'ACTIVE' },
    { id: 3, name: 'Pooja Verma', email: 'pooja.v@nestpro.com', role: 'Accountant', status: 'ACTIVE' }
  ]);

  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Property Manager');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) return;

    setTeamMembers([
      ...teamMembers,
      { id: Date.now(), name: newMemberName, email: newMemberEmail, role: newMemberRole, status: 'ACTIVE' }
    ]);
    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddTeamModalOpen(false);
    alert(`Added ${newMemberName} as ${newMemberRole}!`);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>System & Business Settings</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Manage business profile, team member permissions, notification channels, security, and subscription billing.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'business', label: '🏢 Business Details', icon: Building2 },
          { id: 'team', label: '👥 Team & Roles', icon: Users },
          { id: 'notifications', label: '🔔 Notifications & WhatsApp', icon: Bell },
          { id: 'billing', label: '💳 Subscription & Billing', icon: CreditCard }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: activeTab === t.id ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
              color: activeTab === t.id ? '#ffffff' : '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BUSINESS DETAILS */}
      {activeTab === 'business' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>Business Profile & Identifiers</h3>

          <form onSubmit={(e) => { e.preventDefault(); alert('Saved Business Details!'); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Business Brand Name</label>
              <input type="text" defaultValue="NestPro Accommodation Operating System" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>GST Registration Number</label>
              <input type="text" defaultValue="29ABCDE1234F1Z5" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Support Phone Number</label>
              <input type="text" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button type="submit" className="btn-primary">Save Business Details</button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: TEAM & ROLES */}
      {activeTab === 'team' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Team Members & Role Access Control</h3>
            <button className="btn-primary" onClick={() => setIsAddTeamModalOpen(true)}>
              <Plus size={16} /> Add Team Member
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>Name</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{m.name}</td>
                  <td style={{ padding: '12px' }}>{m.email}</td>
                  <td style={{ padding: '12px' }}><span className="badge badge-indigo">{m.role}</span></td>
                  <td style={{ padding: '12px' }}><span className="badge badge-emerald">{m.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: BILLING */}
      {activeTab === 'billing' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Current Subscription Plan</h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>NestPro Enterprise Plan (Unlimited Properties & AI Calls)</div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>✓ ACTIVE PLAN</span>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569' }}>
            Renews on <strong>March 1, 2026</strong> • ₹4,999/month billed annually.
          </div>
        </div>
      )}

      {/* Add Team Member Modal */}
      {isAddTeamModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '16px', padding: '28px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px', color: '#0f172a' }}>Add New Team Member</h3>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Member Name</label>
                <input type="text" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Email Address</label>
                <input type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Assigned Role</label>
                <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Maintenance Staff">Maintenance Staff</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Member</button>
                <button type="button" className="btn-secondary" onClick={() => setIsAddTeamModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
