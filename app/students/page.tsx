'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getStudents, deleteStudent } from '@/lib/api'
import type { Student } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Trash2, AlertCircle, Code, RefreshCw } from 'lucide-react'

const AVATAR_COLORS = [
  'bg-blue-500','bg-purple-500','bg-cyan-500',
  'bg-emerald-500','bg-rose-500','bg-amber-500','bg-pink-500',
]

export default function StudentsPage() {
  const [students,  setStudents]  = useState<Student[]>([])
  const [filtered,  setFiltered]  = useState<Student[]>([])
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(true)
  const [deleting,  setDeleting]  = useState<string | null>(null)
  const [modal,     setModal]     = useState<Student | null>(null)
  const [toast,     setToast]     = useState<{ msg: string; ok: boolean } | null>(null)

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getStudents()
      setStudents(res.data)
      setFiltered(res.data)
    } catch { showToast('Failed to load students', false) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.roll_number.toLowerCase().includes(q)
    ))
  }, [search, students])

  const handleDelete = async () => {
    if (!modal) return
    setDeleting(modal.roll_number)
    try {
      await deleteStudent(modal.roll_number)
      showToast(`${modal.name} removed successfully`, true)
      setModal(null)
      load()
    } catch { showToast('Failed to delete student', false) }
    finally { setDeleting(null) }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm shadow-lg ${
          toast.ok
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-4 h-4" />{toast.msg}
        </div>
      )}

      {/* Delete Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-foreground">Delete Student</h3>
            </div>
            <p className="text-foreground/60 mb-6">
              Are you sure you want to delete <strong>{modal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setModal(null)} className="flex-1">Cancel</Button>
              <Button
                onClick={handleDelete}
                disabled={!!deleting}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">

          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Students</h1>
              <p className="text-foreground/60">Manage classroom students and their enrollment</p>
            </div>
            <Button variant="outline" onClick={load} className="w-full md:w-auto gap-2">
              <RefreshCw className="w-4 h-4" />Refresh
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              placeholder="Search by name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-secondary/30 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Enrollment Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-foreground/40 text-sm">
                          No students found
                        </td>
                      </tr>
                    ) : filtered.map((s, i) => (
                      <tr key={s.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                              {s.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground/70 font-mono text-sm">{s.roll_number}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setModal(s)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-foreground/40 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-foreground/50">
            Showing {filtered.length} of {students.length} students
          </div>

          {/* Register hint */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex gap-4">
              <Code className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-700 mb-2">Register Students via SSH</h4>
                <p className="text-sm text-blue-600/80 mb-3">
                  Connect to the Raspberry Pi and run:
                </p>
                <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-green-400 space-y-1">
                  <div>cd ~/Documents/attendance_system</div>
                  <div>source venv/bin/activate</div>
                  <div>python3 main.py <span className="text-slate-500"># Choose option 2</span></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}