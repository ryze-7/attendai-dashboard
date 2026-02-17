'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { StatCard } from '@/components/StatCard'
import { AttendanceChart } from '@/components/AttendanceChart'
import { RecentActivity } from '@/components/RecentActivity'
import { OfflineBanner } from '@/components/OfflineBanner'
import { Users, CheckCircle2, XCircle, TrendingUp, RefreshCw, Plus } from 'lucide-react'
import { getStats, getStatus } from '@/lib/api'
import type { Stats, SystemStatus } from '@/lib/api'

export default function Dashboard() {
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [status,   setStatus]   = useState<SystemStatus | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [offline,  setOffline]  = useState(false)
  const [spinning, setSpinning] = useState(false)

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setSpinning(true)
    try {
      const [s, st] = await Promise.all([getStats(), getStatus()])
      setStats(s.data)
      setStatus(st.data)
      setOffline(false)
    } catch {
      setOffline(true)
    } finally {
      setLoading(false)
      setSpinning(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(() => load(true), 15_000)
    return () => clearInterval(id)
  }, [load])

  const isLive = status?.recognition_running ?? false

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">

          {/* Header — always visible */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-foreground/60">Real-time classroom attendance monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => load(true)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground/60"
              >
                <RefreshCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${
                offline
                  ? 'bg-red-100 text-red-500'
                  : isLive
                    ? 'bg-green-100 text-green-600'
                    : 'bg-secondary text-foreground/50'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  offline ? 'bg-red-400' : isLive ? 'bg-green-500 animate-pulse' : 'bg-foreground/30'
                }`} />
                {offline ? 'OFFLINE' : isLive ? 'LIVE' : 'IDLE'}
              </div>
            </div>
          </div>

          {/* Offline state */}
          {offline ? (
            <OfflineBanner onRetry={() => load()} retrying={loading} />
          ) : loading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 rounded-lg bg-secondary/30 animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-80 rounded-lg bg-secondary/30 animate-pulse" />
                <div className="h-80 rounded-lg bg-secondary/30 animate-pulse" />
              </div>
            </>
          ) : (
            <>
              {/* Stat Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard
                    title="Total Students"
                    value={stats.total_students}
                    icon={<Users className="w-8 h-8" />}
                    variant="default"
                  />
                  <StatCard
                    title="Present Today"
                    value={stats.present_today}
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    variant="success"
                    trend={{ value: 3, direction: 'up' }}
                  />
                  <StatCard
                    title="Absent Today"
                    value={stats.absent_today}
                    icon={<XCircle className="w-8 h-8" />}
                    variant="error"
                  />
                  <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendance_rate}%`}
                    icon={<TrendingUp className="w-8 h-8" />}
                    variant="warning"
                  />
                </div>
              )}

              {/* Chart + Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AttendanceChart />
                </div>
                <div>
                  <RecentActivity />
                </div>
              </div>

              {/* Register CTA */}
              <div className="mt-8 flex items-center justify-between bg-card border border-border rounded-lg p-5">
                <div>
                  <p className="font-semibold text-foreground">Register New Student</p>
                  <p className="text-sm text-foreground/60 mt-0.5">
                    {stats?.total_students ?? 0} students registered so far
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/students'}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Register Student
                </button>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  )
}