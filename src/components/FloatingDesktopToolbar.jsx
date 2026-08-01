import React, { useState } from 'react';
import { 
  Sparkles, QrCode, Send, KeyRound, Wrench, MessageSquare, Bot, X, Check, Activity 
} from 'lucide-react';

export default function FloatingDesktopToolbar({ onNavigate }) {
  const [minimized, setMinimized] = useState(false);
  const [activeRoboState, setActiveRoboState] = useState('Idle');

  const triggerRoboState = (stateName) => {
    setActiveRoboState(stateName);
    setTimeout(() => setActiveRoboState('Idle'), 3000);
  };

  if (minimized) {
    return (
      <div
        onClick={() => setMinimized(false)}
        className="floating-toolbar"
        style={{ cursor: 'pointer', background: '#0f172a', color: '#ffffff', border: '1px solid #334155' }}
      >
        <Bot size={18} color="#60a5fa" className="spin" />
        <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>AI Robo Operating System</span>
      </div>
    );
  }

  return (
    <div className="floating-toolbar">
      
      {/* AI Robo Presence Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '12px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={16} color="#2563eb" />
        </div>
        <div>
          <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#0f172a' }}>AI Robo Assistant</div>
          <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="pulse-dot"></span> {activeRoboState === 'Idle' ? 'Monitoring PG' : activeRoboState}
          </div>
        </div>
      </div>

      {/* Quick Interactive Actions */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          className="btn-secondary"
          onClick={() => {
            triggerRoboState('Generating Token...');
            if (onNavigate) onNavigate('Self Check-in');
          }}
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '9999px' }}
        >
          <KeyRound size={14} color="#2563eb" /> Check-in Token
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            triggerRoboState('Formatting Poster...');
            if (onNavigate) onNavigate('Print Room QR Posters');
          }}
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '9999px' }}
        >
          <QrCode size={14} color="#16a34a" /> Print QR Poster
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            triggerRoboState('Connecting WhatsApp API...');
            if (onNavigate) onNavigate('WhatsApp Suite');
          }}
          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '9999px' }}
        >
          <Send size={14} color="#25d366" /> WhatsApp Direct
        </button>

        <button
          className="btn-primary"
          onClick={() => {
            triggerRoboState('Launching AI Receptionist...');
            if (onNavigate) onNavigate('AI Voice Receptionist');
          }}
          style={{ padding: '6px 14px', fontSize: '0.75rem', borderRadius: '9999px' }}
        >
          <Sparkles size={14} /> Open AI Robo
        </button>
      </div>

      <button
        onClick={() => setMinimized(true)}
        style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', color: '#64748b' }}
      >
        <X size={14} />
      </button>

    </div>
  );
}
