'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { StatCard } from '@/components/StatCard'
import { AttendanceChart } from '@/components/AttendanceChart'
import { RecentActivity } from '@/components/RecentActivity'
import { Users, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { getDashboardStats, getTodayAttendance } from '@/lib/api'

interface DashboardData {
  total_students: number
  present_today: number
  absent_today: number
  attendance_rate: number
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API data while actual Raspberry Pi integration is being set up
        const data: DashboardData = {
          total_students: 30,
          present_today: 28,
          absent_today: 2,
          attendance_rate: 93,
        }
        setDashboardData(data)
        setIsLive(true)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setIsLive(false)
      }
    }

    // Initial fetch
    fetchData()

    // Set up 15-second auto-refresh
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Dashboard
              </h1>
              <p className="text-foreground/60">
                Real-time classroom attendance monitoring
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${isLive ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {isLive ? 'LIVE' : 'OFFLINE'}
            </div>
          </div>

          {/* Stats Grid */}
          {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Students"
                value={dashboardData.total_students}
                icon={<Users className="w-8 h-8" />}
                variant="default"
              />
              <StatCard
                title="Present Today"
                value={dashboardData.present_today}
                icon={<CheckCircle2 className="w-8 h-8" />}
                variant="success"
              />
              <StatCard
                title="Absent Today"
                value={dashboardData.absent_today}
                icon={<XCircle className="w-8 h-8" />}
                variant="error"
              />
              <StatCard
                title="Attendance Rate"
                value={`${dashboardData.attendance_rate}%`}
                icon={<Clock className="w-8 h-8" />}
                variant="warning"
              />
            </div>
          )}

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AttendanceChart />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
