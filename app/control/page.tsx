'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { 
  Wifi, 
  Camera, 
  Volume2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Code,
  Trash2
} from 'lucide-react'

interface ClearModal {
  isOpen: boolean
}

export default function ControlPanel() {
  const [faceRecognitionActive, setFaceRecognitionActive] = useState(true)
  const [recognitionLoading, setRecognitionLoading] = useState(false)
  const [clearModal, setClearModal] = useState<ClearModal>({ isOpen: false })

  const systemStatus = {
    recognition_running: faceRecognitionActive,
    camera_connected: true,
    arduino_connected: true,
    total_students: 30,
    present_today: 28,
    api_port: 5000,
    last_ping: '2 seconds ago'
  }

  const handleFaceRecognitionStart = async () => {
    setRecognitionLoading(true)
    // Simulate API call
    setTimeout(() => {
      setFaceRecognitionActive(true)
      setRecognitionLoading(false)
    }, 1000)
  }

  const handleFaceRecognitionStop = async () => {
    setRecognitionLoading(true)
    // Simulate API call
    setTimeout(() => {
      setFaceRecognitionActive(false)
      setRecognitionLoading(false)
    }, 1000)
  }

  const handleClearAllAttendance = () => {
    // API call to clear all attendance
    setClearModal({ isOpen: false })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const StatusCard = ({ label, isActive }: { label: string; isActive: boolean }) => (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3">
        {isActive ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
        <div>
          <p className="text-sm text-foreground/60">Status</p>
          <p className={`font-semibold ${isActive ? 'text-green-400' : 'text-red-400'}`}>
            {isActive ? 'Connected' : 'Offline'}
          </p>
        </div>
      </div>
    </div>
  )

  const CodeBlock = ({ command }: { command: string }) => (
    <div className="bg-black/30 rounded p-3 font-mono text-xs text-green-400 flex items-center justify-between">
      <span>{command}</span>
      <button
        onClick={() => copyToClipboard(command)}
        className="ml-2 p-1 hover:bg-green-400/20 rounded transition-colors"
      >
        <Copy className="w-4 h-4" />
      </button>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              System Control Panel
            </h1>
            <p className="text-foreground/60">
              Monitor and control Raspberry Pi 5 components
            </p>
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatusCard label="Face Recognition" isActive={systemStatus.recognition_running} />
            <StatusCard label="Camera" isActive={systemStatus.camera_connected} />
            <StatusCard label="Arduino" isActive={systemStatus.arduino_connected} />
          </div>

          {/* Face Recognition Control */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Face Recognition Engine</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-foreground/60 mb-1">Control the face recognition system</p>
                <p className={`font-semibold ${systemStatus.recognition_running ? 'text-green-400' : 'text-red-400'}`}>
                  {systemStatus.recognition_running ? 'Running' : 'Stopped'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleFaceRecognitionStart}
                  disabled={systemStatus.recognition_running || recognitionLoading}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  {recognitionLoading ? 'Starting...' : 'Start'}
                </Button>
                <Button
                  onClick={handleFaceRecognitionStop}
                  disabled={!systemStatus.recognition_running || recognitionLoading}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  {recognitionLoading ? 'Stopping...' : 'Stop'}
                </Button>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">System Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{systemStatus.total_students}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-2">Present Today</p>
                <p className="text-2xl font-bold text-green-400">{systemStatus.present_today}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-2">API Port</p>
                <p className="text-2xl font-bold text-foreground">{systemStatus.api_port}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-2">Last Ping</p>
                <p className="text-sm font-medium text-foreground">{systemStatus.last_ping}</p>
              </div>
            </div>
          </div>

          {/* SSH Quick Commands */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Code className="w-5 h-5" />
              SSH Quick Commands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CodeBlock command="ssh pi@192.168.1.17" />
              <CodeBlock command="python3 /home/pi/attendance/main.py" />
              <CodeBlock command="systemctl status attendai" />
              <CodeBlock command="tail -f /home/pi/attendance/logs/app.log" />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-200/80 mb-4">
              Clear all attendance records. This action cannot be undone.
            </p>
            <Button
              onClick={() => setClearModal({ isOpen: true })}
              className="bg-red-600 hover:bg-red-700 gap-2"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Attendance
            </Button>
          </div>

          {/* Clear Confirmation Modal */}
          {clearModal.isOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card border border-border rounded-lg p-6 max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-foreground">Clear All Records?</h3>
                </div>
                <p className="text-foreground/60 mb-6">
                  Are you sure you want to permanently delete all attendance records? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setClearModal({ isOpen: false })}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClearAllAttendance}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Clear All
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
