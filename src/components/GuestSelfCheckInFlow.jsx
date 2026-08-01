import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, User, FileText, Camera, CreditCard, Key, 
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building2, Upload, Lock 
} from 'lucide-react';

export default function GuestSelfCheckInFlow({ token, onCompleteCheckIn }) {
  const [step, setStep] = useState(1);
  
  // Guest Form Data State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [agreementSigned, setAgreementSigned] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  
  // Auto Assigned Room
  const [assignedRoom] = useState('Room 102 (Double Sharing, Floor 1)');
  const [generatedPin] = useState('441392');

  const handleSendOtp = () => {
    if (!guestPhone || guestPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    setOtpSent(true);
    alert(`Demo OTP sent to ${guestPhone}: 1234`);
  };

  const handleVerifyOtp = () => {
    if (otpInput === '1234' || otpInput.length === 4) {
      setIsPhoneVerified(true);
      alert('Phone Verified! ✓');
    } else {
      alert('Invalid OTP. Use demo OTP: 1234');
    }
  };

  const handleCompleteFinalCheckIn = () => {
    if (onCompleteCheckIn) {
      onCompleteCheckIn({
        name: guestName || 'Resident',
        phone: guestPhone,
        email: guestEmail,
        room: '102',
        rent: 9500,
        pin: generatedPin
      });
    }
    alert('Check-In Completed Successfully! Door PIN Generated: 441392');
  };

  return (
    <div style={{ maxWidth: '640px', margin: '32px auto', padding: '0 16px' }}>
      
      {/* Portal Header */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}>
        <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', margin: '0 auto 8px auto' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>Sunrise PG & Residency</h2>
        <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
          ✓ Token-Gated Self Check-In Portal ({token})
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        {[1, 2, 3, 4, 5, 6, 7].map(s => (
          <div
            key={s}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: s === step ? '#2563eb' : s < step ? '#10b981' : '#e2e8f0',
              color: s <= step ? '#fff' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem'
            }}
          >
            {s < step ? '✓' : s}
          </div>
        ))}
      </div>

      {/* STEP 1: Personal Details */}
      {step === 1 && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 1: Guest Personal Details</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Enter your full legal name and email address.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Full Name (as per Aadhaar)</label>
              <input type="text" placeholder="e.g. Vikramaditya Sen" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address</label>
              <input type="email" placeholder="vikram@domain.com" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
            </div>

            <button className="btn-primary" onClick={() => { if(!guestName) return alert('Enter full name'); setStep(2); }}>
              Proceed to Phone Verification <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Phone OTP Verification */}
      {step === 2 && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 2: Mobile Phone Verification</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Verify mobile number via OTP.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Mobile Phone Number</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="+91 98765 43210" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} disabled={isPhoneVerified} style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                {!isPhoneVerified && <button className="btn-primary" onClick={handleSendOtp}>Send OTP</button>}
              </div>
            </div>

            {otpSent && !isPhoneVerified && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Enter OTP (1234)" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} style={{ width: '160px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                <button className="btn-primary" onClick={handleVerifyOtp} style={{ background: '#10b981' }}>Verify</button>
              </div>
            )}

            {isPhoneVerified && <span className="badge badge-emerald">✓ Phone Number Verified</span>}

            <button className="btn-primary" onClick={() => { if(!isPhoneVerified) return alert('Verify OTP first'); setStep(3); }}>
              Proceed to Aadhaar KYC <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Aadhaar Upload */}
      {step === 3 && (
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 3: Aadhaar / Government ID Upload</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Upload front & back image of government ID for AI OCR extraction.</p>

          <div style={{ border: '2px dashed #cbd5e1', padding: '32px', borderRadius: '16px', marginBottom: '20px', background: '#f8fafc', cursor: 'pointer' }} onClick={() => setAadhaarUploaded(true)}>
            <Upload size={36} color="#2563eb" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{aadhaarUploaded ? '✓ Aadhaar Card Scanned (AI OCR 98.4%)' : 'Click to Upload Aadhaar Card Image'}</div>
          </div>

          <button className="btn-primary" onClick={() => { if(!aadhaarUploaded) return alert('Upload Aadhaar image'); setStep(4); }}>
            Proceed to Liveness Photo <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 4: Facial Liveness Photo */}
      {step === 4 && (
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 4: Facial Liveness Check</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Capture selfie photo for ID comparison anti-spoofing.</p>

          <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '3px solid #2563eb', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', cursor: 'pointer' }} onClick={() => setFaceCaptured(true)}>
            <Camera size={48} color={faceCaptured ? '#10b981' : '#2563eb'} />
          </div>

          {faceCaptured && <div className="badge badge-emerald" style={{ marginBottom: '20px' }}>✓ Face Match Verified (96.8%)</div>}

          <button className="btn-primary" onClick={() => { if(!faceCaptured) return alert('Capture face photo'); setStep(5); }}>
            Proceed to E-Agreement <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 5: Digital E-Agreement */}
      {step === 5 && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 5: Digital Rental Agreement</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>Review and sign digital rental policy agreement.</p>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#475569', height: '120px', overflowY: 'auto', marginBottom: '16px' }}>
            <strong>Terms & Rules:</strong><br />
            1. Main entrance door auto-locks at 10:30 PM.<br />
            2. Rent is due on 1st of every calendar month via UPI/Razorpay.<br />
            3. No smoking or unauthorized overnight visitors without gate pass.
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: '20px' }}>
            <input type="checkbox" checked={agreementSigned} onChange={(e) => setAgreementSigned(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            I agree to all rules & sign e-rental contract
          </label>

          <button className="btn-primary" onClick={() => { if(!agreementSigned) return alert('Check agreement box'); setStep(6); }}>
            Proceed to Payment <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 6: Payment Checkout */}
      {step === 6 && (
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>Step 6: Security Deposit & Rent Checkout</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '20px' }}>Pay first month rent & security deposit via UPI.</p>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned Allocation:</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563eb' }}>{assignedRoom}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>Total: ₹9,500</div>
          </div>

          <button className="btn-primary" onClick={() => { setPaymentDone(true); setStep(7); handleCompleteFinalCheckIn(); }} style={{ background: '#16a34a', width: '100%', justifyContent: 'center', padding: '14px' }}>
            <CreditCard size={18} /> Pay ₹9,500 & Complete Digital Check-In
          </button>
        </div>
      )}

      {/* STEP 7: Success & Smart Lock PIN */}
      {step === 7 && (
        <div className="glass-panel-glow" style={{ padding: '32px', textAlign: 'center' }}>
          <span className="badge badge-emerald" style={{ padding: '6px 16px', marginBottom: '16px' }}>
            🎉 DIGITAL CHECK-IN SUCCESSFUL
          </span>

          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
            Welcome to Sunrise PG!
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
            Your room assignment and smart door access PIN have been active.
          </p>

          <div style={{ background: '#f8fafc', border: '2px solid #2563eb', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>YOUR SMART DOOR LOCK PIN:</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>{generatedPin}</div>
            <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '6px' }}>✓ Allocated: {assignedRoom}</div>
          </div>
        </div>
      )}

    </div>
  );
}
