import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, UserCheck, FileText, CreditCard, KeyRound, 
  CheckCircle2, AlertTriangle, ArrowRight, Upload, Camera, 
  Sparkles, Lock, Clock, Building, Smartphone 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckInPortal({ currentToken = 'demo-checkin-token-88', onSelectToken }) {
  const [tokenInput, setTokenInput] = useState(currentToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkinData, setCheckinData] = useState(null);
  const [step, setStep] = useState(1);

  // Form states
  const [docType, setDocType] = useState('Aadhaar Card');
  const [docNumber, setDocNumber] = useState('');
  const [kycResult, setKycResult] = useState(null);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    if (currentToken) {
      setTokenInput(currentToken);
      fetchTokenDetails(currentToken);
    }
  }, [currentToken]);

  const fetchTokenDetails = async (tokenStr) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/checkin/${tokenStr}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify check-in token');
      }
      setCheckinData(data);
      if (data.status === 'CHECKED_IN') {
        setStep(5);
      } else if (data.status === 'AGREEMENT_SIGNED') {
        setStep(4);
      } else if (data.status === 'KYC_SUBMITTED') {
        setStep(3);
      } else {
        setStep(1);
      }
    } catch (err) {
      setError(err.message);
      setCheckinData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/checkin/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: checkinData.token,
          documentType: docType,
          documentNumber: docNumber || '7890-1234-5678'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setKycResult(data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAgreementSubmit = async () => {
    if (!agreementSigned) return;
    setLoading(true);
    try {
      const res = await fetch('/api/checkin/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: checkinData.token,
          signatureDataUrl: 'data:image/svg+xml;base64,signed'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkin/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: checkinData.token,
          paymentMethod: 'UPI'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPaymentResult(data);
      setCheckinData(prev => ({
        ...prev,
        status: 'CHECKED_IN',
        accessCode: data.accessCode
      }));
      setStep(5);
      
      // Trigger success confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
      
      {/* Token Link Selector Bar */}
      <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Token URL:</span>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#a5b4fc' }}>
            /checkin/{tokenInput}
          </code>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-secondary"
            onClick={() => {
              setTokenInput('demo-checkin-token-88');
              fetchTokenDetails('demo-checkin-token-88');
            }}
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            Load Demo Token
          </button>
        </div>
      </div>

      {/* Progress Steps Header */}
      {checkinData && (
        <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            
            <div className={`step-item ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > 1 ? <CheckCircle2 size={18} /> : '1'}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Verification</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Token Check</div>
              </div>
            </div>

            <div className={`step-item ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
              <div className="step-number">{step > 2 ? <CheckCircle2 size={18} /> : '2'}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Digital KYC</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Liveness</div>
              </div>
            </div>

            <div className={`step-item ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
              <div className="step-number">{step > 3 ? <CheckCircle2 size={18} /> : '3'}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Agreement</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>E-Signature</div>
              </div>
            </div>

            <div className={`step-item ${step === 4 ? 'active' : step > 4 ? 'completed' : ''}`}>
              <div className="step-number">{step > 4 ? <CheckCircle2 size={18} /> : '4'}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Payment</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rent & Deposit</div>
              </div>
            </div>

            <div className={`step-item ${step === 5 ? 'active' : ''}`}>
              <div className="step-number">5</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Smart Pass</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Key Code</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          color: '#fb7185',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={20} />
          <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>
        </div>
      )}

      {/* STEP 1: WELCOME & ASSIGNED ROOM OVERVIEW */}
      {step === 1 && checkinData && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="badge badge-emerald" style={{ marginBottom: '12px' }}>
              <Sparkles size={12} /> VERIFIED CHECK-IN TOKEN
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
              Welcome, {checkinData.residentName}! 👋
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              You are completing self check-in for **NestPro PG & Hostel Residence**.
            </p>
          </div>

          {/* Assigned Room Card */}
          {checkinData.room && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700 }}>
                    Assigned Residence
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    Room {checkinData.room.roomNumber} ({checkinData.room.type})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Floor {checkinData.room.floor} • NestPro Prime Tower
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ₹{checkinData.room.priceMonthly.toLocaleString()}<span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>/month</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Refundable Deposit: ₹{checkinData.room.depositAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                {checkinData.room.amenities.map((am, i) => (
                  <span key={i} style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    color: '#c7d2fe',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    ✓ {am}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button 
            className="btn-primary" 
            onClick={() => setStep(2)}
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            Start Digital Identity Verification (KYC) <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: DIGITAL KYC & AI LIVENESS MATCH */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Digital Identity Verification (KYC)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Upload your Government ID and perform automated AI facial liveness check.
            </p>
          </div>

          <form onSubmit={handleKycSubmit}>
            <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="Aadhaar Card">Aadhaar Card (India)</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  Document Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5491-8821-9920"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Upload Simulation Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer'
                }}>
                  <Upload size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Front ID Photo</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>PNG, JPG up to 5MB</div>
                </div>

                <div style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer'
                }}>
                  <Camera size={28} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>AI Selfie Liveness</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>Face Match Check</div>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            >
              {loading ? 'Processing AI OCR & Face Matching...' : 'Verify Document & Proceed'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: DIGITAL LEASE AGREEMENT */}
      {step === 3 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div className="badge badge-emerald" style={{ marginBottom: '10px' }}>
              ✓ KYC VERIFIED (OCR: 96% | Face Match: 98%)
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Digital Residency Agreement
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Please review house policies and sign the electronic rental contract.
            </p>
          </div>

          {/* Contract Terms Box */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            maxHeight: '180px',
            overflowY: 'auto',
            fontSize: '0.8rem',
            lineHeight: '1.6',
            color: 'var(--text-muted)',
            marginBottom: '20px'
          }}>
            <p style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>TERMS & CONDITIONS - NESTPRO RESIDENCE</p>
            <p>1. **Curfew & Access**: Main gate locks at 10:30 PM. Late access requires valid Smart Pass unlock.</p>
            <p>2. **Notice Period**: Minimum 30 days written notice required prior to vacate for security deposit refund.</p>
            <p>3. **Guest Policy**: Day visitors permitted 9:00 AM - 8:00 PM. No overnight stay in room without manager log.</p>
            <p>4. **Rent Payment**: Rent due on 1st of every month via NestPro portal.</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreementSigned}
                onChange={(e) => setAgreementSigned(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                I agree to all House Rules & execute digital rental agreement.
              </span>
            </label>
          </div>

          <button
            onClick={handleAgreementSubmit}
            disabled={!agreementSigned || loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: agreementSigned ? 1 : 0.5 }}
          >
            {loading ? 'Executing Contract...' : 'Sign Contract & Proceed to Payment'} <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 4: PAYMENT GATEWAY SIMULATION */}
      {step === 4 && checkinData && checkinData.room && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div className="badge badge-indigo" style={{ marginBottom: '10px' }}>
              CREDENTIAL ALLOCATION READY
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>
              Complete Rent & Deposit Payment
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Your check-in credential and Smart Lock PIN will be issued immediately upon payment webhook confirmation.
            </p>
          </div>

          {/* Payment Invoice Summary */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>First Month Rent (Room {checkinData.assignedRoomNumber})</span>
              <span style={{ fontWeight: 700 }}>₹{checkinData.room.priceMonthly.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Security Deposit (Refundable)</span>
              <span style={{ fontWeight: 700 }}>₹{checkinData.room.depositAmount.toLocaleString()}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--accent-emerald)' }}>
                ₹{(checkinData.room.priceMonthly + checkinData.room.depositAmount).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handlePaymentSubmit}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <CreditCard size={18} /> {loading ? 'Processing Transaction & Allocation Lock...' : 'Pay Instant via UPI / Card & Get Key Pass'}
          </button>
        </div>
      )}

      {/* STEP 5: DIGITAL ACCESS PASS & SMART LOCK PIN */}
      {step === 5 && checkinData && (
        <div className="glass-panel-glow" style={{ padding: '36px', textAlign: 'center' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '16px', padding: '6px 16px', fontSize: '0.8rem' }}>
            <CheckCircle2 size={14} /> CHECK-IN COMPLETE • SMART ACCESS GRANTED
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Welcome to Room {checkinData.assignedRoomNumber}! 🎉
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Your digital check-in is complete. Use your 6-digit IoT key code to unlock the main gate and your room door.
          </p>

          {/* Key Access Code Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(6,182,212,0.2) 100%)',
            border: '2px dashed var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '28px',
            display: 'inline-block',
            width: '100%',
            maxWidth: '380px'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 700 }}>
              YOUR IOT SMART DOOR PIN
            </div>
            <div style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '2.8rem', 
              fontWeight: 800, 
              letterSpacing: '0.15em', 
              color: '#fff',
              margin: '12px 0',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.8)'
            }}>
              {checkinData.accessCode || '849201'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              ✓ Main Entrance Gate & Room {checkinData.assignedRoomNumber} Smart Lock
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => window.print()}>
              <FileText size={16} /> Download Digital Access Pass
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
