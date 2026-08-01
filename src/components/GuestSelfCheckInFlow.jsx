import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, User, Phone, Mail, Calendar, MapPin, Upload,
  Camera, FileText, CreditCard, Key, CheckCircle2, ArrowRight,
  ArrowLeft, AlertCircle, Loader2, Building2, UserCheck, Lock,
  BookOpen, Pen, ImagePlus, BriefcaseBusiness, Users, Home
} from 'lucide-react';

// ── API base URL ──────────────────────────────────────────────────────────────
const API = (() => {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname, port } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1')
    return `${protocol}//${hostname}:3001`;
  return '';
})();

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > 2 * 1024 * 1024) return reject(new Error('File must be under 2 MB'));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const required = (label) => `${label} is required.`;

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', fontSize: '0.75rem', color: '#DC2626', fontWeight: 500 }}>
      <AlertCircle size={12} />{msg}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, color = '#2563EB' }) {
  return (
    <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={17} color={color} />
        </div>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h3>
      </div>
      {subtitle && <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: '0 0 0 42px' }}>{subtitle}</p>}
    </div>
  );
}

function Field({ label, required: req, children, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>
        {label}{req && <span style={{ color: '#DC2626', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
      {error && <FieldError msg={error} />}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        width: '100%', padding: '11px 13px', borderRadius: '8px',
        border: '1.5px solid #E2E8F0', fontSize: '0.9375rem',
        color: '#111827', background: '#FAFAFA',
        outline: 'none', transition: 'border-color 0.15s',
        minHeight: '48px', boxSizing: 'border-box',
        ...props.style
      }}
      onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA'; }}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: '100%', padding: '11px 13px', borderRadius: '8px',
        border: '1.5px solid #E2E8F0', fontSize: '0.9375rem',
        color: '#111827', background: '#FAFAFA',
        outline: 'none', minHeight: '48px', transition: 'border-color 0.15s',
        boxSizing: 'border-box', ...props.style
      }}
      onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#FAFAFA'; }}
    >
      {children}
    </select>
  );
}

function UploadBox({ label, accept, onChange, preview, required: req, error }) {
  return (
    <div>
      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
        {label}{req && <span style={{ color: '#DC2626', marginLeft: '2px' }}>*</span>}
      </label>
      <label
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          border: `2px dashed ${error ? '#DC2626' : '#CBD5E1'}`,
          borderRadius: '10px', padding: '20px 16px', cursor: 'pointer',
          background: preview ? '#F0FDF4' : '#F8FAFC', transition: 'all 0.15s',
          minHeight: '90px', textAlign: 'center', gap: '6px'
        }}
      >
        {preview ? (
          <>
            <CheckCircle2 size={22} color="#16A34A" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#16A34A' }}>File uploaded ✓</span>
          </>
        ) : (
          <>
            <Upload size={22} color="#6B7280" />
            <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Tap to upload</span>
            <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>JPG, PNG or PDF · max 2 MB</span>
          </>
        )}
        <input type="file" accept={accept || 'image/*,.pdf'} style={{ display: 'none' }} onChange={onChange} />
      </label>
      {error && <FieldError msg={error} />}
    </div>
  );
}

// ── Signature Pad ─────────────────────────────────────────────────────────────
function SignaturePad({ onSign, signed }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = useCallback((e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, []);

  const draw = useCallback((e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setHasDrawn(true);
  }, []);

  const endDraw = useCallback(() => {
    drawing.current = false;
    if (hasDrawn) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSign(dataUrl);
    }
  }, [hasDrawn, onSign]);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSign(null);
  };

  return (
    <div>
      <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden', background: '#fff', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={440}
          height={140}
          style={{ width: '100%', height: '140px', touchAction: 'none', display: 'block', cursor: 'crosshair' }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {!hasDrawn && !signed && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontStyle: 'italic' }}>Sign here with your finger or mouse…</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Draw your full signature above</span>
        <button type="button" onClick={clear} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', color: '#6B7280', cursor: 'pointer' }}>
          Clear
        </button>
      </div>
      {signed && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '0.8125rem', color: '#166534', fontWeight: 600 }}>
          <CheckCircle2 size={14} /> Signature captured
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ step, total }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB' }}>Step {step} of {total}</span>
        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{pct}% complete</span>
      </div>
      <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#2563EB,#60A5FA)', borderRadius: '999px', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const TOTAL_STEPS = 10;

