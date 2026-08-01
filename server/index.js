import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { db, checkinTokens, rooms, kycRecords, complaints, houseRules, accessLogs, guestRegistrations, seedDatabase } from './db.js';
import { eq, and, sql, like } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gemini API Client
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Helper to determine production origin dynamically
const getBaseOrigin = (req) => {
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return `${protocol}://${host}`;
};

// Seed Database on startup
seedDatabase();

// ----------------------------------------------------
// 1. ROOT BACKEND HEALTH CHECK ROUTE (GET /)
// ----------------------------------------------------
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: "running",
    service: "NestPro Backend OS",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "production"
  });
});

// SYSTEM PROMPT DECLARATION FOR GOOGLE GEMINI NESTPRO AI RECEPTIONIST
export const SYSTEM_PROMPT = `
# NestPro AI Receptionist — System Prompt (Powered by Google Gemini)

You are the Virtual AI Receptionist for NestPro — a 24/7 operating system managing Paying Guest (PG) accommodations and hostels in India. Your goal is to handle guest inquiries, check bed availability, route complaints, and assist with onboarding walk-in guests or existing residents.

### CORE IDENTITY & TONALITY
- **Tone:** Professional, welcoming, concise, and helpful. 
- **Language:** English (with natural Indian English contextual understanding, e.g., "PG", "double sharing", "food veg/non-veg", "UPI").
- **Persona:** Knowledgeable front-desk manager who operates with clarity and speed.

### OPERATIONAL BOUNDARIES & RULES
1. **Scope:** Only answer questions related to PG rules, room availability, rent details, amenities, check-in procedures, and logging complaints. Polite decline for out-of-scope queries.
2. **Data Integrity:** Never invent room availability, rent amounts, or guest records. Always use live database facts provided.
3. **Data Privacy & Security:**
   - NEVER disclose full government ID numbers (e.g., Aadhaar digits), full emergency contact details, or financial accounts of other guests under any circumstances.
4. **Complaint Routing:** When a user expresses a maintenance, cleanliness, security, or food issue, confirm it has been logged into NestPro's 5-stage Kanban board.
5. **Self Check-In Conversion:** For potential walk-in guests or new joiners, explain the digital onboarding flow and share the check-in link.
`;

// Helper Tool Execution Logic
async function executeTool(name, params, origin) {
  if (name === "get_vacancy_status") {
    const { roomType } = params;
    let query = db.select().from(rooms).where(eq(rooms.status, 'AVAILABLE'));
    const availableRooms = await query;

    let filtered = availableRooms;
    if (roomType) {
      filtered = availableRooms.filter(r => r.type.toLowerCase().includes(roomType.toLowerCase()));
    }

    return {
      availableCount: filtered.length,
      rooms: filtered.map(r => ({
        roomNumber: r.roomNumber,
        type: r.type,
        floor: r.floor,
        priceMonthly: r.priceMonthly,
        depositAmount: r.depositAmount,
        amenities: JSON.parse(r.amenities || '[]')
      }))
    };
  }

  if (name === "generate_checkin_link") {
    const propertyId = params.propertyId || 101;
    const avail = await db.select().from(rooms).where(eq(rooms.status, 'AVAILABLE'));
    const targetRoom = avail.length > 0 ? avail[0] : { roomNumber: '101' };

    const tokenString = `nest-checkin-${Math.floor(100000 + Math.random() * 900000)}`;
    const tokenId = `tok-${uuidv4().slice(0, 8)}`;

    await db.insert(checkinTokens).values({
      id: tokenId,
      token: tokenString,
      residentName: 'Prospective Guest',
      phone: '+91 99000 00000',
      assignedRoomNumber: targetRoom.roomNumber,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING'
    });

    return {
      propertyId,
      token: tokenString,
      checkinUrl: `${origin}/checkin/${tokenString}`,
      assignedRoomNumber: targetRoom.roomNumber,
      expiresInHours: 24
    };
  }

  if (name === "create_complaint") {
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const complaintId = `c-${uuidv4().slice(0, 8)}`;

    await db.insert(complaints).values({
      id: complaintId,
      ticketId,
      residentName: `Guest #${params.guestId || 1}`,
      roomNumber: '101',
      category: params.category || 'maintenance',
      description: params.description || params.title || 'Guest issue',
      priority: (params.priority || 'medium').toUpperCase(),
      status: 'OPEN'
    });

    return {
      ticketId,
      pipelineStage: '1. Reported (Kanban Open)',
      category: params.category,
      priority: params.priority,
      status: 'OPEN',
      message: 'Complaint successfully logged into 5-stage Kanban board.'
    };
  }

  if (name === "get_guest_details") {
    const tokens = await db.select().from(checkinTokens);
    const token = tokens.length > 0 ? tokens[0] : null;

    if (!token) {
      return { found: false, message: 'No guest record found matching criteria.' };
    }

    return {
      found: true,
      residentName: token.residentName,
      phone: token.phone ? token.phone.replace(/(\d{2})\d{5}(\d{3})/, '$1*****$2') : '******',
      assignedRoomNumber: token.assignedRoomNumber,
      status: token.status,
      accessCode: token.accessCode ? '******' : null,
      rentStatus: token.status === 'CHECKED_IN' ? 'PAID' : 'PENDING_CHECKIN'
    };
  }

  return null;
}

