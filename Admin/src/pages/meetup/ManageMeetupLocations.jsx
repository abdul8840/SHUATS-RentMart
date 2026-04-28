// ManageMeetupLocations.tsx (Fixed)
import { useState, useEffect } from 'react';
import { getMeetupLocationsAPI, createMeetupLocationAPI, updateMeetupLocationAPI, deleteMeetupLocationAPI } from '../../api/axios.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import Loader from '../../components/common/Loader.jsx';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiRefreshCw, FiShield, FiAlertTriangle, FiNavigation, FiX } from 'react-icons/fi';

const locationTypes = ['Library', 'Admin Block', 'Cafeteria', 'Department', 'Hostel Area', 'Sports Complex', 'Gate', 'Other'];

const ManageMeetupLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModal, setFormModal] = useState({ open: false, editing: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, location: null });
  const [formData, setFormData] = useState({
    name: '', description: '', type: 'Library', lat: '', lng: '', isSafe: true
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data } = await getMeetupLocationsAPI();
      if (data.success) setLocations(data.locations);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '', type: 'Library', lat: '', lng: '', isSafe: true });
    setFormModal({ open: true, editing: null });
  };

  const openEditModal = (loc) => {
    setFormData({
      name: loc.name,
      description: loc.description || '',
      type: loc.type,
      lat: loc.coordinates.lat.toString(),
      lng: loc.coordinates.lng.toString(),
      isSafe: loc.isSafe
    });
    setFormModal({ open: true, editing: loc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.lat || !formData.lng) {
      toast.error('Name and coordinates are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        coordinates: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
        isSafe: formData.isSafe
      };

      if (formModal.editing) {
        await updateMeetupLocationAPI(formModal.editing._id, payload);
        toast.success('Location updated');
      } else {
        await createMeetupLocationAPI(payload);
        toast.success('Location created');
      }
      setFormModal({ open: false, editing: null });
      fetchLocations();
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.location) return;
    setDeleting(true);
    try {
      await deleteMeetupLocationAPI(deleteModal.location._id);
      toast.success('Location deleted');
      setDeleteModal({ open: false, location: null });
      fetchLocations();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const totalUsage = locations.reduce((sum, loc) => sum + (loc.usageCount || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-900 flex items-center gap-2">
              <FiMapPin className="w-7 h-7 text-green-600" />
              Manage Meetup Locations
            </h1>
            <p className="text-green-600 mt-1">Configure safe meetup spots for item exchanges</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchLocations}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition cursor-pointer"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Add Location
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Locations</p>
                <p className="text-2xl font-bold text-green-800">{locations.length}</p>
              </div>
              <FiMapPin className="w-8 h-8 text-green-500 opacity-60" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Usage Count</p>
                <p className="text-2xl font-bold text-blue-800">{totalUsage}</p>
              </div>
              <FiNavigation className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Safe Zones</p>
                <p className="text-2xl font-bold text-emerald-800">{locations.filter(l => l.isSafe).length}</p>
              </div>
              <FiShield className="w-8 h-8 text-emerald-500 opacity-60" />
            </div>
          </div>
        </div>

        {/* Locations Grid */}
        {locations.length === 0 ? (
          <div className="text-center py-16 bg-green-50/30 rounded-2xl">
            <div className="text-5xl mb-4">📍</div>
            <p className="text-green-600 text-lg">No meetup locations configured</p>
            <button
              onClick={openCreateModal}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Add Your First Location
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {locations.map((loc) => (
              <div key={loc._id} className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${loc.isSafe ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                        {loc.isSafe ? <FiShield className="w-5 h-5" /> : <FiAlertTriangle className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-900 text-lg">{loc.name}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">{loc.type}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(loc)}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ open: true, location: loc })}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {loc.description && (
                    <p className="mt-3 text-sm text-green-600">{loc.description}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-500">
                      <FiNavigation className="w-3 h-3" />
                      {loc.coordinates.lat}, {loc.coordinates.lng}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${loc.isSafe ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {loc.isSafe ? '✅ Safe Zone' : '⚠️ Unmarked'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-green-100 flex justify-between items-center">
                    <span className="text-xs text-green-400">
                      Used {loc.usageCount || 0} times for meetups
                    </span>
                    <button
                      onClick={() => openEditModal(loc)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium cursor-pointer"
                    >
                      Edit Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Modal - Inline Implementation */}
        {formModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-green-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-green-900">
                  {formModal.editing ? 'Edit Location' : 'Add New Location'}
                </h2>
                <button
                  onClick={() => setFormModal({ open: false, editing: null })}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Location Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Central Library"
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    placeholder="Brief description of this location..."
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Location Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                  >
                    {locationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      required
                      placeholder="25.4358"
                      className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      required
                      placeholder="81.8463"
                      className="w-full px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSafe}
                      onChange={(e) => setFormData({ ...formData, isSafe: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-sm text-green-700">Mark as Safe Zone</span>
                  </label>
                  {!formData.isSafe && (
                    <span className="text-xs text-amber-600">⚠️ Unmarked locations may be less safe</span>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setFormModal({ open: false, editing: null })}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? 'Saving...' : (formModal.editing ? 'Update Location' : 'Create Location')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, location: null })}
          onConfirm={handleDelete}
          title="Delete Location"
          message={`Are you sure you want to delete "${deleteModal.location?.name}"? This action cannot be undone.`}
          confirmText="Delete Location"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default ManageMeetupLocations;