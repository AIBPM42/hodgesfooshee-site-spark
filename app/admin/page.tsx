"use client";

import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="glass-card max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">Please login to continue</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Go to Login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {profile.first_name || profile.email}!
          </h1>
          <p className="text-gray-300">
            Role: <span className="text-hf-orange font-semibold">{profile.role}</span> |
            Status: <span className="text-green-400 font-semibold">{profile.status}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <h3 className="text-xl font-semibold text-white mb-1">Agents</h3>
              <p className="text-3xl font-bold text-hf-orange">0</p>
              <p className="text-gray-400 text-sm">Active agents</p>
            </div>
          </Card>

          <Card className="glass-card">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-xl font-semibold text-white mb-1">Pending</h3>
              <p className="text-3xl font-bold text-yellow-400">0</p>
              <p className="text-gray-400 text-sm">Applications</p>
            </div>
          </Card>

          <Card className="glass-card">
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <h3 className="text-xl font-semibold text-white mb-1">Open Houses</h3>
              <p className="text-3xl font-bold text-green-400">0</p>
              <p className="text-gray-400 text-sm">Scheduled</p>
            </div>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Super Admin / Broker Only */}
          {(profile.role === 'super_admin' || profile.role === 'broker') && (
            <>
              <Link href="/admin/agents/pending">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">⏳</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Pending Agents</h3>
                      <p className="text-gray-400 text-sm">Review & approve applications</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/agents">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">👥</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Manage Agents</h3>
                      <p className="text-gray-400 text-sm">View all active agents</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/content">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">✏️</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Edit Content</h3>
                      <p className="text-gray-400 text-sm">Manage homepage & blog</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/analytics">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">📊</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Analytics</h3>
                      <p className="text-gray-400 text-sm">View site metrics</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </>
          )}

          {/* Agent Only */}
          {profile.role === 'agent' && (
            <>
              <Link href="/admin/open-houses">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">🏠</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">My Open Houses</h3>
                      <p className="text-gray-400 text-sm">Create & manage events</p>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/leads">
                <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-5xl">📋</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">My Leads</h3>
                      <p className="text-gray-400 text-sm">Manage your contacts</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </>
          )}

          {/* All Users */}
          <Link href="/admin/profile">
            <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">⚙️</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
                  <p className="text-gray-400 text-sm">Update your information</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/">
            <Card className="glass-card hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">🏡</div>
                <div>
                  <h3 className="text-xl font-semibold text-white">View Site</h3>
                  <p className="text-gray-400 text-sm">Go to public homepage</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Sign Out Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
