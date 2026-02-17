'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getStats } from '@/lib/api'

interface ChartRow { day: string; present: number; absent: number; late: number }

export function AttendanceChart() {
  const [data, setData] = useState<ChartRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
      .then(res => {
        const rows = res.data.weekly_data.slice().reverse().map(d => ({
          day: new Date(d.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }),
          present: d.count,
          absent: Math.max(0, res.data.total_students - d.count),
          late: 0,
        }))
        setData(rows)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Attendance</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-foreground/40 text-sm">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-foreground/40 text-sm">
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="present" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="absent"  fill="#ef4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="late"    fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}