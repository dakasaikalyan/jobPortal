"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRef } from "react"
import ReactDOM from "react-dom"

const jobTypes = ["full-time", "part-time", "contract", "internship", "freelance"]
const experienceLevels = ["entry-level", "mid-level", "senior-level", "executive"]

interface Job {
  _id: string
  title: string
  company: any
  location: any
  applicantsCount?: number
}

interface Company {
  _id: string
  name: string
  description: string
  website: string
  industry: string
  size: string
  founded?: number
}

export default function EmployerDashboard() {
  const { user, token } = useAuth()
  // Role-based access control
  if (user && user.role !== "employer") {
    if (typeof window !== "undefined") window.location.href = "/dashboard";
    return null;
  }
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    jobType: jobTypes[0],
    experienceLevel: experienceLevels[0],
    location: "",
    salaryMin: "",
    salaryMax: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const { showToast } = useToast()

  // Company profile state
  const [company, setCompany] = useState<Company | null>(null)
  const [companyLoading, setCompanyLoading] = useState(true)
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    size: "1-10",
    founded: "",
    logo: "" // Added for logo preview
  })
  const [companyFormLoading, setCompanyFormLoading] = useState(false)

  useEffect(() => {
    fetchCompany()
    fetchJobs()
    // eslint-disable-next-line
  }, [token])

  const fetchCompany = async () => {
    if (!token) return
    setCompanyLoading(true)
    try {
      // Fetch all companies and filter by owner (current user)
      const res = await fetch(`/api/companies` , {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.data)) {
        const myCompany = data.data.find((c: any) => c.owner && c.owner._id === user?.id)
        setCompany(myCompany || null)
        if (myCompany) {
          setCompanyForm({
            name: myCompany.name || "",
            description: myCompany.description || "",
            website: myCompany.website || "",
            industry: myCompany.industry || "",
            size: myCompany.size || "1-10",
            founded: myCompany.founded ? String(myCompany.founded) : "",
            logo: myCompany.logo || "" // Assuming logo is stored in company object
          })
        }
      }
    } catch {
      setCompany(null)
    } finally {
      setCompanyLoading(false)
    }
  }

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value })
  }

  const handleCompanyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCompanyFormLoading(true)
    try {
      let res, data
      if (company) {
        // Update
        res = await fetch(`/api/companies/${company._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ...companyForm,
            founded: companyForm.founded ? Number(companyForm.founded) : undefined
          })
        })
        data = await res.json()
        if (res.ok) {
          showToast("Company profile updated!", "success")
          setShowCompanyForm(false)
          fetchCompany()
        } else {
          showToast(data.message || "Failed to update company.", "error")
        }
      } else {
        // Create
        res = await fetch(`/api/companies`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ...companyForm,
            founded: companyForm.founded ? Number(companyForm.founded) : undefined
          })
        })
        data = await res.json()
        if (res.ok) {
          showToast("Company profile created!", "success")
          setShowCompanyForm(false)
          fetchCompany()
        } else {
          showToast(data.message || "Failed to create company.", "error")
        }
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setCompanyFormLoading(false)
    }
  }

  const fetchJobs = async () => {
    if (!token) return
    setLoading(true)
    const res = await fetch("/api/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    // Filter jobs posted by the current employer
    const myJobs = Array.isArray(data.data)
      ? data.data.filter((job: any) => job.postedBy && job.postedBy._id === user?.id)
      : []
    setJobs(myJobs)
    setLoading(false)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === 'requirements' ? String(e.target.value) : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    setFormSuccess("")
    // Validation (frontend)
    if (form.title.length < 5) {
      showToast("Title must be at least 5 characters.", "error")
      setFormLoading(false)
      return
    }
    if (form.description.length < 50) {
      showToast("Description must be at least 50 characters.", "error")
      setFormLoading(false)
      return
    }
    if (form.requirements.length < 20) {
      showToast("Requirements must be at least 20 characters.", "error")
      setFormLoading(false)
      return
    }
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          requirements: form.requirements,
          jobType: form.jobType,
          experienceLevel: form.experienceLevel,
          location: form.location,
          salary: {
            min: form.salaryMin ? Number(form.salaryMin) : undefined,
            max: form.salaryMax ? Number(form.salaryMax) : undefined,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        showToast(data.message || "Failed to post job.", "error")
      } else {
        showToast("Job posted successfully!", "success")
        setForm({
          title: "",
          description: "",
          requirements: "",
          jobType: jobTypes[0],
          experienceLevel: experienceLevels[0],
          location: "",
          salaryMin: "",
          salaryMax: "",
        })
        setShowForm(false)
        fetchJobs()
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error")
    } finally {
      setFormLoading(false)
    }
  }

  // Add a simple TagInput component for requirements/skills
  function TagInput({ value, onChange, placeholder }: { value: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [input, setInput] = useState("")
    
    // Ensure value only contains strings
    const safeValue = value.filter(item => typeof item === 'string')
    
    const addTag = (tag: string) => {
      if (tag && typeof tag === 'string' && !safeValue.includes(tag)) {
        onChange([...safeValue, tag])
      }
    }
    const removeTag = (idx: number) => {
      onChange(safeValue.filter((_, i) => i !== idx))
    }
    return (
      <div className="flex flex-wrap gap-2 border rounded px-2 py-2 bg-white min-h-[44px]">
        {safeValue.map((tag, idx) => (
          <span key={tag+idx} className="flex items-center bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-medium">
            {tag}
            <button type="button" className="ml-1 text-blue-500 hover:text-red-500" onClick={() => removeTag(idx)}>&times;</button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="flex-1 min-w-[80px] border-none outline-none bg-transparent text-sm"
          value={input}
          placeholder={placeholder}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if ((e.key === "Enter" || e.key === ",") && input.trim()) {
              e.preventDefault(); addTag(input.trim()); setInput("")
            } else if (e.key === "Backspace" && !input && safeValue.length) {
              removeTag(safeValue.length - 1)
            }
          }}
        />
      </div>
    )
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
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.firstName || ""}! (Employer Dashboard)</h1>
        {/* Company Profile Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {companyLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : company ? (
              <div className="space-y-2">
                <div className="font-bold text-lg">{company.name}</div>
                <div className="text-gray-600">{company.industry} | {company.size} employees</div>
                <div className="text-gray-600">Founded: {company.founded || "N/A"}</div>
                <div className="text-gray-600">Website: <a href={company.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{company.website}</a></div>
                <div className="text-gray-700">{company.description}</div>
                <Button className="mt-4" onClick={() => setShowCompanyForm(true)}>Edit Company Profile</Button>
              </div>
            ) : (
              <div>
                <div className="mb-4 text-blue-700 font-semibold">You need to create a company profile before posting jobs.</div>
                <Button onClick={() => setShowCompanyForm(true)}>Create Company Profile</Button>
              </div>
            )}
            {/* Company Profile Modal/Form */}
            {showCompanyForm && typeof window !== "undefined" && ReactDOM.createPortal(
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
                <Card className="flex w-full max-w-3xl p-0 overflow-hidden fixed z-[10000] pointer-events-auto">
                  <button className="absolute top-2 right-2 text-gray-500 z-10" onClick={() => setShowCompanyForm(false)}>&times;</button>
                  {/* Live Preview */}
                  <div className="w-1/2 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col items-center justify-center p-8 border-r">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage src={companyForm.logo || undefined} />
                      <AvatarFallback>{(companyForm.name?.[0] || "C").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-bold text-xl mb-1">{companyForm.name || "Company Name"}</div>
                    <div className="text-blue-700 mb-1">{companyForm.industry || "Industry"} | {companyForm.size || "Size"}</div>
                    <div className="text-gray-600 mb-1">Founded: {companyForm.founded || "----"}</div>
                    <div className="text-gray-600 mb-1">{companyForm.website ? <a href={companyForm.website} className="underline" target="_blank" rel="noopener noreferrer">{companyForm.website}</a> : "Website"}</div>
                    <div className="text-gray-700 text-sm mt-2 line-clamp-5">{companyForm.description || "Company description will appear here."}</div>
                  </div>
                  {/* Form */}
                  <form onSubmit={handleCompanyFormSubmit} className="w-1/2 p-8 space-y-4">
                    <h2 className="text-xl font-bold mb-2">{company ? "Edit" : "Create"} Company Profile</h2>
                    <TooltipProvider>
                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="name" placeholder="Company Name" value={companyForm.name} onChange={handleCompanyFormChange} required />
                          </TooltipTrigger>
                          <TooltipContent>Enter your official company name.</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <textarea name="description" placeholder="Company Description" value={companyForm.description} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" maxLength={2000} required />
                          </TooltipTrigger>
                          <TooltipContent>Describe your company in a few sentences.</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="website" placeholder="https://company.com" value={companyForm.website} onChange={handleCompanyFormChange} required />
                          </TooltipTrigger>
                          <TooltipContent>Company website (include https://)</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="industry" placeholder="Industry" value={companyForm.industry} onChange={handleCompanyFormChange} required />
                          </TooltipTrigger>
                          <TooltipContent>e.g. Software, Healthcare, Education</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <select name="size" value={companyForm.size} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required>
                              <option value="">Select Size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                          </TooltipTrigger>
                          <TooltipContent>Number of employees</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="founded" type="number" placeholder="Founded Year" value={companyForm.founded} onChange={handleCompanyFormChange} min={1800} max={new Date().getFullYear()} />
                          </TooltipTrigger>
                          <TooltipContent>Year company was founded</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                    {companyFormLoading && <div className="flex justify-center py-4"><LoadingSpinner className="w-6 h-6" /></div>}
                    <Button type="submit" className="w-full" disabled={companyFormLoading}>
                      {companyFormLoading ? (company ? "Saving..." : "Creating...") : (company ? "Save Changes" : "Create Company")}
                    </Button>
                  </form>
                </Card>
              </div>,
              document.body
            )}
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Posted Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : jobs.length === 0 ? (
              <div>No jobs posted yet.</div>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li key={job._id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-lg">{job.title}</div>
                      <div className="text-gray-600">
                        {typeof job.company === 'string' ? job.company : job.company?.name} - {
                          typeof job.location === 'string'
                            ? job.location
                            : job.location && typeof job.location === 'object'
                              ? (job.location.remote ? 'Remote' : Object.entries(job.location).map(([k, v]) => `${k}: ${v}`).join(', '))
                              : ''
                        }
                      </div>
                    </div>
                    <div className="text-blue-600 font-bold">{job.applicantsCount} Applicants</div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 sticky bottom-4 z-[40]">
              <Button onClick={() => setShowForm(true)}>Post New Job</Button>
            </div>
            {/* Job Posting Modal/Form */}
            {showForm && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60]">
                <Card className="flex w-full max-w-3xl p-0 overflow-hidden relative">
                  <button className="absolute top-2 right-2 text-gray-500 z-10" onClick={() => setShowForm(false)}>&times;</button>
                  {/* Live Preview */}
                  <div className="w-1/2 bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-8 border-r">
                    <div className="font-bold text-xl mb-1">{form.title || "Job Title"}</div>
                    <div className="text-green-700 mb-1">
                      {company?.name || "Company"} - {typeof form.location === 'string' ? form.location : ''}
                    </div>
                    <div className="text-gray-600 mb-1">{form.jobType} | {form.experienceLevel}</div>
                    <div className="text-gray-700 text-sm mt-2 line-clamp-5">{form.description || "Job description will appear here."}</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(form.requirements ? form.requirements.split(",") : []).map((req, i) => req.trim() && <span key={i} className="bg-blue-200 text-blue-800 rounded px-2 py-1 text-xs">{req.trim()}</span>)}
                    </div>
                    <div className="text-blue-700 font-bold mt-2">Salary: {form.salaryMin && form.salaryMax ? `${form.salaryMin} - ${form.salaryMax}` : "-"}</div>
                  </div>
                  {/* Form */}
                  <form onSubmit={handleFormSubmit} className="w-1/2 p-8 space-y-4">
                    <h2 className="text-xl font-bold mb-2">Post a New Job</h2>
                    <TooltipProvider>
                      <div className="space-y-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="title" placeholder="Job Title" value={form.title} onChange={handleFormChange} required />
                          </TooltipTrigger>
                          <TooltipContent>Enter the job title.</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <textarea name="description" placeholder="Job Description (min 50 chars)" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" minLength={50} required />
                          </TooltipTrigger>
                          <TooltipContent>Describe the job role and responsibilities.</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {/* TagInput for requirements */}
                            <TagInput
                              value={typeof form.requirements === 'string' ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : []}
                              onChange={tags => setForm(prev => ({ ...prev, requirements: tags.join(", ") }))}
                              placeholder="Add requirements and press Enter"
                            />
                          </TooltipTrigger>
                          <TooltipContent>List job requirements (press Enter after each).</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input name="location" placeholder="Location" value={form.location} onChange={handleFormChange} required />
                          </TooltipTrigger>
                          <TooltipContent>Job location (remote, city, etc.)</TooltipContent>
                        </Tooltip>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Job Type</label>
                            <select name="jobType" value={form.jobType} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                          {jobTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Experience Level</label>
                            <select name="experienceLevel" value={form.experienceLevel} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                          {experienceLevels.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input name="salaryMin" type="number" placeholder="Min Salary" value={form.salaryMin} onChange={handleFormChange} min={0} />
                            </TooltipTrigger>
                            <TooltipContent>Minimum salary offered</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Input name="salaryMax" type="number" placeholder="Max Salary" value={form.salaryMax} onChange={handleFormChange} min={0} />
                            </TooltipTrigger>
                            <TooltipContent>Maximum salary offered</TooltipContent>
                          </Tooltip>
                        </div>
                    </div>
                    </TooltipProvider>
                    {formLoading && <div className="flex justify-center py-4"><LoadingSpinner className="w-6 h-6" /></div>}
                    <Button type="submit" className="w-full" disabled={formLoading}>
                      {formLoading ? "Posting..." : "Post Job"}
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : jobs.length === 0 ? (
              <div>No jobs posted yet.</div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge variant="secondary">{job?.applicantsCount || 0} applicants</Badge>
                    </div>
                    <div className="text-gray-600 mb-3">
                      {typeof job.company === 'string' ? job.company : job.company?.name} - {
                        typeof job.location === 'string'
                          ? job.location
                          : job.location && typeof job.location === 'object'
                            ? (job?.location?.remote ? 'Remote' : Object.entries(job.location).map(([k, v]) => `${k}: ${v}`).join(', '))
                            : ''
                      }
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/dashboard/employer/applications/${job._id}`}
                    >
                      View Applications
                    </Button>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 