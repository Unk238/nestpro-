import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { eq, and, sql } from 'drizzle-orm';
import path from 'path';
import fs from 'fs';

// On Vercel serverless functions, write SQLite DB to /tmp
const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');

if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    // fallback if read-only
  }
}

const dbPath = path.join(dataDir, 'nestpro.db');
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// Database Schemas
export const rooms = sqliteTable('rooms', {
  id: text('id').primaryKey(),
  roomNumber: text('room_number').notNull().unique(),
  type: text('type').notNull(),
  floor: integer('floor').notNull(),
  priceMonthly: real('price_monthly').notNull(),
  depositAmount: real('deposit_amount').notNull(),
  status: text('status').notNull().default('AVAILABLE'),
  amenities: text('amenities').notNull(),
  currentTenant: text('current_tenant'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const checkinTokens = sqliteTable('checkin_tokens', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  residentName: text('resident_name').notNull(),
  phone: text('phone').notNull(),
  assignedRoomNumber: text('assigned_room_number').notNull(),
  expiresAt: text('expires_at').notNull(),
  status: text('status').notNull().default('PENDING'),
  accessCode: text('access_code'),
  paymentId: text('payment_id'),
  kycVerified: integer('kyc_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const kycRecords = sqliteTable('kyc_records', {
  id: text('id').primaryKey(),
  token: text('token').notNull(),
  documentType: text('document_type').notNull(),
  documentNumber: text('document_number').notNull(),
  ocrConfidence: real('ocr_confidence').notNull(),
  livenessScore: real('liveness_score').notNull(),
  status: text('status').notNull().default('VERIFIED'),
  verifiedAt: text('verified_at').default(sql`CURRENT_TIMESTAMP`),
});

export const complaints = sqliteTable('complaints', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().unique(),
  residentName: text('resident_name').notNull(),
  roomNumber: text('room_number').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull().default('MEDIUM'),
  status: text('status').notNull().default('OPEN'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const houseRules = sqliteTable('house_rules', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  ruleText: text('rule_text').notNull(),
});

export const accessLogs = sqliteTable('access_logs', {
  id: text('id').primaryKey(),
  residentName: text('resident_name').notNull(),
  roomNumber: text('room_number').notNull(),
  accessCode: text('access_code').notNull(),
  unlockedAt: text('unlocked_at').default(sql`CURRENT_TIMESTAMP`),
  entryPoint: text('entry_point').default('Main Smart Gate'),
});

// Create tables if not exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    room_number TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    floor INTEGER NOT NULL,
    price_monthly REAL NOT NULL,
    deposit_amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE',
    amenities TEXT NOT NULL,
    current_tenant TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS checkin_tokens (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    resident_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    assigned_room_number TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    access_code TEXT,
    payment_id TEXT,
    kyc_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS kyc_records (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    document_type TEXT NOT NULL,
    document_number TEXT NOT NULL,
    ocr_confidence REAL NOT NULL,
    liveness_score REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'VERIFIED',
    verified_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL UNIQUE,
    resident_name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'MEDIUM',
    status TEXT NOT NULL DEFAULT 'OPEN',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS house_rules (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    rule_text TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS access_logs (
    id TEXT PRIMARY KEY,
    resident_name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    access_code TEXT NOT NULL,
    unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
    entry_point TEXT DEFAULT 'Main Smart Gate'
  );
`);

// Initial Data Seeding
export function seedDatabase() {
  const roomCount = sqlite.prepare('SELECT count(*) as count FROM rooms').get();
  if (roomCount.count === 0) {
    console.log('🌱 Seeding initial NestPro Database...');

    const initialRooms = [
      { id: 'rm-101', roomNumber: '101', type: 'Single Luxury', floor: 1, priceMonthly: 14500, depositAmount: 14500, status: 'AVAILABLE', amenities: JSON.stringify(['Attached Balcony', 'AC', 'Private Washroom', 'High-Speed WiFi', 'Work Desk']) },
      { id: 'rm-102', roomNumber: '102', type: 'Double Sharing', floor: 1, priceMonthly: 9500, depositAmount: 9500, status: 'AVAILABLE', amenities: JSON.stringify(['AC', 'Shared Washroom', 'Individual Wardrobes', 'WiFi']) },
      { id: 'rm-201', roomNumber: '201', type: 'Single Luxury', floor: 2, priceMonthly: 15000, depositAmount: 15000, status: 'AVAILABLE', amenities: JSON.stringify(['Skyline View', 'AC', 'Smart TV', 'Private Washroom', 'Ergonomic Chair']) },
      { id: 'rm-202', roomNumber: '202', type: 'Dorm 4-Bed', floor: 2, priceMonthly: 6500, depositAmount: 6500, status: 'AVAILABLE', amenities: JSON.stringify(['Bunk Beds', 'Individual Lockers', 'Common Lounge Access', 'WiFi']) },
      { id: 'rm-301', roomNumber: '301', type: 'Double Sharing', floor: 3, priceMonthly: 9800, depositAmount: 9800, status: 'OCCUPIED', currentTenant: 'Rohan Sharma', amenities: JSON.stringify(['AC', 'Attached Washroom', 'Balcony']) },
    ];

    const insertRoom = sqlite.prepare(`
      INSERT INTO rooms (id, room_number, type, floor, price_monthly, deposit_amount, status, amenities, current_tenant)
      VALUES (@id, @roomNumber, @type, @floor, @priceMonthly, @depositAmount, @status, @amenities, @currentTenant)
    `);
    initialRooms.forEach(r => insertRoom.run({ ...r, currentTenant: r.currentTenant || null }));

    const demoToken = {
      id: 'tok-demo-123',
      token: 'demo-checkin-token-88',
      residentName: 'Aarav Patel',
      phone: '+91 98765 43210',
      assignedRoomNumber: '101',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      accessCode: null,
      paymentId: null,
      kycVerified: 0
    };
    sqlite.prepare(`
      INSERT INTO checkin_tokens (id, token, resident_name, phone, assigned_room_number, expires_at, status, access_code, payment_id, kyc_verified)
      VALUES (@id, @token, @residentName, @phone, @assignedRoomNumber, @expiresAt, @status, @accessCode, @paymentId, @kycVerified)
    `).run(demoToken);

    const rules = [
      { id: 'rule-1', category: 'Curfew & Entry', title: 'Main Gate Locking Time', ruleText: 'Main entrance auto-locks at 10:30 PM. Late entry requires digital Smart Pass unlock via NestPro web app.' },
      { id: 'rule-2', category: 'Visitors', title: 'Guest Policy', ruleText: 'Day visitors permitted between 9:00 AM - 8:00 PM in common areas only. No overnight stay without prior manager approval.' },
      { id: 'rule-3', category: 'Dining', title: 'Meal Timings', ruleText: 'Breakfast: 7:30 AM - 9:30 AM | Dinner: 8:00 PM - 10:00 PM. Served in 1st Floor Dining Hall.' },
      { id: 'rule-4', category: 'Utilities', title: 'Electricity & Laundry', ruleText: '300 units free per room/month. Washing machines operational daily 7 AM - 9 PM.' },
    ];
    const insertRule = sqlite.prepare('INSERT INTO house_rules (id, category, title, rule_text) VALUES (@id, @category, @title, @ruleText)');
    rules.forEach(r => insertRule.run(r));

    sqlite.prepare(`
      INSERT INTO complaints (id, ticket_id, resident_name, room_number, category, description, priority, status)
      VALUES ('c-1', 'TKT-1092', 'Rohan Sharma', '301', 'WiFi', 'Slow internet connection on 3rd floor router', 'MEDIUM', 'IN_PROGRESS')
    `).run();

    console.log('✅ Database seeded successfully!');
  }
}
