import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, CheckCircle, Building2 } from 'lucide-react';

export function CuteRoboMascot() {
  const statusMessages = [
    "🤖 24/7 Virtual Front Desk Active",
    "🏠 3 Vacant Beds Found in PG-1",
    "🛡️ Digital KYC Auto-Approved",
    "💬 Rent Reminder Sent via WhatsApp",
  ];

  const [currentStatus, setCurrentStatus] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus((prev) => (prev + 1) % statusMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [statusMessages.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '24px 0', position: 'relative' }}>
      
      {/* Floating Animated Status Bubble */}
      <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStatus}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #bfdbfe',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.12)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#1e3a8a'
            }}
          >
            <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
              <span className="pulse-dot"></span>
            </span>
            {statusMessages[currentStatus]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Cute Robo Sphere */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        {/* Glow Ring */}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #0284c7 100%)',
          borderRadius: '50%',
          filter: 'blur(16px)',
          opacity: 0.4
        }}></div>

        {/* Robo Container */}
        <div style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(180deg, #2563eb 0%, #4f46e5 100%)',
          borderRadius: '50%',
          padding: '3px',
          boxShadow: '0 12px 30px rgba(37, 99, 235, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(255, 255, 255, 0.5)'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#0f172a',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Robo Eyes */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '4px' }}>
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                style={{
                  width: '12px',
                  height: '14px',
                  background: '#38bdf8',
                  borderRadius: '9999px',
                  boxShadow: '0 0 10px #38bdf8'
                }}
              ></motion.div>
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                style={{
                  width: '12px',
                  height: '14px',
                  background: '#38bdf8',
                  borderRadius: '9999px',
                  boxShadow: '0 0 10px #38bdf8'
                }}
              ></motion.div>
            </div>

            {/* Cute LED Smile Line */}
            <div style={{ width: '22px', height: '6px', borderBottom: '2px solid #67e8f9', borderRadius: '50%' }}></div>

            {/* Sparkle Badges */}
            <Sparkles size={12} color="#67e8f9" style={{ position: 'absolute', top: '8px', right: '10px' }} className="spin" />
          </div>
        </div>
      </motion.div>

      {/* Interactive Floating Pill Badges (Using Official Golden Nest Emblem) */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', fontSize: '0.75rem', fontWeight: 700 }}>
        <span style={{ padding: '4px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <img src="/nestpro-icon.jpg" alt="Nest Emblem" style={{ width: '14px', height: '14px', borderRadius: '3px', objectFit: 'cover' }} /> AI Powered NestOS
        </span>

        <span style={{ padding: '4px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={14} color="#16a34a" /> Zero Front-Desk Staff Needed
        </span>
      </div>

    </div>
  );
}

export default CuteRoboMascot;
