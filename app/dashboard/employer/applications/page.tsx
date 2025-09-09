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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ExternalLink,
  Star,
  MessageSquare,
  Download,
  Send
} from "lucide-react"

interface Application {
  _id: string
  job: {
    _id: string
    title: string
    company: {
      name: string
    }
  }
  applicant: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profile: {
      title?: string
      summary?: string
      phone?: string
      location?: {
        city: string
        state: string
        country: string
      }
      skills?: string[]
      experience?: Array<{
        company: string
        position: string
        startDate: string
        endDate?: string
        current: boolean
        description: string
      }>
      education?: Array<{
        institution: string
        degree: string
        field: string
        startDate: string
        endDate?: string
      }>
      website?: string
      linkedin?: string
      github?: string
    }
    resume?: {
      filename: string
      path: string
      uploadDate: string
    }
  }
  coverLetter: string
  resume?: {
    filename: string
    path: string
    uploadDate: string
  }
  status: string
  notes: Array<{
    content: string
    addedBy: {
      firstName: string
      lastName: string
    }
    addedAt: string
  }>
  interview?: {
    scheduled: boolean
    date?: string
    time?: string
    location?: string
    type?: string
    notes?: string
  }
  createdAt: string
  updatedAt: string
}

export default function ApplicationsPage() {
  const { user, token } = useAuth()
  const { showActionToast } = useToast()
  
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [jobFilter, setJobFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [newNote, setNewNote] = useState("")
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    location: "",
    type: "video",
    notes: ""
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [jobs, setJobs] = useState<any[]>([])

  // Role-based access control
  if (user && user.role !== "employer") {
    if (typeof window !== "undefined") window.location.href = "/dashboard"
    return null
  }

  useEffect(() => {
    fetchApplications()
    fetchJobs()
  }, [searchQuery, statusFilter, jobFilter])

  const fetchApplications = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (jobFilter !== 'all') params.append('jobId', jobFilter)
      
      const res = await fetch(`/api/applications/employer?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setApplications(data.data || [])
      } else {
        showActionToast('Fetch', 'applications', false, data.message)
      }
    } catch (error) {
      showActionToast('Fetch', 'applications', false, 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async () => {
    if (!token) return
    
    try {
      const res = await fetch('/api/jobs/employer', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setJobs(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
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
        showActionToast('Update', 'application status', true)
        fetchApplications()
      } else {
        showActionToast('Update', 'application status', false, data.message)
      }
    } catch (error) {
      showActionToast('Update', 'application status', false, 'Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleAddNote = async (applicationId: string) => {
    if (!token || !newNote.trim()) return
    
    setActionLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNote }),
      })
      const data = await res.json()
      
      if (res.ok) {
        showActionToast('Add', 'note', true)
        setNewNote("")
        fetchApplications()
      } else {
        showActionToast('Add', 'note', false, data.message)
      }
    } catch (error) {
      showActionToast('Add', 'note', false, 'Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleScheduleInterview = async (applicationId: string) => {
    if (!token || !interviewData.date || !interviewData.time) return
    
    setActionLoading(applicationId)
    try {
      const res = await fetch(`/api/applications/${applicationId}/interview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interviewData),
      })
      const data = await res.json()
      
      if (res.ok) {
        showActionToast('Schedule', 'interview', true)
        setInterviewData({ date: "", time: "", location: "", type: "video", notes: "" })
        setSelectedApplication(null)
        fetchApplications()
      } else {
        showActionToast('Schedule', 'interview', false, data.message)
      }
    } catch (error) {
      showActionToast('Schedule', 'interview', false, 'Network error')
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: Clock },
      reviewing: { color: "bg-blue-100 text-blue-800", label: "Under Review", icon: Eye },
      shortlisted: { color: "bg-green-100 text-green-800", label: "Shortlisted", icon: Star },
      'interview-scheduled': { color: "bg-purple-100 text-purple-800", label: "Interview Scheduled", icon: Calendar },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected", icon: XCircle },
      hired: { color: "bg-emerald-100 text-emerald-800", label: "Hired", icon: CheckCircle }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const downloadResume = (resume: any) => {
    // In a real app, this would download the file
    showActionToast('Download', 'resume', true)
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600">Review and manage job applications</p>
        </div>

        <Tabs defaultValue="all-applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all-applications">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewing">Under Review</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="hired">Hired</TabsTrigger>
          </TabsList>

          <TabsContent value="all-applications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>All Applications</CardTitle>
                    <CardDescription>Manage all job applications</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search applications..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Under Review</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="interview-scheduled">Interview</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={jobFilter} onValueChange={setJobFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Job" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map(job => (
                          <SelectItem key={job._id} value={job._id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No applications found</p>
                    </div>
                  ) : (
                    applications.map((application) => (
                      <div key={application._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {getInitials(application.applicant.firstName, application.applicant.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {application.applicant.firstName} {application.applicant.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">{application.applicant.email}</p>
                                <p className="text-sm text-blue-600 font-medium">
                                  Applied for: {application.job.title}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {getStatusBadge(application.status)}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              {application.applicant.profile?.title && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {application.applicant.profile.title}
                                </div>
                              )}
                              {application.applicant.profile?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {application.applicant.profile.location.city}, {application.applicant.profile.location.state}
                                </div>
                              )}
                              {application.applicant.profile?.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {application.applicant.profile.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Applied {formatDate(application.createdAt)}
                              </div>
                            </div>
                            
                            {application.applicant.profile?.skills && application.applicant.profile.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {application.applicant.profile.skills.slice(0, 5).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.applicant.profile.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{application.applicant.profile.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            {application.coverLetter && (
                              <div className="text-sm text-gray-600 mb-2">
                                <strong>Cover Letter:</strong> {application.coverLetter.substring(0, 150)}...
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              
                              {application.resume && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadResume(application.resume)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Resume
                                </Button>
                              )}
                              
                              {application.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application._id, 'reviewing')}
                                    disabled={actionLoading === application._id}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    {actionLoading === application._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <>
                                        <Eye className="w-4 h-4 mr-1" />
                                        Review
                                      </>
                                    )}
                                  </Button>
                                  
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                    disabled={actionLoading === application._id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    {actionLoading === application._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <>
                                        <Star className="w-4 h-4 mr-1" />
                                        Shortlist
                                      </>
                                    )}
                                  </Button>
                                  
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                    disabled={actionLoading === application._id}
                                  >
                                    {actionLoading === application._id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <>
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                      </>
                                    )}
                                  </Button>
                                </>
                              )}
                              
                              {application.status === 'reviewing' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                    disabled={actionLoading === application._id}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Star className="w-4 h-4 mr-1" />
                                    Shortlist
                                  </Button>
                                  
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                    disabled={actionLoading === application._id}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {application.status === 'shortlisted' && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      Schedule Interview
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Schedule Interview</DialogTitle>
                                      <DialogDescription>
                                        Schedule an interview with {application.applicant.firstName} {application.applicant.lastName}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Interview Date</Label>
                                          <Input
                                            type="date"
                                            value={interviewData.date}
                                            onChange={(e) => setInterviewData(prev => ({ ...prev, date: e.target.value }))}
                                          />
                                        </div>
                                        <div>
                                          <Label>Interview Time</Label>
                                          <Input
                                            type="time"
                                            value={interviewData.time}
                                            onChange={(e) => setInterviewData(prev => ({ ...prev, time: e.target.value }))}
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Interview Type</Label>
                                        <Select value={interviewData.type} onValueChange={(value) => setInterviewData(prev => ({ ...prev, type: value }))}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="phone">Phone</SelectItem>
                                            <SelectItem value="video">Video Call</SelectItem>
                                            <SelectItem value="in-person">In-Person</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Location/Meeting Link</Label>
                                        <Input
                                          value={interviewData.location}
                                          onChange={(e) => setInterviewData(prev => ({ ...prev, location: e.target.value }))}
                                          placeholder="Office address or meeting link"
                                        />
                                      </div>
                                      <div>
                                        <Label>Notes</Label>
                                        <Textarea
                                          value={interviewData.notes}
                                          onChange={(e) => setInterviewData(prev => ({ ...prev, notes: e.target.value }))}
                                          placeholder="Additional notes for the interview"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setInterviewData({ date: "", time: "", location: "", type: "video", notes: "" })
                                          setSelectedApplication(null)
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={() => handleScheduleInterview(application._id)}
                                        disabled={!interviewData.date || !interviewData.time || actionLoading === application._id}
                                      >
                                        {actionLoading === application._id ? "Scheduling..." : "Schedule Interview"}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar tabs for other application statuses */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Applications waiting for review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.filter(app => app.status === 'pending').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending applications</p>
                    </div>
                  ) : (
                    applications
                      .filter(app => app.status === 'pending')
                      .map((application) => (
                        <div key={application._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same application card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortlisted" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shortlisted Candidates</CardTitle>
                <CardDescription>Candidates who have been shortlisted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.filter(app => app.status === 'shortlisted').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No shortlisted candidates</p>
                    </div>
                  ) : (
                    applications
                      .filter(app => app.status === 'shortlisted')
                      .map((application) => (
                        <div key={application._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same application card content as above */}
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