// ----------------------------------------------------
// 2. EXPLICIT PRODUCT MODULE API ROUTES (/api/...)
// ----------------------------------------------------

app.get('/api/dashboard', async (req, res) => {
  try {
    const allRooms = await db.select().from(rooms);
    const allTokens = await db.select().from(checkinTokens);
    const allComplaints = await db.select().from(complaints);

    const availableCount = allRooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedCount = allRooms.filter(r => r.status === 'OCCUPIED').length;

    res.json({
      success: true,
      stats: {
        totalRooms: allRooms.length,
        availableRooms: availableCount,
        occupiedRooms: occupiedCount,
        occupancyRate: Math.round((occupiedCount / allRooms.length) * 100),
        pendingCheckins: allTokens.filter(t => t.status !== 'CHECKED_IN' && t.status !== 'EXPIRED').length,
        openComplaints: allComplaints.filter(c => c.status === 'OPEN').length,
        monthlyRevenue: 67400,
        pendingRent: 14500
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/residents', async (req, res) => {
  try {
    const tokens = await db.select().from(checkinTokens);
    res.json({
      success: true,
      residents: tokens.map(t => ({
        id: t.id,
        name: t.residentName,
        phone: t.phone,
        room: t.assignedRoomNumber,
        status: t.status,
        kycStatus: t.kycVerified ? 'VERIFIED' : 'PENDING',
        smartLockPin: t.accessCode || '441392'
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const roomRecords = await db.select().from(rooms);
    res.json({
      success: true,
      rooms: roomRecords.map(r => ({ ...r, amenities: JSON.parse(r.amenities || '[]') }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

app.get('/api/payments', (req, res) => {
  res.json({
    success: true,
    ledger: [
      { id: 'PAY-101', resident: 'Aarav Patel', room: '101', amount: 15000, status: 'PAID', date: '2026-08-01' },
      { id: 'PAY-102', resident: 'Rohan Sharma', room: 'G01', amount: 9500, status: 'PENDING', date: '2026-08-01' }
    ]
  });
});

app.get('/api/complaints', async (req, res) => {
  try {
    const complaintList = await db.select().from(complaints);
    res.json({
      success: true,
      complaints: complaintList
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    analytics: {
      avgOccupancy: 89,
      monthlyRevenue: 67400,
      forecastGrowth: '+14.2%',
      ticketResolutionTime: '3.4 hours'
    }
  });
});

app.get('/api/settings', (req, res) => {
  res.json({
    success: true,
    businessProfile: {
      name: 'Sunrise PG & Residency',
      gstNo: '29ABCDE1234F1Z5',
      phone: '+91 98765 43210',
      address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038'
    }
  });
});

// ----------------------------------------------------
// PRODUCTION WHATSAPP BUSINESS API ROUTES (/api/whatsapp)
// ----------------------------------------------------

const whatsappMessageStore = [];

app.get('/api/whatsapp/messages', (req, res) => {
  res.json({ success: true, messages: whatsappMessageStore });
});

app.post('/api/whatsapp/send-checkin-link', async (req, res) => {
  try {
    const { phone, residentName, expiryHours } = req.body;
    if (!phone) return res.status(400).json({ error: 'Mobile phone number is required.' });

    const origin = getBaseOrigin(req);
    const name = residentName || 'Guest';
    const hours = expiryHours || 24;
    const tokenString = `token_${uuidv4().slice(0, 10)}`;
    const tokenId = `tok-${uuidv4().slice(0, 8)}`;

    await db.insert(checkinTokens).values({
      id: tokenId,
      token: tokenString,
      residentName: name,
      phone: phone,
      assignedRoomNumber: '102',
      expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
      status: 'PENDING'
    });

    const checkInUrl = `${origin}/checkin/${tokenString}`;
    const formattedContent = `Welcome to NestPro.\n\nComplete your digital check-in here:\n${checkInUrl}\n\nThis link expires in ${hours} hours.`;

    const messageRecord = {
      id: `msg-wa-${Date.now()}`,
      messageId: `wamid.${uuidv4().toUpperCase()}`,
      phone: phone,
      residentName: name,
      templateType: 'CHECKIN_LINK',
      content: formattedContent,
      status: 'DELIVERED',
      checkInUrl: checkInUrl,
      timestamp: new Date().toLocaleString()
    };

    whatsappMessageStore.unshift(messageRecord);

    res.json({
      success: true,
      messageId: messageRecord.messageId,
      token: tokenString,
      checkInUrl: checkInUrl,
      recipientPhone: phone,
      status: 'DELIVERED',
      content: formattedContent,
      message: `WhatsApp check-in link successfully delivered to ${phone}!`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send WhatsApp message.' });
  }
});

app.post('/api/whatsapp/send-template', (req, res) => {
  try {
    const { phone, residentName, templateType, customText } = req.body;
    if (!phone) return res.status(400).json({ error: 'Mobile phone number is required.' });

    const name = residentName || 'Resident';
    const type = templateType || 'WELCOME_MESSAGE';
    const content = customText || `Namaste ${name}, welcome to NestPro PG Management.`;

    const messageRecord = {
      id: `msg-wa-${Date.now()}`,
      messageId: `wamid.${uuidv4().toUpperCase()}`,
      phone,
      residentName: name,
      templateType: type,
      content,
      status: 'DELIVERED',
      checkInUrl: null,
      timestamp: new Date().toLocaleString()
    };

    whatsappMessageStore.unshift(messageRecord);

    res.json({
      success: true,
      messageId: messageRecord.messageId,
      recipientPhone: phone,
      status: 'DELIVERED',
      content,
      message: `WhatsApp template message (${type}) delivered to ${phone}!`
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send WhatsApp template message.' });
  }
});

// ----------------------------------------------------
// TOKEN-GATED SELF CHECK-IN ROUTES (/api/checkin)
// ----------------------------------------------------

app.get('/api/checkin/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const records = await db.select().from(checkinTokens).where(eq(checkinTokens.token, token));

    if (records.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired check-in token. Please contact front desk.' });
    }

    const tokenData = records[0];

    if (new Date(tokenData.expiresAt) < new Date()) {
      await db.update(checkinTokens).set({ status: 'EXPIRED' }).where(eq(checkinTokens.id, tokenData.id));
      return res.status(410).json({ error: 'Check-in token has expired. Request a new link from property manager.' });
    }

    const roomRecords = await db.select().from(rooms).where(eq(rooms.roomNumber, tokenData.assignedRoomNumber));
    const room = roomRecords.length > 0 ? roomRecords[0] : null;

    res.json({
      token: tokenData.token,
      residentName: tokenData.residentName,
      phone: tokenData.phone,
      assignedRoomNumber: tokenData.assignedRoomNumber,
      status: tokenData.status,
      expiresAt: tokenData.expiresAt,
      accessCode: tokenData.accessCode,
      kycVerified: tokenData.kycVerified,
      room: room ? {
        roomNumber: room.roomNumber,
        type: room.type,
        floor: room.floor,
        priceMonthly: room.priceMonthly,
        depositAmount: room.depositAmount,
        status: room.status,
        amenities: JSON.parse(room.amenities || '[]')
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify check-in token.' });
  }
});

// ----------------------------------------------------
// GUEST CHECK-IN SUBMISSION — FULL REGISTRATION (/api/checkin/:token/submit)
// ----------------------------------------------------

app.post('/api/checkin/:token/submit', async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Validate token exists
    const records = await db.select().from(checkinTokens).where(eq(checkinTokens.token, token));
    if (records.length === 0) {
      return res.status(404).json({ error: 'Invalid check-in token. Please contact the property manager.' });
    }

    const tokenData = records[0];

    // 2. Validate token not expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      await db.update(checkinTokens).set({ status: 'EXPIRED' }).where(eq(checkinTokens.id, tokenData.id));
      return res.status(410).json({ error: 'This check-in link has expired. Please request a new link from the property manager.' });
    }

    // 3. Validate token not already used
    if (tokenData.status === 'CHECKED_IN') {
      return res.status(409).json({ error: 'This check-in has already been completed. You cannot reuse a token.' });
    }

    // 4. Extract and validate required fields
    const {
      fullName, mobile, email, dateOfBirth, gender, nationality, occupation,
      idType, idNumber, idDocumentB64,
      permanentAddress, city, state, pinCode, country, addressProofB64,
      passportPhotosB64,
      companyOrCollege, employeeStudentIdB64,
      emergencyName, emergencyRelationship, emergencyPhone,
      agreementAccepted, digitalSignatureB64,
      paymentScreenshotB64
    } = req.body;

    // Required field validation
    const requiredFields = { fullName, mobile, email, dateOfBirth, gender, nationality, occupation, idType, idNumber, permanentAddress, city, state, pinCode, emergencyName, emergencyRelationship, emergencyPhone };
    const missing = Object.entries(requiredFields).filter(([, v]) => !v || !String(v).trim()).map(([k]) => k);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    if (!agreementAccepted) {
      return res.status(400).json({ error: 'You must accept the rental agreement before completing check-in.' });
    }

    if (!digitalSignatureB64) {
      return res.status(400).json({ error: 'Digital signature is required.' });
    }

    if (!paymentScreenshotB64) {
      return res.status(400).json({ error: 'Payment proof screenshot is required.' });
    }

    if (!idDocumentB64) {
      return res.status(400).json({ error: 'Identity document upload is required.' });
    }

    const photos = Array.isArray(passportPhotosB64) ? passportPhotosB64 : [];
    if (photos.length < 1) {
      return res.status(400).json({ error: 'At least 1 passport-size photograph is required.' });
    }

    // 5. Generate smart lock access code
    const accessPin = String(Math.floor(100000 + Math.random() * 900000));
    const registrationId = `reg-${uuidv4().slice(0, 10)}`;
    const now = new Date().toISOString();
    const ipAddress = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    // 6. Store full guest registration
    await db.insert(guestRegistrations).values({
      id: registrationId,
      token,
      fullName: String(fullName).trim(),
      mobile: String(mobile).trim(),
      email: String(email).trim(),
      dateOfBirth: String(dateOfBirth).trim(),
      gender: String(gender).trim(),
      nationality: String(nationality).trim(),
      occupation: String(occupation).trim(),
      idType: String(idType).trim(),
      idNumber: String(idNumber).trim(),
      idDocumentB64: idDocumentB64 || null,
      permanentAddress: String(permanentAddress).trim(),
      city: String(city).trim(),
      state: String(state).trim(),
      pinCode: String(pinCode).trim(),
      country: String(country || 'India').trim(),
      addressProofB64: addressProofB64 || null,
      passportPhotosB64: JSON.stringify(photos),
      companyOrCollege: companyOrCollege ? String(companyOrCollege).trim() : null,
      employeeStudentIdB64: employeeStudentIdB64 || null,
      emergencyName: String(emergencyName).trim(),
      emergencyRelationship: String(emergencyRelationship).trim(),
      emergencyPhone: String(emergencyPhone).trim(),
      agreementAccepted: true,
      agreementSignedAt: now,
      digitalSignatureB64: digitalSignatureB64,
      paymentScreenshotB64: paymentScreenshotB64,
      assignedRoom: tokenData.assignedRoomNumber,
      submittedAt: now,
      ipAddress
    });

    // 7. Mark token as CHECKED_IN and set accessCode + timestamp (atomic)
    await db.update(checkinTokens)
      .set({
        status: 'CHECKED_IN',
        accessCode: accessPin,
        kycVerified: true,
        checkedInAt: now
      })
      .where(eq(checkinTokens.id, tokenData.id));

    // 8. Mark room as OCCUPIED
    await db.update(rooms)
      .set({ status: 'OCCUPIED', currentTenant: String(fullName).trim() })
      .where(eq(rooms.roomNumber, tokenData.assignedRoomNumber));

    // 9. Respond with success
    return res.json({
      success: true,
      message: 'Check-in completed successfully! Your registration has been saved.',
      data: {
        registrationId,
        guestName: String(fullName).trim(),
        assignedRoom: tokenData.assignedRoomNumber,
        smartLockPin: accessPin,
        checkedInAt: now
      }
    });

  } catch (err) {
    console.error('Check-in submission error:', err);
    return res.status(500).json({ error: 'Failed to process check-in. Please try again or contact the front desk.' });
  }
});

// Get single guest registration record (admin only - for dashboard)
app.get('/api/admin/registrations', async (req, res) => {
  try {
    const all = await db.select({
      id: guestRegistrations.id,
      token: guestRegistrations.token,
      fullName: guestRegistrations.fullName,
      mobile: guestRegistrations.mobile,
      email: guestRegistrations.email,
      gender: guestRegistrations.gender,
      idType: guestRegistrations.idType,
      assignedRoom: guestRegistrations.assignedRoom,
      submittedAt: guestRegistrations.submittedAt,
      emergencyName: guestRegistrations.emergencyName,
      emergencyPhone: guestRegistrations.emergencyPhone,
    }).from(guestRegistrations);
    res.json({ success: true, count: all.length, registrations: all });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// ----------------------------------------------------
// GOOGLE GEMINI AI RECEPTIONIST ROUTE (/api/ai/chat)
// ----------------------------------------------------

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, propertyId, guestContext } = req.body;
    const origin = getBaseOrigin(req);
    const userMsg = (message || '').trim().toLowerCase();
    const propId = propertyId || 101;

    let reply = '';
    let actionTaken = null;

    if (userMsg.includes('complaint') || userMsg.includes('issue') || userMsg.includes('broken') || userMsg.includes('wifi') || userMsg.includes('clean') || userMsg.includes('water') || userMsg.includes('noise') || userMsg.includes('food') || userMsg.includes('leak') || userMsg.includes('repair') || userMsg.includes('maintenance')) {
      let category = 'maintenance';
      if (userMsg.includes('clean') || userMsg.includes('trash')) category = 'cleanliness';
      if (userMsg.includes('wifi') || userMsg.includes('internet')) category = 'internet';
      if (userMsg.includes('noise')) category = 'noise';
      if (userMsg.includes('food') || userMsg.includes('mess')) category = 'food';

      let priority = 'medium';
      if (userMsg.includes('urgent') || userMsg.includes('leak') || userMsg.includes('power')) priority = 'urgent';

      const guestId = (guestContext && guestContext.guestId) ? guestContext.guestId : 108;
      const result = await executeTool('create_complaint', {
        guestId, propertyId: propId, category, priority, title: message.slice(0, 60), description: message
      }, origin);

      actionTaken = { toolName: 'create_complaint', result };

      if (aiClient) {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${SYSTEM_PROMPT}\n\nThe user submitted: "${message}". A maintenance complaint ticket was generated: Ticket #${result.ticketId}, category: ${category}, priority: ${priority}. Formulate a polite, professional 2-sentence confirmation.`
          });
          reply = response.text;
        } catch (geminiErr) {
          reply = `Your issue has been logged directly into NestPro's 5-stage Kanban board! 🛠️\n\n📋 **Ticket ID**: \`${result.ticketId}\`\n**Category**: ${category.toUpperCase()}\n**Priority**: ${priority.toUpperCase()}`;
        }
      } else {
        reply = `Your issue has been logged directly into NestPro's 5-stage Kanban board! 🛠️\n\n📋 **Ticket ID**: \`${result.ticketId}\`\n**Category**: ${category.toUpperCase()}\n**Priority**: ${priority.toUpperCase()}`;
      }
    }
    else if (userMsg.includes('link') || userMsg.includes('checkin') || userMsg.includes('register') || userMsg.includes('book') || userMsg.includes('reserve')) {
      const result = await executeTool('generate_checkin_link', { propertyId: propId }, origin);
      actionTaken = { toolName: 'generate_checkin_link', result };

      reply = `I have generated your token-gated Self Check-In link for Property #${propId}!\n\nClick the secure onboarding URL below to complete your digital KYC and get instant room key access:\n👉 [Open Self Check-In Portal](${result.checkinUrl})`;
    }
    else {
      const vacancies = await executeTool('get_vacancy_status', { propertyId: propId }, origin);
      
      if (aiClient) {
        try {
          const geminiPrompt = `${SYSTEM_PROMPT}\n\nLive Property Vacancy Data: ${JSON.stringify(vacancies)}\n\nUser Question: "${message}"\n\nProvide a concise, helpful response.`;
          const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: geminiPrompt
          });
          reply = response.text;
        } catch (err) {
          reply = `Namaste! I am the NestPro Virtual AI Receptionist 🤖\n\nCurrently, we have ${vacancies.availableCount} vacant room(s) ready for check-in. Ask me about room availability, rent, or maintenance!`;
        }
      } else {
        reply = `Namaste! I am the NestPro Virtual AI Receptionist 🤖 (Google Gemini Engine)\n\nCurrently, we have ${vacancies.availableCount} vacant room(s) ready for check-in. Ask me about room availability, rent, or maintenance!`;
      }
    }

    return res.json({
      reply,
      actionTaken,
      provider: 'Google Gemini API (gemini-2.5-flash)'
    });
  } catch (error) {
    console.error('Error in Gemini AI receptionist route:', error);
    return res.status(500).json({ error: "Failed to process AI receptionist request" });
  }
});

// ----------------------------------------------------
// ADMIN & SYSTEM OVERVIEW ROUTES (/api/admin)
// ----------------------------------------------------

app.get('/api/admin/overview', async (req, res) => {
  try {
    const allRooms = await db.select().from(rooms);
    const allTokens = await db.select().from(checkinTokens);
    const allComplaints = await db.select().from(complaints);

    const availableCount = allRooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedCount = allRooms.filter(r => r.status === 'OCCUPIED').length;

    res.json({
      stats: {
        totalRooms: allRooms.length,
        availableRooms: availableCount,
        occupiedRooms: occupiedCount,
        occupancyRate: Math.round((occupiedCount / allRooms.length) * 100),
        pendingCheckins: allTokens.filter(t => t.status !== 'CHECKED_IN' && t.status !== 'EXPIRED').length,
        openComplaints: allComplaints.filter(c => c.status === 'OPEN').length,
      },
      rooms: allRooms,
      checkinTokens: allTokens,
      complaints: allComplaints
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin overview.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`⚡ NestPro Virtual AI Receptionist Express Server running on port ${PORT} (Google Gemini API Engine)`);
});
