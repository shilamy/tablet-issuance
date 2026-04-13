'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, History, MapPin, Battery, Wifi, Clock, User, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTabletStore } from '@/store/tabletStore';

export default function TabletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = params.deviceId as string;
  
  const { getTabletById, deleteTablet, getIssuanceByTablet } = useTabletStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const tablet = getTabletById(deviceId);
  const activeIssuance = getIssuanceByTablet(deviceId);

  if (!tablet) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tablet Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The tablet with ID "{deviceId}" could not be found.
          </p>
          <Link
            href="/tablets"
            className="px-6 py-3 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl font-bold transition-colors"
          >
            Back to Tablets
          </Link>
        </div>
      </Layout>
    );
  }

  const statusColors = {
    available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    issued: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    damaged: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    missing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    maintenance: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const conditionColors = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-blue-600 dark:text-blue-400',
    fair: 'text-yellow-600 dark:text-yellow-400',
    poor: 'text-orange-600 dark:text-orange-400',
    damaged: 'text-red-600 dark:text-red-400',
  };

  const handleDelete = () => {
    deleteTablet(tablet.id);
    router.push('/tablets');
  };

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/tablets"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-knbs-100 to-knbs-200 dark:from-knbs-900 dark:to-knbs-800 rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-knbs-600 dark:text-knbs-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {tablet.model}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {tablet.deviceId}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl font-bold text-sm ${statusColors[tablet.status]}`}>
              {tablet.status.charAt(0).toUpperCase() + tablet.status.slice(1)}
            </span>
            <Link
              href={`/tablets/new?edit=${tablet.deviceId}`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Battery className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tablet.battery}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tablet.storage}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">RAM</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tablet.ram}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Seen</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{tablet.lastSeen}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Information */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Device Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Operating System</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tablet.os}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Condition</p>
                  <p className={`font-medium ${conditionColors[tablet.condition]}`}>
                    {tablet.condition.charAt(0).toUpperCase() + tablet.condition.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Purchase Date</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tablet.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Warranty</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tablet.warranty}</p>
                </div>
              </div>
              {tablet.serialNumber && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Serial Number</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">{tablet.serialNumber}</p>
                </div>
              )}
              {tablet.imei && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IMEI</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">{tablet.imei}</p>
                </div>
              )}
              {tablet.notes && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{tablet.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Assignment & Location */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Assignment & Location</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tablet.location}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Assigned To</p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {tablet.assignedTo || 'Not Assigned'}
                  </p>
                </div>
              </div>
              {tablet.assignedActivity && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Activity</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tablet.assignedActivity}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Department</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {tablet.department || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Issuance */}
        {activeIssuance && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Active Issuance
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Participant</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{activeIssuance.participantName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Checked Out</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{activeIssuance.checkoutDate.split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expected Return</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{activeIssuance.expectedReturnDate}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/issuance/checkin?issuanceId=${activeIssuance.id}`}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Check In Tablet
                </Link>
                <Link
                  href={`/logs?tabletId=${tablet.deviceId}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold text-sm transition-colors"
                >
                  <History className="w-4 h-4 inline mr-2" />
                  View History
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Link
            href="/tablets"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold transition-colors text-center"
          >
            Back to Tablets
          </Link>
          {tablet.status === 'available' && (
            <Link
              href={`/issuance/checkout?tabletId=${tablet.deviceId}`}
              className="px-6 py-3 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl font-bold transition-colors text-center"
            >
              Issue This Tablet
            </Link>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Tablet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete <strong>{tablet.model}</strong> ({tablet.deviceId})? This will remove the tablet from inventory.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
