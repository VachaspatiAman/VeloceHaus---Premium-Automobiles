"use client";
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Palette, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface ColorVariant {
  color_name: string;
  hex_code: string;
  image_url: string;
}

interface Vehicle {
  id?: string;
  name: string;
  brand: string;
  type: string;
  fueltype: string;
  price: number;
  stock: number;
  featured: boolean;
  description: string;
  image_url: string;
  // Specs
  engine?: string;
  transmission?: string;
  horsepower?: number;
  torque?: string;
  mileage?: string;
  seats?: number;
  top_speed?: number;
  warranty?: string;
  // Color variants stored as JSON in DB
  color_variants?: ColorVariant[];
}

const emptyForm = (): Vehicle => ({
  name: '', brand: '', type: '', fueltype: '', price: 0, stock: 0,
  featured: false, description: '', image_url: '',
  engine: '', transmission: '', horsepower: 0, torque: '',
  mileage: '', seats: 5, top_speed: 0, warranty: '',
  color_variants: []
});

const emptyColor = (): ColorVariant => ({ color_name: '', hex_code: '#ffffff', image_url: '' });

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Vehicle>(emptyForm());
  const [activeTab, setActiveTab] = useState<'basic' | 'specs' | 'colors'>('basic');
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem('token') || '';

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API}/vehicles`);
      const data = await res.json();
      if (data.status === 'success') setVehicles(data.data.vehicles);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, []);

  const openAdd = () => {
    setEditingVehicle(null);
    setFormData(emptyForm());
    setActiveTab('basic');
    setShowModal(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      ...v,
      color_variants: Array.isArray(v.color_variants) ? v.color_variants : []
    });
    setActiveTab('basic');
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle?')) return;
    await fetch(`${API}/admin/vehicles/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token()}` }
    });
    fetchVehicles();
  };

  // ── Color variant helpers ────────────────────────────────────────────────────
  const addColor = () =>
    setFormData(f => ({ ...f, color_variants: [...(f.color_variants || []), emptyColor()] }));

  const removeColor = (i: number) =>
    setFormData(f => ({ ...f, color_variants: (f.color_variants || []).filter((_, idx) => idx !== i) }));

  const updateColor = (i: number, field: keyof ColorVariant, val: string) =>
    setFormData(f => ({
      ...f,
      color_variants: (f.color_variants || []).map((c, idx) => idx === i ? { ...c, [field]: val } : c)
    }));

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingVehicle
        ? `${API}/admin/vehicles/${editingVehicle.id}`
        : `${API}/admin/vehicles`;
      const res = await fetch(url, {
        method: editingVehicle ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) { fetchVehicles(); setShowModal(false); }
      else alert(data.message || 'Failed to save vehicle');
    } catch (e) { alert('An error occurred'); }
    finally { setSaving(false); }
  };

  const field = (label: string, node: React.ReactNode) => (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {node}
    </div>
  );

  const input = (props: React.InputHTMLAttributes<HTMLInputElement> & { onChange: any }) => (
    <input
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm
                 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition"
    />
  );

  const select = (props: React.SelectHTMLAttributes<HTMLSelectElement> & { onChange: any, children: any }) => (
    <select
      {...props}
      className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm
                 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition"
    />
  );

  const filtered = vehicles.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { key: 'basic', label: 'Basic Info' },
    { key: 'specs', label: 'Specifications' },
    { key: 'colors', label: `Color Variants (${formData.color_variants?.length || 0})` },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Vehicles</h2>
          <p className="text-gray-400 mt-1 text-sm">Add detailed vehicles with specs and color variants.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium
                     flex items-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Vehicle
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm
                         text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
            />
          </div>
          <span className="text-xs text-gray-500">{filtered.length} vehicles</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950/50 text-gray-400 text-xs border-b border-gray-800 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Fuel</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Colors</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm text-gray-300">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No vehicles found.</td></tr>
              ) : filtered.map((v: any) => (
                <tr key={v.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.name} className="w-10 h-10 rounded-lg object-cover border border-gray-700" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{v.name}</p>
                        <p className="text-xs text-gray-500">{v.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{v.type}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                      {v.fueltype || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">₹{Number(v.price).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {Array.isArray(v.color_variants) && v.color_variants.length > 0 ? (
                      <div className="flex items-center gap-1">
                        {v.color_variants.slice(0, 4).map((c: ColorVariant, i: number) => (
                          <div
                            key={i}
                            title={c.color_name}
                            className="w-5 h-5 rounded-full border-2 border-gray-700"
                            style={{ backgroundColor: c.hex_code || '#888' }}
                          />
                        ))}
                        {v.color_variants.length > 4 && (
                          <span className="text-xs text-gray-500">+{v.color_variants.length - 4}</span>
                        )}
                      </div>
                    ) : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${v.stock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(v)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">Fill in all details for accurate listing</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4 shrink-0 flex gap-1 border-b border-gray-800">
              {tabs.map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === t.key
                      ? 'bg-red-600/10 text-red-400 border-b-2 border-red-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto p-6">

                {/* ── Tab: Basic Info ── */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {field('Vehicle Name *', input({ required: true, placeholder: 'e.g., Hyundai Creta', value: formData.name, onChange: (e: any) => setFormData(f => ({ ...f, name: e.target.value })) }))}
                      {field('Brand *', input({ required: true, placeholder: 'e.g., Hyundai', value: formData.brand, onChange: (e: any) => setFormData(f => ({ ...f, brand: e.target.value })) }))}
                      {field('Type *', select({ required: true, value: formData.type, onChange: (e: any) => setFormData(f => ({ ...f, type: e.target.value })), children: (<><option value="">Select type</option><option value="Car">Car</option><option value="SUV">SUV</option><option value="Truck">Truck</option><option value="Bike">Bike</option><option value="Van">Van</option><option value="Electric">Electric</option></>) }))}
                      {field('Fuel Type *', select({ required: true, value: formData.fueltype, onChange: (e: any) => setFormData(f => ({ ...f, fueltype: e.target.value })), children: (<><option value="">Select fuel</option><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option><option value="Hybrid">Hybrid</option><option value="CNG">CNG</option><option value="LPG">LPG</option></>) }))}
                      {field('Price (₹) *', input({ type: 'number', required: true, min: 0, placeholder: '5000000', value: formData.price || '', onChange: (e: any) => setFormData(f => ({ ...f, price: Number(e.target.value) })) }))}
                      {field('Stock *', input({ type: 'number', required: true, min: 0, placeholder: '10', value: formData.stock || '', onChange: (e: any) => setFormData(f => ({ ...f, stock: Number(e.target.value) })) }))}
                    </div>
                    {field('Primary Image URL', input({ type: 'url', placeholder: 'https://example.com/car.jpg', value: formData.image_url || '', onChange: (e: any) => setFormData(f => ({ ...f, image_url: e.target.value })) }))}
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="h-32 rounded-xl object-cover border border-gray-700" onError={e => (e.currentTarget.style.display = 'none')} />
                    )}
                    {field('Description', (
                      <textarea
                        rows={4}
                        placeholder="Describe the vehicle — highlights, features, unique selling points..."
                        value={formData.description || ''}
                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-3.5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm
                                   placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 resize-none transition"
                      />
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={formData.featured || false} onChange={e => setFormData(f => ({ ...f, featured: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500" />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Mark as Featured Vehicle</span>
                    </label>
                  </div>
                )}

                {/* ── Tab: Specifications ── */}
                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 bg-gray-800/50 rounded-xl px-4 py-2.5 border border-gray-700">
                      Detailed specs help buyers make informed decisions. Fill as many as applicable.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {field('Engine', input({ placeholder: 'e.g., 1.5L Turbo GDI', value: formData.engine || '', onChange: (e: any) => setFormData(f => ({ ...f, engine: e.target.value })) }))}
                      {field('Transmission', select({ value: formData.transmission || '', onChange: (e: any) => setFormData(f => ({ ...f, transmission: e.target.value })), children: (<><option value="">Select</option><option value="Manual">Manual</option><option value="Automatic">Automatic</option><option value="AMT">AMT</option><option value="CVT">CVT</option><option value="DCT">DCT (Dual Clutch)</option></>) }))}
                      {field('Horsepower (bhp)', input({ type: 'number', min: 0, placeholder: 'e.g., 138', value: formData.horsepower || '', onChange: (e: any) => setFormData(f => ({ ...f, horsepower: Number(e.target.value) })) }))}
                      {field('Torque', input({ placeholder: 'e.g., 242 Nm @ 1500 rpm', value: formData.torque || '', onChange: (e: any) => setFormData(f => ({ ...f, torque: e.target.value })) }))}
                      {field('Mileage', input({ placeholder: 'e.g., 17.4 kmpl', value: formData.mileage || '', onChange: (e: any) => setFormData(f => ({ ...f, mileage: e.target.value })) }))}
                      {field('Seating Capacity', input({ type: 'number', min: 1, max: 20, placeholder: 'e.g., 5', value: formData.seats || '', onChange: (e: any) => setFormData(f => ({ ...f, seats: Number(e.target.value) })) }))}
                      {field('Top Speed (km/h)', input({ type: 'number', min: 0, placeholder: 'e.g., 190', value: formData.top_speed || '', onChange: (e: any) => setFormData(f => ({ ...f, top_speed: Number(e.target.value) })) }))}
                      {field('Warranty', input({ placeholder: 'e.g., 3 years / 1,00,000 km', value: formData.warranty || '', onChange: (e: any) => setFormData(f => ({ ...f, warranty: e.target.value })) }))}
                    </div>
                  </div>
                )}

                {/* ── Tab: Color Variants ── */}
                {activeTab === 'colors' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Add each available color with its unique image.</p>
                      <button
                        type="button"
                        onClick={addColor}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-xl transition-colors border border-gray-700"
                      >
                        <Palette className="w-4 h-4 text-red-400" />
                        Add Color
                      </button>
                    </div>

                    {(!formData.color_variants || formData.color_variants.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-600 border border-dashed border-gray-700 rounded-2xl">
                        <Palette className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm">No color variants added yet.</p>
                        <p className="text-xs mt-1">Click &quot;Add Color&quot; to add the first variant.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {(formData.color_variants || []).map((c, i) => (
                        <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full border-2 border-gray-600" style={{ backgroundColor: c.hex_code || '#888' }} />
                              Color Variant {i + 1}
                              {c.color_name && <span className="text-gray-400 font-normal">— {c.color_name}</span>}
                            </span>
                            <button type="button" onClick={() => removeColor(i)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Color Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g., Pearl White"
                                value={c.color_name}
                                onChange={e => updateColor(i, 'color_name', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Hex Color</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={c.hex_code || '#ffffff'}
                                  onChange={e => updateColor(i, 'hex_code', e.target.value)}
                                  className="w-10 h-10 rounded-lg border-0 bg-transparent cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={c.hex_code || ''}
                                  onChange={e => updateColor(i, 'hex_code', e.target.value)}
                                  placeholder="#ffffff"
                                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1 uppercase tracking-wider">Image URL *</label>
                              <input
                                type="url"
                                required
                                placeholder="https://..."
                                value={c.image_url}
                                onChange={e => updateColor(i, 'image_url', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-red-500 transition"
                              />
                            </div>
                          </div>
                          {c.image_url && (
                            <img
                              src={c.image_url}
                              alt={c.color_name}
                              className="h-24 rounded-xl object-cover border border-gray-700 mt-1"
                              onError={e => (e.currentTarget.style.display = 'none')}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-800 flex gap-3 shrink-0">
                {/* Tab navigation */}
                <div className="flex gap-2 flex-1">
                  {activeTab !== 'basic' && (
                    <button type="button" onClick={() => setActiveTab(activeTab === 'colors' ? 'specs' : 'basic')}
                      className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition-colors flex items-center gap-1.5">
                      <ChevronUp className="w-4 h-4 rotate-90" /> Back
                    </button>
                  )}
                  {activeTab !== 'colors' && (
                    <button type="button" onClick={() => setActiveTab(activeTab === 'basic' ? 'specs' : 'colors')}
                      className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition-colors flex items-center gap-1.5">
                      Next <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  )}
                </div>
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-red-600/20">
                  {saving ? 'Saving…' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
