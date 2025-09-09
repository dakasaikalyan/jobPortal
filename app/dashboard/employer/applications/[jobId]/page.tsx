"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"
import { useAuth } from "@/components/AuthContext"
import { ArrowLeft, User, Mail, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"

interface Application {
  _id: string
  applicant: {
    _id: string
    firstName: string
    lastName: string
    email: string
    resume?: string
  }
  job: {
    _id: string
    title: string
    company: { name: string }
  }
  status: "pending" | "reviewing" | "shortlisted" | "interview-scheduled" | "hired" | "rejected"
  appliedAt: string
  coverLetter?: string
}

interface Job {
  _id: string
  title: string
  company: { name: string }
  location: string
  jobType: string
}

export default function JobApplicationsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const { showToast } = useToast()
  
  const [applications, setApplications] = useState<Application[]>([])
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (params.jobId) {
      fetchJobDetails()
      if (token) {
        fetchApplications()
      }
    }
  }, [params.jobId, token])

  const fetchApplications = async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`/api/applications/job/${params.jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setApplications(data.data || [])
      } else {
        showToast(data.message || "Failed to load applications", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`/api/jobs/${params.jobId}`)
      const data = await res.json()
      if (res.ok) {
        setJob(data.data)
      }
    } catch (error) {
      console.error("Error fetching job details:", error)
    }
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    if (!token) return
    setActionLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast(`Application ${newStatus} successfully!`, "success")
        fetchApplications() // Refresh the list
      } else {
        showToast(data.message || "Failed to update status", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "reviewing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reviewed</Badge>
      case "hired":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>
      case "rejected":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Applications for {job?.title}
          </h1>
          <p className="text-gray-600">
            {job?.company?.name} • {applications.length} applications
          </p>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No applications received yet.</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application._id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                        {application.applicant.firstName.charAt(0)}{application.applicant.lastName.charAt(0)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant.firstName} {application.applicant.lastName}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.applicant.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Applied {new Date(application.appliedAt).toLocaleDateString()}
                          </div>
                        </div>

                        {application.coverLetter && (
                          <div className="text-gray-700 text-sm mb-3">
                            <strong>Cover Letter:</strong> {application.coverLetter}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {application.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application._id, "hired")}
                            disabled={actionLoading === application._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === application._id ? "Updating..." : "Accept"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(application._id, "rejected")}
                            disabled={actionLoading === application._id}
                          >
                            {actionLoading === application._id ? "Updating..." : "Reject"}
                          </Button>
                        </div>
                      )}
                      
                      {application.status === "hired" && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Accepted</span>
                        </div>
                      )}
                      
                      {application.status === "rejected" && (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Rejected</span>
                        </div>
                      )}

                      {application.applicant.resume && (
                        <Button variant="outline" size="sm">
                          View Resume
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 