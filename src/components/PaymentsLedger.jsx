import React, { useState } from 'react';
import { 
  DollarSign, Search, Filter, Download, MessageSquare, FileText, 
  CheckCircle2, Clock, AlertCircle, Plus, Eye, Send 
} from 'lucide-react';

export default function PaymentsLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const [payments, setPayments] = useState([
    { id: 'PAY-901', resident: 'Aarav Patel', room: '101', amount: 15000, status: 'PAID', method: 'UPI Instant', date: '2026-02-01', transactionId: 'TXN-98124401', receiptNo: 'REC-2026-01' },
    { id: 'PAY-902', resident: 'Rohan Sharma', room: 'G01', amount: 9500, status: 'PENDING', method: 'Pending Razorpay', date: '2026-02-01', transactionId: '-', receiptNo: '-' },
    { id: 'PAY-903', resident: 'Priya Sundaram', room: '201', amount: 25000, status: 'PAID', method: 'UPI Instant', date: '2026-02-02', transactionId: 'TXN-44109822', receiptNo: 'REC-2026-02' },
    { id: 'PAY-904', resident: 'Vikram Reddy', room: '102', amount: 9500, status: 'PARTIAL', method: 'Cash Deposit', date: '2026-02-03', transactionId: 'CSH-00291', receiptNo: 'REC-2026-03' }
  ]);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.resident.toLowerCase().includes(searchQuery.toLowerCase()) || p.room.includes(searchQuery);
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendReminder = (residentName) => {
    alert(`Dispatched WhatsApp Rent Payment Reminder to ${residentName}.`);
  };

  const handleGenerateReceipt = (pay) => {
    setSelectedReceipt(pay);
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Payment & Rent Collection Ledger</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Track rent collections, pending balances, issue digital receipts, and trigger automated WhatsApp reminders.
          </p>
        </div>

        <button className="btn-primary" onClick={() => alert('Bulk WhatsApp Rent Reminders sent to all pending tenants!')}>
          <MessageSquare size={16} /> Bulk WhatsApp Rent Reminders
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search payment by resident name or room..."
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
          <option value="PENDING">Pending</option>
          <option value="PARTIAL">Partial</option>
        </select>
      </div>

      {/* Payment Table */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
              <th style={{ padding: '12px' }}>Payment ID</th>
              <th style={{ padding: '12px' }}>Resident & Room</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Payment Method</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#2563eb' }}>{p.id}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{p.resident}</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Room {p.room}</div>
                </td>
                <td style={{ padding: '12px', fontWeight: 900, color: '#16a34a' }}>₹{p.amount.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{p.method}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge ${p.status === 'PAID' ? 'badge-emerald' : p.status === 'PENDING' ? 'badge-amber' : 'badge-purple'}`}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{p.date}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {p.status === 'PAID' ? (
                      <button className="btn-secondary" onClick={() => handleGenerateReceipt(p)} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        <FileText size={12} /> Receipt
                      </button>
                    ) : (
                      <button className="btn-primary" onClick={() => handleSendReminder(p.resident)} style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#d97706' }}>
                        <Send size={12} /> Remind
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '16px', padding: '28px', border: '1px solid #cbd5e1', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>RENT PAYMENT RECEIPT</h3>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Receipt #: {selectedReceipt.receiptNo}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Resident Name:</span>
                <strong style={{ color: '#0f172a' }}>{selectedReceipt.resident}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Room Assigned:</span>
                <strong>Room {selectedReceipt.room}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Amount Paid:</span>
                <strong style={{ color: '#16a34a', fontSize: '1.1rem' }}>₹{selectedReceipt.amount.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Transaction ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{selectedReceipt.transactionId}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={() => alert('Downloaded PDF Receipt!')} style={{ flex: 1 }}>
                <Download size={16} /> Download PDF
              </button>
              <button className="btn-secondary" onClick={() => setSelectedReceipt(null)}>Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
