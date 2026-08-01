import React from "react";
import { ShieldCheck } from "lucide-react";

export function PublicGuestLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#090d16',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Minimal Header — No Owner Navigation or Dashboard Links */}
      <header style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid #1e293b',
        marginBottom: '20px'
      }}>
        {/* Official Golden House Nest Emblem Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            overflow: 'hidden',
            background: '#fefce8',
            border: '1px solid #fef08a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(217, 119, 6, 0.2)'
          }}>
            <img src="/nestpro-icon.jpg" alt="NestPro Golden House Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            NestPro OS
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#34d399',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '4px 12px',
          borderRadius: '9999px'
        }}>
          <ShieldCheck size={14} color="#34d399" /> Secure Resident Portal
        </div>
      </header>

      {/* Main Form/Success Body */}
      <main style={{ width: '100%', maxWidth: '480px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {children}
      </main>

      {/* Minimal Footer */}
      <footer style={{ width: '100%', maxWidth: '480px', textAlign: 'center', padding: '20px 0', fontSize: '0.725rem', color: '#64748b', borderTop: '1px solid rgba(30, 41, 59, 0.6)', marginTop: '24px' }}>
        Powered by NestPro Accommodations OS • All Rights Reserved
      </footer>
    </div>
  );
}

export default PublicGuestLayout;
