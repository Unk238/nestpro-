import React, { useState } from 'react';
import { 
  CheckCircle2, Building2, MapPin, Layers, Home, Phone, Upload, Image, 
  Sparkles, RefreshCw, X, AlertTriangle, ShieldCheck, ArrowRight, ArrowLeft, Plus, Trash2, Key 
} from 'lucide-react';

export default function OnboardingWizard({ onCompleteSetup }) {
  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Account & Role Selection
  const [userRole, setUserRole] = useState('Owner');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [bizRegNumber, setBizRegNumber] = useState('');

  // STEP 2: Multi-Property Portfolio Selection
  const [selectedTypes, setSelectedTypes] = useState(['PG', 'Hostel']);

  // STEP 3: Independent Properties Hierarchy
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Sunrise PG & Residency',
      type: 'PG',
      branch: 'Koramangala Main Branch',
      buildings: [
        {
          id: 101,
          name: 'Main Block A',
          hasGroundFloor: true,
          floors: [
            {
              id: 1001,
              name: 'Ground Floor',
              commonBathrooms: 2,
              rooms: [
                { roomNo: 'G01', sharing: 'Double Sharing', price: 9500, bathType: 'Attached' },
                { roomNo: 'G02', sharing: 'Triple Sharing', price: 8000, bathType: 'Shared' }
              ]
            },
            {
              id: 1002,
              name: 'Floor 1',
              commonBathrooms: 3,
              rooms: [
                { roomNo: '101', sharing: 'Single Luxury', price: 15000, bathType: 'Attached' },
                { roomNo: '102', sharing: 'Double Sharing', price: 9500, bathType: 'Attached' }
              ]
            }
          ]
        }
      ]
    }
  ]);

  // STEP 4: Google Maps Address Simulation
  const [addressInput, setAddressInput] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // STEP 5: Bulk Room Creator State
  const [bulkTargetFloorId, setBulkTargetFloorId] = useState('');
  const [bulkPrefix, setBulkPrefix] = useState('10');
  const [bulkCount, setBulkCount] = useState(4);
  const [bulkSharing, setBulkSharing] = useState('Double Sharing');
  const [bulkPrice, setBulkPrice] = useState(9000);
  const [bulkBathType, setBulkBathType] = useState('Attached');

  // STEP 7: Logo Branding Selector
  const [logoPreview, setLogoPreview] = useState('/nestpro-logo.jpg');
  const [skippedLogo, setSkippedLogo] = useState(false);

  // Verification & Phone OTP Handlers
  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    alert(`Demo OTP sent to ${mobileNumber}: 1234`);
  };

  const handleVerifyOtp = () => {
    if (otpInput === '1234' || otpInput.length === 4) {
      setIsPhoneVerified(true);
      alert('Mobile Phone Verified Successfully! ✓');
    } else {
      alert('Invalid OTP. Use demo OTP: 1234');
    }
  };

  const propertyTypesList = [
    { id: 'PG', title: 'Paying Guest (PG)', desc: 'Monthly rental with food & utilities' },
    { id: 'Hostel', title: 'Hostel / Student Housing', desc: 'Dormitory beds for students & professionals' },
    { id: 'Hotel', title: 'Hotel / Boutique Stay', desc: 'Daily rate short-term accommodations' },
    { id: 'Lodge', title: 'Lodge / Guest House', desc: 'Budget transient accommodations' },
    { id: 'Co-Living', title: 'Co-Living Spaces', desc: 'Premium shared living for tech professionals' },
    { id: 'Dormitory', title: 'Dormitory Bunk Beds', desc: 'High-density shared sleeping space' },
    { id: 'Rental', title: 'Apartment Rental', desc: 'Full unit family / independent flats' }
  ];

  const handleToggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleAddressSearch = (text) => {
    setAddressInput(text);
    if (text.length > 2) {
      setAddressSuggestions([
        { text: `${text}, 100 Feet Road, Koramangala 4th Block, Bengaluru, Karnataka 560034`, lat: 12.9348, lng: 77.6254 },
        { text: `${text}, HSR Layout Sector 1, Outer Ring Road, Bengaluru 560102`, lat: 12.9116, lng: 77.6389 },
        { text: `${text}, Gachibowli DLF Cybercity, Hyderabad, Telangana 500032`, lat: 17.4447, lng: 78.3483 }
      ]);
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSelectAddress = (item) => {
    setSelectedAddress(item);
    setAddressInput(item.text);
    setAddressSuggestions([]);
  };

  const handleBulkGenerateRooms = () => {
    if (!bulkTargetFloorId) {
      alert('Please select a target floor level.');
      return;
    }
    const newRooms = [];
    for (let i = 1; i <= bulkCount; i++) {
      newRooms.push({
        roomNo: `${bulkPrefix}${i}`,
        sharing: bulkSharing,
        price: Number(bulkPrice),
        bathType: bulkBathType
      });
    }

    setProperties(properties.map(p => ({
      ...p,
      buildings: p.buildings.map(b => ({
        ...b,
        floors: b.floors.map(f => {
          if (f.id === Number(bulkTargetFloorId)) {
            return { ...f, rooms: [...f.rooms, ...newRooms] };
          }
          return f;
        })
      }))
    })));

    alert(`Successfully generated ${bulkCount} rooms for selected floor!`);
  };

  const calculateCompletionScore = () => {
    let score = 0;
    if (isPhoneVerified) score += 25;
    if (selectedTypes.length > 0) score += 15;
    if (properties.length > 0) score += 25;
    if (selectedAddress) score += 15;
    if (logoPreview && !skippedLogo) score += 20;
    return score;
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 20px' }}>
      
      {/* Wizard Header Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/nestpro-logo.jpg" alt="NestPro Logo" style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-emerald">NESTPRO ACCOMMODATION ONBOARDING</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step {currentStep} of 8</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '2px' }}>
              {currentStep === 1 && 'Account Registration & Verification'}
              {currentStep === 2 && 'Multi-Property Type Selector'}
              {currentStep === 3 && 'Independent Properties & Branch Creator'}
              {currentStep === 4 && 'Google Maps Address Autocomplete'}
              {currentStep === 5 && 'Room Configuration & Bulk Generator'}
              {currentStep === 6 && 'Floor Common Bathroom Counters'}
              {currentStep === 7 && 'Business Logo & Brand Customization'}
              {currentStep === 8 && 'Final Setup Review & Readiness Audit'}
            </h2>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <div
              key={s}
              onClick={() => setCurrentStep(s)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: s === currentStep ? 'var(--primary)' : s < currentStep ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                border: s === currentStep ? '2px solid var(--primary-hover)' : s < currentStep ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)',
                color: s === currentStep ? '#fff' : s < currentStep ? 'var(--accent-emerald)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {s < currentStep ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: ACCOUNT REGISTRATION & ROLE SELECTION */}
      {currentStep === 1 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>User Role & Mandatory Mobile Phone Verification</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Select your business operational role and verify your mobile number to get started.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>SELECT YOUR ACCOUNT ROLE</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {['Owner', 'Property Manager', 'Receptionist', 'Operations Staff', 'Accountant', 'Maintenance Staff'].map(r => (
                <button
                  key={r}
                  onClick={() => setUserRole(r)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: userRole === r ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: userRole === r ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: userRole === r ? '#fff' : 'var(--text-muted)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textAlign: 'left'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Mandatory Mobile Phone OTP Verification */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '8px', color: '#fff' }}>
              MOBILE NUMBER (MANDATORY OTP VERIFICATION) <span style={{ color: 'var(--accent-rose)' }}>*</span>
            </label>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="+91 Mobile Phone Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={isPhoneVerified}
                style={{ flex: 1, minWidth: '220px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', outline: 'none' }}
              />
              {!isPhoneVerified && (
                <button className="btn-primary" onClick={handleSendOtp} disabled={otpSent}>
                  {otpSent ? 'OTP Sent' : 'Send Phone OTP'}
                </button>
              )}
            </div>

            {otpSent && !isPhoneVerified && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter 4-digit OTP (1234)"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  style={{ width: '180px', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', outline: 'none' }}
                />
                <button className="btn-primary" onClick={handleVerifyOtp} style={{ background: 'var(--accent-emerald)' }}>
                  Verify OTP
                </button>
              </div>
            )}

            {isPhoneVerified && (
              <div className="badge badge-emerald" style={{ marginTop: '8px', padding: '6px 14px' }}>
                ✓ Mobile Number Verified (+91 {mobileNumber})
              </div>
            )}
          </div>

          {/* Optional Business Identifiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address (Optional)</label>
              <input type="email" placeholder="owner@nestpro.com" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GST Number (Optional)</label>
              <input type="text" placeholder="29ABCDE1234F1Z5" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Business Registration No (Optional)</label>
              <input type="text" placeholder="REG-2026-9871" value={bizRegNumber} onChange={(e) => setBizRegNumber(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }} />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MULTI-PROPERTY PORTFOLIO SELECTOR */}
      {currentStep === 2 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Select Property Types in Your Portfolio</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Owners can manage mixed portfolios (e.g. PG + Hotel + Lodge). Select all that apply.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {propertyTypesList.map(type => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <div
                  key={type.id}
                  onClick={() => handleToggleType(type.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{type.title}</span>
                    {isSelected && <span className="badge badge-emerald">✓ Selected</span>}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: INDEPENDENT PROPERTY & BRANCH CREATOR */}
      {currentStep === 3 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Independent Properties & Building Structure</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Hierarchy: Property -&gt; Branch (Optional) -&gt; Building -&gt; Floor -&gt; Room -&gt; Bed
          </p>

          {properties.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{p.name} ({p.type})</span>
                <span className="badge badge-indigo">{p.branch}</span>
              </div>

              {p.buildings.map(b => (
                <div key={b.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '12px', marginTop: '10px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>🏢 {b.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Floors: {b.floors.map(f => f.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* STEP 4: GOOGLE MAPS ADDRESS AUTOCOMPLETE */}
      {currentStep === 4 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Google Maps Address & Floor Structure</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Search property address with simulated Google Maps Autocomplete and set ground floor existence.
          </p>

          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>SEARCH PROPERTY ADDRESS</label>
            <input
              type="text"
              placeholder="Type address (e.g. Koramangala 4th Block...)"
              value={addressInput}
              onChange={(e) => handleAddressSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: '#fff', outline: 'none' }}
            />

            {addressSuggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#0e1322', border: '1px solid var(--border-color)', borderRadius: '12px', zIndex: 10, marginTop: '4px', overflow: 'hidden' }}>
                {addressSuggestions.map((item, i) => (
                  <div key={i} onClick={() => handleSelectAddress(item)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.85rem' }}>
                    📍 {item.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAddress && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-emerald)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <div style={{ fontWeight: 800, color: '#fff' }}>Selected Address:</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>{selectedAddress.text}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>Coordinates: {selectedAddress.lat}, {selectedAddress.lng}</div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700 }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              Ground Floor Exists (Generates Ground Floor, Floor 1, Floor 2, etc.)
            </label>
          </div>
        </div>
      )}

      {/* STEP 5: BULK ROOM GENERATOR */}
      {currentStep === 5 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Floor Level Bulk Room Generator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Generate multiple rooms across floor levels simultaneously with custom pricing and sharing types.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Floor</label>
              <select value={bulkTargetFloorId} onChange={(e) => setBulkTargetFloorId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }}>
                <option value="">Select Floor Level</option>
                <option value="1001">Ground Floor</option>
                <option value="1002">Floor 1</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room No Prefix</label>
              <input type="text" value={bulkPrefix} onChange={(e) => setBulkPrefix(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Count</label>
              <input type="number" value={bulkCount} onChange={(e) => setBulkCount(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sharing Type</label>
              <select value={bulkSharing} onChange={(e) => setBulkSharing(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', marginTop: '4px' }}>
                <option value="Single Luxury">Single Luxury</option>
                <option value="Double Sharing">Double Sharing</option>
                <option value="Triple Sharing">Triple Sharing</option>
                <option value="Four Sharing">Four Sharing</option>
              </select>
            </div>
          </div>

          <button className="btn-primary" onClick={handleBulkGenerateRooms}>
            <Plus size={16} /> Bulk Generate Rooms
          </button>
        </div>
      )}

      {/* STEP 6: FLOOR COMMON BATHROOMS */}
      {currentStep === 6 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Floor-Level Common Bathroom Counters</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Set total common bathrooms per floor without forcing manual bathroom selection on every room.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: '#fff' }}>Ground Floor</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Common Restrooms for shared residents</div>
              </div>
              <span className="badge badge-emerald">2 Common Bathrooms</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong style={{ color: '#fff' }}>Floor 1</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Common Restrooms for shared residents</div>
              </div>
              <span className="badge badge-emerald">3 Common Bathrooms</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 7: LOGO BRANDING SELECTOR */}
      {currentStep === 7 && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Business Logo Branding & Customization</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Upload or select your property logo to brand digital check-in links and WhatsApp receipts.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '20px', border: '2px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {logoPreview && !skippedLogo ? (
                <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No Logo</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-primary" onClick={() => { setLogoPreview('/nestpro-logo.jpg'); setSkippedLogo(false); }}>
                  <Image size={16} /> Select Sample Logo
                </button>

                <button className="btn-secondary" onClick={() => setSkippedLogo(true)}>
                  Deselect / Skip
                </button>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Recommended size: 512x512 PNG/JPG.
              </div>
            </div>
          </div>

          {skippedLogo && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent-amber)', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', color: '#fbbf24' }}>
              ⚠️ Property branding incomplete — profile will display default badge until logo is uploaded.
            </div>
          )}
        </div>
      )}

      {/* STEP 8: FINAL REVIEW & COMPLETION SCORE */}
      {currentStep === 8 && (
        <div className="glass-panel-glow" style={{ padding: '32px', textAlign: 'center' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '16px', padding: '6px 16px' }}>
            🎉 COMPLETION AUDIT SCORE
          </span>

          <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-emerald)', marginBottom: '4px' }}>
            {calculateCompletionScore()}% READY
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '28px' }}>
            Your property portfolio setup is validated and ready for 24/7 AI Receptionist & Self Check-In operation.
          </p>

          <button className="btn-primary" onClick={onCompleteSetup} style={{ padding: '14px 32px', fontSize: '1rem' }}>
            <Sparkles size={18} /> Launch Owner Command Center OS <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Navigation Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
        <button
          className="btn-secondary"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {currentStep < 8 && (
          <button
            className="btn-primary"
            onClick={() => {
              if (currentStep === 1 && !isPhoneVerified) {
                alert('Please verify your mobile number via OTP first.');
                return;
              }
              setCurrentStep(Math.min(8, currentStep + 1));
            }}
          >
            Next Step <ArrowRight size={16} />
          </button>
        )}
      </div>

    </div>
  );
}
