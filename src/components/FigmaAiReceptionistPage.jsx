import React, { useState } from 'react';
import { 
  Bot, Send, User, Sparkles, Wrench, ShieldAlert, CheckCircle2, 
  ArrowRight, PhoneCall, Mic, Volume2, Activity, Clock, Database, 
  BookOpen, Sliders, AlertTriangle, RefreshCw, FileText, Play, Pause, Search
} from 'lucide-react';

export default function FigmaAiReceptionistPage({ onOpenCheckInToken }) {
  const [activeTab, setActiveTab] = useState('chat');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const callLogs = [
    { id: 'CALL-8902', phone: '+91 98765 43210', duration: '2m 14s', sentiment: 'POSITIVE', intent: 'Room Vacancy & Rates', action: 'get_vacancy_status()', timestamp: '10:42 AM' },
    { id: 'CALL-8901', phone: '+91 98123 99999', duration: '1m 45s', sentiment: 'NEUTRAL', intent: 'Digital Check-In Link', action: 'generate_checkin_link()', timestamp: '10:15 AM' },
    { id: 'CALL-8900', phone: '+91 99000 88888', duration: '3m 02s', sentiment: 'URGENT', intent: 'AC Water Leak Complaint', action: 'create_complaint()', timestamp: '09:30 AM' }
  ];

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a', minHeight: '100vh', padding: '32px 24px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* FIGMA REDESIGNED AI RECEPTIONIST HEADER BANNER */}
        <div className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)'
            }}>
              <Bot size={28} color="#fff" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                  NestPro AI Receptionist Studio (White & Blue)
                </h2>
                <span className="badge badge-purple">GEMINI 2.5 FLASH</span>
                <span className="badge badge-emerald"><span className="pulse-dot"></span> 24/7 ONLINE</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                System Prompt Rules Active • Automated Function Tool Registry • Latency: 118ms
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Resolution Rate</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>94.2%</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Calls Today</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb' }}>148 Calls</div>
            </div>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'chat', label: '💬 Live Chat Console' },
            { id: 'calls', label: '🎙️ Voice Call Transcripts & Waveforms' },
            { id: 'prompt', label: '🧠 System Prompt Studio' },
            { id: 'tools', label: '⚙️ Tool & API Function Registry' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid #cbd5e1',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(37, 99, 235, 0.35)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: LIVE CHAT CONSOLE */}
        {activeTab === 'chat' && (
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>Live AI Receptionist Terminal</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '24px' }}>
              Test function calls against live Drizzle ORM database inventory.
            </p>
            <button className="btn-primary" onClick={() => alert('AI Receptionist Terminal Active!')}>
              <Bot size={18} /> Launch Terminal Interaction
            </button>
          </div>
        )}

        {/* TAB 2: FIGMA VOICE CALL TRANSCRIPTS */}
        {activeTab === 'calls' && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Figma AI Voice Call Logs & Audio Transcripts</h3>
              <span className="badge badge-purple">24/7 VOICE ENGINE</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Call ID</th>
                    <th style={{ padding: '12px' }}>Caller Phone</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Caller Sentiment</th>
                    <th style={{ padding: '12px' }}>Primary Intent</th>
                    <th style={{ padding: '12px' }}>Action Executed</th>
                    <th style={{ padding: '12px' }}>Audio Waveform</th>
                  </tr>
                </thead>
                <tbody>
                  {callLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#7c3aed' }}>{log.id}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{log.phone}</td>
                      <td style={{ padding: '12px' }}>{log.duration}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${log.sentiment === 'POSITIVE' ? 'badge-emerald' : log.sentiment === 'URGENT' ? 'badge-rose' : 'badge-amber'}`}>
                          {log.sentiment}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{log.intent}</td>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', color: '#2563eb', fontWeight: 700 }}>{log.action}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === log.id ? null : log.id)}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                        >
                          {playingAudioId === log.id ? <Pause size={12} /> : <Play size={12} />} {playingAudioId === log.id ? 'Playing...' : 'Play Call Audio'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
