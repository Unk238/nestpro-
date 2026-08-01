import React, { useState } from 'react';
import { 
  Building2, Users, ShieldCheck, AlertCircle, KeyRound, 
  TrendingUp, TrendingDown, PhoneCall, CheckCircle2, Clock, DollarSign, 
  Layers, Plus, ArrowRight, RefreshCw, MessageSquare, Sparkles, Activity,
  ChevronDown, Search, Filter, MoreVertical, Bell
} from 'lucide-react';

export default function OwnerCommandCenterView({ onOpenCheckInToken }) {
  const [selectedProperty, setSelectedProperty] = useState('prop-1');

  const propertiesList = [
    { id: 'prop-1', name: 'Sunrise PG & Residency', type: 'PG', occupancy: 92, vacantBeds: 2, totalBeds: 24, revenue: '₹1,85,000', pendingRent: '₹14,500', checkinsToday: 4, checkoutsToday: 1, aiCallsHandled: 48, openComplaints: 2 },
    { id: 'prop-2', name: 'Sunrise Luxury Hotel', type: 'Hotel', occupancy: 78, vacantBeds: 6, totalBeds: 30, revenue: '₹3,40,000', pendingRent: '₹0', checkinsToday: 8, checkoutsToday: 5, aiCallsHandled: 112, openComplaints: 1 }
  ];

  const currentProp = propertiesList.find(p => p.id === selectedProperty) || propertiesList[0];

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Workspace Header Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{currentProp.name} Command Center</h2>
              <span className="badge badge-indigo">{currentProp.type} OS</span>
              <span className="badge badge-emerald">LIVE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              NESTPRO PG MANAGEMENT • MANAGE. AUTOMATE. GROW.
            </p>
          </div>
        </div>

        {/* Property Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: '#f8fafc', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {propertiesList.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProperty(p.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: selectedProperty === p.id ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : 'transparent',
                color: selectedProperty === p.id ? '#fff' : '#64748b',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {p.name.split(' ')[0]} ({p.type})
            </button>
          ))}
        </div>
      </div>

      {/* 6 CORE OPERATIONAL METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        <div className="metric-card metric-card-emerald">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Occupancy Rate</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>{currentProp.occupancy}%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{currentProp.totalBeds - currentProp.vacantBeds} of {currentProp.totalBeds} Beds Filled</div>
        </div>

        <div className="metric-card metric-card-indigo">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Today's Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', marginTop: '4px' }}>{currentProp.revenue}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Automated UPI & Razorpay</div>
        </div>

        <div className="metric-card metric-card-amber">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Pending Payments</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#b45309', marginTop: '4px' }}>{currentProp.pendingRent}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>1-Click WhatsApp Remind</div>
        </div>

        <div className="metric-card metric-card-cyan">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Vacant Rooms</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>{currentProp.vacantBeds} Beds</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Ready for Instant Check-In</div>
        </div>

        <div className="metric-card metric-card-purple">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Check-Ins Today</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>{currentProp.checkinsToday} Residents</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Token-Gated QR Completed</div>
        </div>

        <div className="metric-card metric-card-rose">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Open Complaints</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#e11d48', marginTop: '4px' }}>{currentProp.openComplaints} Tickets</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Kanban Dispatch Active</div>
        </div>

      </div>

      {/* QUICK DISPATCH TOOLBAR */}
      <div className="glass-panel-glow" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Instant Automation Dispatch & WhatsApp Reminders
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            Issue single-use self check-in links or trigger automated WhatsApp rent payment requests.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => onOpenCheckInToken('demo-checkin-token-88')}>
            <Plus size={16} /> Issue Check-In Token
          </button>

          <button className="btn-secondary" onClick={() => alert(`Bulk WhatsApp Rent Reminders sent for ${currentProp.name}.`)}>
            <MessageSquare size={16} color="#10b981" /> Send Bulk Reminders
          </button>
        </div>
      </div>

    </div>
  );
}
