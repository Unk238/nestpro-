import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow base64 file uploads

// ── In-memory stores for Vercel serverless (resets per cold start) ─────────────
const whatsappMessages = [];
const checkinStore = {}; // token -> {residentName, assignedRoom, status, expiresAt, accessCode}
const guestRegistrations = []; // submitted check-in records

// Seed a demo token
checkinStore['demo-checkin-token-88'] = {
  token: 'demo-checkin-token-88',
  residentName: 'Aarav Patel',
  assignedRoomNumber: '102',
  status: 'PENDING',
  expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  accessCode: null,
  room: {
    roomNumber: '102',
    type: 'Double Sharing',
    floor: 1,
    priceMonthly: 9500,
    depositAmount: 9500,
    amenities: ['AC', 'Shared Washroom', 'WiFi']
  }
};

// ── Health check ──────────────────────────────────────────────────────────────
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'running',
    service: 'NestPro Backend',
    version: '1.0.0',
    environment: 'vercel-serverless'
  });
});

// ── Dashboard stats ───────────────────────────────────────────────────────────
app.get(['/api/dashboard', '/dashboard'], (req, res) => {
  res.json({
    success: true,
    stats: {
      totalRooms: 8,
      availableRooms: 3,
      occupiedRooms: 4,
      occupancyRate: 75,
      pendingCheckins: Object.values(checkinStore).filter(t => t.status === 'PENDING').length,
      openComplaints: 2,
      monthlyRevenue: 67400,
      pendingRent: 14500
    }
  });
});

// ── Residents ─────────────────────────────────────────────────────────────────
app.get(['/api/residents', '/residents'], (req, res) => {
  res.json({
    success: true,
    residents: [
      { id: 'res-101', name: 'Aarav Patel',        phone: '+91 98765 43210', room: '101', status: 'PAID',    kycStatus: 'VERIFIED', smartLockPin: '441392' },
      { id: 'res-102', name: 'Priya Sundaram',     phone: '+91 99000 88888', room: '201', status: 'PAID',    kycStatus: 'VERIFIED', smartLockPin: '882211' },
      { id: 'res-103', name: 'Rohan Sharma',        phone: '+91 98123 99999', room: '301', status: 'PENDING', kycStatus: 'VERIFIED', smartLockPin: '551122' },
      { id: 'res-104', name: 'Vikramaditya Sen',   phone: '+91 97654 11111', room: '402', status: 'PAID',    kycStatus: 'VERIFIED', smartLockPin: '993344' }
    ]
  });
});

// ── Rooms ─────────────────────────────────────────────────────────────────────
app.get(['/api/rooms', '/rooms'], (req, res) => {
  res.json({
    success: true,
    rooms: [
      { roomNumber: '101', type: 'Single Luxury',  floor: 1, priceMonthly: 14500, depositAmount: 14500, status: 'OCCUPIED',     amenities: ['Balcony','AC','Private Washroom','WiFi'] },
      { roomNumber: '102', type: 'Double Sharing',  floor: 1, priceMonthly:  9500, depositAmount:  9500, status: 'AVAILABLE',    amenities: ['AC','Shared Washroom','WiFi'] },
      { roomNumber: '201', type: 'Deluxe Suite',    floor: 2, priceMonthly: 25000, depositAmount: 25000, status: 'OCCUPIED',     amenities: ['Skyline View','AC','Smart TV','Private Washroom'] },
      { roomNumber: '202', type: 'Double Sharing',  floor: 2, priceMonthly:  9500, depositAmount:  9500, status: 'AVAILABLE',    amenities: ['AC','Balcony','WiFi'] },
      { roomNumber: '301', type: 'Double Sharing',  floor: 3, priceMonthly:  9800, depositAmount:  9800, status: 'OCCUPIED',     amenities: ['AC','Attached Washroom'] },
      { roomNumber: '302', type: 'Deluxe Suite',    floor: 3, priceMonthly: 22000, depositAmount: 22000, status: 'AVAILABLE',    amenities: ['City View','AC','Private Kitchenette'] },
      { roomNumber: '401', type: 'Triple Sharing',  floor: 4, priceMonthly:  8000, depositAmount:  8000, status: 'MAINTENANCE',  amenities: ['Shared Washroom','WiFi'] },
      { roomNumber: '402', type: 'Single Luxury',   floor: 4, priceMonthly: 15000, depositAmount: 15000, status: 'OCCUPIED',     amenities: ['Top Floor View','AC','Private Desk'] }
    ]
  });
});