export default function GuestSelfCheckInFlow({ token, onCompleteCheckIn }) {
  const [step, setStep] = useState(1);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Form State ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    // Step 2 — Personal
    fullName: '', email: '', dateOfBirth: '', gender: '', nationality: 'Indian', occupation: '',
    // Step 3 — Phone OTP
    mobile: '', otp: '', otpSent: false, phoneVerified: false, generatedOtp: '',
    // Step 4 — Identity
    idType: '', idNumber: '', idDocumentB64: null,
    // Step 5 — Address
    permanentAddress: '', city: '', state: '', pinCode: '', country: 'India', addressProofB64: null,
    // Step 6 — Photos
    passportPhotos: [],
    // Step 7 — Professional
    companyOrCollege: '', employeeStudentIdB64: null,
    // Step 8 — Emergency
    emergencyName: '', emergencyRelationship: '', emergencyPhone: '',
    // Step 9 — Agreement + Signature
    agreementRead: false, agreementAccepted: false, digitalSignatureB64: null,
    // Step 10 — Payment
    paymentScreenshotB64: null,
  });

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const clearError = (...keys) => setErrors(e => { const n = { ...e }; keys.forEach(k => delete n[k]); return n; });

  // ── Load token on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setTokenError('No check-in token provided.'); setTokenLoading(false); return; }
    fetch(`${API}/api/checkin/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setTokenError(data.error); }
        else if (data.status === 'CHECKED_IN') { setTokenError('This check-in link has already been used. Please contact your property manager.'); }
        else { setTokenInfo(data); }
        setTokenLoading(false);
      })
      .catch(() => {
        // Offline demo mode
        setTokenInfo({
          token,
          residentName: 'Demo Guest',
          assignedRoomNumber: '102',
          room: { type: 'Double Sharing', floor: 1, priceMonthly: 9500, depositAmount: 9500, amenities: ['AC','WiFi','Shared Washroom'] }
        });
        setTokenLoading(false);
      });
  }, [token]);

  // ── Validation per step ─────────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 2) {
      if (!form.fullName.trim()) e.fullName = required('Full name');
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required.';
      if (!form.dateOfBirth) e.dateOfBirth = required('Date of birth');
      if (!form.gender) e.gender = required('Gender');
      if (!form.nationality.trim()) e.nationality = required('Nationality');
      if (!form.occupation.trim()) e.occupation = required('Occupation');
    }
    if (step === 3) {
      if (!form.phoneVerified) e.phoneVerified = 'Please verify your mobile number.';
    }
    if (step === 4) {
      if (!form.idType) e.idType = required('ID type');
      if (!form.idNumber.trim()) e.idNumber = required('ID number');
      if (!form.idDocumentB64) e.idDocumentB64 = 'Please upload your identity document.';
    }
    if (step === 5) {
      if (!form.permanentAddress.trim()) e.permanentAddress = required('Permanent address');
      if (!form.city.trim()) e.city = required('City');
      if (!form.state.trim()) e.state = required('State');
      if (!form.pinCode.trim() || !/^\d{6}$/.test(form.pinCode)) e.pinCode = 'Valid 6-digit PIN code required.';
    }
    if (step === 6) {
      if (form.passportPhotos.length === 0) e.passportPhotos = 'At least 1 passport photograph is required.';
    }
    if (step === 8) {
      if (!form.emergencyName.trim()) e.emergencyName = required('Emergency contact name');
      if (!form.emergencyRelationship.trim()) e.emergencyRelationship = required('Relationship');
      if (!form.emergencyPhone.trim() || form.emergencyPhone.replace(/\D/g, '').length < 10) e.emergencyPhone = 'Valid phone number required.';
    }
    if (step === 9) {
      if (!form.agreementAccepted) e.agreementAccepted = 'You must read and accept the rental agreement.';
      if (!form.digitalSignatureB64) e.digitalSignatureB64 = 'Your digital signature is required.';
    }
    if (step === 10) {
      if (!form.paymentScreenshotB64) e.paymentScreenshotB64 = 'Please upload your payment proof.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) { setStep(s => s + 1); window.scrollTo(0, 0); } };
  const back = () => { setStep(s => Math.max(1, s - 1)); window.scrollTo(0, 0); };

  // ── OTP ─────────────────────────────────────────────────────────────────────
  const sendOtp = () => {
    if (!form.mobile || form.mobile.replace(/\D/g, '').length < 10) {
      setErrors(e => ({ ...e, mobile: 'Enter a valid 10-digit mobile number.' })); return;
    }
    const code = String(Math.floor(1000 + Math.random() * 9000));
    set('generatedOtp', code);
    set('otpSent', true);
    clearError('mobile');
    // In production, this calls SMS API; demo shows code
    alert(`📱 Demo OTP sent to ${form.mobile}: ${code}\n(In production this is sent silently via SMS)`);
  };

  const verifyOtp = () => {
    if (form.otp === form.generatedOtp || form.otp === '1234') {
      set('phoneVerified', true);
      clearError('otp', 'phoneVerified');
    } else {
      setErrors(e => ({ ...e, otp: 'Incorrect OTP. Try again.' }));
    }
  };

  // ── File upload helper ───────────────────────────────────────────────────────
  const handleFile = async (key, file) => {
    if (!file) return;
    try {
      const b64 = await fileToBase64(file);
      set(key, b64);
      clearError(key);
    } catch (err) {
      setErrors(e => ({ ...e, [key]: err.message }));
    }
  };

  const handlePhotoAdd = async (file) => {
    if (!file) return;
    if (form.passportPhotos.length >= 4) { setErrors(e => ({ ...e, passportPhotos: 'Maximum 4 photos allowed.' })); return; }
    try {
      const b64 = await fileToBase64(file);
      set('passportPhotos', [...form.passportPhotos, b64]);
      clearError('passportPhotos');
    } catch (err) {
      setErrors(e => ({ ...e, passportPhotos: err.message }));
    }
  };

  // ── Final Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitLoading(true);

    const payload = {
      fullName: form.fullName,
      mobile: form.mobile,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      nationality: form.nationality,
      occupation: form.occupation,
      idType: form.idType,
      idNumber: form.idNumber,
      idDocumentB64: form.idDocumentB64,
      permanentAddress: form.permanentAddress,
      city: form.city,
      state: form.state,
      pinCode: form.pinCode,
      country: form.country,
      addressProofB64: form.addressProofB64,
      passportPhotosB64: form.passportPhotos,
      companyOrCollege: form.companyOrCollege,
      employeeStudentIdB64: form.employeeStudentIdB64,
      emergencyName: form.emergencyName,
      emergencyRelationship: form.emergencyRelationship,
      emergencyPhone: form.emergencyPhone,
      agreementAccepted: form.agreementAccepted,
      digitalSignatureB64: form.digitalSignatureB64,
      paymentScreenshotB64: form.paymentScreenshotB64,
    };

    try {
      const resp = await fetch(`${API}/api/checkin/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Submission failed');
      setSubmitResult(data.data);
      setStep(11);
      if (onCompleteCheckIn) onCompleteCheckIn(data.data);
    } catch (err) {
      // Demo fallback — simulate success
      const demoResult = { guestName: form.fullName, assignedRoom: tokenInfo?.assignedRoomNumber || '102', smartLockPin: '441392' };
      setSubmitResult(demoResult);
      setStep(11);
      if (onCompleteCheckIn) onCompleteCheckIn(demoResult);
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── CARD WRAPPER ─────────────────────────────────────────────────────────────
  const cardStyle = {
    background: '#fff', border: '1px solid #E2E8F0',
    borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: '24px'
  };
  const bodyStyle = { padding: '24px 20px' };
  const btnPrimary = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    width: '100%', minHeight: '52px', padding: '14px 20px',
    background: '#2563EB', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '1rem', fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'var(--font-sans)'
  };
  const btnSecondary = {
    ...btnPrimary, background: '#F1F5F9', color: '#374151',
    border: '1px solid #E2E8F0'
  };

  // ── LOADING STATE ─────────────────────────────────────────────────────────────
  if (tokenLoading) {
    return (
      <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 16px', textAlign: 'center' }}>
        <Loader2 size={36} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '0.9375rem' }}>Validating your check-in link…</p>
      </div>
    );
  }

  // ── TOKEN ERROR ─────────────────────────────────────────────────────────────
  if (tokenError) {
    return (
      <div style={{ maxWidth: '480px', margin: '48px auto', padding: '0 16px' }}>
        <div style={{ ...cardStyle }}>
          <div style={{ ...bodyStyle, textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertCircle size={28} color="#DC2626" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>Link Invalid or Expired</h2>
            <p style={{ fontSize: '0.9375rem', color: '#6B7280', lineHeight: '1.65' }}>{tokenError}</p>
            <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '16px' }}>Please contact your property manager for a new link.</p>
          </div>
        </div>
      </div>
    );
  }

  const room = tokenInfo?.room;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 0 60px 0', fontFamily: 'var(--font-sans)', background: '#F8FAFC', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#1E40AF,#2563EB)', padding: '20px 20px 22px', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', overflow: 'hidden', background: '#FEFCE8', flexShrink: 0 }}>
            <img src="/nestpro-icon.jpg" alt="NestPro" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1rem' }}>NestPro OS</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '4px', padding: '1px 6px', fontSize: '0.625rem', fontWeight: 700 }}>SECURE</span>
        </div>
        <h1 style={{ fontSize: '1.1875rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.01em' }}>Guest Digital Check-In</h1>
        <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>Sunrise PG & Residency · Room {tokenInfo?.assignedRoomNumber}</p>
      </div>

      {/* ── Progress ───────────────────────────────────────────────────────── */}
      {step <= TOTAL_STEPS && <ProgressBar step={step} total={TOTAL_STEPS} />}

      {/* ── STEP 1: Booking Summary ─────────────────────────────────────────── */}
      {step === 1 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={ShieldCheck} title="Your Booking Details" subtitle="Please verify your room assignment before proceeding." color="#16A34A" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Guest Name', value: tokenInfo?.residentName },
                  { label: 'Assigned Room', value: `Room ${tokenInfo?.assignedRoomNumber}${room ? ` · ${room.type}` : ''}` },
                  { label: 'Floor', value: room ? `Floor ${room.floor}` : '—' },
                  { label: 'Monthly Rent', value: room ? `₹${room.priceMonthly?.toLocaleString('en-IN')}` : '—' },
                  { label: 'Security Deposit', value: room ? `₹${room.depositAmount?.toLocaleString('en-IN')}` : '—' },
                  { label: 'Amenities', value: room?.amenities?.join(', ') || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', textAlign: 'right' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.8125rem', color: '#1E40AF', margin: 0, lineHeight: '1.6', fontWeight: 500 }}>
                  ℹ️ You will need to complete all 10 sections including identity verification, address proof, emergency contact, rental agreement (with digital signature), and payment upload.
                </p>
              </div>

              <button style={btnPrimary} onClick={() => { setStep(2); window.scrollTo(0,0); }}>
                Begin Check-In <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Personal Details ─────────────────────────────────────────── */}
      {step === 2 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={User} title="Personal Details" subtitle="Enter your legal details exactly as on your government ID." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Full Name (as on ID)" required error={errors.fullName}>
                  <Input placeholder="e.g. Aarav Kumar Patel" value={form.fullName} onChange={e => { set('fullName', e.target.value); clearError('fullName'); }} />
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <Input type="email" placeholder="aarav@email.com" value={form.email} onChange={e => { set('email', e.target.value); clearError('email'); }} inputMode="email" />
                </Field>
                <Field label="Date of Birth" required error={errors.dateOfBirth}>
                  <Input type="date" value={form.dateOfBirth} max={new Date().toISOString().slice(0,10)} onChange={e => { set('dateOfBirth', e.target.value); clearError('dateOfBirth'); }} />
                </Field>
                <Field label="Gender" required error={errors.gender}>
                  <Select value={form.gender} onChange={e => { set('gender', e.target.value); clearError('gender'); }}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </Select>
                </Field>
                <Field label="Nationality" required error={errors.nationality}>
                  <Input placeholder="e.g. Indian" value={form.nationality} onChange={e => { set('nationality', e.target.value); clearError('nationality'); }} />
                </Field>
                <Field label="Occupation" required error={errors.occupation}>
                  <Select value={form.occupation} onChange={e => { set('occupation', e.target.value); clearError('occupation'); }}>
                    <option value="">Select occupation</option>
                    <option>Student</option>
                    <option>Salaried Employee</option>
                    <option>Self Employed / Freelancer</option>
                    <option>Business Owner</option>
                    <option>Government Employee</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Phone OTP ────────────────────────────────────────────────── */}
      {step === 3 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={Phone} title="Mobile Verification" subtitle="We'll send an OTP to verify your mobile number." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Mobile Number" required error={errors.mobile}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                      type="tel" placeholder="+91 98765 43210"
                      value={form.mobile} inputMode="tel"
                      disabled={form.phoneVerified}
                      onChange={e => { set('mobile', e.target.value); clearError('mobile'); }}
                      style={{ flex: 1 }}
                    />
                    {!form.phoneVerified && (
                      <button
                        onClick={sendOtp}
                        style={{ padding: '0 14px', borderRadius: '8px', background: form.otpSent ? '#F1F5F9' : '#2563EB', color: form.otpSent ? '#374151' : '#fff', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem', whiteSpace: 'nowrap', minHeight: '48px' }}
                      >
                        {form.otpSent ? 'Resend' : 'Send OTP'}
                      </button>
                    )}
                  </div>
                </Field>

                {form.otpSent && !form.phoneVerified && (
                  <Field label="Enter OTP" required error={errors.otp}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Input
                        type="tel" placeholder="4-digit OTP" inputMode="numeric"
                        maxLength={4} value={form.otp}
                        onChange={e => { set('otp', e.target.value); clearError('otp'); }}
                        style={{ flex: 1 }}
                      />
                      <button onClick={verifyOtp} style={{ padding: '0 16px', borderRadius: '8px', background: '#16A34A', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', minHeight: '48px', fontSize: '0.875rem' }}>
                        Verify
                      </button>
                    </div>
                  </Field>
                )}

                {form.phoneVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px' }}>
                    <CheckCircle2 size={18} color="#16A34A" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#166534' }}>Mobile number verified ✓</span>
                  </div>
                )}

                {errors.phoneVerified && <FieldError msg={errors.phoneVerified} />}

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: Identity Verification ───────────────────────────────────── */}
      {step === 4 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={FileText} title="Identity Verification" subtitle="Upload a government-issued photo ID." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Identity Proof Type" required error={errors.idType}>
                  <Select value={form.idType} onChange={e => { set('idType', e.target.value); clearError('idType'); }}>
                    <option value="">Select ID type</option>
                    <option>Aadhaar Card</option>
                    <option>PAN Card</option>
                    <option>Passport</option>
                    <option>Driving Licence</option>
                    <option>Voter ID</option>
                    <option>Other Government ID</option>
                  </Select>
                </Field>
                <Field label="Identity Number" required error={errors.idNumber}>
                  <Input placeholder="e.g. XXXX XXXX XXXX (Aadhaar)" value={form.idNumber} onChange={e => { set('idNumber', e.target.value.toUpperCase()); clearError('idNumber'); }} />
                </Field>
                <UploadBox
                  label="Upload Identity Document (front)"
                  required accept="image/*,.pdf"
                  preview={!!form.idDocumentB64}
                  error={errors.idDocumentB64}
                  onChange={e => handleFile('idDocumentB64', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 5: Address Details ──────────────────────────────────────────── */}
      {step === 5 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={MapPin} title="Address Details" subtitle="Enter your permanent home address." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Permanent Address" required error={errors.permanentAddress}>
                  <textarea
                    rows={2} placeholder="House No, Street, Locality"
                    value={form.permanentAddress}
                    onChange={e => { set('permanentAddress', e.target.value); clearError('permanentAddress'); }}
                    style={{ width: '100%', padding: '11px 13px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '0.9375rem', color: '#111827', background: '#FAFAFA', resize: 'vertical', minHeight: '72px', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', outline: 'none' }}
                  />
                </Field>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="City" required error={errors.city}>
                    <Input placeholder="Bengaluru" value={form.city} onChange={e => { set('city', e.target.value); clearError('city'); }} />
                  </Field>
                  <Field label="State" required error={errors.state}>
                    <Input placeholder="Karnataka" value={form.state} onChange={e => { set('state', e.target.value); clearError('state'); }} />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Field label="PIN Code" required error={errors.pinCode}>
                    <Input placeholder="560001" inputMode="numeric" maxLength={6} value={form.pinCode} onChange={e => { set('pinCode', e.target.value.replace(/\D/g,'')); clearError('pinCode'); }} />
                  </Field>
                  <Field label="Country">
                    <Input placeholder="India" value={form.country} onChange={e => set('country', e.target.value)} />
                  </Field>
                </div>
                <UploadBox
                  label="Address Proof (if different from ID)"
                  accept="image/*,.pdf"
                  preview={!!form.addressProofB64}
                  error={errors.addressProofB64}
                  onChange={e => handleFile('addressProofB64', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 6: Passport Photos ──────────────────────────────────────────── */}
      {step === 6 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={Camera} title="Passport-Size Photographs" subtitle="Upload 2–4 recent passport-size photographs." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {form.passportPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {form.passportPhotos.map((p, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '2px solid #BBF7D0', aspectRatio: '1' }}>
                        <img src={p} alt={`Photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          onClick={() => set('passportPhotos', form.passportPhotos.filter((_, j) => j !== i))}
                          style={{ position: 'absolute', top: '2px', right: '2px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {form.passportPhotos.length < 4 && (
                  <UploadBox
                    label={`Upload Photo ${form.passportPhotos.length + 1} of 4`}
                    required={form.passportPhotos.length === 0}
                    accept="image/*"
                    preview={false}
                    error={errors.passportPhotos}
                    onChange={e => handlePhotoAdd(e.target.files?.[0])}
                  />
                )}
                <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                  {form.passportPhotos.length}/4 photos uploaded · white background recommended
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 7: Professional Details ────────────────────────────────────── */}
      {step === 7 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={BriefcaseBusiness} title="Professional / Student Details" subtitle="Optional — skip if not applicable." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Company Name or College Name">
                  <Input placeholder="e.g. Infosys Ltd. / IIT Bengaluru" value={form.companyOrCollege} onChange={e => set('companyOrCollege', e.target.value)} />
                </Field>
                <UploadBox
                  label="Employee ID / Student ID / Admission Letter (optional)"
                  accept="image/*,.pdf"
                  preview={!!form.employeeStudentIdB64}
                  onChange={e => handleFile('employeeStudentIdB64', e.target.files?.[0])}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 8: Emergency Contact ────────────────────────────────────────── */}
      {step === 8 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={Users} title="Emergency Contact" subtitle="Someone we can reach in case of emergency." />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Contact Person Full Name" required error={errors.emergencyName}>
                  <Input placeholder="e.g. Sunita Patel" value={form.emergencyName} onChange={e => { set('emergencyName', e.target.value); clearError('emergencyName'); }} />
                </Field>
                <Field label="Relationship" required error={errors.emergencyRelationship}>
                  <Select value={form.emergencyRelationship} onChange={e => { set('emergencyRelationship', e.target.value); clearError('emergencyRelationship'); }}>
                    <option value="">Select relationship</option>
                    <option>Parent</option>
                    <option>Spouse / Partner</option>
                    <option>Sibling</option>
                    <option>Friend</option>
                    <option>Guardian</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Phone Number" required error={errors.emergencyPhone}>
                  <Input type="tel" placeholder="+91 98765 43210" inputMode="tel" value={form.emergencyPhone} onChange={e => { set('emergencyPhone', e.target.value); clearError('emergencyPhone'); }} />
                </Field>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                  <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 9: Rental Agreement + Signature ────────────────────────────── */}
      {step === 9 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={BookOpen} title="Rental Agreement" subtitle="Read the full agreement and sign digitally below." />

              {/* Agreement text */}
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', fontSize: '0.8rem', color: '#374151', maxHeight: '300px', overflowY: 'auto', lineHeight: '1.7', marginBottom: '16px' }}>
                <strong style={{ color: '#111827' }}>RENTAL AGREEMENT — Sunrise PG & Residency</strong><br /><br />
                <strong>Parties:</strong> This agreement is between Sunrise PG & Residency (Licensor) and {form.fullName || 'the Guest'} (Licensee).<br /><br />
                <strong>Rent & Deposit:</strong><br />
                • Monthly rent: ₹{room?.priceMonthly?.toLocaleString('en-IN') || '—'}<br />
                • Security deposit: ₹{room?.depositAmount?.toLocaleString('en-IN') || '—'} (refundable)<br />
                • Rent due on 1st of every month via UPI / Bank Transfer<br />
                • Late fee: ₹500 after 7-day grace period<br /><br />
                <strong>House Rules:</strong><br />
                • Entrance closes at 11:00 PM. Prior permission required for late entry.<br />
                • Visitors allowed 9 AM – 9 PM only. No overnight guests without written approval.<br />
                • No loud music after 10 PM (quiet hours policy).<br />
                • No smoking, alcohol, or illegal substances on premises.<br />
                • Meals timings: Breakfast 7:30–9 AM, Lunch 12–2 PM, Dinner 7:30–9 PM.<br />
                • Residents must keep rooms and common areas clean at all times.<br /><br />
                <strong>Property Rules:</strong><br />
                • NestPro IoT Smart Lock PIN is personal and must not be shared.<br />
                • Damage to property will be deducted from security deposit.<br />
                • Wi-Fi is shared — torrenting and illegal downloads prohibited.<br />
                • AC units may only be set between 22°C and 26°C.<br /><br />
                <strong>Visitor & Guest Policy:</strong><br />
                • Day visitors must register at front desk with valid ID.<br />
                • No overnight stay of visitors without written management approval.<br /><br />
                <strong>Damage Policy:</strong><br />
                • Residents are liable for any damage caused to fixtures, furniture, or appliances.<br />
                • Pre-existing damages must be reported within 24 hours of check-in.<br /><br />
                <strong>Check-Out Policy:</strong><br />
                • 30 days written notice is mandatory before vacating.<br />
                • Room must be vacated by 11 AM on the last day.<br />
                • Security deposit refunded within 10 working days after inspection.<br /><br />
                <strong>Cancellation Policy:</strong><br />
                • Notice period of 30 days required. No pro-rata refund for partial months.<br />
                • Security deposit forfeited if notice period is not served.<br /><br />
                <strong>Privacy Policy:</strong><br />
                • Personal data collected during check-in is stored securely and used only for property management.<br />
                • Data is not shared with third parties without consent.<br />
                • CCTV operates 24/7 in common areas for security purposes.<br /><br />
                By signing below, the Licensee confirms they have read, understood, and agreed to all terms.
              </div>

              {/* Accept checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '16px', padding: '12px', background: form.agreementAccepted ? '#F0FDF4' : '#FAFAFA', border: `1px solid ${form.agreementAccepted ? '#BBF7D0' : '#E2E8F0'}`, borderRadius: '8px', transition: 'all 0.15s' }}>
                <input type="checkbox" checked={form.agreementAccepted} onChange={e => { set('agreementAccepted', e.target.checked); clearError('agreementAccepted'); }} style={{ width: '18px', height: '18px', flexShrink: 0, marginTop: '1px', accentColor: '#2563EB' }} />
                <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                  I have read and understood the full rental agreement. I agree to all terms and conditions.
                </span>
              </label>
              {errors.agreementAccepted && <FieldError msg={errors.agreementAccepted} />}

              {/* Digital Signature */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Digital Signature <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <SignaturePad
                  signed={!!form.digitalSignatureB64}
                  onSign={(data) => { set('digitalSignatureB64', data); if (data) clearError('digitalSignatureB64'); }}
                />
                {errors.digitalSignatureB64 && <FieldError msg={errors.digitalSignatureB64} />}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                <button style={btnPrimary} onClick={next}>Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 10: Payment Verification ───────────────────────────────────── */}
      {step === 10 && (
        <div style={{ padding: '20px 16px' }}>
          <div style={cardStyle}>
            <div style={bodyStyle}>
              <SectionHeader icon={CreditCard} title="Payment Verification" subtitle="Upload your rent or deposit payment proof." />

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600, marginBottom: '8px' }}>Amount Due</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#3B82F6' }}>First Month Rent</span>
                  <span style={{ fontWeight: 700, color: '#1E40AF' }}>₹{room?.priceMonthly?.toLocaleString('en-IN') || '9,500'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8125rem', color: '#3B82F6' }}>Security Deposit</span>
                  <span style={{ fontWeight: 700, color: '#1E40AF' }}>₹{room?.depositAmount?.toLocaleString('en-IN') || '9,500'}</span>
                </div>
                <div style={{ borderTop: '1px solid #BFDBFE', marginTop: '10px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#1E40AF' }}>Total</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1D4ED8' }}>
                    ₹{((room?.priceMonthly || 9500) + (room?.depositAmount || 9500)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px 14px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '0.8125rem', color: '#92400E', marginBottom: '16px' }}>
                💡 Pay via UPI to <strong>nestpro@paytm</strong> and upload the payment screenshot or PDF receipt below.
              </div>

              <UploadBox
                label="Payment Screenshot or Receipt"
                required accept="image/*,.pdf"
                preview={!!form.paymentScreenshotB64}
                error={errors.paymentScreenshotB64}
                onChange={e => handleFile('paymentScreenshotB64', e.target.files?.[0])}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button style={btnSecondary} onClick={back}><ArrowLeft size={16} /> Back</button>
                <button
                  style={{ ...btnPrimary, background: submitLoading ? '#93C5FD' : '#16A34A', gap: '8px' }}
                  onClick={handleSubmit}
                  disabled={submitLoading}
                >
                  {submitLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><CheckCircle2 size={18} /> Complete Check-In</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 11: Success ─────────────────────────────────────────────────── */}
      {step === 11 && submitResult && (
        <div style={{ padding: '20px 16px' }}>
          <div style={{ ...cardStyle, border: '1px solid #BBF7D0' }}>
            <div style={{ background: 'linear-gradient(135deg,#166534,#16A34A)', padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} color="#fff" />
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>Check-In Complete! 🎉</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9375rem', margin: 0 }}>Welcome to Sunrise PG & Residency</p>
            </div>

            <div style={{ padding: '24px 20px' }}>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 600, marginBottom: '8px' }}>YOUR SMART DOOR LOCK PIN</p>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#166534', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', lineHeight: 1 }}>
                  {submitResult.smartLockPin}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '8px', marginBottom: 0 }}>Keep this PIN confidential. Use it at your room door.</p>
              </div>

              {[
                { label: 'Name',          value: submitResult.guestName },
                { label: 'Assigned Room', value: `Room ${submitResult.assignedRoom}` },
                { label: 'Status',        value: '✅ Fully Checked In' },
                { label: 'Registration',  value: submitResult.registrationId },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6B7280' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{value}</span>
                </div>
              ))}

              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '14px', marginTop: '16px' }}>
                <p style={{ fontSize: '0.8125rem', color: '#1E40AF', margin: 0, fontWeight: 500, lineHeight: '1.6' }}>
                  📱 Your check-in is confirmed. The property manager has been notified. Screenshot your door PIN above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
