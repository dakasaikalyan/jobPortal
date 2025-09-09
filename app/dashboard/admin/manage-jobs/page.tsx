"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthContext"
import { useToast } from "@/components/ui/toast-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  MapPin, 
  DollarSign,
  Calendar,
  User,
  AlertTriangle
} from "lucide-react"

interface Job {
  _id: string
  title: string
  description: string
  requirements: string
  company: {
    _id: string
    name: string
    logo?: string
    industry: string
  }
  postedBy: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  locations: Array<{
    city: string
    state: string
    country: string
    remote: boolean
  }>
  salary: {
    min?: number
    max?: number
    currency: string
    period: string
  }
  jobType: string
  experienceLevel: string
  experienceLevelText: string
  skills: string[]
  status: string
  approvalStatus: string
  featured: boolean
  applicationsCount: number
  createdAt: string
  approvedAt?: string
  rejectionReason?: string
}

export default function ManageJobsPage() {
  const { user, token } = useAuth()
  const { showToast } = useToast()
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [approvalFilter, setApprovalFilter] = useState("all")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Role-based access control
  if (user && user.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/dashboard"
    return null
  }

  useEffect(() => {
    fetchJobs()
  }, [searchQuery, statusFilter, approvalFilter])

  const fetchJobs = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (approvalFilter !== 'all') params.append('approvalStatus', approvalFilter)
      
      const res = await fetch(`/api/jobs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setJobs(data.data || [])
      } else {
        showToast(data.message || "Failed to fetch jobs", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveJob = async (jobId: string) => {
    if (!token) return
    
    setActionLoading(jobId)
    try {
      const res = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        showToast("Job approved successfully!", "success")
        fetchJobs()
      } else {
        showToast(data.message || "Failed to approve job", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectJob = async (jobId: string) => {
    if (!token || !rejectionReason.trim()) return
    
    setActionLoading(jobId)
    try {
      const res = await fetch(`/api/jobs/${jobId}/reject`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ rejectionReason })
      })
      const data = await res.json()
      
      if (res.ok) {
        showToast("Job rejected successfully!", "success")
        setRejectionReason("")
        setSelectedJob(null)
        fetchJobs()
      } else {
        showToast(data.message || "Failed to reject job", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      paused: { color: "bg-yellow-100 text-yellow-800", label: "Paused" },
      closed: { color: "bg-red-100 text-red-800", label: "Closed" },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getApprovalBadge = (approvalStatus: string) => {
    const approvalConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", label: "Approved", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected", icon: XCircle }
    }
    const config = approvalConfig[approvalStatus as keyof typeof approvalConfig] || approvalConfig.pending
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const formatSalary = (salary: Job['salary']) => {
    if (!salary.min && !salary.max) return "Not specified"
    const min = salary.min ? `$${salary.min.toLocaleString()}` : ""
    const max = salary.max ? `$${salary.max.toLocaleString()}` : ""
    const period = salary.period === 'yearly' ? '/year' : salary.period === 'monthly' ? '/month' : '/hour'
    return `${min}${min && max ? ' - ' : ''}${max}${period}`
  }

  const formatLocations = (locations: Job['locations']) => {
    if (!locations || locations.length === 0) return "Not specified"
    return locations.map(loc => 
      loc.remote ? "Remote" : `${loc.city}, ${loc.state}`
    ).join(", ")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
          <p className="text-gray-600">Review, approve, and manage job postings</p>
        </div>

        <Tabs defaultValue="all-jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all-jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>Manage all job postings on the platform</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Approval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No jobs found</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                              <div className="flex gap-2">
                                {getStatusBadge(job.status)}
                                {getApprovalBadge(job.approvalStatus)}
                                {job.featured && (
                                  <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.company.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {formatLocations(job.locations)}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatSalary(job.salary)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(job.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-2">
                              <strong>Experience:</strong> {job.experienceLevelText}
                            </div>
                            
                            <div className="text-sm text-gray-600">
                              <strong>Posted by:</strong> {job.postedBy.firstName} {job.postedBy.lastName} ({job.postedBy.email})
                            </div>
                            
                            {job.rejectionReason && (
                              <Alert className="mt-2">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Rejection Reason:</strong> {job.rejectionReason}
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            
                            {job.approvalStatus === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveJob(job._id)}
                                  disabled={actionLoading === job._id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {actionLoading === job._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </>
                                  )}
                                </Button>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      disabled={actionLoading === job._id}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Reject Job Posting</DialogTitle>
                                      <DialogDescription>
                                        Please provide a reason for rejecting this job posting.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Job Title</label>
                                        <p className="text-sm text-gray-600">{job.title}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Company</label>
                                        <p className="text-sm text-gray-600">{job.company.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Rejection Reason *</label>
                                        <Textarea
                                          placeholder="Enter reason for rejection..."
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setRejectionReason("")
                                          setSelectedJob(null)
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRejectJob(job._id)}
                                        disabled={!rejectionReason.trim() || actionLoading === job._id}
                                      >
                                        {actionLoading === job._id ? "Rejecting..." : "Reject Job"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>Jobs waiting for admin approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.filter(job => job.approvalStatus === 'pending').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending jobs</p>
                    </div>
                  ) : (
                    jobs
                      .filter(job => job.approvalStatus === 'pending')
                      .map((job) => (
                        <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same job card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Jobs</CardTitle>
                <CardDescription>Jobs that have been approved and are live</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.filter(job => job.approvalStatus === 'approved').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No approved jobs</p>
                    </div>
                  ) : (
                    jobs
                      .filter(job => job.approvalStatus === 'approved')
                      .map((job) => (
                        <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same job card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Jobs</CardTitle>
                <CardDescription>Jobs that have been rejected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.filter(job => job.approvalStatus === 'rejected').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <XCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No rejected jobs</p>
                    </div>
                  ) : (
                    jobs
                      .filter(job => job.approvalStatus === 'rejected')
                      .map((job) => (
                        <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same job card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
