'use client'

import { WifiOff, RefreshCw } from 'lucide-react'

interface Props {
  onRetry: () => void
  retrying?: boolean
}

export function OfflineBanner({ onRetry, retrying }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-9 h-9 text-red-400" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Raspberry Pi Offline
        </h2>
        <p className="text-foreground/60 text-sm mb-1">
          Cannot reach the attendance server at
        </p>
        <code className="text-xs bg-secondary px-2 py-1 rounded font-mono text-foreground/70">
          192.168.1.17:5000
        </code>

        {/* Steps */}
        <div className="mt-6 bg-card border border-border rounded-lg p-4 text-left space-y-2">
          <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-3">
            To fix this:
          </p>
          {[
            'Make sure the Pi is powered on',
            'Connect to the same WiFi network',
            'SSH in and run: python3 api.py',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-foreground/70">{step}</p>
            </div>
          ))}
          <div className="mt-3 bg-slate-900 rounded px-3 py-2 font-mono text-xs text-green-400">
            ssh ryze07@192.168.1.17<br />
            cd ~/Documents/attendance_system<br />
            source venv/bin/activate<br />
            python3 api.py
          </div>
        </div>

        {/* Retry */}
        <button
          onClick={onRetry}
          disabled={retrying}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors mx-auto"
        >
          <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
          {retrying ? 'Retrying...' : 'Retry Connection'}
        </button>
      </div>
    </div>
  )
}