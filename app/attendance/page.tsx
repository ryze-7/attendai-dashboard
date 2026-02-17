'use client'

import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Clock, Download, Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import { getAttendanceToday, getAllAttendance, clearTodayAttendance, clearAllAttendance } from '@/lib/api'
import type { AttendanceRecord } from '@/lib/api'

type TimeFilter   = 'today' | 'all'
type StatusFilter = 'all' | 'present' | 'absent' | 'late'

export default function AttendancePage() {
  const [records,   setRecords]   = useState<AttendanceRecord[]>([])
  const [filtered,  setFiltered]  = useState<AttendanceRecord[]>([])
  const [search,    setSearch]    = useState('')
  const [timeF,     setTimeF]     = useState<TimeFilter>('today')
  const [statusF,   setStatusF]   = useState<StatusFilter>('all')
  const [loading,   setLoading]   = useState(true)
  const [clearModal, setClearModal] = useState<'today' | 'all' | null>(null)
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok }); setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = timeF === 'today' ? await getAttendanceToday() : await getAllAttendance()
      setRecords(res.data)
    } catch { showToast('Failed to load records', false) }
    finally { setLoading(false) }
  }, [timeF])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(records.filter(r =>
      r.name.toLowerCase().includes(q) || r.roll_number.toLowerCase().includes(q)
    ))
  }, [search, records])

  const handleClear = async () => {
    try {
      const res = clearModal === 'today' ? await clearTodayAttendance() : await clearAllAttendance()
      showToast(res.message, true)
      setClearModal(null)
      load()
    } catch { showToast('Failed to clear records', false) }
  }

  const exportCSV = () => {
    const csv = [
      'Name,Roll Number,Date,Time',
      ...filtered.map(r => {
        const { d, t } = fmtTs(r.timestamp)
        return `"${r.name}",${r.roll_number},${d},${t}`
      }),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    Object.assign(document.createElement('a'), {
      href: url,
      download: `attendance_${new Date().toISOString().split('T')[0]}.csv`,
    }).click()
    URL.revokeObjectURL(url)
    showToast('Report exported!', true)
  }

  const fmtTs = (ts: string) => {
    try {
      const dt = new Date(ts.replace(' ', 'T'))
      return {
        d: dt.toLocaleDateString('en-CA'),
        t: dt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }
    } catch { return { d: '—', t: '—' } }
  }

  const stats = {
    total:   records.length,
    present: records.length,   // all fetched records are "present"
    absent:  0,
    late:    0,
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm shadow-lg ${
          toast.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-4 h-4" />{toast.msg}
        </div>
      )}

      {/* Clear Modal */}
      {clearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-foreground">
                Clear {clearModal === 'today' ? "Today's" : 'All'} Records?
              </h3>
            </div>
            <p className="text-foreground/60 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setClearModal(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleClear} className="flex-1 bg-red-600 hover:bg-red-700">Clear</Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Attendance Records</h1>
              <p className="text-foreground/60">Track and manage student attendance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={load} className="gap-2">
                <RefreshCw className="w-4 h-4" />Refresh
              </Button>
              <Button onClick={exportCSV} className="gap-2">
                <Download className="w-4 h-4" />Export Report
              </Button>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Records', value: stats.total,   color: 'text-foreground' },
              { label: 'Present',       value: stats.present, color: 'text-green-500'  },
              { label: 'Absent',        value: stats.absent,  color: 'text-red-500'    },
              { label: 'Late',          value: stats.late,    color: 'text-yellow-500' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-foreground/60 mb-2">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Time toggle */}
          <div className="mb-4 flex gap-2">
            <Button size="sm" variant={timeF === 'today' ? 'default' : 'outline'} onClick={() => setTimeF('today')}>Today</Button>
            <Button size="sm" variant={timeF === 'all'   ? 'default' : 'outline'} onClick={() => setTimeF('all')}>All Time</Button>
          </div>

          {/* Search + status filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search by name or enrollment number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-card border-border pl-4"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['all','present','absent','late'] as StatusFilter[]).map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={statusF === f ? 'default' : 'outline'}
                  onClick={() => setStatusF(f)}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => <div key={i} className="h-14 rounded-lg bg-secondary/30 animate-pulse" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Student</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Enrollment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-foreground/40 text-sm">
                          No records found
                        </td>
                      </tr>
                    ) : filtered.map((r, i) => {
                      const { d, t } = fmtTs(r.timestamp)
                      return (
                        <tr key={i} className="border-b border-border hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{r.name}</td>
                          <td className="px-6 py-4 text-foreground/70 font-mono text-sm">{r.roll_number}</td>
                          <td className="px-6 py-4 text-foreground/70">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-foreground/40" />
                              {d} {t}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Present
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-foreground/70 font-mono text-sm">98%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="mt-4 flex items-center justify-between text-sm text-foreground/50">
            <span>Showing {filtered.length} of {records.length} records</span>
            <Button variant="outline" size="sm" onClick={() => setClearModal('today')}>
              Clear Today
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}