"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Briefcase, Users, BarChart3, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react"

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  jobCount: number
}

export function DashboardSidebar({ currentView, onViewChange, jobCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: LayoutDashboard,
      count: null,
    },
    {
      id: "jobs",
      label: "Job Listings",
      icon: Briefcase,
      count: jobCount,
    },
    {
      id: "post-job",
      label: "Post New Job",
      icon: Plus,
      count: null,
    },
    {
      id: "applications",
      label: "Applications",
      icon: Users,
      count: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      count: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      count: null,
    },
  ]

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-serif font-bold text-sidebar-foreground">JobBoard</h2>
              <p className="text-sm text-sidebar-foreground/70">Admin Dashboard</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2",
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== null && (
                    <span className="bg-sidebar-accent text-sidebar-accent-foreground text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && <div className="text-xs text-sidebar-foreground/50">© 2024 JobBoard Dashboard</div>}
      </div>
    </div>
  )
}
