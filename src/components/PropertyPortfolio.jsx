import React, { useState } from 'react';
import { 
  Building2, Home, Layers, Plus, Search, Filter, Edit2, Trash2, CheckCircle2, 
  AlertCircle, ChevronDown, User, DoorClosed, Key, Sparkles
} from 'lucide-react';

export default function PropertyPortfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Property State
  const [properties, setProperties] = useState([
    {
      id: 'prop-101',
      name: 'Sunrise PG & Residency',
      type: 'PG',
      address: '100 Feet Road, Koramangala 4th Block, Bengaluru',
      totalBeds: 24,
      occupiedBeds: 22,
      vacantBeds: 2,
      buildings: [
        {
          id: 'b-1',
          name: 'Block A (Main Building)',
          floors: [
            {
              floorName: 'Ground Floor',
              commonRestrooms: 2,
              rooms: [
                { id: 'r-g01', roomNo: 'G01', sharing: 'Double Sharing', price: 9500, status: 'OCCUPIED', resident: 'Aarav Patel', bath: 'Attached' },
                { id: 'r-g02', roomNo: 'G02', sharing: 'Triple Sharing', price: 8000, status: 'VACANT', resident: 'None', bath: 'Shared' }
              ]
            },
            {
              floorName: 'Floor 1',
              commonRestrooms: 3,
              rooms: [
                { id: 'r-101', roomNo: '101', sharing: 'Single Luxury', price: 15000, status: 'OCCUPIED', resident: 'Rohan Sharma', bath: 'Attached' },
                { id: 'r-102', roomNo: '102', sharing: 'Double Sharing', price: 9500, status: 'VACANT', resident: 'None', bath: 'Attached' }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'prop-102',
      name: 'Sunrise Luxury Hotel',
      type: 'Hotel',
      address: 'HSR Layout Sector 1, Outer Ring Road, Bengaluru',
      totalBeds: 30,
      occupiedBeds: 24,
      vacantBeds: 6,
      buildings: [
        {
          id: 'b-2',
          name: 'Tower 1',
          floors: [
            {
              floorName: 'Floor 1',
              commonRestrooms: 0,
              rooms: [
                { id: 'r-201', roomNo: '201', sharing: 'Deluxe Suite', price: 25000, status: 'OCCUPIED', resident: 'Priya Sundaram', bath: 'Attached' }
              ]
            }
          ]
        }
      ]
    }
  ]);

  // Form State for Add Property Modal
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState('PG');
  const [newPropAddress, setNewPropAddress] = useState('');

  const handleAddProperty = (e) => {
    e.preventDefault();
    if (!newPropName || !newPropAddress) return;

    const newProp = {
      id: `prop-${Date.now()}`,
      name: newPropName,
      type: newPropType,
      address: newPropAddress,
      totalBeds: 12,
      occupiedBeds: 0,
      vacantBeds: 12,
      buildings: [
        {
          id: `b-${Date.now()}`,
          name: 'Main Block',
          floors: [
            {
              floorName: 'Ground Floor',
              commonRestrooms: 2,
              rooms: [
                { id: `r-${Date.now()}`, roomNo: 'G01', sharing: 'Double Sharing', price: 9000, status: 'VACANT', resident: 'None', bath: 'Attached' }
              ]
            }
          ]
        }
      ]
    };

    setProperties([...properties, newProp]);
    setNewPropName('');
    setNewPropAddress('');
    setIsAddModalOpen(false);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id));
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ padding: '28px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>Property Portfolio Manager</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Manage properties, buildings, floors, rooms, and live bed occupancy statuses.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add New Property
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search property by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem', color: '#0f172a' }}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', outline: 'none' }}
        >
          <option value="ALL">All Property Types</option>
          <option value="PG">PG</option>
          <option value="Hotel">Hotel</option>
          <option value="Hostel">Hostel</option>
          <option value="Lodge">Lodge</option>
        </select>
      </div>

      {/* Properties List Accordion Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredProperties.map(prop => (
          <div key={prop.id} className="glass-panel" style={{ padding: '24px' }}>
            
            {/* Property Level Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>{prop.name}</h3>
                  <span className="badge badge-indigo">{prop.type}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>📍 {prop.address}</p>
              </div>

              {/* Stats & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{prop.occupiedBeds} / {prop.totalBeds} Beds Filled</div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{prop.vacantBeds} Vacant Beds Ready</div>
                </div>

                <button onClick={() => handleDeleteProperty(prop.id)} style={{ background: '#fee2e2', border: 'none', padding: '8px', borderRadius: '8px', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Buildings & Floor Hierarchy */}
            {prop.buildings.map(b => (
              <div key={b.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="#2563eb" /> {b.name}
                </div>

                {b.floors.map((floor, fIdx) => (
                  <div key={fIdx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#475569' }}>
                        {floor.floorName} ({floor.rooms.length} Rooms • {floor.commonRestrooms} Common Restrooms)
                      </span>
                    </div>

                    {/* Rooms Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      {floor.rooms.map(room => (
                        <div
                          key={room.id}
                          style={{
                            border: room.status === 'OCCUPIED' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                            background: room.status === 'OCCUPIED' ? '#f0fdf4' : '#eff6ff',
                            padding: '12px',
                            borderRadius: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Room {room.roomNo}</strong>
                            <span className={`badge ${room.status === 'OCCUPIED' ? 'badge-emerald' : 'badge-indigo'}`}>
                              {room.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.75rem', color: '#475569' }}>{room.sharing} • {room.bath}</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>₹{room.price}/mo</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Resident: {room.resident}</div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            ))}

          </div>
        ))}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '16px', padding: '28px', border: '1px solid #cbd5e1', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '16px', color: '#0f172a' }}>Add New Property</h3>

            <form onSubmit={handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Property Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise PG Koramangala"
                  value={newPropName}
                  onChange={(e) => setNewPropName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Property Type</label>
                <select
                  value={newPropType}
                  onChange={(e) => setNewPropType(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                >
                  <option value="PG">Paying Guest (PG)</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Lodge">Lodge</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Address</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Feet Road, Bengaluru"
                  value={newPropAddress}
                  onChange={(e) => setNewPropAddress(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Property</button>
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
