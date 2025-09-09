"use client"

import { useEffect, useState } from "react"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin, 
  Github, 
  Youtube, 
  Edit3, 
  Save, 
  X,
  Eye,
  EyeOff,
  Lock,
  Upload,
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/AuthContext"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/toast-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { motion } from "framer-motion"

export default function ProfilePage() {
  const { user, token, login } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Profile data (fetched from API)
  const [profile, setProfile] = useState<any>(null)
  const { showToast } = useToast()

  // Experience modal state
  const [showExpModal, setShowExpModal] = useState(false)
  const [expEditIndex, setExpEditIndex] = useState<number | null>(null)
  const [expForm, setExpForm] = useState<any>({ position: "", company: "", startDate: "", endDate: "", current: false, description: "" })
  // Education modal state
  const [showEduModal, setShowEduModal] = useState(false)
  const [eduEditIndex, setEduEditIndex] = useState<number | null>(null)
  const [eduForm, setEduForm] = useState<any>({ degree: "", field: "", institution: "", startDate: "", endDate: "", current: false })
  const [skillInput, setSkillInput] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [phoneInput, setPhoneInput] = useState("")

  // Experience handlers
  const openAddExp = () => { setExpEditIndex(null); setExpForm({ position: "", company: "", startDate: "", endDate: "", current: false, description: "" }); setShowExpModal(true) }
  const openEditExp = (i: number) => { setExpEditIndex(i); setExpForm(profile.experience[i]); setShowExpModal(true) }
  const saveExp = () => {
    setProfile((prev: any) => {
      const experience = [...(prev.experience || [])]
      if (expEditIndex === null) experience.push({ ...expForm, id: Date.now() })
      else experience[expEditIndex] = { ...expForm }
      return { ...prev, experience }
    })
    setShowExpModal(false)
  }
  const deleteExp = (i: number) => {
    setProfile((prev: any) => ({ ...prev, experience: prev.experience.filter((_: any, idx: number) => idx !== i) }))
  }

  // Education handlers
  const openAddEdu = () => { setEduEditIndex(null); setEduForm({ degree: "", field: "", institution: "", startDate: "", endDate: "", current: false }); setShowEduModal(true) }
  const openEditEdu = (i: number) => { setEduEditIndex(i); setEduForm(profile.education[i]); setShowEduModal(true) }
  const saveEdu = () => {
    setProfile((prev: any) => {
      const education = [...(prev.education || [])]
      if (eduEditIndex === null) education.push({ ...eduForm, id: Date.now() })
      else education[eduEditIndex] = { ...eduForm }
      return { ...prev, education }
    })
    setShowEduModal(false)
  }
  const deleteEdu = (i: number) => {
    setProfile((prev: any) => ({ ...prev, education: prev.education.filter((_: any, idx: number) => idx !== i) }))
  }

  // Only show jobseeker/volunteer fields for non-employers
  const isEmployer = user?.role === "employer"

  useEffect(() => {
    if (!token) return
    fetchProfile()
    // eslint-disable-next-line
  }, [token])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setProfile({
          ...data.data.profile,
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          email: data.data.email,
        })
        // Seed local controlled inputs
        setPhoneInput(data.data.profile?.phone || "")
        setLocationQuery(data.data.profile?.location?.city || "")
      } else {
        setError(data.message || "Failed to load profile.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // When entering edit mode, seed inputs from current profile state
  useEffect(() => {
    if (isEditing && profile) {
      setPhoneInput(profile.phone || "")
      setLocationQuery(profile.location?.city || "")
    }
    // eslint-disable-next-line
  }, [isEditing])

  // Simple client-side location autocomplete using a small list; can be replaced with Places API
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 2) { setLocationSuggestions([]); return }
    const cities = [
      "Hyderabad", "bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Gurugram", "Noida",
      "Remote"
    ]
    const q = locationQuery.toLowerCase()
    setLocationSuggestions(cities.filter(c => c.toLowerCase().startsWith(q)).slice(0, 5))
  }, [locationQuery])

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      // Build payload deterministically from state
      const cleanExperience = (profile.experience || []).filter((exp: any) => exp.position && exp.company)
      const cleanEducation = (profile.education || []).filter((edu: any) => edu.degree && edu.institution)
      const payloadProfile: any = {}
      // Basic text fields
      if (typeof profile.summary === 'string' && profile.summary.trim()) payloadProfile.summary = profile.summary.trim()
      if (typeof profile.title === 'string' && profile.title.trim()) payloadProfile.title = profile.title.trim()
      if (typeof profile.website === 'string' && profile.website.trim()) payloadProfile.website = profile.website.trim()
      if (typeof profile.linkedin === 'string' && profile.linkedin.trim()) payloadProfile.linkedin = profile.linkedin.trim()
      if (typeof profile.github === 'string' && profile.github.trim()) payloadProfile.github = profile.github.trim()
      if (typeof profile.youtube === 'string' && profile.youtube.trim()) payloadProfile.youtube = profile.youtube.trim()
      // Phone (prefer local input)
      if (typeof phoneInput === 'string' && phoneInput.trim()) payloadProfile.phone = phoneInput.trim()
      // Location (typed or selected)
      const cityCandidate = locationQuery || (profile.location && profile.location.city)
      if (cityCandidate && cityCandidate.trim()) {
        payloadProfile.location = {
          city: cityCandidate.trim(),
          state: profile.location?.state,
          country: profile.location?.country,
        }
      }
      // Visibility / freelancer
      if (typeof profile.profileVisibility === 'string') payloadProfile.profileVisibility = profile.profileVisibility
      if (typeof profile.isFreelancer === 'boolean') payloadProfile.isFreelancer = profile.isFreelancer
      if (profile.isFreelancer && typeof profile.freelanceCompany === 'string' && profile.freelanceCompany.trim()) {
        payloadProfile.freelanceCompany = profile.freelanceCompany.trim()
      }
      // Arrays
      if (Array.isArray(profile.skills) && profile.skills.length > 0) payloadProfile.skills = profile.skills
      if (cleanExperience.length > 0) payloadProfile.experience = cleanExperience
      if (cleanEducation.length > 0) payloadProfile.education = cleanEducation

      const body: any = { profile: payloadProfile }
      // Visible confirmation that save is triggered and payload is built
      try {
        const previewPhone = payloadProfile.phone ? `phone=${payloadProfile.phone}` : "phone=\u2013"
        const previewCity = payloadProfile.location?.city ? `city=${payloadProfile.location.city}` : "city=\u2013"
        showToast(`Saving profile (${previewPhone}, ${previewCity})`, "info")
        if (typeof window !== 'undefined') {
          console.log('Profile save payload', body)
        }
      } catch {}
      if (typeof window !== 'undefined') {
        console.log('Profile save payload', body)
      }

      console.log(JSON.stringify(body),"JSON.stringify(body)")
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        showToast("Profile updated successfully!", "success")
        setIsEditing(false)
        // Update user context with new profile info
        login({ ...user, ...data.data }, token)
      } else {
        showToast(data.message || "Failed to update profile.", "error")
      }
    } catch {
      showToast("Network error. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFreelancerToggle = (checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      isFreelancer: checked,
      freelanceCompany: checked ? prev.freelanceCompany : ""
    }))
  }

  const getVisibilityIcon = () => {
    switch (profile?.profileVisibility) {
      case "public":
        return <Eye className="w-4 h-4" />
      case "private":
        return <Lock className="w-4 h-4" />
      case "freelance-hidden":
        return <EyeOff className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  const getVisibilityLabel = () => {
    switch (profile?.profileVisibility) {
      case "public":
        return "Public"
      case "private":
        return "Private"
      case "freelance-hidden":
        return "Hidden (Freelance)"
      default:
        return "Public"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your professional profile and preferences</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button onClick={() => setError("")} className="text-red-700">
                <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {success}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button onClick={() => setSuccess("")} className="text-green-700">
                <svg className="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L10 8.586l-1.293-1.293z" clipRule="evenodd" />
                </svg>
              </button>
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder-user.jpg" alt={profile?.firstName} />
                      <AvatarFallback className="text-2xl">
                        {(profile?.firstName?.[0] || '').toString()}{(profile?.lastName?.[0] || '').toString()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Upload className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-xl">
                    {profile?.firstName} {profile?.lastName}
                  </CardTitle>
                  <CardDescription>{profile?.title}</CardDescription>
                  
                  {/* Profile Visibility */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getVisibilityIcon()}
                    <Badge variant="secondary">{getVisibilityLabel()}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {isEditing ? (
                        <Input value={profile?.phone || ""} onChange={(e) => setProfile((p:any) => ({ ...(p || {}), phone: e.target.value }))} placeholder="Phone number" />
                      ) : (
                        <span>{profile?.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm relative">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {isEditing ? (
                        <div className="w-full">
                          <Input
                            value={locationQuery}
                            onChange={(e) => setLocationQuery(e.target.value)}
                            placeholder="City (type to search)"
                          />
                          {locationSuggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 bg-white border rounded shadow w-56 max-h-48 overflow-auto">
                              {locationSuggestions.map((s) => (
                                <button key={s} className="w-full text-left px-3 py-2 hover:bg-gray-100" onClick={() => { setProfile((p:any) => ({ ...p, location: { ...(p.location||{}), city: s } })); setLocationQuery(s); setLocationSuggestions([]) }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{profile?.location?.city}{profile?.location?.state ? `, ${profile?.location?.state}` : ""}</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Portfolio Links */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Portfolio Links</h4>
                    {profile?.website && (
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Globe className="w-4 h-4" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profile?.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profile?.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {profile?.youtube && (
                      <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                        <Youtube className="w-4 h-4" />
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <Separator />

                  {/* Freelance Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Freelance Status</span>
                      <Switch
                        checked={profile?.isFreelancer}
                        onCheckedChange={handleFreelancerToggle}
                        disabled={!isEditing}
                      />
                    </div>
                    {profile?.isFreelancer && (
                      <div className="text-xs text-gray-500">
                        {profile?.freelanceCompany ? (
                          <span>Company: {profile.freelanceCompany}</span>
                        ) : (
                          <span>No company specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <Textarea
                          value={profile?.summary}
                          onChange={(e) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-700">{profile?.summary}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill and press Add" />
                            <Button type="button" onClick={() => { if (!skillInput.trim()) return; setProfile((p:any) => ({ ...p, skills: [...(p.skills||[]), skillInput.trim()] })); setSkillInput("") }}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile?.skills?.map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {skill}
                                <button className="ml-1" onClick={() => setProfile((p:any) => ({ ...p, skills: (p.skills||[]).filter((_:any,i:number)=> i!==index) }))}>×</button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profile?.skills?.map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Work Experience</CardTitle>
                        {isEditing && (
                          <Button size="sm" onClick={openAddExp}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Add Experience
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {profile?.experience?.map((exp: any, i: number) => (
                          <div key={exp.id || i} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{exp.position}</h4>
                                <p className="text-gray-600">{exp.company}</p>
                                <p className="text-sm text-gray-500">
                                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                </p>
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => openEditExp(i)}>
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => deleteExp(i)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-700 mt-2">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Experience Modal */}
                  <Dialog open={showExpModal} onOpenChange={setShowExpModal}>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{expEditIndex === null ? "Add" : "Edit"} Experience</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <Input placeholder="Position" value={expForm.position} onChange={e => setExpForm(f => ({ ...f, position: e.target.value }))} />
                        <Input placeholder="Company" value={expForm.company} onChange={e => setExpForm(f => ({ ...f, company: e.target.value }))} />
                        <Input type="date" placeholder="Start Date" value={expForm.startDate} onChange={e => setExpForm(f => ({ ...f, startDate: e.target.value }))} />
                        <Input type="date" placeholder="End Date" value={expForm.endDate} onChange={e => setExpForm(f => ({ ...f, endDate: e.target.value }))} disabled={expForm.current} />
                        <label className="flex items-center gap-2"><input type="checkbox" checked={expForm.current} onChange={e => setExpForm(f => ({ ...f, current: e.target.checked }))} />Current</label>
                        <Textarea placeholder="Description" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} />
                      </div>
                      <DialogFooter>
                        <Button onClick={saveExp}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Education</CardTitle>
                        {isEditing && (
                          <Button size="sm" onClick={openAddEdu}>
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Add Education
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {profile?.education?.map((edu: any, i: number) => (
                          <div key={edu.id || i} className="border-l-4 border-green-500 pl-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                                <p className="text-gray-600">{edu.institution}</p>
                                <p className="text-sm text-gray-500">
                                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                </p>
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => openEditEdu(i)}>
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => deleteEdu(i)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Education Modal */}
                  <Dialog open={showEduModal} onOpenChange={setShowEduModal}>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{eduEditIndex === null ? "Add" : "Edit"} Education</DialogTitle></DialogHeader>
                      <div className="space-y-3">
                        <Input placeholder="Degree" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} />
                        <Input placeholder="Field of Study" value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} />
                        <Input placeholder="Institution" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} />
                        <Input type="date" placeholder="Start Date" value={eduForm.startDate} onChange={e => setEduForm(f => ({ ...f, startDate: e.target.value }))} />
                        <Input type="date" placeholder="End Date" value={eduForm.endDate} onChange={e => setEduForm(f => ({ ...f, endDate: e.target.value }))} disabled={eduForm.current} />
                        <label className="flex items-center gap-2"><input type="checkbox" checked={eduForm.current} onChange={e => setEduForm(f => ({ ...f, current: e.target.checked }))} />Current</label>
                      </div>
                      <DialogFooter>
                        <Button onClick={saveEdu}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Visibility</CardTitle>
                      <CardDescription>
                        Control who can see your profile information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Profile Visibility</label>
                        <Select
                          value={profile?.profileVisibility}
                          onValueChange={(value) => setProfile(prev => ({ ...prev, profileVisibility: value }))}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>Public - Anyone can view</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                <span>Private - Only you can view</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="freelance-hidden">
                              <div className="flex items-center gap-2">
                                <EyeOff className="w-4 h-4" />
                                <span>Hidden - Hidden when freelancing</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {profile?.isFreelancer && (
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Freelance Company</label>
                          <Input
                            value={profile?.freelanceCompany}
                            onChange={(e) => setProfile(prev => ({ ...prev, freelanceCompany: e.target.value }))}
                            placeholder="Enter your freelance company name"
                            disabled={!isEditing}
                          />
                          <p className="text-xs text-gray-500">
                            When you're a freelancer, your profile will be hidden from public view if you choose "Hidden" visibility.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Links</CardTitle>
                      <CardDescription>
                        Add your professional portfolio links
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          value={profile?.website}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-website.com"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium">LinkedIn</label>
                        <Input
                          value={profile?.linkedin}
                          onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/your-profile"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium">GitHub</label>
                        <Input
                          value={profile?.github}
                          onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                          placeholder="https://github.com/your-username"
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium">YouTube</label>
                        <Input
                          value={profile?.youtube}
                          onChange={(e) => setProfile(prev => ({ ...prev, youtube: e.target.value }))}
                          placeholder="https://youtube.com/@your-channel"
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 