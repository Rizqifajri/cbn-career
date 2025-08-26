"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, User } from "lucide-react"

interface DashboardHeaderProps {
  currentView: string
}

export function DashboardHeader({ currentView }: DashboardHeaderProps) {
  const getPageTitle = () => {
    switch (currentView) {
      case "overview":
        return "Dashboard Overview"
      case "jobs":
        return "Job Listings"
      case "post-job":
        return "Post New Job"
      case "applications":
        return "Applications"
      case "analytics":
        return "Analytics"
      case "settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="bg-primary border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-primary-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-primary-foreground/70">Manage your job postings and recruitment process</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, candidates..."
                className="pl-10 w-64 bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/professional-headshot.png" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm text-primary-foreground">
                <div className="font-medium">Admin User</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
