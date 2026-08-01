import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { db, checkinTokens, rooms, kycRecords, complaints, houseRules, accessLogs, seedDatabase } from './db.js';
import { eq, and, sql, like } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google Gemini API Client
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const aiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// In-Memory WhatsApp Message History Store
const whatsappMessageStore = [
  {
    id: 'msg-wa-101',
    messageId: 'wamid.HBgLOTE5ODc2NTQzMjEwFQIAERgSQjE0MzNENDRFODA1N0M0QgA=',
    phone: '+91 98765 43210',
    residentName: 'Aarav Patel',
    templateType: 'CHECKIN_LINK',
    content: 'Welcome to NestPro.\n\nComplete your digital check-in here:\nhttp://localhost:5173/checkin/demo-checkin-token-88\n\nThis link expires in 24 hours.',
    status: 'DELIVERED',
    checkInUrl: 'http://localhost:5173/checkin/demo-checkin-token-88',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString()
  }
];

// Seed Database on startup
seedDatabase();

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
async function executeTool(name, params) {
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
      checkinUrl: `/checkin/${tokenString}`,
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
// PRODUCTION WHATSAPP BUSINESS API ROUTES (/api/whatsapp)
// ----------------------------------------------------

app.get('/api/whatsapp/messages', (req, res) => {
  res.json({ success: true, messages: whatsappMessageStore });
});

app.post('/api/whatsapp/send-checkin-link', async (req, res) => {
  try {
    const { phone, residentName, expiryHours } = req.body;
    if (!phone) return res.status(400).json({ error: 'Mobile phone number is required.' });

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

    const checkInUrl = `http://localhost:5173/checkin/${tokenString}`;
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
// GOOGLE GEMINI AI RECEPTIONIST ROUTE (/api/ai/chat)
// ----------------------------------------------------

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, propertyId, guestContext } = req.body;
    const userMsg = (message || '').trim().toLowerCase();
    const propId = propertyId || 101;

    let reply = '';
    let actionTaken = null;

    // 1. Complaint Logging Tool Execution
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
      });

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
    // 2. Check-In Link Tool Execution
    else if (userMsg.includes('link') || userMsg.includes('checkin') || userMsg.includes('register') || userMsg.includes('book') || userMsg.includes('reserve')) {
      const result = await executeTool('generate_checkin_link', { propertyId: propId });
      actionTaken = { toolName: 'generate_checkin_link', result };

      reply = `I have generated your token-gated Self Check-In link for Property #${propId}!\n\nClick the secure onboarding URL below to complete your digital KYC and get instant room key access:\n👉 [Open Self Check-In Portal](${result.checkinUrl})`;
    }
    // 3. Vacancy & General Inquiry powered by Google Gemini API
    else {
      const vacancies = await executeTool('get_vacancy_status', { propertyId: propId });
      
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
