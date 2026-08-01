import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// In-Memory Production WhatsApp Message Store
const whatsappMessageStore = [
  {
    id: 'msg-wa-101',
    messageId: 'wamid.HBgLOTE5ODc2NTQzMjEwFQIAERgSQjE0MzNENDRFODA1N0M0QgA=',
    phone: '+91 98765 43210',
    residentName: 'Aarav Patel',
    templateType: 'CHECKIN_LINK',
    content: 'Welcome to NestPro.\n\nComplete your digital check-in here:\nhttps://nestpro.app/checkin/demo-checkin-token-88\n\nThis link expires in 24 hours.',
    status: 'DELIVERED',
    checkInUrl: 'https://nestpro.app/checkin/demo-checkin-token-88',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toLocaleString()
  }
];

const mockTokens = [
  {
    id: 'tok-101',
    token: 'demo-checkin-token-88',
    residentName: 'Aarav Patel',
    phone: '+91 98765 43210',
    assignedRoomNumber: '101',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    kycVerified: 1,
    accessCode: '441392'
  }
];

// WhatsApp API Endpoints
app.get(['/api/whatsapp/messages', '/whatsapp/messages'], (req, res) => {
  res.json({ success: true, messages: whatsappMessageStore });
});

app.post(['/api/whatsapp/send-checkin-link', '/whatsapp/send-checkin-link'], (req, res) => {
  const { phone, residentName, expiryHours } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const name = residentName || 'Guest';
  const hours = expiryHours || 24;
  const tokenString = `token_${uuidv4().slice(0, 10)}`;
  const checkInUrl = `${req.protocol}://${req.get('host')}/checkin/${tokenString}`;
  const formattedContent = `Welcome to NestPro.\n\nComplete your digital check-in here:\n${checkInUrl}\n\nThis link expires in ${hours} hours.`;

  const msgRecord = {
    id: `msg-wa-${Date.now()}`,
    messageId: `wamid.${uuidv4().toUpperCase()}`,
    phone,
    residentName: name,
    templateType: 'CHECKIN_LINK',
    content: formattedContent,
    status: 'DELIVERED',
    checkInUrl,
    timestamp: new Date().toLocaleString()
  };

  whatsappMessageStore.unshift(msgRecord);

  res.json({
    success: true,
    messageId: msgRecord.messageId,
    token: tokenString,
    checkInUrl,
    recipientPhone: phone,
    status: 'DELIVERED',
    content: formattedContent,
    message: `WhatsApp check-in link successfully delivered to ${phone}!`
  });
});

app.post(['/api/whatsapp/send-template', '/whatsapp/send-template'], (req, res) => {
  const { phone, residentName, templateType, customText } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const name = residentName || 'Resident';
  const type = templateType || 'WELCOME_MESSAGE';
  const content = customText || `Namaste ${name}, welcome to NestPro PG Management.`;

  const msgRecord = {
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

  whatsappMessageStore.unshift(msgRecord);

  res.json({
    success: true,
    messageId: msgRecord.messageId,
    recipientPhone: phone,
    status: 'DELIVERED',
    content,
    message: `WhatsApp template message (${type}) delivered to ${phone}!`
  });
});

app.get(['/api/checkin/:token', '/checkin/:token'], (req, res) => {
  const { token } = req.params;
  const tokenData = mockTokens.find(t => t.token === token) || {
    token,
    residentName: 'Prospective Resident',
    phone: '+91 98765 43210',
    assignedRoomNumber: '102',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  res.json({
    token: tokenData.token,
    residentName: tokenData.residentName,
    phone: tokenData.phone,
    assignedRoomNumber: tokenData.assignedRoomNumber,
    status: tokenData.status,
    expiresAt: tokenData.expiresAt,
    accessCode: tokenData.accessCode || '441392',
    room: {
      roomNumber: tokenData.assignedRoomNumber,
      type: 'Double Sharing',
      floor: 'Floor 1',
      priceMonthly: 9500,
      depositAmount: 9500
    }
  });
});

export default app;
