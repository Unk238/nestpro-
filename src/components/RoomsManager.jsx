import React, { useState } from 'react';
import { 
  Home, Building2, Layers, Plus, Search, Filter, UserPlus, RefreshCw, 
  CheckCircle2, AlertCircle, Wrench, Key, User 
} from 'lucide-react';

export default function RoomsManager({ roomsState, setRoomsState, onAssignResident }) {
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningRoom, setAssigningRoom] = useState(null);
  const [newResidentName, setNewResidentName] = useState('');
  const [newResidentPhone, setNewResidentPhone] = useState('');

  // Initial Rooms List if not provided
  const [rooms, setRooms] = useState(roomsState || [
    { id: '101', roomNo: '101', floor: 'Floor 1', sharing: 'Single Luxury', price: 15000, status: 'OCCUPIED', resident: 'Aarav Patel', phone: '+91 98765 43210', bath: 'Attached' },
    { id: '102', roomNo: '102', floor: 'Floor 1', sharing: 'Double Sharing', price: 9500, status: 'VACANT', resident: 'None', phone: '-', bath: 'Attached' },
    { id: '201', roomNo: '201', floor: 'Floor 2', sharing: 'Deluxe Suite', price: 25000, status: 'OCCUPIED', resident: 'Priya Sundaram', phone: '+91 99000 88888', bath: 'Attached' },
    { id: '205', roomNo: '205', floor: 'Floor 2', sharing: 'Double Sharing', price: 9500, status: 'VACANT', resident: 'None', phone: '-', bath: 'Attached' },
    { id: '301', roomNo: '301', floor: 'Floor 3', sharing: 'Double Sharing', price: 9800, status: 'OCCUPIED', resident: 'Rohan Sharma', phone: '+91 98123 99999', bath: 'Attached' },
    { id: '306', roomNo: '306', floor: 'Floor 3', sharing: 'Deluxe Suite', price: 22000, status: 'VACANT', resident: 'None', phone: '-', bath: 'Attached' },
    { id: 'g01', roomNo: 'G01', floor: 'Ground Floor', sharing: 'Double Sharing', price: 9000, status: 'MAINTENANCE', resident: 'None', phone: '-', bath: 'Shared' },
    { id: 'g02', roomNo: 'G02', floor: 'Ground Floor', sharing: 'Triple Sharing', price: 8000, status: 'VACANT', resident: 'None', phone: '-', bath: 'Shared' }
  ]);

  const handleStatusChange = (roomId, newStatus) => {
    const updated = rooms.map(r => {
      if (r.id === roomId) {
        return { 
          ...r, 
          status: newStatus,
          resident: newStatus === 'VACANT' || newStatus === 'MAINTENANCE' ? 'None' : r.resident,
          phone: newStatus === 'VACANT' || newStatus === 'MAINTENANCE' ? '-' : r.phone
        };
      }
      return r;
    });
    setRooms(updated);
    if (setRoomsState) setRoomsState(updated);
  };

  const handleAssignResidentSubmit = (e) => {
    e.preventDefault();
    if (!assigningRoom || !newResidentName) return;

    const updated = rooms.map(r => {
      if (r.id === assigningRoom.id) {
        return {
          ...r,
          status: 'OCCUPIED',
          resident: newResidentName,
          phone: newResidentPhone || '+91 98000 11111'
        };
      }
      return r;
    });

    setRooms(updated);
    if (setRoomsState) setRoomsState(updated);
    if (onAssignResident) {
      onAssignResident({
        name: newResidentName,
        phone: newResidentPhone || '+91 98000 11111',
        room: assigningRoom.roomNo,
        rent: assigningRoom.price
      });
    }

    alert(`Successfully assigned Room ${assigningRoom.roomNo} to ${newResidentName}!`);
    setAssigningRoom(null);
    setNewResidentName('');
    setNewResidentPhone('');
  };

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.roomNo.toLowerCase().includes(searchQuery.toLowerCase()) || r.resident.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = selectedFloor === 'ALL' || r.floor === selectedFloor;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesSearch && matchesFloor && matchesStatus;
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Rooms & Bed Allocation Manager</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Live room occupancy, floor selection, maintenance status controls, and instant guest room assignment.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search room number or resident name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
          />
        </div>

        <select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
        >
          <option value="ALL">All Floor Levels</option>
          <option value="Ground Floor">Ground Floor</option>
          <option value="Floor 1">Floor 1</option>
          <option value="Floor 2">Floor 2</option>
          <option value="Floor 3">Floor 3</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
        >
          <option value="ALL">All Statuses</option>
          <option value="VACANT">Vacant Only</option>
          <option value="OCCUPIED">Occupied Only</option>
          <option value="MAINTENANCE">Under Maintenance</option>
        </select>
      </div>

      {/* Room Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
        {filteredRooms.map(room => (
          <div
            key={room.id}
            style={{
              background: '#ffffff',
              border: room.status === 'OCCUPIED' ? '1px solid #bbf7d0' : room.status === 'VACANT' ? '1px solid #bfdbfe' : '1px solid #fde68a',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>Room {room.roomNo}</strong>
              <span className={`badge ${room.status === 'OCCUPIED' ? 'badge-emerald' : room.status === 'VACANT' ? 'badge-indigo' : 'badge-amber'}`}>
                {room.status}
              </span>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
              {room.floor} • {room.sharing} ({room.bath})
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#2563eb', marginBottom: '12px' }}>
              ₹{room.price.toLocaleString()}/mo
            </div>

            <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
              <strong>Resident:</strong> {room.resident}
              {room.phone !== '-' && <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '2px' }}>{room.phone}</div>}
            </div>

            {/* Quick Action Status Toggles */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {room.status === 'VACANT' && (
                <button className="btn-primary" onClick={() => setAssigningRoom(room)} style={{ padding: '6px 12px', fontSize: '0.75rem', width: '100%', justifyContent: 'center' }}>
                  <UserPlus size={14} /> Assign Resident
                </button>
              )}

              {room.status === 'OCCUPIED' && (
                <button className="btn-secondary" onClick={() => handleStatusChange(room.id, 'VACANT')} style={{ padding: '6px 12px', fontSize: '0.75rem', flex: 1 }}>
                  Checkout & Vacate
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={() => handleStatusChange(room.id, room.status === 'MAINTENANCE' ? 'VACANT' : 'MAINTENANCE')}
                style={{ padding: '6px 10px', fontSize: '0.75rem', color: room.status === 'MAINTENANCE' ? '#16a34a' : '#d97706' }}
              >
                <Wrench size={12} /> {room.status === 'MAINTENANCE' ? 'Set Ready' : 'Maintenance'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Resident Modal */}
      {assigningRoom && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '440px', borderRadius: '16px', padding: '28px', border: '1px solid #cbd5e1', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '6px', color: '#0f172a' }}>
              Assign Guest to Room {assigningRoom.roomNo}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
              {assigningRoom.floor} • {assigningRoom.sharing} • ₹{assigningRoom.price.toLocaleString()}/mo
            </p>

            <form onSubmit={handleAssignResidentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Resident Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Sen"
                  value={newResidentName}
                  onChange={(e) => setNewResidentName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Mobile Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 98000 11111"
                  value={newResidentPhone}
                  onChange={(e) => setNewResidentPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm Room Allocation</button>
                <button type="button" className="btn-secondary" onClick={() => setAssigningRoom(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
