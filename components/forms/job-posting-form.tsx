"use client"

import React, { useState } from 'react'
import { useToast } from '@/components/ui/toast-context'
import { FileUpload } from '@/components/ui/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, MapPin, DollarSign, Briefcase, User, Calendar } from 'lucide-react'

interface Location {
  city: string
  state: string
  country: string
  remote: boolean
}

interface JobPostingFormProps {
  onSubmit: (data: any) => void
  loading?: boolean
  initialData?: any
}

export function JobPostingForm({ onSubmit, loading = false, initialData }: JobPostingFormProps) {
  const { showActionToast } = useToast()
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    jobType: initialData?.jobType || 'full-time',
    experienceLevel: initialData?.experienceLevel || '',
    experienceLevelText: initialData?.experienceLevelText || '',
    salaryMin: initialData?.salary?.min || '',
    salaryMax: initialData?.salary?.max || '',
    currency: initialData?.salary?.currency || 'USD',
    salaryPeriod: initialData?.salary?.period || 'yearly',
    skills: initialData?.skills || [],
    benefits: initialData?.benefits || [],
    applicationDeadline: initialData?.applicationDeadline || '',
    ...initialData
  })

  const [locations, setLocations] = useState<Location[]>(
    initialData?.locations || [{ city: '', state: '', country: '', remote: false }]
  )
  const [newLocation, setNewLocation] = useState<Location>({ city: '', state: '', country: '', remote: false })
  const [newSkill, setNewSkill] = useState('')
  const [newBenefit, setNewBenefit] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const jobTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' }
  ]

  const experienceLevels = [
    { value: 'entry-level', label: 'Entry Level (0-2 years)' },
    { value: 'mid-level', label: 'Mid Level (3-5 years)' },
    { value: 'senior-level', label: 'Senior Level (6-10 years)' },
    { value: 'executive', label: 'Executive (10+ years)' }
  ]

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' }
  ]

  const salaryPeriods = [
    { value: 'hourly', label: 'Per Hour' },
    { value: 'monthly', label: 'Per Month' },
    { value: 'yearly', label: 'Per Year' }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (index: number, field: keyof Location, value: any) => {
    const newLocations = [...locations]
    newLocations[index] = { ...newLocations[index], [field]: value }
    setLocations(newLocations)
  }

  const addLocation = () => {
    if (newLocation.city && newLocation.state && newLocation.country) {
      setLocations([...locations, newLocation])
      setNewLocation({ city: '', state: '', country: '', remote: false })
    } else {
      showActionToast('Add', 'location', false, 'Please fill in all required fields')
    }
  }

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index))
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit('')
    }
  }

  const removeBenefit = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b !== benefit)
    }))
  }

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      showActionToast('Create', 'job', false, 'Job title is required')
      return
    }
    
    if (!formData.description.trim()) {
      showActionToast('Create', 'job', false, 'Job description is required')
      return
    }
    
    if (!formData.requirements.trim()) {
      showActionToast('Create', 'job', false, 'Job requirements are required')
      return
    }
    
    if (!formData.experienceLevelText.trim()) {
      showActionToast('Create', 'job', false, 'Experience level description is required')
      return
    }
    
    if (locations.some(loc => !loc.city || !loc.state || !loc.country)) {
      showActionToast('Create', 'job', false, 'All location fields are required')
      return
    }

    const submitData = {
      ...formData,
      locations: locations.filter(loc => loc.city && loc.state && loc.country),
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        max: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        currency: formData.currency,
        period: formData.salaryPeriod
      },
      applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined,
      files: uploadedFiles
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Details
          </CardTitle>
          <CardDescription>Basic information about the job position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              rows={6}
              required
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="List the required skills, qualifications, and experience..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experienceLevel">Experience Level *</Label>
              <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="experienceLevelText">Experience Description *</Label>
              <Input
                id="experienceLevelText"
                value={formData.experienceLevelText}
                onChange={(e) => handleInputChange('experienceLevelText', e.target.value)}
                placeholder="e.g., 3-5 years of React development experience"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Locations
          </CardTitle>
          <CardDescription>Add one or more work locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {locations.map((location, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <Label>City *</Label>
                <Input
                  value={location.city}
                  onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                  placeholder="e.g., San Francisco"
                  required
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={location.state}
                  onChange={(e) => handleLocationChange(index, 'state', e.target.value)}
                  placeholder="e.g., California"
                  required
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Input
                  value={location.country}
                  onChange={(e) => handleLocationChange(index, 'country', e.target.value)}
                  placeholder="e.g., United States"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`remote-${index}`}
                    checked={location.remote}
                    onChange={(e) => handleLocationChange(index, 'remote', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`remote-${index}`}>Remote</Label>
                </div>
                {locations.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLocation(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div>
              <Label>Add New Location</Label>
              <Input
                value={newLocation.city}
                onChange={(e) => setNewLocation(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
              />
            </div>
            <div>
              <Label>&nbsp;</Label>
              <Input
                value={newLocation.state}
                onChange={(e) => setNewLocation(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State"
              />
            </div>
            <div>
              <Label>&nbsp;</Label>
              <Input
                value={newLocation.country}
                onChange={(e) => setNewLocation(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Country"
              />
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={addLocation} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Salary & Benefits
          </CardTitle>
          <CardDescription>Compensation and benefits information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                placeholder="e.g., 80000"
              />
            </div>
            <div>
              <Label htmlFor="salaryMax">Maximum Salary</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                placeholder="e.g., 120000"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salaryPeriod">Period</Label>
              <Select value={formData.salaryPeriod} onValueChange={(value) => handleInputChange('salaryPeriod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {salaryPeriods.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Required Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Benefits</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {benefit}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeBenefit(benefit)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Additional Documents
          </CardTitle>
          <CardDescription>Upload any additional documents related to this job</CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload
            onFileSelect={handleFileSelect}
            uploadType="document"
            acceptedTypes={['application/pdf', '.doc', '.docx', 'image/*']}
            maxFiles={3}
            maxSize={5}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Posting Job...' : 'Post Job'}
        </Button>
      </div>
    </form>
  )
}
