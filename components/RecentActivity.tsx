import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

const activities = [
  {
    id: '1',
    student: 'Arjun Sharma',
    action: 'Marked Present',
    time: '09:15 AM',
    confidence: '98%',
    status: 'present' as const,
  },
  {
    id: '2',
    student: 'Priya Gupta',
    action: 'Marked Late',
    time: '09:22 AM',
    confidence: '95%',
    status: 'late' as const,
  },
  {
    id: '3',
    student: 'Rahul Singh',
    action: 'Marked Present',
    time: '09:08 AM',
    confidence: '99%',
    status: 'present' as const,
  },
  {
    id: '4',
    student: 'Neha Verma',
    action: 'Marked Present',
    time: '09:10 AM',
    confidence: '97%',
    status: 'present' as const,
  },
  {
    id: '5',
    student: 'Vikram Patel',
    action: 'Marked Absent',
    time: '09:30 AM',
    confidence: 'N/A',
    status: 'absent' as const,
  },
]

export function RecentActivity() {
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
      case 'absent':
        return 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
      case 'late':
        return 'bg-yellow-900/20 text-yellow-400 hover:bg-yellow-900/30'
      default:
        return ''
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {getStatusIcon(activity.status)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.student}
                </p>
                <p className="text-xs text-foreground/60">{activity.action}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground/50 whitespace-nowrap">
                {activity.time}
              </span>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusBadgeColor(activity.status)}`}
              >
                {activity.confidence}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
