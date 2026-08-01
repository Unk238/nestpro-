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

// ============================================================
// SCHEMA DEFINITIONS
// ============================================================

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
  checkedInAt: text('checked_in_at'),
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

// ── NEW: Full Guest Registration Record ────────────────────────────────────────
export const guestRegistrations = sqliteTable('guest_registrations', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),

  // Personal Details
  fullName: text('full_name').notNull(),
  mobile: text('mobile').notNull(),
  email: text('email').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  nationality: text('nationality').notNull(),
  occupation: text('occupation').notNull(),

  // Identity Verification
  idType: text('id_type').notNull(),
  idNumber: text('id_number').notNull(),
  idDocumentB64: text('id_document_b64'),

  // Address Details
  permanentAddress: text('permanent_address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pinCode: text('pin_code').notNull(),
  country: text('country').notNull().default('India'),
  addressProofB64: text('address_proof_b64'),

  // Photographs
  passportPhotosB64: text('passport_photos_b64'), // JSON array of base64 strings

  // Professional/Student Details
  companyOrCollege: text('company_or_college'),
  employeeStudentIdB64: text('employee_student_id_b64'),

  // Emergency Contact
  emergencyName: text('emergency_name').notNull(),
  emergencyRelationship: text('emergency_relationship').notNull(),
  emergencyPhone: text('emergency_phone').notNull(),

  // Rental Agreement
  agreementAccepted: integer('agreement_accepted', { mode: 'boolean' }).default(false),
  agreementSignedAt: text('agreement_signed_at'),
  digitalSignatureB64: text('digital_signature_b64'),

  // Payment Verification
  paymentScreenshotB64: text('payment_screenshot_b64'),

  // Meta
  assignedRoom: text('assigned_room').notNull(),
  submittedAt: text('submitted_at').default(sql`CURRENT_TIMESTAMP`),
  ipAddress: text('ip_address'),
});

// ============================================================
// CREATE TABLES
// ============================================================
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
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    checked_in_at TEXT
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

  CREATE TABLE IF NOT EXISTS guest_registrations (
    id TEXT PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    nationality TEXT NOT NULL,
    occupation TEXT NOT NULL,
    id_type TEXT NOT NULL,
    id_number TEXT NOT NULL,
    id_document_b64 TEXT,
    permanent_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    address_proof_b64 TEXT,
    passport_photos_b64 TEXT,
    company_or_college TEXT,
    employee_student_id_b64 TEXT,
    emergency_name TEXT NOT NULL,
    emergency_relationship TEXT NOT NULL,
    emergency_phone TEXT NOT NULL,
    agreement_accepted INTEGER DEFAULT 0,
    agreement_signed_at TEXT,
    digital_signature_b64 TEXT,
    payment_screenshot_b64 TEXT,
    assigned_room TEXT NOT NULL,
    submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT
  );
