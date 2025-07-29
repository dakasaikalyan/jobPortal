"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"
import { motion } from "framer-motion"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface Job {
  _id: string
  title: string
  company: { name: string }
  location: string
  jobType: string
}

export default function AdminDashboard() {
  const { user, token } = useAuth()
  // Role-based access control
  if (user && user.role !== "admin") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  const [stats, setStats] = useState({ totalUsers: 0, totalJobs: 0, recentUsers: [] as User[] })
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [userSearch, setUserSearch] = useState("")
  const [jobSearch, setJobSearch] = useState("")
  const [actionLoading, setActionLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { showToast } = useToast()

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchJobs()
    // eslint-disable-next-line
  }, [])

  const fetchStats = async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setStats({
      totalUsers: data.totalUsers || 0,
      totalJobs: data.totalJobs || 0,
      recentUsers: data.recentUsers || [],
    })
    setLoading(false)
  }

  const fetchUsers = async (search = "") => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setUsers(data.data || [])
      else setError(data.message || "Failed to load users.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchJobs = async (search = "") => {
    if (!token) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/jobs?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) setJobs(data.data || [])
      else setError(data.message || "Failed to load jobs.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!token) return
    setActionLoading(userId + newRole)
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Role updated!", "success")
        fetchUsers(userSearch)
      } else {
        showToast(data.message || "Failed to update role.", "error")
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading("")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!token) return
    if (!window.confirm("Are you sure you want to delete this user?")) return
    setActionLoading(userId + "delete")
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        showToast("User deleted!", "success")
        fetchUsers(userSearch)
      } else {
        showToast(data.message || "Failed to delete user.", "error")
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading("")
    }
  }

  const handleApproveJob = async (jobId: string) => {
    if (!token) return
    setActionLoading(jobId + "approve")
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ approved: true }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Job approved!", "success")
        fetchJobs(jobSearch)
      } else {
        showToast(data.message || "Failed to approve job.", "error")
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading("")
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!token) return
    if (!window.confirm("Are you sure you want to delete this job?")) return
    setActionLoading(jobId + "delete")
    setError("")
    setSuccess("")
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Job deleted!", "success")
        fetchJobs(jobSearch)
      } else {
        showToast(data.message || "Failed to delete job.", "error")
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setActionLoading("")
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.firstName}! (Admin Dashboard)</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Site Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : (
              <div className="space-y-4">
                <div className="text-lg font-semibold">Total Users: {stats.totalUsers}</div>
                <div className="text-lg font-semibold">Total Jobs: {stats.totalJobs}</div>
                <div className="mt-6">
                  <div className="font-semibold mb-2">Recent Users:</div>
                  <ul className="space-y-2">
                    {stats.recentUsers.map((u) => (
                      <li key={u._id} className="p-2 bg-white rounded shadow flex justify-between items-center">
                        <span>{u.firstName} {u.lastName} ({u.role})</span>
                        <span className="text-gray-600 text-sm">{u.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Controls: Users */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search users by name or email"
              value={userSearch}
              onChange={e => { setUserSearch(e.target.value); fetchUsers(e.target.value) }}
              className="mb-4"
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <ul className="space-y-2">
              {users.map(u => (
                <li key={u._id} className="flex justify-between items-center bg-white rounded p-3 shadow">
                  <span>{u.firstName} {u.lastName} ({u.role}) - {u.email}</span>
                  <div className="flex gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      disabled={actionLoading === u._id + u.role}
                      className="border rounded px-2 py-1"
                    >
                      <option value="jobseeker">Jobseeker</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(u._id)}
                      disabled={actionLoading === u._id + "delete"}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Admin Controls: Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search jobs by title or company"
              value={jobSearch}
              onChange={e => { setJobSearch(e.target.value); fetchJobs(e.target.value) }}
              className="mb-4"
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <ul className="space-y-2">
              {jobs.map(j => (
                <li key={j._id} className="flex justify-between items-center bg-white rounded p-3 shadow">
                  <span>{j.title} ({j.company?.name || ""}) - {typeof j.location === 'string' ? j.location : j.location?.remote ? 'Remote' : JSON.stringify(j.location)} [{j.jobType}]</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveJob(j._id)}
                      disabled={actionLoading === j._id + "approve"}
                    >
                      {actionLoading === j._id + "approve" ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteJob(j._id)}
                      disabled={actionLoading === j._id + "delete"}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 