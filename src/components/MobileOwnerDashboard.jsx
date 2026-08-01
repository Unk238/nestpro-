import React, { useState } from "react";
import { Smartphone, Bell, Check, Clock, AlertTriangle, Plus, MessageSquare, Copy, Link as LinkIcon } from "lucide-react";

export function MobileOwnerDashboard({ onOpenCheckInToken }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [rooms, setRooms] = useState([
    { roomNo: "101", type: "Double Sharing", price: "₹8,500", status: "Occupied", tenant: "Srijan Raj", phone: "+91 98765 11111" },
    { roomNo: "102", type: "Single Sharing", price: "₹12,000", status: "Available", tenant: null, phone: null },
    { roomNo: "103", type: "Triple Sharing", price: "₹7,000", status: "Pending Due", tenant: "Aman Verma", phone: "+91 98765 22222" },
    { roomNo: "201", type: "Single Luxury", price: "₹15,000", status: "Available", tenant: null, phone: null },
  ]);

  const handleRemindRentWhatsApp = (tenantName, phone, amount) => {
    const text = encodeURIComponent(`Hi ${tenantName}, this is a gentle reminder regarding your NestPro PG rent of ${amount}. Please pay via UPI to receive your digital receipt.`);
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleGenerateWhatsAppLink = () => {
    const link = `${window.location.origin}/checkin/demo-checkin-token-88`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    const waText = encodeURIComponent(`Welcome to NestPro PG! Click your single-use digital check-in link to complete onboarding and get your room key: ${link}`);
    window.open(`https://wa.me/?text=${waText}`, '_blank');
  };

  return (
    <div style={{ padding: "16px", minHeight: "100%", backgroundColor: "#f8fafc", color: "#0f172a", fontFamily: "sans-serif" }}>
      
      {/* Top Header Card */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "18px 16px",
        borderRadius: "20px",
        color: "#ffffff",
        boxShadow: "0 12px 24px rgba(0, 0, 0, 0.4)",
        marginBottom: "16px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div>
            <p style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Total Month Collection</p>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ffffff", margin: "2px 0 0 0" }}>₹1,85,000</h3>
          </div>
          <span style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            color: "#6ee7b7",
            fontSize: "0.65rem",
            padding: "4px 10px",
            borderRadius: "9999px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            fontWeight: 700
          }}>
            92% Collected
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.7rem", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div>
            <span style={{ color: "#94a3b8" }}>Total Beds:</span> <strong style={{ color: "#fff" }}>24 Beds</strong>
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>Vacant:</span> <strong style={{ color: "#4ade80" }}>2 Available</strong>
          </div>
        </div>
      </div>

      {/* Quick Action Pills */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "16px" }}>
        <button 
          onClick={handleGenerateWhatsAppLink}
          style={{
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "8px 12px",
            borderRadius: "12px",
            border: "none",
            fontSize: "0.7rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
          }}
        >
          {copiedLink ? "✓ WhatsApp Link Copied!" : "🔗 Generate WhatsApp Checkin Link"}
        </button>

        <button 
          onClick={() => alert("WhatsApp Bulk Reminders triggered for all pending rent tenants.")}
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #cbd5e1",
            color: "#334155",
            padding: "8px 12px",
            borderRadius: "12px",
            fontSize: "0.7rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            cursor: "pointer"
          }}
        >
          💬 Send Bulk WhatsApp
        </button>
      </div>

      {/* Visual Floor / Room Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h4 style={{ fontSize: "0.7rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Floor 1 Rooms & Beds
        </h4>
        
        {rooms.map((room) => (
          <div 
            key={room.roomNo} 
            style={{
              backgroundColor: "#ffffff",
              padding: "14px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>Room {room.roomNo}</span>
                <span style={{ fontSize: "0.7rem", color: "#64748b" }}>({room.type})</span>
              </div>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "#475569", marginTop: "2px" }}>
                {room.tenant ? `Tenant: ${room.tenant}` : "Vacant Room"} • <span style={{ color: "#2563eb" }}>{room.price}</span>
              </p>
            </div>

            <div>
              {room.status === "Available" && (
                <span style={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: "0.65rem", padding: "4px 10px", borderRadius: "10px", fontWeight: 700 }}>
                  Available
                </span>
              )}

              {room.status === "Occupied" && (
                <span style={{ backgroundColor: "#f1f5f9", color: "#334155", fontSize: "0.65rem", padding: "4px 10px", borderRadius: "10px", fontWeight: 600 }}>
                  Paid
                </span>
              )}

              {room.status === "Pending Due" && (
                <button 
                  onClick={() => handleRemindRentWhatsApp(room.tenant, room.phone, room.price)}
                  style={{
                    backgroundColor: "#f59e0b",
                    color: "#ffffff",
                    fontSize: "0.65rem",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)"
                  }}
                >
                  Remind Rent
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
