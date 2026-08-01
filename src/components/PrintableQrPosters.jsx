import React, { useState } from 'react';
import { 
  Printer, QrCode, Building2, Wrench, DollarSign, CheckCircle2, Download, Sparkles 
} from 'lucide-react';

export default function PrintableQrPosters({ onTestScanComplaint }) {
  const [selectedRoom, setSelectedRoom] = useState('101');
  const [posterType, setPosterType] = useState('COMPLAINT');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1080px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Printable QR Poster Generator for Rooms</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Print room posters for residents to scan & report maintenance issues or pay rent with zero app downloads.
          </p>
        </div>

        <button className="btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print Room Poster (A4)
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Select Room Number</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
          >
            <option value="101">Room 101 (Floor 1)</option>
            <option value="102">Room 102 (Floor 1)</option>
            <option value="201">Room 201 (Floor 2)</option>
            <option value="G01">Room G01 (Ground Floor)</option>
            <option value="COMMON">Common Dining / Reception Area</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Poster Category</label>
          <select
            value={posterType}
            onChange={(e) => setPosterType(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem', outline: 'none' }}
          >
            <option value="COMPLAINT">🛠️ Maintenance & Issue Scanner Poster</option>
            <option value="PAYMENT">💳 Rent Payment QR Poster</option>
            <option value="CHECKIN">🎟️ Guest Self Check-In Entrance Poster</option>
          </select>
        </div>
      </div>

      {/* A4 PRINTABLE POSTER PREVIEW */}
      <div style={{ background: '#ffffff', border: '2px solid #0f172a', borderRadius: '24px', padding: '40px', maxWidth: '580px', margin: '0 auto', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        {/* NestPro Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', lineHeight: '1.1' }}>Sunrise PG & Residency</h3>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
              NestPro Room Operating System
            </div>
          </div>
        </div>

        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 900, color: '#1d4ed8', marginBottom: '24px' }}>
          ASSIGNED TO: ROOM {selectedRoom}
        </div>

        {/* Big Action Headline */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
          {posterType === 'COMPLAINT' ? '🛠️ NEED MAINTENANCE OR REPAIR?' : posterType === 'PAYMENT' ? '💳 PAY MONTHLY RENT INSTANTLY' : '🎟️ GUEST SELF CHECK-IN'}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '24px', fontWeight: 600 }}>
          Scan QR code with your phone camera below to report tap leaks, Wi-Fi issues, or housekeeping in 5 seconds.
        </p>

        {/* QR Code Canvas Frame */}
        <div style={{ border: '4px solid #0f172a', padding: '24px', borderRadius: '20px', display: 'inline-block', background: '#ffffff', marginBottom: '20px' }}>
          <svg width="180" height="180" viewBox="0 0 100 100" fill="#0f172a">
            <path d="M0,0 h30 v30 h-30 z M40,0 h20 v20 h-20 z M70,0 h30 v30 h-30 z M0,40 h20 v20 h-20 z M30,30 h40 v40 h-40 z M0,70 h30 v30 h-30 z M70,70 h30 v30 h-30 z" />
            <rect x="10" y="10" width="10" height="10" fill="#2563eb" />
            <rect x="80" y="10" width="10" height="10" fill="#2563eb" />
            <rect x="10" y="80" width="10" height="10" fill="#2563eb" />
          </svg>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          <CheckCircle2 size={16} /> NO APP DOWNLOAD REQUIRED • NO LOGIN REQUIRED
        </div>

        {/* Test Open Trigger */}
        <button
          className="btn-primary"
          onClick={() => {
            if (onTestScanComplaint) onTestScanComplaint();
          }}
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.9rem' }}
        >
          <Sparkles size={16} /> Simulate Resident QR Scan on Phone
        </button>

      </div>

    </div>
  );
}
