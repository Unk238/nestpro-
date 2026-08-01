import React, { useState } from 'react';
import { 
  Building2, Users, ShieldCheck, AlertCircle, KeyRound, 
  TrendingUp, TrendingDown, PhoneCall, CheckCircle2, Clock, DollarSign, 
  Layers, Plus, ArrowRight, RefreshCw, MessageSquare, Sparkles, Activity,
  ChevronDown, Search, Filter, MoreVertical
} from 'lucide-react';

export default function OwnerCommandCenter({ onOpenCheckInToken }) {
  const [selectedProperty, setSelectedProperty] = useState('prop-1');
  const [timeRange, setTimeRange] = useState('This Month');

  const propertiesList = [
    { 
      id: 'prop-1', 
      name: 'Sunrise PG & Residency', 
      type: 'PG', 
      occupancy: 92, 
      occupancyTrend: '+4.2%',
      vacantBeds: 2, 
      totalBeds: 24, 
      revenue: '₹1,85,000', 
      revenueTrend: '+12.8%',
      pendingRent: '₹14,500', 
      checkinsToday: 3, 
      checkoutsToday: 1, 
      aiCallsHandled: 48, 
      newLeads: 9, 
      kycVerified: 22, 
      kycPending: 2, 
      openComplaints: 1 
    },
    { 
      id: 'prop-2', 
      name: 'Sunrise Luxury Hotel', 
      type: 'Hotel', 
      occupancy: 78, 
      occupancyTrend: '+2.1%',
      vacantBeds: 6, 
      totalBeds: 30, 
      revenue: '₹3,40,000', 
      revenueTrend: '+18.5%',
      pendingRent: '₹0', 
      checkinsToday: 8, 
      checkoutsToday: 5, 
      aiCallsHandled: 112, 
      newLeads: 18, 
      kycVerified: 28, 
      kycPending: 0, 
      openComplaints: 2 
    },
    { 
      id: 'prop-3', 
      name: 'Sunrise Executive Lodge', 
      type: 'Lodge', 
      occupancy: 65, 
      occupancyTrend: '-1.4%',
      vacantBeds: 7, 
      totalBeds: 20, 
      revenue: '₹95,000', 
      revenueTrend: '+5.0%',
      pendingRent: '₹6,500', 
      checkinsToday: 2, 
      checkoutsToday: 2, 
      aiCallsHandled: 34, 
      newLeads: 4, 
      kycVerified: 13, 
      kycPending: 1, 
      openComplaints: 0 
    }
  ];

  const currentProp = propertiesList.find(p => p.id === selectedProperty) || propertiesList[0];

  return (
    <div style={{ maxWidth: '1280px', margin: '32px auto', padding: '0 20px' }}>
      
      {/* Figma SaaS Header & Workspace Selector Bar */}
      <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Workspace Brand Title & Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #cbd5e1',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)'
          }}>
            <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
                {currentProp.name}
              </h2>
              <span className="badge badge-indigo">{currentProp.type} OS</span>
              <span className="badge badge-emerald">LIVE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
              NESTPRO PG MANAGEMENT • MANAGE. AUTOMATE. GROW.
            </p>
          </div>
        </div>

        {/* Portfolio Selector & Time Range Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Property Selector Pills */}
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
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {p.name.split(' ')[0]} ({p.type})
              </button>
            ))}
          </div>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              outline: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* FIGMA SAAS TOP HERO KPI METRIC CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        {/* Metric 1: Occupancy Rate */}
        <div className="metric-card metric-card-emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              Occupancy Rate
            </span>
            <span className="trend-up"><TrendingUp size={12} /> {currentProp.occupancyTrend}</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', letterSpacing: '-0.02em' }}>
            {currentProp.occupancy}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            {currentProp.totalBeds - currentProp.vacantBeds} of {currentProp.totalBeds} Beds Occupied
          </div>
        </div>

        {/* Metric 2: Month Revenue */}
        <div className="metric-card metric-card-indigo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              Total Collection
            </span>
            <span className="trend-up"><TrendingUp size={12} /> {currentProp.revenueTrend}</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', letterSpacing: '-0.02em' }}>
            {currentProp.revenue}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Automated UPI & Razorpay
          </div>
        </div>

        {/* Metric 3: Vacant Beds */}
        <div className="metric-card metric-card-cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              Vacant Beds
            </span>
            <span className="badge badge-emerald">Ready</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0284c7', letterSpacing: '-0.02em' }}>
            {currentProp.vacantBeds} Beds
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Instant QR Check-In Active
          </div>
        </div>

        {/* Metric 4: Pending Rent */}
        <div className="metric-card metric-card-amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              Pending Rent
            </span>
            <span className="badge badge-amber">Due</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#b45309', letterSpacing: '-0.02em' }}>
            {currentProp.pendingRent}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            1-Click WhatsApp Reminder
          </div>
        </div>

        {/* Metric 5: AI Calls Handled */}
        <div className="metric-card metric-card-purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
              AI Receptionist Calls
            </span>
            <span className="badge badge-purple">24/7 AI</span>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.02em' }}>
            {currentProp.aiCallsHandled}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Automated Inquiries & Bookings
          </div>
        </div>

      </div>

      {/* QUICK SAAS ACTION DISPATCH TOOLBAR */}
      <div className="glass-panel-glow" style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            Quick Automation Dispatch & WhatsApp Center
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            Generate single-use check-in tokens or trigger automated rent reminders for {currentProp.name}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" onClick={() => onOpenCheckInToken('demo-checkin-token-88')}>
            <Plus size={16} /> Issue Check-In Token
          </button>

          <button className="btn-secondary" onClick={() => alert(`Bulk WhatsApp Rent Reminders dispatched for ${currentProp.name}.`)}>
            <MessageSquare size={16} color="#10b981" /> Send Bulk WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}
