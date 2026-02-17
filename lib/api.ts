const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://ryze07.local:5000'

export interface Student {
  id: number
  name: string
  roll_number: string
}

export interface AttendanceRecord {
  name: string
  roll_number: string
  timestamp: string
}

export interface Stats {
  total_students: number
  present_today: number
  absent_today: number
  attendance_rate: number
  weekly_data: { date: string; count: number }[]
}

export interface SystemStatus {
  recognition_running: boolean
  camera_connected: boolean
  arduino_connected: boolean
  total_students: number
  present_today: number
  timestamp: string
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(5000) })
  const d = await r.json()
  if (!d.success) throw new Error(d.error || 'API error')
  return d
}

async function del<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    signal: AbortSignal.timeout(5000),
  })
  const d = await r.json()
  if (!d.success) throw new Error(d.error || 'API error')
  return d
}

async function post<T>(path: string, body?: object): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(5000),
  })
  const d = await r.json()
  if (!d.success) throw new Error(d.error || 'API error')
  return d
}

export const getStatus            = () => get<{ data: SystemStatus }>('/api/status')
export const getStats             = () => get<{ data: Stats }>('/api/stats')
export const getStudents          = () => get<{ data: Student[] }>('/api/students')
export const deleteStudent        = (roll: string) => del<{ message: string }>(`/api/students/${roll}`)
export const getAttendanceToday   = () => get<{ data: AttendanceRecord[] }>('/api/attendance/today')
export const getAllAttendance      = () => get<{ data: AttendanceRecord[] }>('/api/attendance/all')
export const clearTodayAttendance = () => del<{ message: string }>('/api/attendance/clear/today')
export const clearAllAttendance   = () => del<{ message: string }>('/api/attendance/clear/all')
export const startRecognition     = () => post<{ message: string }>('/api/recognition/start')
export const stopRecognition      = () => post<{ message: string }>('/api/recognition/stop')
export const registerStudent      = (name: string, roll_number: string) =>
  post<{ message: string; data: Student }>('/api/students', { name, roll_number })