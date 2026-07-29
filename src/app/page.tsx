import Link from "next/link";
import {
  Tablet,
  Shield,
  BarChart3,
  Users,
  CheckCircle,
  ArrowRight,
  Activity,
  MapPin
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-knbs-50/50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-knbs-950/20">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-KNBS.png" alt="KNBS Logo" className="w-10 h-10 object-contain rounded-xl shadow-lg shadow-knbs-500/20 bg-white p-1" />
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-gray-100">TabletTrack</h1>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">KNBS Digital Asset Management</p>
            </div>
          </div>
          <Link
            href="/auth/login"
            className="px-6 py-2.5 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-knbs-500/30 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
          >
            Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-knbs-50 dark:bg-knbs-950/20 border border-knbs-200 dark:border-knbs-900 rounded-full">
              <div className="w-2 h-2 bg-knbs-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-knbs-700 dark:text-knbs-400 uppercase tracking-widest">Kenya National Bureau of Statistics</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-gray-100 leading-tight tracking-tight">
              Streamline Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-knbs-600 to-knbs-500">
                Tablet Issuance
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              Comprehensive digital platform for managing tablet assignments, tracking field operations,
              and ensuring accountability across all KNBS surveys and census activities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-gradient-to-r from-knbs-500 to-knbs-600 text-white rounded-2xl text-base font-bold hover:shadow-xl hover:shadow-knbs-500/30 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/request-tablets"
                className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-knbs-500 dark:border-knbs-400 text-knbs-600 dark:text-knbs-400 rounded-2xl text-base font-bold hover:bg-knbs-50 dark:hover:bg-knbs-950/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Request Tablets
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl text-base font-bold hover:border-knbs-500 dark:hover:border-knbs-400 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Register as Field Staff
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Secure Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time monitoring of all tablet assignments and returns</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all group mt-8">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Bulk Issuance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approve and release tablets to field staff efficiently</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive insights into device utilization</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl transition-all group mt-8">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-knbs-600 dark:text-knbs-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Activity Logs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete audit trail of all system events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">5,000+</p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tablets Managed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">47</p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Counties Covered</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">10+</p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Surveys</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">99.9%</p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-knbs-600 to-knbs-500 rounded-3xl p-12 lg:p-16 text-center shadow-2xl shadow-knbs-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-knbs-100 mb-8 max-w-2xl mx-auto">
              Join the digital transformation of Kenya&apos;s statistical operations.
              Login to access the dashboard or register as field staff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-8 py-4 bg-white text-knbs-600 rounded-2xl text-base font-bold hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
              >
                Login to Dashboard
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-knbs-700 text-white rounded-2xl text-base font-bold hover:bg-knbs-800 hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">

              <img src="/logo-KNBS.png" alt="KNBS Logo" className="w-8 h-8 object-contain rounded-lg bg-white p-0.5" />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">TabletTrack</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">KNBS © 2026</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Kenya National Bureau of Statistics - Digital Asset Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
