'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  ClipboardList, 
  Zap, 
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
    },
    {
      name: 'Students',
      href: '/students',
      icon: Users,
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: ClipboardList,
    },
    {
      name: 'Control Panel',
      href: '/control',
      icon: Zap,
    },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/' && pathname.startsWith(href))
  }

  const NavLink = ({ item }: { item: typeof navigationItems[0] }) => {
    const Icon = item.icon
    const active = isActive(item.href)
    
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
          active
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
        )}
        onClick={() => setIsMobileOpen(false)}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-sidebar md:border-r md:border-sidebar-border md:flex md:flex-col md:py-6 md:px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-sidebar-primary">AttendAI</h1>
          <p className="text-sidebar-foreground/60 text-xs mt-1">Classroom Attendance</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navigationItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="text-sidebar-foreground/40 text-xs px-4">
            Connected to Raspberry Pi 5 • Face Recognition Active
          </p>
        </div>
      </aside>

      {/* Mobile Sidebar - Overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col py-6 px-4 z-40">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-sidebar-primary">AttendAI</h1>
              <p className="text-sidebar-foreground/60 text-xs mt-1">Classroom Attendance</p>
            </div>

            <nav className="flex-1 space-y-2">
              {navigationItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>

            <div className="pt-4 border-t border-sidebar-border">
              <p className="text-sidebar-foreground/40 text-xs px-4">
                Connected to Raspberry Pi 5 • Face Recognition Active
              </p>
            </div>
          </aside>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex justify-around py-2 z-30">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded transition-colors',
                active
                  ? 'text-primary'
                  : 'text-foreground/50 hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
