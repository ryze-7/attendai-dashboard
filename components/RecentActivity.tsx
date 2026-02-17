'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getAttendanceToday } from '@/lib/api'
import type { AttendanceRecord } from '@/lib/api'

export function RecentActivity() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendanceToday()
      .then(res => setRecords(res.data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fmtTime = (ts: string) => {
    try {
      return new Date(ts.replace(' ', 'T'))
        .toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true })
    } catch { return '—' }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h3>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="py-10 text-center text-foreground/40 text-sm">No check-ins today yet</div>
      ) : (
        <div className="space-y-3">
          {records.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
                  <p className="text-xs text-foreground/60">Marked Present</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-foreground/50">{fmtTime(r.timestamp)}</span>
                <Badge variant="outline" className="text-xs bg-green-900/20 text-green-400 border-green-900/30">
                  98%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}