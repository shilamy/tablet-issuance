"use client";

import { useState, useEffect } from "react";
import { 
  Package, User, Tablet, Calendar, MapPin,
  ChevronLeft, Search, Filter, Download,
  AlertCircle, CheckCircle, Clock, ExternalLink
} from "lucide-react";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function ActiveIssuancesPage() {
  const [issuances, setIssuances] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Mock data
    const mockData = [
      {
        id: 'ACT-001',
        participantId: 'P-1001',
        participantName: 'John Doe',
        tabletId: 'KNBS-TAB-001',
        tabletModel: 'Samsung Galaxy Tab A8',
        checkedOutAt: '2024-01-10T10:00:00Z',
        expectedReturn: '2024-01-15T18:00:00Z',
        checkedOutBy: 'Admin User',
        location: 'Nairobi Office',
        status: 'active'
      },
      // Add more mock data...
    ];
    setIssuances(mockData);
  }, []);

  const filteredIssuances = issuances.filter(issuance => {
    if (filter === 'overdue') {
      const isOverdue = new Date(issuance.expectedReturn) < new Date();
      if (!isOverdue) return false;
    }
    
    if (!search) return true;
    
    return (
      issuance.participantName.toLowerCase().includes(search.toLowerCase()) ||
      issuance.tabletId.toLowerCase().includes(search.toLowerCase()) ||
      issuance.location.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/issuance"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Issuances</h1>
              <p className="text-gray-600">All tablets currently checked out to participants</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, tablet ID, location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Issuances</option>
              <option value="overdue">Overdue Only</option>
              <option value="nairobi">Nairobi Only</option>
              <option value="field">Field Teams Only</option>
            </select>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Issuances Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Participant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tablet</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Checked Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Expected Return</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIssuances.map((issuance) => {
                  const isOverdue = new Date(issuance.expectedReturn) < new Date();
                  
                  return (
                    <tr key={issuance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{issuance.participantName}</div>
                            <div className="text-sm text-gray-500">{issuance.participantId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Tablet className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{issuance.tabletId}</div>
                            <div className="text-sm text-gray-500">{issuance.tabletModel}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(issuance.checkedOutAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(issuance.checkedOutAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium ${
                          isOverdue ? 'text-rose-600' : 'text-gray-900'
                        }`}>
                          {new Date(issuance.expectedReturn).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${
                          isOverdue ? 'text-rose-500 font-medium' : 'text-gray-500'
                        }`}>
                          {isOverdue ? 'OVERDUE' : 'On schedule'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{issuance.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          isOverdue
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isOverdue ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/issuance/checkin?participant=${issuance.participantId}`}
                          className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                        >
                          Check-in
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Active</div>
                <div className="text-2xl font-bold text-gray-900">{issuances.length}</div>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Overdue</div>
                <div className="text-2xl font-bold text-rose-600">
                  {issuances.filter(i => new Date(i.expectedReturn) < new Date()).length}
                </div>
              </div>
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Due Today</div>
                <div className="text-2xl font-bold text-amber-600">2</div>
              </div>
              <Calendar className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Avg Duration</div>
                <div className="text-2xl font-bold text-gray-900">3.2 days</div>
              </div>
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}