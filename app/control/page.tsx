'use client'

import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, Copy, Code, Trash2, RefreshCw } from 'lucide-react'
import { getStatus, startRecognition, stopRecognition, clearAllAttendance } from '@/lib/api'
import type { SystemStatus } from '@/lib/api'

const SSH_CMDS = [
  'ssh pi@192.168.1.17',
  'python3 /home/pi/attendance/main.py',
  'systemctl status attendai',
  'tail -f /home/pi/attendance/logs/app.log',
]

export default function ControlPanel() {
  const [status,  setStatus]  = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy,    setBusy]    = useState(false)
  const [modal,   setModal]   = useState(false)
  const [copied,  setCopied]  = useState<number | null>(null)
  const [toast,   setToast]   = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok }); setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    try {
      const res = await getStatus()
      setStatus(res.data)
    } catch { /* Pi offline */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [load])

  const handleStart = async () => {
    setBusy(true)
    try { const r = await startRecognition(); showToast(r.message, true); load() }
    catch (e: any) { showToast(e.message || 'Failed to start', false) }
    finally { setBusy(false) }
  }

  const handleStop = async () => {
    setBusy(true)
    try { const r = await stopRecognition(); showToast(r.message, true); load() }
    catch (e: any) { showToast(e.message || 'Failed to stop', false) }
    finally { setBusy(false) }
  }

  const handleClearAll = async () => {
    try { const r = await clearAllAttendance(); showToast(r.message, true); setModal(false) }
    catch { showToast('Failed to clear', false) }
  }

  const copy = (cmd: string, i: number) => {
    navigator.clipboard.writeText(cmd)
    setCopied(i); setTimeout(() => setCopied(null), 2000)
  }

  const running = status?.recognition_running

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
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-foreground">Clear All Records?</h3>
            </div>
            <p className="text-foreground/60 mb-6">
              Permanently delete all attendance records. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleClearAll} className="flex-1 bg-red-600 hover:bg-red-700">Clear All</Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">

          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">System Control Panel</h1>
              <p className="text-foreground/60">Monitor and control Raspberry Pi 5 components</p>
            </div>
            <Button variant="outline" onClick={load} className="gap-2">
              <RefreshCw className="w-4 h-4" />Refresh
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {loading ? [...Array(3)].map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-secondary/30 animate-pulse" />
            )) : [
              { label: 'Pi Connection',    ok: true },
              { label: 'Camera',           ok: status?.camera_connected  ?? false },
              { label: 'Face Recognition', ok: status?.recognition_running ?? false },
            ].map(c => (
              <div key={c.label} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
                {c.ok
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  : <AlertCircle  className="w-5 h-5 text-red-400 flex-shrink-0" />
                }
                <div>
                  <p className="text-sm text-foreground/60">Status</p>
                  <p className={`font-semibold ${c.ok ? 'text-green-500' : 'text-red-400'}`}>
                    {c.ok ? 'Connected' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Face Recognition Engine */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Face Recognition Engine</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/60 mb-1">Control the face recognition system</p>
                <p className={`font-semibold ${running ? 'text-green-500' : 'text-foreground/50'}`}>
                  {running ? '● Running' : '○ Stopped'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleStart}
                  disabled={busy || !!running}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  {busy && !running ? 'Starting...' : 'Start'}
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={busy || !running}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  {busy && running ? 'Stopping...' : 'Stop'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">System Information</h2>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-lg bg-secondary/30 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: status?.total_students ?? '—', color: 'text-foreground' },
                  { label: 'Present Today',  value: status?.present_today  ?? '—', color: 'text-green-500' },
                  { label: 'API Port',       value: '5000',                         color: 'text-foreground' },
                  { label: 'Last Ping',      value: status?.timestamp?.split(' ')[1]?.slice(0,5) ?? '—', color: 'text-foreground' },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-sm text-foreground/60 mb-2">{s.label}</p>
                    <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SSH Commands */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />SSH Quick Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SSH_CMDS.map((cmd, i) => (
                <div key={i} className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400 flex items-center justify-between">
                  <span>{cmd}</span>
                  <button
                    onClick={() => copy(cmd, i)}
                    className="ml-2 p-1 hover:bg-green-400/20 rounded transition-colors text-green-400/70 hover:text-green-400"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600/80 mb-4">Clear all attendance records. This action cannot be undone.</p>
            <Button onClick={() => setModal(true)} className="bg-red-600 hover:bg-red-700 gap-2" size="sm">
              <Trash2 className="w-4 h-4" />Clear All Attendance
            </Button>
          </div>

        </div>
      </main>
    </div>
  )
}