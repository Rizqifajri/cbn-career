"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Users, Eye, TrendingUp } from "lucide-react"

interface DashboardOverviewProps {
  jobCount: number
}

export function DashboardOverview({ jobCount }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Active Jobs",
      value: jobCount.toString(),
      icon: Briefcase,
      change: "+2 this week",
      changeType: "positive" as const,
    },
    {
      title: "Total Applications",
      value: "127",
      icon: Users,
      change: "+15 this week",
      changeType: "positive" as const,
    },
    {
      title: "Job Views",
      value: "2,847",
      icon: Eye,
      change: "+12% this month",
      changeType: "positive" as const,
    },
    {
      title: "Hire Rate",
      value: "23%",
      icon: TrendingUp,
      change: "+3% this month",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-accent">{stat.change}</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Video Editor</p>
                  <p className="text-sm text-muted-foreground">Cretivox • Jakarta</p>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Jr. Graphic Designer</p>
                  <p className="text-sm text-muted-foreground">OGS • Jakarta</p>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-card-foreground">Software Engineer</p>
                  <p className="text-sm text-muted-foreground">Condfe • Jakarta</p>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-muted-foreground">Post a new job</p>
                <p className="text-sm text-muted-foreground">Create and publish job listings</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-muted-foreground">Review applications</p>
                <p className="text-sm text-muted-foreground">Check pending candidate applications</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-muted-foreground">View analytics</p>
                <p className="text-sm text-muted-foreground">Track job performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
