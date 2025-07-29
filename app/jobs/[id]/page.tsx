"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"
import { useAuth } from "@/components/AuthContext"
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building, Calendar, User } from "lucide-react"

interface Job {
  _id: string
  title: string
  description: string
  requirements: string
  company: { name: string; description?: string; website?: string; industry?: string }
  location: string
  jobType: string
  experienceLevel: string
  salary?: { min?: number; max?: number }
  postedAt?: string
  applicantsCount?: number
  logo?: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const { showToast } = useToast()
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applyLoading, setApplyLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchJobDetails()
    }
  }, [params.id])

  const fetchJobDetails = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        setJob(data.data)
        checkIfApplied()
      } else {
        showToast(data.message || "Failed to load job details", "error")
        router.push("/jobs")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
      router.push("/jobs")
    } finally {
      setLoading(false)
    }
  }

  const checkIfApplied = async () => {
    if (!token) return
    try {
      const res = await fetch("/api/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        const hasAppliedToThisJob = data.data.some((app: any) => app.job._id === params.id)
        setHasApplied(hasAppliedToThisJob)
      }
    } catch (error) {
      console.error("Error checking application status:", error)
    }
  }

  const handleApply = async () => {
    if (!token) {
      showToast("You must be logged in to apply.", "error")
      return
    }
    setApplyLoading(true)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: params.id }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Application submitted successfully!", "success")
        setHasApplied(true)
      } else {
        showToast(data.message || "Failed to apply.", "error")
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setApplyLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Button onClick={() => router.push("/jobs")}>Back to Jobs</Button>
        </div>
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
          Back to Jobs
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{job.company?.name}</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                    {job.logo || "💼"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{typeof job.location === 'string' ? job.location : job.location?.remote ? 'Remote' : JSON.stringify(job.location)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>
                      {job.salary?.min && job.salary?.max 
                        ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                        : "Salary not specified"
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="capitalize">{job.experienceLevel.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : "Recently posted"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{job.applicantsCount || 0} applicants</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleApply}
                  disabled={applyLoading || hasApplied}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {applyLoading ? "Applying..." : hasApplied ? "Already Applied" : "Apply Now"}
                </Button>
                
                {hasApplied && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm">✓ You have already applied for this position</p>
                  </div>
                )}

                {/* Company Info */}
                {job.company && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">About {job.company.name}</h4>
                    {job.company.description && (
                      <p className="text-sm text-gray-600 mb-2">{job.company.description}</p>
                    )}
                    {job.company.industry && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Industry:</span>
                        <span>{job.company.industry}</span>
                      </div>
                    )}
                    {job.company.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm block mt-2"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 