"use client";

import { useState } from "react";
import {
  Tablet, User, Calendar, MapPin, QrCode,
  ArrowLeft, Search, CheckCircle, AlertCircle,
  Users, Package, Clock, Shield
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "@/components/Layout";
import { useTabletStore } from "@/store/tabletStore";
import { mockParticipants } from "@/data/mockdata";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('qr');

  // Get data and actions from store
  const {
    participants,
    tablets,
    getAvailableTablets,
    checkoutTablet
  } = useTabletStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    participantId: qrCode || "",
    tabletId: "",
    expectedReturn: "",
    location: "Nairobi Office",
    activity: "Field Survey",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available tablets from store
  const availableTablets = getAvailableTablets();

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Use store's checkout action
    const result = checkoutTablet({
      participantId: formData.participantId,
      tabletId: formData.tabletId,
      expectedReturnDate: formData.expectedReturn,
      location: formData.location,
      activity: formData.activity,
      notes: formData.notes
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (result) {
        setStep(3); // Success step
      } else {
        alert("Failed to checkout tablet. Please check the details and try again.");
      }
    }, 1000);
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
              <h1 className="text-2xl font-bold text-gray-900">Check-out Tablet</h1>
              <p className="text-gray-600">Issue tablet to participant</p>
            </div>

          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : num}
              </div>
              {num < 3 && (
                <div className={`w-20 h-1 mx-2 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-gray-600 mb-8">
          {step === 1 && "Select Participant"}
          {step === 2 && "Select Tablet"}
          {step === 3 && "Confirmation"}
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Select Participant
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Participant ID or QR Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.participantId}
                  onChange={(e) => setFormData({ ...formData, participantId: e.target.value })}
                  placeholder="Enter participant ID"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Participant List */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Recent Participants</h4>
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  onClick={() => {
                    setFormData({ ...formData, participantId: participant.id });
                    setStep(2);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{participant.name}</div>
                        <div className="text-sm text-gray-500">ID: {participant.id}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{participant.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.participantId}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next: Select Tablet
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tablet className="w-5 h-5" />
              Select Tablet
            </h3>

            {/* Available Tablets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {availableTablets.map((tablet) => (
                <div
                  key={tablet.id}
                  onClick={() => setFormData({ ...formData, tabletId: tablet.id })}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.tabletId === tablet.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.tabletId === tablet.id ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                      <Tablet className={`w-6 h-6 ${formData.tabletId === tablet.id ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{tablet.id}</div>
                      <div className="text-sm text-gray-500">{tablet.model}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Return Date
                </label>
                <input
                  type="date"
                  value={formData.expectedReturn}
                  onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Nairobi Office</option>
                  <option>Mombasa Field</option>
                  <option>Kisumu Warehouse</option>
                  <option>Thika Field</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any additional notes..."
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
                disabled={!formData.tabletId || !formData.expectedReturn}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Check-out
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center bg-white rounded-xl border border-gray-200 p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tablet Checked Out Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Tablet {formData.tabletId} has been issued to participant {formData.participantId}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-sm text-gray-500">Tablet ID</div>
                  <div className="font-medium">{formData.tabletId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Participant</div>
                  <div className="font-medium">{formData.participantId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Expected Return</div>
                  <div className="font-medium">{formData.expectedReturn}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{formData.location}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/issuance"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
              <Link
                href="/issuance/checkout"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Check-out Another Tablet
              </Link>
            </div>
          </div>
        )}

        {/* Validation Rules */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Validation Rules Applied
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              Participant eligibility verified
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              Tablet availability confirmed
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              No duplicate issuance detected
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
