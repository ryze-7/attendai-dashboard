'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Clock, Download, Calendar, AlertCircle } from 'lucide-react'

interface AttendanceRecord {
  id: string
  student_name: string
  enrollment_number: string
  date: string
  time: string
  status: 'present' | 'absent' | 'late'
  confidence: number
}

const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    student_name: 'Arjun Sharma',
    enrollment_number: 'E001',
    date: '2025-02-17',
    time: '09:15',
    status: 'present',
    confidence: 98,
  },
  {
    id: '2',
    student_name: 'Priya Gupta',
    enrollment_number: 'E002',
    date: '2025-02-17',
    time: '09:22',
    status: 'late',
    confidence: 95,
  },
  {
    id: '3',
    student_name: 'Rahul Singh',
    enrollment_number: 'E003',
    date: '2025-02-17',
    time: '09:08',
    status: 'present',
    confidence: 99,
  },
  {
    id: '4',
    student_name: 'Neha Verma',
    enrollment_number: 'E004',
    date: '2025-02-17',
    time: '09:10',
    status: 'present',
    confidence: 97,
  },
  {
    id: '5',
    student_name: 'Vikram Patel',
    enrollment_number: 'E005',
    date: '2025-02-17',
    time: 'N/A',
    status: 'absent',
    confidence: 0,
  },
  {
    id: '6',
    student_name: 'Anjali Desai',
    enrollment_number: 'E006',
    date: '2025-02-17',
    time: '09:05',
    status: 'present',
    confidence: 96,
  },
  {
    id: '7',
    student_name: 'Rohan Kumar',
    enrollment_number: 'E007',
    date: '2025-02-17',
    time: '09:30',
    status: 'late',
    confidence: 92,
  },
  {
    id: '8',
    student_name: 'Kavya Nair',
    enrollment_number: 'E008',
    date: '2025-02-17',
    time: '09:12',
    status: 'present',
    confidence: 98,
  },
  {
    id: '9',
    student_name: 'Aditya Menon',
    enrollment_number: 'E009',
    date: '2025-02-17',
    time: '09:20',
    status: 'present',
    confidence: 97,
  },
  {
    id: '10',
    student_name: 'Shreya Iyer',
    enrollment_number: 'E010',
    date: '2025-02-17',
    time: '09:18',
    status: 'present',
    confidence: 99,
  },
]

interface ClearModal {
  isOpen: boolean
  type: 'today' | 'all' | null
}

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>(mockAttendanceData)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTime, setFilterTime] = useState<'today' | 'all'>('today')
  const [filterStatus, setFilterStatus] = useState<'all' | 'present' | 'absent' | 'late'>('all')
  const [clearModal, setClearModal] = useState<ClearModal>({ isOpen: false, type: null })

  const filteredData = attendanceData.filter((record) => {
    const matchesSearch =
      record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesTime = filterTime === 'all' || record.date === '2025-02-17' // Today's date
    return matchesSearch && matchesStatus && matchesTime
  })

  const handleClearToday = () => {
    setAttendanceData(attendanceData.filter((r) => r.date !== '2025-02-17'))
    setClearModal({ isOpen: false, type: null })
  }

  const handleClearAll = () => {
    setAttendanceData([])
    setClearModal({ isOpen: false, type: null })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-900/20 text-green-400'
      case 'absent':
        return 'bg-red-900/20 text-red-400'
      case 'late':
        return 'bg-yellow-900/20 text-yellow-400'
      default:
        return ''
    }
  }

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter((r) => r.status === 'present').length,
    absent: attendanceData.filter((r) => r.status === 'absent').length,
    late: attendanceData.filter((r) => r.status === 'late').length,
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Attendance Records
              </h1>
              <p className="text-foreground/60">
                Track and manage student attendance
              </p>
            </div>
            <Button className="w-full md:w-auto gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Present</p>
              <p className="text-2xl font-bold text-green-500">{stats.present}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Absent</p>
              <p className="text-2xl font-bold text-red-500">{stats.absent}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm text-foreground/60 mb-2">Late</p>
              <p className="text-2xl font-bold text-yellow-500">{stats.late}</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={filterTime === 'today' ? 'default' : 'outline'}
              onClick={() => setFilterTime('today')}
              size="sm"
            >
              Today
            </Button>
            <Button
              variant={filterTime === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterTime('all')}
              size="sm"
            >
              All Time
            </Button>
          </div>

          {/* Search and Status Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search by name or enrollment number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-foreground/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'present' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('present')}
                size="sm"
              >
                Present
              </Button>
              <Button
                variant={filterStatus === 'absent' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('absent')}
                size="sm"
              >
                Absent
              </Button>
              <Button
                variant={filterStatus === 'late' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('late')}
                size="sm"
              >
                Late
              </Button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Enrollment
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => (
                    <tr
                      key={record.id}
                      className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                        index % 2 === 0 ? 'bg-background/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        {record.student_name}
                      </td>
                      <td className="px-6 py-4 text-foreground/80">
                        {record.enrollment_number}
                      </td>
                      <td className="px-6 py-4 text-foreground/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-foreground/40" />
                          {record.date} {record.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-foreground/80">
                        {record.confidence > 0 ? `${record.confidence}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-4 mb-8 flex items-center justify-between">
            <div className="text-sm text-foreground/60">
              Showing {filteredData.length} of {attendanceData.length} records
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClearModal({ isOpen: true, type: 'today' })}
              >
                Clear Today
              </Button>
            </div>
          </div>

          {/* Clear Confirmation Modal */}
          {clearModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-lg p-6 max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-orange-400" />
                  <h3 className="text-lg font-semibold text-foreground">
                    Clear {clearModal.type === 'today' ? 'Today' : 'All'} Records?
                  </h3>
                </div>
                <p className="text-foreground/60 mb-6">
                  {clearModal.type === 'today'
                    ? 'Are you sure you want to clear all attendance records for today? This action cannot be undone.'
                    : 'Are you sure you want to clear all attendance records? This action cannot be undone.'}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setClearModal({ isOpen: false, type: null })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={clearModal.type === 'today' ? handleClearToday : handleClearAll}
                    className="flex-1 bg-orange-600 hover:bg-orange-700"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
