const PI_API_BASE = 'http://192.168.1.17:5000'

// Types for API responses
export interface AttendanceRecord {
  id: string
  student_id: string
  student_name: string
  timestamp: string
  status: 'present' | 'absent' | 'late'
  confidence: number
}

export interface Student {
  id: string
  name: string
  enrollment_number: string
  photo_url?: string
}

export interface ClassSession {
  id: string
  date: string
  start_time: string
  end_time?: string
  total_students: number
  present_count: number
  absent_count: number
  late_count: number
}

export interface SystemStatus {
  pi_online: boolean
  camera_active: boolean
  led_status: 'on' | 'off'
  buzzer_status: 'on' | 'off'
  face_recognition_active: boolean
  last_detection: string | null
  connected_students: number
}

// Dashboard API calls
export async function getDashboardStats() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch stats')
    return await res.json()
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

export async function getTodayAttendance() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/attendance/today`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch today attendance')
    return await res.json() as AttendanceRecord[]
  } catch (error) {
    console.error('Error fetching today attendance:', error)
    return []
  }
}

// Students API calls
export async function getAllStudents() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/students`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch students')
    return await res.json() as Student[]
  } catch (error) {
    console.error('Error fetching students:', error)
    return []
  }
}

export async function getStudentAttendance(studentId: string) {
  try {
    const res = await fetch(`${PI_API_BASE}/api/students/${studentId}/attendance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch student attendance')
    return await res.json() as AttendanceRecord[]
  } catch (error) {
    console.error('Error fetching student attendance:', error)
    return []
  }
}

export async function addStudent(student: Omit<Student, 'id'>) {
  try {
    const res = await fetch(`${PI_API_BASE}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    })
    if (!res.ok) throw new Error('Failed to add student')
    return await res.json()
  } catch (error) {
    console.error('Error adding student:', error)
    return null
  }
}

// Attendance API calls
export async function getAttendanceHistory(
  startDate?: string,
  endDate?: string
) {
  try {
    const params = new URLSearchParams()
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    const res = await fetch(`${PI_API_BASE}/api/attendance?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch attendance history')
    return await res.json() as AttendanceRecord[]
  } catch (error) {
    console.error('Error fetching attendance history:', error)
    return []
  }
}

export async function getClassSessions() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/sessions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch sessions')
    return await res.json() as ClassSession[]
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return []
  }
}

// Control Panel API calls
export async function getSystemStatus() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to fetch system status')
    return await res.json() as SystemStatus
  } catch (error) {
    console.error('Error fetching system status:', error)
    return null
  }
}

export async function controlLED(state: 'on' | 'off') {
  try {
    const res = await fetch(`${PI_API_BASE}/api/control/led`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    })
    if (!res.ok) throw new Error('Failed to control LED')
    return await res.json()
  } catch (error) {
    console.error('Error controlling LED:', error)
    return null
  }
}

export async function controlBuzzer(state: 'on' | 'off') {
  try {
    const res = await fetch(`${PI_API_BASE}/api/control/buzzer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state }),
    })
    if (!res.ok) throw new Error('Failed to control buzzer')
    return await res.json()
  } catch (error) {
    console.error('Error controlling buzzer:', error)
    return null
  }
}

export async function startFaceRecognition() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/control/face-recognition/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to start face recognition')
    return await res.json()
  } catch (error) {
    console.error('Error starting face recognition:', error)
    return null
  }
}

export async function stopFaceRecognition() {
  try {
    const res = await fetch(`${PI_API_BASE}/api/control/face-recognition/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to stop face recognition')
    return await res.json()
  } catch (error) {
    console.error('Error stopping face recognition:', error)
    return null
  }
}
