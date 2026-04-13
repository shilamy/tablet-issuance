'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Package, Users, CheckCircle, Upload, Download, FileText, Search, Filter, AlertTriangle } from 'lucide-react';
import { useTabletStore } from '@/store/tabletStore';
import { PageSkeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';

export default function BulkIssuancePage() {
  const { tablets, participants, checkoutTablet, getAvailableTablets } = useTabletStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [bulkMode, setBulkMode] = useState<'tablets' | 'participants'>('tablets');
  const [selectedTablets, setSelectedTablets] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [issuanceDetails, setIssuanceDetails] = useState({
    activity: '2024 Kenya Population and Housing Census',
    expectedReturnDate: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    );
  }

  const availableTablets = getAvailableTablets();
  const filteredTablets = availableTablets.filter(t => {
    const matchesSearch = t.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSelectAll = () => {
    if (bulkMode === 'tablets') {
      setSelectedTablets(filteredTablets.map(t => t.id));
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const handleDeselectAll = () => {
    if (bulkMode === 'tablets') {
      setSelectedTablets([]);
    } else {
      setSelectedParticipants([]);
    }
  };

  const handleToggleTablet = (tabletId: string) => {
    setSelectedTablets(prev =>
      prev.includes(tabletId)
        ? prev.filter(id => id !== tabletId)
        : [...prev, tabletId]
    );
  };

  const handleToggleParticipant = (participantId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleBulkIssue = async () => {
    if (selectedTablets.length === 0 || selectedParticipants.length === 0) {
      toast('Please select at least one tablet and one participant', 'warning');
      return;
    }

    if (!issuanceDetails.expectedReturnDate || !issuanceDetails.location) {
      toast('Please fill in all required fields', 'warning');
      return;
    }

    setIsProcessing(true);
    
    // Process issuances one by one
    let successCount = 0;
    let failCount = 0;
    
    for (const tabletId of selectedTablets) {
      for (const participantId of selectedParticipants) {
        const result = checkoutTablet({
          participantId,
          tabletId,
          expectedReturnDate: issuanceDetails.expectedReturnDate,
          location: issuanceDetails.location,
          activity: issuanceDetails.activity,
          notes: issuanceDetails.notes
        });
        
        if (result) {
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    setIsProcessing(false);
    
    if (failCount === 0) {
      setShowSuccess(true);
      toast(`Successfully issued ${successCount} tablets!`, 'success');
    } else {
      toast(`${successCount} issued, ${failCount} failed`, 'warning');
    }
  };

  const activities = [
    '2024 Kenya Population and Housing Census',
    'Continuous Household Surveys (KCHSP)',
    'Integrated Household Budget Surveys (KIHBS 2025/26)',
    'Labour Force Surveys',
    'Agriculture and Livestock Surveys',
    'Building and Construction Surveys',
    'Industrial Production and Enterprise Surveys',
    '2025 Remittances Household Survey (RHS)'
  ];

  if (showSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bulk Issuance Complete!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {selectedTablets.length} tablets have been issued to {selectedParticipants.length} participants.
          </p>
          <div className="flex gap-4">
            <Link
              href="/issuance"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold transition-colors"
            >
              View All Issuances
            </Link>
            <button
              onClick={() => {
                setShowSuccess(false);
                setSelectedTablets([]);
                setSelectedParticipants([]);
              }}
              className="px-6 py-3 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl font-bold transition-colors"
            >
              Issue More
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/issuance"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Bulk Issuance
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Issue multiple tablets to multiple participants at once
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setBulkMode('tablets')}
              className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all ${
                bulkMode === 'tablets'
                  ? 'border-knbs-500 bg-knbs-50 dark:bg-knbs-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  bulkMode === 'tablets' ? 'bg-knbs-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedTablets.length} Tablets Selected
                  </p>
                  <p className="text-sm text-gray-500">
                    {availableTablets.length} available
                  </p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setBulkMode('participants')}
              className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition-all ${
                bulkMode === 'participants'
                  ? 'border-knbs-500 bg-knbs-50 dark:bg-knbs-950/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  bulkMode === 'participants' ? 'bg-knbs-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-gray-100">
                    {selectedParticipants.length} Participants Selected
                  </p>
                  <p className="text-sm text-gray-500">
                    {participants.length} total
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selection List */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">
                {bulkMode === 'tablets' ? 'Select Tablets' : 'Select Participants'}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-knbs-600 dark:text-knbs-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-xs font-bold text-gray-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={bulkMode === 'tablets' ? 'Search tablets...' : 'Search participants...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-knbs-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {bulkMode === 'tablets' ? (
                filteredTablets.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No available tablets found
                  </div>
                ) : (
                  filteredTablets.map((tablet) => (
                    <label
                      key={tablet.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTablets.includes(tablet.id)}
                        onChange={() => handleToggleTablet(tablet.id)}
                        className="w-5 h-5 rounded border-gray-300 text-knbs-500 focus:ring-knbs-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {tablet.model}
                        </p>
                        <p className="text-sm text-gray-500 font-mono">{tablet.deviceId}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-bold">
                          {tablet.battery}% battery
                        </span>
                      </div>
                    </label>
                  ))
                )
              ) : (
                filteredParticipants.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No participants found
                  </div>
                ) : (
                  filteredParticipants.map((participant) => (
                    <label
                      key={participant.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={() => handleToggleParticipant(participant.id)}
                        className="w-5 h-5 rounded border-gray-300 text-knbs-500 focus:ring-knbs-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {participant.name}
                        </p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold">
                          {participant.role || 'Participant'}
                        </span>
                      </div>
                    </label>
                  ))
                )
              )}
            </div>
          </div>

          {/* Issuance Details */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Issuance Details</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleBulkIssue(); }} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Activity/Survey *
                </label>
                <select
                  required
                  value={issuanceDetails.activity}
                  onChange={(e) => setIssuanceDetails({ ...issuanceDetails, activity: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                >
                  {activities.map((activity) => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Expected Return Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={issuanceDetails.expectedReturnDate}
                    onChange={(e) => setIssuanceDetails({ ...issuanceDetails, expectedReturnDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={issuanceDetails.location}
                    onChange={(e) => setIssuanceDetails({ ...issuanceDetails, location: e.target.value })}
                    placeholder="e.g., Nairobi HQ"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </label>
                <textarea
                  value={issuanceDetails.notes}
                  onChange={(e) => setIssuanceDetails({ ...issuanceDetails, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes for this bulk issuance..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 resize-none"
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Issuance Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tablets to issue:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{selectedTablets.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Participants:</span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{selectedParticipants.length}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                  <span className="text-gray-500">Total issuances:</span>
                  <span className="font-bold text-knbs-600">
                    {selectedTablets.length * selectedParticipants.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/issuance"
                  className="flex-1 px-6 py-3 text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isProcessing || selectedTablets.length === 0 || selectedParticipants.length === 0}
                  className="flex-1 px-6 py-3 bg-knbs-500 hover:bg-knbs-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Issue Tablets
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
