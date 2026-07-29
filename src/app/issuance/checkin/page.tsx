"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { 
  Tablet, CheckCircle,
  ArrowLeft, Shield, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { useTabletStore } from "@/store/tabletStore";

function CheckinPage() {
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('qr') || searchParams.get('tablet') || searchParams.get('participant');
  
  const { issuances, refreshData } = useTabletStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tabletId: qrCode?.startsWith('KNBS-TAB-') ? qrCode : "",
    participantId: qrCode?.startsWith('P-') ? qrCode : "",
    condition: "good",
    notes: "",
    location: "Nairobi Office"
  });

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  type ActiveIssuanceInfo = {
    participantName: string;
    tabletModel: string;
    checkedOutAt: string;
    expectedReturn: string;
    checkedOutBy: string;
    location: string;
  };

  const activeIssuance = useMemo<ActiveIssuanceInfo | null>(() => {
    if (!formData.tabletId && !formData.participantId) return null;

    // Find matching issuance from store
    const issuance = issuances.find(
      i => i.tabletId === formData.tabletId || i.participantId === formData.participantId
    );

    if (issuance) {
      return {
        participantName: issuance.participantName,
        tabletModel: issuance.tabletModel,
        checkedOutAt: issuance.checkoutDate,
        expectedReturn: issuance.expectedReturnDate,
        checkedOutBy: issuance.checkoutBy || "System",
        location: issuance.checkoutLocation || "Nairobi Office",
      };
    }

    return null;
  }, [formData.participantId, formData.tabletId, issuances]);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Success step
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/issuance"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Check-in Tablet</h1>
              <p className="text-gray-600">Return tablet from participant</p>
            </div>

          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > num ? 'bg-emerald-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tablet className="w-5 h-5" />
              Scan or Enter Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tablet ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.tabletId}
                    onChange={(e) => setFormData({...formData, tabletId: e.target.value})}
                    placeholder="Enter device ID"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participant ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.participantId}
                    onChange={(e) => setFormData({...formData, participantId: e.target.value})}
                    placeholder="P-1001"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {activeIssuance && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Active Issuance Found
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Participant</div>
                    <div className="font-medium">{activeIssuance.participantName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tablet Model</div>
                    <div className="font-medium">{activeIssuance.tabletModel}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Checked Out</div>
                    <div className="font-medium">
                      {new Date(activeIssuance.checkedOutAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Expected Return</div>
                    <div className="font-medium">
                      {new Date(activeIssuance.expectedReturn).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!(formData.tabletId || formData.participantId)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Condition Check
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Tablet Condition Check
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Physical Condition
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['good', 'minor', 'damaged'].map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setFormData({...formData, condition})}
                      className={`p-4 border rounded-lg text-center ${
                        formData.condition === condition
                          ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-sm font-medium ${
                        condition === 'good' ? 'text-emerald-600' :
                        condition === 'minor' ? 'text-amber-600' :
                        'text-rose-600'
                      }`}>
                        {condition === 'good' ? 'Good' :
                         condition === 'minor' ? 'Minor Issues' :
                         'Damaged'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="checkin-location" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Location
                </label>
                <select
                  id="checkin-location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Nairobi Office</option>
                  <option>Mombasa Field</option>
                  <option>Kisumu Warehouse</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes & Observations
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Note any issues, damages, or observations..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm Check-in'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center bg-white rounded-xl border border-gray-200 p-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tablet Checked In Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Tablet has been returned and marked as available
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-500">Tablet ID</div>
                  <div className="font-medium">{formData.tabletId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Condition</div>
                  <div className={`font-medium capitalize ${
                    formData.condition === 'good' ? 'text-emerald-600' :
                    formData.condition === 'minor' ? 'text-amber-600' :
                    'text-rose-600'
                  }`}>
                    {formData.condition}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Check-in Location</div>
                  <div className="font-medium">{formData.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium">{new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/issuance"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/issuance/checkin"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Check-in Another Tablet
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function CheckinPageWithSuspense() {
  return <Suspense fallback={<div className="p-8">Loading…</div>}><CheckinPage /></Suspense>;
}
