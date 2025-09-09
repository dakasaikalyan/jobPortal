"use client"

import { useEffect, useState } from "react"
import { Search, Filter, MapPin, Briefcase, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/AuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"

interface Job {
  _id: string
  title: string
  company: { name: string }
  location: string
  jobType: string
  salary?: { min?: number; max?: number }
  experienceLevel: string
  postedAt?: string
  applicantsCount?: number
  logo?: string
}

export default function JobsPage() {
  const { user, token } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [applyLoading, setApplyLoading] = useState<string | null>(null)
  const [applySuccess, setApplySuccess] = useState<string | null>(null)
  const [applyError, setApplyError] = useState<string | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("All Locations")
  const [jobTypeFilter, setJobTypeFilter] = useState("All Types")
  const [experienceFilter, setExperienceFilter] = useState("All Levels")
  const { showToast } = useToast()

  useEffect(() => {
    fetchJobs()
    checkAppliedJobs()
    // eslint-disable-next-line
  }, [])

  // Fetch jobs with filters
  const fetchJobs = async (params = {}) => {
    setLoading(true)
    setError("")
    try {
      const query = new URLSearchParams()
      if (searchQuery) query.append("search", searchQuery)
      if (locationFilter !== "All Locations") query.append("location", locationFilter)
      if (jobTypeFilter !== "All Types") query.append("jobType", jobTypeFilter)
      if (experienceFilter !== "All Levels") query.append("experienceLevel", experienceFilter)
      const res = await fetch(`/api/jobs?${query.toString()}`)
      const data = await res.json()
      if (res.ok) {
        setJobs(data.data || [])
      } else {
        setError(data.message || "Failed to load jobs.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Refetch jobs when filters/search change
  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line
  }, [searchQuery, locationFilter, jobTypeFilter, experienceFilter])

  const checkAppliedJobs = async () => {
    if (!token) return
    try {
      const res = await fetch("/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        const appliedJobIds = new Set((data.data || []).map((app: any) => app.job._id))
        setAppliedJobs(appliedJobIds)
      }
    } catch (error) {
      console.error("Error checking applied jobs:", error)
    }
  }

  const handleApply = async (jobId: string) => {
    if (!token) {
      showToast("You must be logged in to apply.", "error")
      return
    }
    setApplyLoading(jobId)
    setApplyError(null)
    setApplySuccess(null)
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || "Failed to apply.", "error")
      } else {
        showToast("Application submitted!", "success")
        setAppliedJobs(prev => new Set([...prev, jobId]))
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setApplyLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find Your Perfect Job</h1>
          <p className="text-xl text-gray-600">Discover {jobs.length} opportunities waiting for you</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  {[...new Set(jobs.map((job) => job.location))].map((loc, idx) => (
                    <SelectItem key={typeof loc === 'string' ? loc : idx} value={loc}>{typeof loc === 'string' ? loc : JSON.stringify(loc)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Levels">All Levels</SelectItem>
                  <SelectItem value="entry-level">Entry-level</SelectItem>
                  <SelectItem value="mid-level">Mid-level</SelectItem>
                  <SelectItem value="senior-level">Senior</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {jobs.length} jobs
          </p>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => alert("More filters coming soon")}> 
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>

        {/* Feedback */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {applyError && <div className="text-red-600 text-center mb-4">{applyError}</div>}
        {applySuccess && <div className="text-green-600 text-center mb-4">{applySuccess}</div>}

        {/* Job Listings */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : jobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            jobs.map((job, index) => (
              <Card
                key={job._id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                        {job.logo || "💼"}
                      </div>

                      <div className="flex-1">
                        <h3 
                          className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer"
                          onClick={() => window.location.href = `/jobs/${job._id}`}
                        >
                          {job.title}
                        </h3>
                        <p className="text-gray-600 font-medium mb-3">{job.company?.name || ""}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {typeof job.location === 'string' ? job.location : job.location?.remote ? 'Remote' : JSON.stringify(job.location)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.jobType}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary?.min && job.salary?.max ? `$${job.salary.min} - $${job.salary.max}` : "-"}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                            {job.experienceLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button
                        className={appliedJobs.has(job._id) 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        }
                        onClick={() => handleApply(job._id)}
                        disabled={applyLoading === job._id || appliedJobs.has(job._id)}
                      >
                        {applyLoading === job._id ? "Applying..." : appliedJobs.has(job._id) ? "Applied ✓" : "Apply"}
                      </Button>
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
