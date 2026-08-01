import React from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Users, Sparkles, Download, Calendar, Activity 
} from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Financial & Occupancy Analytics</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Enterprise performance metrics, revenue growth curves, occupancy trends, and AI predictive forecasts.
          </p>
        </div>

        <button className="btn-secondary" onClick={() => alert('Exporting Analytics Report PDF...')}>
          <Download size={16} /> Export Analytics Report PDF
        </button>
      </div>

      {/* 4 HERO KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
        
        <div className="metric-card metric-card-indigo">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Total Revenue (YTD)</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', marginTop: '4px' }}>₹6,20,000</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '2px', fontWeight: 700 }}>+18.4% vs last quarter</div>
        </div>

        <div className="metric-card metric-card-emerald">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Avg Occupancy</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>89.2%</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '2px', fontWeight: 700 }}>+4.8% vs last month</div>
        </div>

        <div className="metric-card metric-card-cyan">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Avg Rent per Bed</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>₹11,400</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Optimized per floor</div>
        </div>

        <div className="metric-card metric-card-purple">
          <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>AI Inquiry Conversion</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>74.8%</div>
          <div style={{ fontSize: '0.75rem', color: '#7c3aed', marginTop: '2px', fontWeight: 700 }}>24/7 Virtual Desk active</div>
        </div>

      </div>

      {/* 2 MAIN CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        
        {/* Revenue Performance Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>Monthly Revenue Collection Growth</h3>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '16px' }}>UPI & Auto Razorpay Collection Trends (2026)</div>

          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', paddingTop: '20px' }}>
            {[
              { m: 'Jan', val: '₹1.4L', h: '60%' },
              { m: 'Feb', val: '₹1.65L', h: '75%' },
              { m: 'Mar', val: '₹1.85L', h: '88%' },
              { m: 'Apr (FC)', val: '₹2.1L', h: '95%' }
            ].map((col, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2563eb' }}>{col.val}</span>
                <div style={{ width: '100%', height: col.h, background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)', borderRadius: '8px 8px 0 0' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{col.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictive Insights & Forecast Box */}
        <div className="glass-panel-glow" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} color="#2563eb" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>AI Predictive Occupancy Forecast</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#16a34a' }}>✓ High Demand Forecast for Next Month:</strong>
              <p style={{ color: '#475569', marginTop: '2px' }}>AI predicts 100% occupancy for Koramangala Double Sharing rooms by mid-month based on walk-in inquiry velocity.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <strong style={{ color: '#2563eb' }}>💡 Pricing Optimization Recommendation:</strong>
              <p style={{ color: '#475569', marginTop: '2px' }}>Consider adjusting Single Luxury Room 101 rent by +5% to maximize yield.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