// ── Payments ──────────────────────────────────────────────────────────────────
app.get(['/api/payments', '/payments'], (req, res) => {
  res.json({
    success: true,
    ledger: [
      { id: 'PAY-101', resident: 'Aarav Patel',      room: '101', amount: 14500, status: 'PAID',     date: '2026-08-01' },
      { id: 'PAY-102', resident: 'Priya Sundaram',   room: '201', amount: 25000, status: 'PAID',     date: '2026-08-01' },
      { id: 'PAY-103', resident: 'Rohan Sharma',      room: '301', amount:  9800, status: 'PENDING',  date: '2026-08-01' },
      { id: 'PAY-104', resident: 'Vikramaditya Sen', room: '402', amount: 15000, status: 'PAID',     date: '2026-08-01' }
    ]
  });
});

// ── Complaints ────────────────────────────────────────────────────────────────
app.get(['/api/complaints', '/complaints'], (req, res) => {
  res.json({
    success: true,
    complaints: [
      { id: 'c-101', ticketId: 'TKT-101', residentName: 'Rohan Sharma',   roomNumber: '301', category: 'Plumbing',   description: 'AC Water Leakage in washroom', priority: 'CRITICAL', status: 'IN_PROGRESS' },
      { id: 'c-102', ticketId: 'TKT-102', residentName: 'Aarav Patel',    roomNumber: '101', category: 'Internet',   description: 'Floor 2 Wi-Fi Router Reset',   priority: 'HIGH',     status: 'OPEN' },
      { id: 'c-103', ticketId: 'TKT-103', residentName: 'Priya Sundaram', roomNumber: '201', category: 'Electrical', description: 'Hot Water Geyser Tripping',     priority: 'MEDIUM',   status: 'RESOLVED' }
    ]
  });
});

// ── Analytics ─────────────────────────────────────────────────────────────────
app.get(['/api/analytics', '/analytics'], (req, res) => {
  res.json({ success: true, analytics: { avgOccupancy: 89, monthlyRevenue: 67400, forecastGrowth: '+14.2%', ticketResolutionTime: '3.4 hours' } });
});

