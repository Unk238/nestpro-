import React, { useState } from 'react';
import Navbar from './components/Navbar';
import OverviewPage from './components/OverviewPage';
import FigmaSaaSDashboard from './components/FigmaSaaSDashboard';
import PropertyPortfolio from './components/PropertyPortfolio';
import ResidentLedger from './components/ResidentLedger';
import SelfCheckInManager from './components/SelfCheckInManager';
import PaymentsLedger from './components/PaymentsLedger';
import AiReceptionistSuite from './components/AiReceptionistSuite';
import OwnerCommandCenterView from './components/OwnerCommandCenterView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import GuestSelfCheckInFlow from './components/GuestSelfCheckInFlow';
import WhatsAppAutomation from './components/WhatsAppAutomation';
import ResidentPortal from './components/ResidentPortal';
import InstantScanComplaintPage from './components/InstantScanComplaintPage';
import PrintableQrPosters from './components/PrintableQrPosters';
import FloatingDesktopToolbar from './components/FloatingDesktopToolbar';

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentToken, setCurrentToken] = useState('demo-checkin-token-88');
  const [residentPortalTokenData, setResidentPortalTokenData] = useState({
    token: '3JHF82LK',
    type: 'complaint',
    resident: {
      name: 'Aarav Patel',
      room: '101 (Single Luxury)',
      property: 'Sunrise PG & Residency',
      rentDue: 15000,
      lockPin: '441392'
    }
  });

  // URL-based routing for guest check-in links.
  // Guests should see only the check-in form, with no admin dashboard or navbar.
  // When a guest opens https://nestpro-os.vercel.app/checkin/TOKEN
  // they must see ONLY the check-in form — no admin dashboard, no navbar
  const urlPath = typeof window !== 'undefined' ? (window.location.pathname + window.location.hash) : '/';
  const checkinMatch = urlPath.match(/\/checkin\/([^\/\?#]+)/);
  if (checkinMatch) {
    const guestToken = checkinMatch[1];
    return <GuestSelfCheckInFlow token={guestToken} onCompleteCheckIn={() => {}} />;
  }

  const handleLaunchResidentPortal = (tokenStr, data) => {
    setCurrentToken(tokenStr);
    setResidentPortalTokenData({
      token: tokenStr,
      type: data?.type || 'complaint',
      resident: data?.resident || {
        name: 'Aarav Patel',
        room: '101 (Single Luxury)',
        property: 'Sunrise PG & Residency',
        rentDue: 15000,
        lockPin: '441392'
      }
    });
    setActiveTab('Resident Encrypted Portal');
  };

  const handleOpenCheckInToken = (tokenStr) => {
    setCurrentToken(tokenStr);
    setActiveTab('Self Check-In Portal');
  };

  const handleResidentSubmittedInstantComplaint = (ticket) => {
    alert(`NEW COMPLAINT RECEIVED ON OWNER DASHBOARD!\n\nTicket #${ticket.id}\nRoom: ${ticket.room}\nIssue: ${ticket.title}\nStatus: OPEN on Kanban Board`);
    setActiveTab('Dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{ flex: 1, paddingBottom: activeTab === 'Overview' ? '0' : '80px' }}>
        {activeTab === 'Overview' && (
          <OverviewPage onNavigate={setActiveTab} />
        )}

        {activeTab === 'Dashboard' && (
          <FigmaSaaSDashboard onOpenCheckInToken={handleOpenCheckInToken} />
        )}

        {activeTab === 'Property Portfolio' && (
          <PropertyPortfolio />
        )}

        {activeTab === 'Resident Ledger' && (
          <ResidentLedger onLaunchResidentPortal={handleLaunchResidentPortal} />
        )}

        {activeTab === 'Print Room QR Posters' && (
          <PrintableQrPosters onTestScanComplaint={() => setActiveTab('Instant Scan Complaint')} />
        )}

        {activeTab === 'Self Check-in' && (
          <SelfCheckInManager onSelectToken={handleOpenCheckInToken} />
        )}

        {activeTab === 'Self Check-In Portal' && (
          <GuestSelfCheckInFlow token={currentToken} onCompleteCheckIn={() => setActiveTab('Resident Ledger')} />
        )}

        {activeTab === 'Instant Scan Complaint' && (
          <InstantScanComplaintPage onSubmitToOwner={handleResidentSubmittedInstantComplaint} />
        )}

        {activeTab === 'Resident Encrypted Portal' && (
          <ResidentPortal
            token={residentPortalTokenData.token}
            tokenData={residentPortalTokenData}
            onSubmitComplaint={handleResidentSubmittedInstantComplaint}
            onPayRent={() => {}}
          />
        )}

        {activeTab === 'Payments' && (
          <PaymentsLedger />
        )}

        {activeTab === 'AI Voice Receptionist' && (
          <AiReceptionistSuite onOpenCheckInToken={handleOpenCheckInToken} />
        )}

        {activeTab === 'Command Center' && (
          <OwnerCommandCenterView onOpenCheckInToken={handleOpenCheckInToken} />
        )}

        {activeTab === 'WhatsApp Suite' && (
          <WhatsAppAutomation onOpenCheckInToken={handleOpenCheckInToken} />
        )}

        {activeTab === 'Analytics' && (
          <AnalyticsView />
        )}

        {activeTab === 'Settings' && (
          <SettingsView />
        )}
      </main>

      <FloatingDesktopToolbar onNavigate={setActiveTab} />
    </div>
  );
}