`);

// ============================================================
// ALTER TABLE: add checked_in_at column if missing (migration-safe)
// ============================================================
try {
  sqlite.exec(`ALTER TABLE checkin_tokens ADD COLUMN checked_in_at TEXT;`);
} catch (_) { /* column already exists */ }

// ============================================================
// SEED DATABASE
// ============================================================
export function seedDatabase() {
  const roomCount = sqlite.prepare('SELECT count(*) as count FROM rooms').get();
  if (roomCount.count < 8) {
    console.log('🌱 Seeding 8 Rooms & Master Hackathon Demo Data...');

    sqlite.exec(`DELETE FROM rooms; DELETE FROM checkin_tokens; DELETE FROM complaints;`);

    const initialRooms = [
      { id: 'rm-101', roomNumber: '101', type: 'Single Luxury',   floor: 1, priceMonthly: 14500, depositAmount: 14500, status: 'OCCUPIED',     currentTenant: 'Aarav Patel',        amenities: JSON.stringify(['Balcony', 'AC', 'Private Washroom', 'WiFi']) },
      { id: 'rm-102', roomNumber: '102', type: 'Double Sharing',   floor: 1, priceMonthly:  9500, depositAmount:  9500, status: 'AVAILABLE',    currentTenant: null,                  amenities: JSON.stringify(['AC', 'Shared Washroom', 'WiFi']) },
      { id: 'rm-201', roomNumber: '201', type: 'Deluxe Suite',     floor: 2, priceMonthly: 25000, depositAmount: 25000, status: 'OCCUPIED',     currentTenant: 'Priya Sundaram',      amenities: JSON.stringify(['Skyline View', 'AC', 'Smart TV', 'Private Washroom']) },
      { id: 'rm-202', roomNumber: '202', type: 'Double Sharing',   floor: 2, priceMonthly:  9500, depositAmount:  9500, status: 'AVAILABLE',    currentTenant: null,                  amenities: JSON.stringify(['AC', 'Balcony', 'WiFi']) },
      { id: 'rm-301', roomNumber: '301', type: 'Double Sharing',   floor: 3, priceMonthly:  9800, depositAmount:  9800, status: 'OCCUPIED',     currentTenant: 'Rohan Sharma',        amenities: JSON.stringify(['AC', 'Attached Washroom']) },
      { id: 'rm-302', roomNumber: '302', type: 'Deluxe Suite',     floor: 3, priceMonthly: 22000, depositAmount: 22000, status: 'AVAILABLE',    currentTenant: null,                  amenities: JSON.stringify(['City View', 'AC', 'Private Kitchenette']) },
      { id: 'rm-401', roomNumber: '401', type: 'Triple Sharing',   floor: 4, priceMonthly:  8000, depositAmount:  8000, status: 'MAINTENANCE',  currentTenant: null,                  amenities: JSON.stringify(['Shared Washroom', 'WiFi']) },
      { id: 'rm-402', roomNumber: '402', type: 'Single Luxury',   floor: 4, priceMonthly: 15000, depositAmount: 15000, status: 'OCCUPIED',     currentTenant: 'Vikramaditya Sen',    amenities: JSON.stringify(['Top Floor View', 'AC', 'Private Desk']) }
    ];

    const insertRoom = sqlite.prepare(`
      INSERT INTO rooms (id, room_number, type, floor, price_monthly, deposit_amount, status, amenities, current_tenant)
      VALUES (@id, @roomNumber, @type, @floor, @priceMonthly, @depositAmount, @status, @amenities, @currentTenant)
    `);
    initialRooms.forEach(r => insertRoom.run(r));

    // Pending Approval Registrations for 1-Click Approval Demo
    const demoTokens = [
      {
        id: 'tok-demo-123',
        token: 'demo-checkin-token-88',
        residentName: 'Aarav Patel',
        phone: '+91 98765 43210',
        assignedRoomNumber: '101',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING',
        accessCode: '441392',
        paymentId: 'PAY-8812',
        kycVerified: 1
      },
      {
        id: 'tok-demo-124',
        token: '3JHF82LK',
        residentName: 'Ananya Roy (Pending Approval)',
        phone: '+91 99000 77777',
        assignedRoomNumber: '102',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'SUBMITTED',
        accessCode: null,
        paymentId: null,
        kycVerified: 1
      }
    ];

    const insertToken = sqlite.prepare(`
      INSERT INTO checkin_tokens (id, token, resident_name, phone, assigned_room_number, expires_at, status, access_code, payment_id, kyc_verified)
      VALUES (@id, @token, @residentName, @phone, @assignedRoomNumber, @expiresAt, @status, @accessCode, @paymentId, @kycVerified)
    `);
    demoTokens.forEach(t => insertToken.run(t));

    // Seed Kanban Complaints
    const demoComplaints = [
      { id: 'c-101', ticketId: 'TKT-101', residentName: 'Rohan Sharma',   roomNumber: '301', category: 'Plumbing',   description: 'AC Water Leakage in washroom',   priority: 'CRITICAL', status: 'IN_PROGRESS' },
      { id: 'c-102', ticketId: 'TKT-102', residentName: 'Aarav Patel',    roomNumber: '101', category: 'Internet',   description: 'Floor 2 Wi-Fi Router Reset',      priority: 'HIGH',     status: 'OPEN' },
      { id: 'c-103', ticketId: 'TKT-103', residentName: 'Priya Sundaram', roomNumber: '201', category: 'Electrical', description: 'Hot Water Geyser Tripping',       priority: 'MEDIUM',   status: 'RESOLVED' }
    ];

    const insertComplaint = sqlite.prepare(`
      INSERT INTO complaints (id, ticket_id, resident_name, room_number, category, description, priority, status)
      VALUES (@id, @ticketId, @residentName, @roomNumber, @category, @description, @priority, @status)
    `);
    demoComplaints.forEach(c => insertComplaint.run(c));

    console.log('✅ Hackathon Demo Master Data Seeded Successfully!');
  }
}
