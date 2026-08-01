import React, { useState } from "react";
import { ShieldCheck, Sparkles, CheckCircle2, Building2, User, Phone, FileText, Lock } from "lucide-react";
import confetti from "canvas-confetti";

export function MobileTenantCheckIn({ token = "demo-checkin-token-88", onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Rahul Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [docType, setDocType] = useState("Aadhaar Card");
  const [loading, setLoading] = useState(false);
  const [accessCode, setAccessCode] = useState(null);

  const handleKycSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handlePayAndComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkin/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paymentMethod: "UPI" })
      });
      const data = await res.json();
      setAccessCode(data.accessCode || "441392");
      setStep(4);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      setAccessCode("441392");
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "16px", minHeight: "100%", background: "#f8fafc", color: "#0f172a", fontFamily: "sans-serif" }}>
      
      {/* Mobile Card Header */}
      <div style={{
        background: "linear-gradient(135deg, #2563eb 0%, #4338ca 100%)",
        borderRadius: "20px",
        padding: "20px 16px",
        color: "#ffffff",
        textAlign: "center",
        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.3)",
        marginBottom: "16px",
        position: "relative"
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(4px)",
          padding: "3px 10px",
          borderRadius: "9999px",
          fontSize: "0.65rem",
          fontWeight: 700,
          marginBottom: "8px"
        }}>
          <Sparkles size={12} /> Fast Digital Onboarding
        </div>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800 }}>NestPro Digital Check-In</h2>
        <p style={{ fontSize: "0.7rem", opacity: 0.9, marginTop: "2px" }}>Contactless Registration for Smart Living</p>
      </div>

      {/* Progress Step Counter */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", color: "#64748b", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "16px" }}>
        <span>Step {step} of 4</span>
        <span style={{ fontWeight: 700, color: "#2563eb" }}>
          {step === 1 ? "Personal Info" : step === 2 ? "KYC Upload" : step === 3 ? "Payment" : "Key Pass"}
        </span>
      </div>

      {/* STEP 1: PERSONAL INFO */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "4px" }}>
              Full Name
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma" 
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "0.85rem",
                backgroundColor: "#ffffff"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#475569", marginBottom: "4px" }}>
              Phone Number (WhatsApp)
            </label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210" 
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "0.85rem",
                backgroundColor: "#ffffff"
              }}
            />
          </div>

          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "12px", fontSize: "0.75rem", color: "#1e40af" }}>
            🏠 <strong>Assigned Room 101</strong> (Single Luxury) • ₹14,500/mo
          </div>

          <button 
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
            }}
          >
            Continue to KYC Verification →
          </button>
        </div>
      )}

      {/* STEP 2: DIGITAL KYC UPLOAD */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
            <ShieldCheck size={28} color="#2563eb" style={{ margin: "0 auto 4px auto" }} />
            <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1e3a8a" }}>Digital KYC Verification</h4>
            <p style={{ fontSize: "0.7rem", color: "#1d4ed8", marginTop: "2px" }}>Automated AI OCR & Liveness Match</p>
          </div>

          <div style={{
            border: "2px dashed #cbd5e1",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            cursor: "pointer"
          }}>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>📸 Tap to snap or upload Govt ID / Aadhaar</p>
            <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>OCR Confidence: 97% | Face Match: 98%</span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => setStep(1)}
              style={{ flex: 1, backgroundColor: "#e2e8f0", color: "#334155", fontWeight: 700, padding: "10px", borderRadius: "12px", border: "none", fontSize: "0.8rem" }}
            >
              Back
            </button>
            <button 
              onClick={handleKycSubmit}
              disabled={loading}
              style={{ flex: 2, backgroundColor: "#2563eb", color: "#ffffff", fontWeight: 700, padding: "10px", borderRadius: "12px", border: "none", fontSize: "0.8rem" }}
            >
              {loading ? "Verifying..." : "Submit KYC →"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: RENT PAYMENT */}
      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", padding: "14px", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
              <span>Monthly Rent (Room 101)</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>₹14,500</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b", marginTop: "6px" }}>
              <span>Refundable Deposit</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>₹14,500</span>
            </div>
            <div style={{ height: "1px", backgroundColor: "#e2e8f0", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", fontWeight: 800 }}>
              <span>Total Payable</span>
              <span style={{ color: "#16a34a" }}>₹29,000</span>
            </div>
          </div>

          <button 
            onClick={handlePayAndComplete}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontWeight: 700,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.85rem",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
            }}
          >
            {loading ? "Processing UPI Transaction..." : "Pay via UPI & Issue Smart Pass 💳"}
          </button>
        </div>
      )}

      {/* STEP 4: KEY PASS CONFIRMATION */}
      {step === 4 && (
        <div style={{ textAlign: "center", padding: "12px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>Registration Complete! 🎉</h3>
          
          <div style={{
            backgroundColor: "#1e293b",
            color: "#ffffff",
            padding: "16px",
            borderRadius: "16px",
            border: "2px dashed #3b82f6"
          }}>
            <div style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "#94a3b8", fontWeight: 700 }}>
              SMART DOOR LOCK PIN
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "2rem", fontWeight: 800, color: "#60a5fa", margin: "6px 0" }}>
              {accessCode || "441392"}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#4ade80" }}>✓ Unlocks Main Gate & Room 101</div>
          </div>

          <p style={{ fontSize: "0.7rem", color: "#64748b" }}>
            Details property manager ko send kar di gayi hain. Enjoy your stay at NestPro!
          </p>
        </div>
      )}

    </div>
  );
}
