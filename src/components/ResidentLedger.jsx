import React, { useState } from 'react';
import { 
  Users, Search, Filter, Download, ShieldCheck, Phone, Mail, Home, 
  DollarSign, FileText, CheckCircle2, Clock, Eye, AlertCircle, Plus, Trash2, KeyRound, QrCode 
} from 'lucide-react';
import OwnerTokenGeneratorModal from './OwnerTokenGeneratorModal';

export default function ResidentLedger({ onLaunchResidentPortal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedResident, setSelectedResident] = useState(null);
  const [tokenModalResident, setTokenModalResident] = useState(null);

  const [residents, setResidents] = useState([
    {
      id: 'res-101',
      name: 'Aarav Patel',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210',
      email: 'aarav.patel@techcorp.com',
      property: 'Sunrise PG & Residency',
      room: '101 (Single Luxury)',
      rent: 15000,
      paymentStatus: 'PAID',
      kycStatus: 'VERIFIED',
      aadhaarNo: '9812-4410-8921',
      emergencyContact: '+91 98111 22233 (Father)',
      agreementSigned: true,
      checkInDate: '2026-01-15',
      smartLockPin: '441392'
    },
    {
      id: 'res-102',
      name: 'Rohan Sharma',
      photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      phone: '+91 98123 99999',
      email: 'rohan.s@startup.io',
      property: 'Sunrise PG & Residency',
      room: 'G01 (Double Sharing)',
      rent: 9500,
      paymentStatus: 'PENDING',
      kycStatus: 'VERIFIED',
      aadhaarNo: '4410-9812-3321',
      emergencyContact: '+91 98222 33344 (Brother)',
      agreementSigned: true,
      checkInDate: '2026-02-01',
      smartLockPin: '892014'
    },
    {
      id: 'res-103',
      name: 'Priya Sundaram',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      phone: '+91 99000 88888',
      email: 'priya.s@designlab.com',
      property: 'Sunrise Luxury Hotel',
      room: '201 (Deluxe Suite)',
      rent: 25000,
      paymentStatus: 'PAID',
      kycStatus: 'REVIEW_FLAG',
      aadhaarNo: '8812-3300-1122',
      emergencyContact: '+91 99333 44455 (Mother)',
      agreementSigned: true,
      checkInDate: '2026-02-10',
      smartLockPin: '319042'
    }
  ]);

  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || r.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = 'ID,Name,Phone,Email,Room,Rent,PaymentStatus,KYCStatus,CheckInDate\n';
    const rows = residents.map(r => `${r.id},"${r.name}",${r.phone},${r.email},"${r.room}",${r.rent},${r.paymentStatus},${r.kycStatus},${r.checkInDate}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nestpro_residents_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Resident Ledger Database</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Complete directory of residents, Aadhaar KYC verification, rental agreements, and encrypted access token generation.
          </p>
        </div>

        <button className="btn-secondary" onClick={exportCSV}>
          <Download size={16} /> Export Resident Ledger CSV
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search resident by name, room number, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
        >
          <option value="ALL">All Payment Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending Rent</option>
        </select>
      </div>

      {/* Resident Ledger Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Resident</th>
              <th style={{ padding: '12px' }}>Room & Property</th>
              <th style={{ padding: '12px' }}>Contact Details</th>
              <th style={{ padding: '12px' }}>Monthly Rent</th>
              <th style={{ padding: '12px' }}>Rent Status</th>
              <th style={{ padding: '12px' }}>KYC Verification</th>
              <th style={{ padding: '12px' }}>Generate Digital Access</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map(res => (
              <tr key={res.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={res.photo} alt={res.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{res.name}</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Since {res.checkInDate}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Room {res.room}</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{res.property}</div>
                </td>

                <td style={{ padding: '12px' }}>
                  <div>{res.phone}</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>{res.email}</div>
                </td>

                <td style={{ padding: '12px', fontWeight: 800, color: '#2563eb' }}>
                  ₹{res.rent.toLocaleString()}/mo
                </td>

                <td style={{ padding: '12px' }}>
                  <span className={`badge ${res.paymentStatus === 'PAID' ? 'badge-emerald' : 'badge-amber'}`}>
                    {res.paymentStatus}
                  </span>
                </td>

                <td style={{ padding: '12px' }}>
                  <span className={`badge ${res.kycStatus === 'VERIFIED' ? 'badge-emerald' : 'badge-rose'}`}>
                    {res.kycStatus}
                  </span>
                </td>

                <td style={{ padding: '12px' }}>
                  <button className="btn-primary" onClick={() => setTokenModalResident(res)} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    <QrCode size={14} /> Generate QR / Token Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Owner Token Generator Modal */}
      {tokenModalResident && (
        <OwnerTokenGeneratorModal
          resident={tokenModalResident}
          onClose={() => setTokenModalResident(null)}
          onLaunchPortal={(tokenStr, data) => {
            if (onLaunchResidentPortal) onLaunchResidentPortal(tokenStr, data);
          }}
        />
      )}

    </div>
  );
}
