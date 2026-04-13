'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { ArrowLeft, Search, CheckCircle, Package, Calendar, MapPin, AlertTriangle, QrCode, User, Clock } from 'lucide-react';
import { useTabletStore } from '@/store/tabletStore';
import { useSearchParams } from 'next/navigation';
import { DetailPageSkeleton } from '@/components/ui/skeleton';

export default function ReturnPage() {
  const searchParams = useSearchParams();
  const initialIssuanceId = searchParams.get('issuanceId');
  
  const { getActiveIssuances, checkinTablet, getTabletById, getParticipantById } = useTabletStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssuance, setSelectedIssuance] = useState<string | null>(initialIssuanceId);
  const [returnData, setReturnData] = useState({
    condition: 'good' as 'excellent' | 'good' | 'fair' | 'poor' | 'damaged',
    returnDate: new Date().toISOString().split('T')[0],
    location: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const activeIssuances = getActiveIssuances();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <DetailPageSkeleton />
      </Layout>
    );
  }

  const selectedIssuanceData = activeIssuances.find(i => i.id === selectedIssuance);
  const selectedTablet = selectedIssuanceData ? getTabletById(selectedIssuanceData.tabletId) : null;
  const selectedParticipant = selectedIssuanceData ? getParticipantById(selectedIssuanceData.participantId) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssuance) return;

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = checkinTablet({
      issuanceId: selectedIssuance,
      actualReturnDate: returnData.returnDate,
      location: returnData.location,
      condition: returnData.condition,
      notes: returnData.notes
    });

    setIsProcessing(false);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = '/issuance';
      }, 2000);
    }
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'good', label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'fair', label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'poor', label: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'damaged', label: 'Damaged', color: 'text-red-600', bg: 'bg-red-100' }
  ];

  if (showSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tablet Returned Successfully!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The tablet has been checked in and is now available for re-issuance.
          </p>
          <Link
            href="/issuance"
            className="px-6 py-3 bg-knbs-500 hover:bg-knbs-600 text-white rounded-xl font-bold transition-colors"
          >
            Back to Issuance
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/issuance"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Return Tablet
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check in a tablet from a participant
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Issuances List */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Package className="w-5 h-5 text-knbs-500" />
                Active Issuances ({activeIssuances.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
              {activeIssuances.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No active issuances to return
                </div>
              ) : (
                activeIssuances.map((issuance) => (
                  <button
                    key={issuance.id}
                    onClick={() => setSelectedIssuance(issuance.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedIssuance === issuance.id ? 'bg-knbs-50 dark:bg-knbs-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {issuance.participantName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {issuance.tabletId}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {issuance.tabletModel}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Return Form */}
          <div className="lg:col-span-2">
            {selectedIssuanceData ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/30">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100">Return Details</h3>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Selected Issuance Info */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Participant</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {selectedIssuanceData.participantName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Tablet</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100 font-mono">
                            {selectedIssuanceData.tabletId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Checked Out</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {selectedIssuanceData.checkoutDate.split('T')[0]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Expected Return</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {selectedIssuanceData.expectedReturnDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Condition Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Tablet Condition *
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {conditionOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setReturnData({ ...returnData, condition: opt.value as typeof returnData.condition })}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            returnData.condition === opt.value
                              ? `${opt.bg} border-current ${opt.color} font-bold`
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <span className="text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Return Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={returnData.returnDate}
                        onChange={(e) => setReturnData({ ...returnData, returnDate: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        Return Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={returnData.location}
                        onChange={(e) => setReturnData({ ...returnData, location: e.target.value })}
                        placeholder="e.g., Nairobi HQ, Mombasa Office"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Additional Notes
                    </label>
                    <textarea
                      value={returnData.notes}
                      onChange={(e) => setReturnData({ ...returnData, notes: e.target.value })}
                      rows={3}
                      placeholder="Any issues, damages, or additional information..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 font-medium focus:outline-none focus:ring-2 focus:ring-knbs-500 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link
                      href="/issuance"
                      className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 font-bold transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-8 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Complete Return
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Select an Issuance
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Choose an active issuance from the list to process the return.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
