"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

interface Application {
  _id: string
  company: string
  position: string
  status: string
  appliedDate: string
  logo?: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  // Role-based access control
  if (user && user.role !== "jobseeker" && user.role !== "volunteer") {
    if (typeof window !== "undefined") window.location.href = "/dashboard/" + user.role;
    return null;
  }
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return
      setLoading(true)
      const res = await fetch("/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const normalized = (data.data || []).map((a: any) => ({
        _id: a._id,
        company: a.job?.company?.name || a.job?.company || "",
        position: a.job?.title || "",
        status: a.status || "Application Sent",
        appliedDate: new Date(a.createdAt).toLocaleDateString(),
        logo: a.job?.logo,
      }))
      setApplications(normalized)
      setLoading(false)
    }
    fetchApplications()
  }, [token])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Interview Scheduled":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Application Sent":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.firstName}! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your job search today.</p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8"><LoadingSpinner /></div>
                ) : applications.length === 0 ? (
                  <div>No applications found.</div>
                ) : (
                  <ul className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <li key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{app.logo || "💼"}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{app.position}</h4>
                            <p className="text-sm text-gray-600">{app.company}</p>
                            <p className="text-xs text-gray-500">Applied on {app.appliedDate}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
                <Button variant="outline" className="w-full bg-transparent mt-4">
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8"><LoadingSpinner /></div>
                ) : applications.length === 0 ? (
                  <div>No applications found.</div>
                ) : (
                  <ul className="space-y-4">
                    {applications.map((app) => (
                      <li key={app._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{app.logo || "💼"}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{app.position}</h4>
                            <p className="text-sm text-gray-600">{app.company}</p>
                            <p className="text-xs text-gray-500">Applied on {app.appliedDate}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
