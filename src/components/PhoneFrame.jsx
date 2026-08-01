import React from 'react';

export function PhoneFrame({ children }) {
  return (
    <div style={{
      position: 'relative',
      margin: '0 auto',
      height: '620px',
      width: '310px',
      borderRadius: '44px',
      border: '12px solid #0f172a',
      backgroundColor: '#0f172a',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25)',
      overflow: 'hidden'
    }}>
      {/* Top Notch & Camera */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 30,
        height: '20px',
        width: '130px',
        backgroundColor: '#0f172a',
        borderBottomLeftRadius: '14px',
        borderBottomRightRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
        <div style={{ width: '8px', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
      </div>

      {/* Screen Content Viewport */}
      <div style={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        borderRadius: '32px',
        backgroundColor: '#f8fafc',
        paddingTop: '20px',
        color: '#0f172a'
      }}>
        {children}
      </div>
    </div>
  );
}
