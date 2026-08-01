import React from 'react';

export function ValueFeatureCard({ icon: Icon, title, description, tag }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      backgroundColor: 'rgba(18, 24, 38, 0.85)',
      backdropFilter: 'blur(16px)',
      padding: '24px',
      boxShadow: '0 12px 32px 0 rgba(0, 0, 0, 0.37)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    }}>
      {tag && (
        <span style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          borderRadius: '9999px',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '4px 12px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#a5b4fc',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {tag}
        </span>
      )}

      <div style={{
        marginBottom: '16px',
        display: 'flex',
        height: '48px',
        width: '48px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
        color: '#ffffff',
        boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
      }}>
        <Icon size={24} />
      </div>

      <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
        {title}
      </h3>
      
      <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8' }}>
        {description}
      </p>
    </div>
  );
}
