'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    date: 'Mon',
    present: 28,
    absent: 2,
    late: 0,
  },
  {
    date: 'Tue',
    present: 29,
    absent: 1,
    late: 0,
  },
  {
    date: 'Wed',
    present: 27,
    absent: 1,
    late: 2,
  },
  {
    date: 'Thu',
    present: 30,
    absent: 0,
    late: 0,
  },
  {
    date: 'Fri',
    present: 25,
    absent: 3,
    late: 2,
  },
]

export function AttendanceChart() {
  return (
    <div className="w-full bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111729',
              border: '1px solid #1e293b',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e8eaed' }}
          />
          <Legend />
          <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
          <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
          <Bar dataKey="late" fill="#f59e0b" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