// ── Settings ──────────────────────────────────────────────────────────────────
app.get(['/api/settings', '/settings'], (req, res) => {
  res.json({ success: true, businessProfile: { name: 'Sunrise PG & Residency', gstNo: '29ABCDE1234F1Z5', phone: '+91 98765 43210', address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038' } });
});

// ── WhatsApp: get message logs ────────────────────────────────────────────────
app.get('/api/whatsapp/messages', (req, res) => {
  res.json({ success: true, messages: whatsappMessages });
});

// ── WhatsApp: GENERATE + DISPATCH CHECK-IN LINK ───────────────────────────────
app.post('/api/whatsapp/send-checkin-link', (req, res) => {
  try {
    const { phone, residentName, expiryHours } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required.' });

    const name = residentName || 'Guest';
    const hours = expiryHours || 24;
    const tokenString = `token_${uuidv4().slice(0, 10)}`;

    // Determine production origin from request headers
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'nestpro-os.vercel.app';
    const origin = `${proto}://${host}`;
    const checkInUrl = `${origin}/checkin/${tokenString}`;

    // Store the token in memory
    checkinStore[tokenString] = {
      token: tokenString,
      residentName: name,
      assignedRoomNumber: '102',
      status: 'PENDING',
      expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
      accessCode: null,
      room: {
        roomNumber: '102',
        type: 'Double Sharing',
        floor: 1,
        priceMonthly: 9500,
        depositAmount: 9500,
        amenities: ['AC', 'Shared Washroom', 'WiFi']
      }
    };

    const formattedContent = `Welcome to NestPro.\n\nComplete your digital check-in here:\n${checkInUrl}\n\nThis link expires in ${hours} hours.`;

    const messageRecord = {
      id: `msg-wa-${Date.now()}`,
      messageId: `wamid.${uuidv4().toUpperCase()}`,
      phone,
      residentName: name,
      templateType: 'CHECKIN_LINK',
      content: formattedContent,
      status: 'DELIVERED',
      checkInUrl,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    whatsappMessages.unshift(messageRecord);

    res.json({
      success: true,
      messageId: messageRecord.messageId,
      token: tokenString,
      checkInUrl,
      recipientPhone: phone,
      status: 'DELIVERED',
      content: formattedContent,
      message: `WhatsApp check-in link delivered to ${phone}!`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send WhatsApp message.' });
  }
});

// ── WhatsApp: send template message ──────────────────────────────────────────
app.post('/api/whatsapp/send-template', (req, res) => {
  try {
    const { phone, residentName, templateType, customText } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required.' });

    const name = residentName || 'Resident';
    const content = customText || `Namaste ${name}, welcome to NestPro PG Management.`;

    const messageRecord = {
      id: `msg-wa-${Date.now()}`,
      messageId: `wamid.${uuidv4().toUpperCase()}`,
      phone,
      residentName: name,
      templateType: templateType || 'WELCOME_MESSAGE',
      content,
      status: 'DELIVERED',
      checkInUrl: null,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    whatsappMessages.unshift(messageRecord);

    res.json({ success: true, messageId: messageRecord.messageId, recipientPhone: phone, status: 'DELIVERED', content, message: `Template message delivered to ${phone}!` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send template.' });
  }
});

// ── Check-in: GET token details ───────────────────────────────────────────────
app.get('/api/checkin/:token', (req, res) => {
  const { token } = req.params;
  const tokenData = checkinStore[token];

  if (!tokenData) {
    return res.status(404).json({ error: 'Invalid or expired check-in token. Please contact the property manager.' });
  }

  if (new Date(tokenData.expiresAt) < new Date()) {
    tokenData.status = 'EXPIRED';
    return res.status(410).json({ error: 'This check-in link has expired. Please request a new link.' });
  }

  if (tokenData.status === 'CHECKED_IN') {
    return res.status(409).json({ error: 'This check-in has already been completed.' });
  }

  res.json(tokenData);
});

// ── Check-in: SUBMIT full guest registration ──────────────────────────────────
app.post('/api/checkin/:token/submit', (req, res) => {
  const { token } = req.params;
  const tokenData = checkinStore[token];

  if (!tokenData) return res.status(404).json({ error: 'Invalid check-in token.' });
  if (new Date(tokenData.expiresAt) < new Date()) return res.status(410).json({ error: 'Token expired.' });
  if (tokenData.status === 'CHECKED_IN') return res.status(409).json({ error: 'Already checked in.' });

  const { fullName, mobile, email, dateOfBirth, gender, nationality, occupation,
    idType, idNumber, idDocumentB64, permanentAddress, city, state, pinCode,
    emergencyName, emergencyRelationship, emergencyPhone,
    agreementAccepted, digitalSignatureB64, paymentScreenshotB64, passportPhotosB64 } = req.body;

  // Required field validation
  const required = { fullName, mobile, email, dateOfBirth, gender, nationality, occupation, idType, idNumber, permanentAddress, city, state, pinCode, emergencyName, emergencyRelationship, emergencyPhone };
  const missing = Object.entries(required).filter(([, v]) => !v || !String(v).trim()).map(([k]) => k);
  if (missing.length > 0) return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  if (!agreementAccepted) return res.status(400).json({ error: 'Rental agreement must be accepted.' });
  if (!digitalSignatureB64) return res.status(400).json({ error: 'Digital signature is required.' });
  if (!paymentScreenshotB64) return res.status(400).json({ error: 'Payment proof is required.' });
  if (!idDocumentB64) return res.status(400).json({ error: 'Identity document upload is required.' });

  const photos = Array.isArray(passportPhotosB64) ? passportPhotosB64 : [];
  if (photos.length < 1) return res.status(400).json({ error: 'At least 1 passport photograph is required.' });

  // Generate smart lock PIN
  const accessPin = String(Math.floor(100000 + Math.random() * 900000));
  const registrationId = `reg-${uuidv4().slice(0, 10)}`;
  const now = new Date().toISOString();

  // Mark token as used
  tokenData.status = 'CHECKED_IN';
  tokenData.accessCode = accessPin;
  tokenData.checkedInAt = now;

  // Store registration
  guestRegistrations.push({
    id: registrationId, token, fullName, mobile, email, assignedRoom: tokenData.assignedRoomNumber, submittedAt: now
  });

  res.json({
    success: true,
    message: 'Check-in completed successfully!',
    data: {
      registrationId,
      guestName: String(fullName).trim(),
      assignedRoom: tokenData.assignedRoomNumber,
      smartLockPin: accessPin,
      checkedInAt: now
    }
  });
});

// ── AI Chat (simple responses when Gemini not available) ──────────────────────
app.post('/api/ai/chat', (req, res) => {
  const { message } = req.body;
  const msg = (message || '').toLowerCase();
  let reply = `Namaste! I am the NestPro Virtual AI Receptionist 🤖\n\nWe have 3 vacant rooms ready. Ask me about availability, rent, or log a maintenance complaint!`;
  if (msg.includes('room') || msg.includes('available') || msg.includes('vacant')) {
    reply = `Currently 3 rooms available:\n• Room 102 – Double Sharing – ₹9,500/mo\n• Room 202 – Double Sharing – ₹9,500/mo\n• Room 302 – Deluxe Suite – ₹22,000/mo\n\nShall I generate a check-in link for you?`;
  } else if (msg.includes('complaint') || msg.includes('issue') || msg.includes('broken') || msg.includes('wifi') || msg.includes('water')) {
    reply = `Your complaint has been logged! 🛠️\n\nTicket ID: TKT-${Math.floor(1000 + Math.random() * 9000)}\nStatus: OPEN on 5-stage Kanban Board\n\nThe maintenance team will be notified immediately.`;
  } else if (msg.includes('checkin') || msg.includes('check-in') || msg.includes('register') || msg.includes('link')) {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'nestpro-os.vercel.app';
    const token = `nest-${uuidv4().slice(0, 8)}`;
    const url = `${proto}://${host}/checkin/${token}`;
    checkinStore[token] = { token, residentName: 'Prospective Guest', assignedRoomNumber: '102', status: 'PENDING', expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString(), accessCode: null, room: { roomNumber: '102', type: 'Double Sharing', floor: 1, priceMonthly: 9500, depositAmount: 9500, amenities: ['AC','WiFi','Shared Washroom'] } };
    reply = `Here is your secure check-in link:\n👉 ${url}\n\nThis link expires in 24 hours. Open it on your phone to complete digital registration.`;
  }
  res.json({ reply, provider: 'NestPro AI Receptionist' });
});

// ── Admin overview ────────────────────────────────────────────────────────────
app.get('/api/admin/overview', (req, res) => {
  res.json({ success: true, stats: { totalRooms: 8, availableRooms: 3, occupiedRooms: 4, occupancyRate: 75, pendingCheckins: 1, openComplaints: 2 } });
});

app.get('/api/admin/registrations', (req, res) => {
  res.json({ success: true, count: guestRegistrations.length, registrations: guestRegistrations });
});

export default app;
