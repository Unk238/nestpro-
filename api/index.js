import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// Root Health Check Route
app.get(['/', '/api'], (req, res) => {
  res.json({
    status: "running",
    service: "NestPro Backend",
    version: "1.0.0"
  });
});

// Module API Routes for Production & Vercel
app.get(['/api/dashboard', '/dashboard'], (req, res) => {
  res.json({
    success: true,
    stats: {
      totalRooms: 5,
      availableRooms: 3,
      occupiedRooms: 2,
      occupancyRate: 40,
      pendingCheckins: 1,
      openComplaints: 1,
      monthlyRevenue: 67400,
      pendingRent: 14500
    }
  });
});

app.get(['/api/residents', '/residents'], (req, res) => {
  res.json({
    success: true,
    residents: [
      { id: 'res-101', name: 'Aarav Patel', phone: '+91 98765 43210', room: '101', status: 'PAID', kycStatus: 'VERIFIED' },
      { id: 'res-102', name: 'Rohan Sharma', phone: '+91 98123 99999', room: 'G01', status: 'PENDING', kycStatus: 'VERIFIED' }
    ]
  });
});

app.get(['/api/rooms', '/rooms'], (req, res) => {
  res.json({
    success: true,
    rooms: [
      { roomNumber: '101', floor: 'Floor 1', type: 'Single Luxury', priceMonthly: 15000, status: 'OCCUPIED' },
      { roomNumber: '102', floor: 'Floor 1', type: 'Double Sharing', priceMonthly: 9500, status: 'AVAILABLE' }
    ]
  });
});

app.get(['/api/payments', '/payments'], (req, res) => {
  res.json({
    success: true,
    ledger: [
      { id: 'PAY-101', resident: 'Aarav Patel', room: '101', amount: 15000, status: 'PAID', date: '2026-08-01' },
      { id: 'PAY-102', resident: 'Rohan Sharma', room: 'G01', amount: 9500, status: 'PENDING', date: '2026-08-01' }
    ]
  });
});

app.get(['/api/complaints', '/complaints'], (req, res) => {
  res.json({
    success: true,
    complaints: [
      { id: 'TKT-101', resident: 'Rohan Sharma', room: '101', title: 'AC Water Leakage', category: 'Plumbing', priority: 'CRITICAL', status: 'IN_PROGRESS' }
    ]
  });
});

app.get(['/api/analytics', '/analytics'], (req, res) => {
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

app.get(['/api/settings', '/settings'], (req, res) => {
  res.json({
    success: true,
    businessProfile: {
      name: 'Sunrise PG & Residency',
      gstNo: '29ABCDE1234F1Z5',
      phone: '+91 98765 43210'
    }
  });
});

export default app;
