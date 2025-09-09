"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthContext"
import { useToast } from "@/components/ui/toast-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Building2, 
  MapPin, 
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  ExternalLink
} from "lucide-react"

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  emailVerified: boolean
  isVolunteerApproved: boolean
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
  createdAt: string
  lastLogin?: string
}

export default function ManageUsersPage() {
  const { user, token } = useAuth()
  const { showToast } = useToast()
  
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Role-based access control
  if (user && user.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/dashboard"
    return null
  }

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter, statusFilter])

  const fetchUsers = async () => {
    if (!token) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        setUsers(data.data || [])
      } else {
        showToast(data.message || "Failed to fetch users", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!token) return
    
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      const data = await res.json()
      
      if (res.ok) {
        showToast(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`, "success")
        fetchUsers()
      } else {
        showToast(data.message || "Failed to update user status", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveVolunteer = async (userId: string) => {
    if (!token) return
    
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/users/${userId}/approve-volunteer`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (res.ok) {
        showToast("Volunteer approved successfully!", "success")
        fetchUsers()
      } else {
        showToast(data.message || "Failed to approve volunteer", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    if (!token) return
    
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      })
      const data = await res.json()
      
      if (res.ok) {
        showToast("User role updated successfully!", "success")
        fetchUsers()
      } else {
        showToast(data.message || "Failed to update user role", "error")
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", label: "Admin", icon: Shield },
      employer: { color: "bg-blue-100 text-blue-800", label: "Employer", icon: Building2 },
      jobseeker: { color: "bg-green-100 text-green-800", label: "Job Seeker", icon: User },
      volunteer: { color: "bg-purple-100 text-purple-800", label: "Volunteer", icon: UserCheck }
    }
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.jobseeker
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean, emailVerified: boolean) => {
    if (!isActive) {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    }
    if (!emailVerified) {
      return <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage all platform users</p>
        </div>

        <Tabs defaultValue="all-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="jobseekers">Job Seekers</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="all-users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage all users on the platform</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="jobseeker">Job Seekers</SelectItem>
                        <SelectItem value="employer">Employers</SelectItem>
                        <SelectItem value="volunteer">Volunteers</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="" />
                            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {user.firstName} {user.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                              <div className="flex gap-2">
                                {getRoleBadge(user.role)}
                                {getStatusBadge(user.isActive, user.emailVerified)}
                                {user.role === 'volunteer' && !user.isVolunteerApproved && (
                                  <Badge className="bg-yellow-100 text-yellow-800">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending Approval
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              {user.profile?.title && (
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {user.profile.title}
                                </div>
                              )}
                              {user.profile?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {user.profile.location.city}, {user.profile.location.state}
                                </div>
                              )}
                              {user.profile?.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {user.profile.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined {formatDate(user.createdAt)}
                              </div>
                              {user.lastLogin && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Last active {formatDate(user.lastLogin)}
                                </div>
                              )}
                            </div>
                            
                            {user.profile?.skills && user.profile.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {user.profile.skills.slice(0, 5).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {user.profile.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{user.profile.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(user)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                              
                              <Button
                                variant={user.isActive ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                disabled={actionLoading === user._id}
                              >
                                {actionLoading === user._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : user.isActive ? (
                                  <>
                                    <UserX className="w-4 h-4 mr-1" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    Activate
                                  </>
                                )}
                              </Button>
                              
                              {user.role === 'volunteer' && !user.isVolunteerApproved && (
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveVolunteer(user._id)}
                                  disabled={actionLoading === user._id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {actionLoading === user._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve Volunteer
                                    </>
                                  )}
                                </Button>
                              )}
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Shield className="w-4 h-4 mr-1" />
                                    Change Role
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Change User Role</DialogTitle>
                                    <DialogDescription>
                                      Change the role for {user.firstName} {user.lastName}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Current Role</label>
                                      <p className="text-sm text-gray-600">{user.role}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">New Role</label>
                                      <Select onValueChange={(value) => handleChangeRole(user._id, value)}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select new role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="jobseeker">Job Seeker</SelectItem>
                                          <SelectItem value="employer">Employer</SelectItem>
                                          <SelectItem value="volunteer">Volunteer</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
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

          {/* Similar tabs for other user types */}
          <TabsContent value="jobseekers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Seekers</CardTitle>
                <CardDescription>Manage job seeker accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === 'jobseeker').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No job seekers found</p>
                    </div>
                  ) : (
                    users
                      .filter(u => u.role === 'jobseeker')
                      .map((user) => (
                        <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same user card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employers</CardTitle>
                <CardDescription>Manage employer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === 'employer').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No employers found</p>
                    </div>
                  ) : (
                    users
                      .filter(u => u.role === 'employer')
                      .map((user) => (
                        <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same user card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteers</CardTitle>
                <CardDescription>Manage volunteer accounts and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === 'volunteer').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No volunteers found</p>
                    </div>
                  ) : (
                    users
                      .filter(u => u.role === 'volunteer')
                      .map((user) => (
                        <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same user card content as above */}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>Manage administrator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === 'admin').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No administrators found</p>
                    </div>
                  ) : (
                    users
                      .filter(u => u.role === 'admin')
                      .map((user) => (
                        <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          {/* Same user card content as above */}
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
