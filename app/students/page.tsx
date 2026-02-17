'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { getAllStudents } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Search, Trash2, AlertCircle, Code } from 'lucide-react'

interface Student {
  id: string
  name: string
  enrollment_number: string
  photo_url?: string
}

interface DeleteModal {
  isOpen: boolean
  studentId?: string
  studentName?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<DeleteModal>({ isOpen: false })

  // Mock data for demonstration
  const mockStudents: Student[] = [
    { id: '1', name: 'Arjun Sharma', enrollment_number: 'E001' },
    { id: '2', name: 'Priya Gupta', enrollment_number: 'E002' },
    { id: '3', name: 'Rahul Singh', enrollment_number: 'E003' },
    { id: '4', name: 'Neha Verma', enrollment_number: 'E004' },
    { id: '5', name: 'Vikram Patel', enrollment_number: 'E005' },
    { id: '6', name: 'Anjali Desai', enrollment_number: 'E006' },
    { id: '7', name: 'Rohan Kumar', enrollment_number: 'E007' },
    { id: '8', name: 'Kavya Nair', enrollment_number: 'E008' },
    { id: '9', name: 'Aditya Menon', enrollment_number: 'E009' },
    { id: '10', name: 'Shreya Iyer', enrollment_number: 'E010' },
  ]

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Using mock data for demo
        setStudents(mockStudents)
        setFilteredStudents(mockStudents)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    fetchStudents()
  }, [])

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [searchTerm, students])

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, studentId: id, studentName: name })
  }

  const handleDeleteConfirm = () => {
    if (deleteModal.studentId) {
      setStudents(students.filter((s) => s.id !== deleteModal.studentId))
      setDeleteModal({ isOpen: false })
    }
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
                Students
              </h1>
              <p className="text-foreground/60">
                Manage classroom students and their enrollment
              </p>
            </div>
            <Button className="w-full md:w-auto gap-2">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <Input
              type="text"
              placeholder="Search by name or enrollment number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-foreground/40"
            />
          </div>

          {/* Students Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Enrollment Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`border-b border-border hover:bg-secondary/20 transition-colors ${
                        index % 2 === 0 ? 'bg-background/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {student.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">
                            {student.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground/80">
                        {student.enrollment_number}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDeleteClick(student.id, student.name)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground/60 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Info */}
          <div className="mt-4 flex items-center justify-between text-sm text-foreground/60">
            <span>
              Showing {filteredStudents.length} of {students.length} students
            </span>
          </div>

          {/* Registration Info Card */}
          <div className="mt-8 bg-blue-900/20 border border-blue-900/30 rounded-lg p-6">
            <div className="flex gap-4">
              <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-300 mb-3">Register Students via SSH</h4>
                <p className="text-sm text-blue-200/80 mb-3">
                  Connect to the Raspberry Pi and use the following commands to register students:
                </p>
                <div className="bg-black/30 rounded p-3 font-mono text-xs text-green-400 space-y-2">
                  <div>ssh pi@192.168.1.17</div>
                  <div>python3 /home/pi/attendance/register_student.py</div>
                  <div>{'# Follow prompts to add student name and capture face images'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-lg p-6 max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-foreground">Delete Student</h3>
                </div>
                <p className="text-foreground/60 mb-6">
                  Are you sure you want to delete <strong>{deleteModal.studentName}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModal({ isOpen: false })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Delete
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
