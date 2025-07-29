"use client"

import { useState } from "react"
import { MapPin, Clock, DollarSign, Users, Heart, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    logo: "🚀",
    tags: ["React", "TypeScript", "Next.js"],
    posted: "2 days ago",
    applicants: 45,
    description: "Join our innovative team building the next generation of web applications.",
    featured: true,
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    logo: "💡",
    tags: ["Strategy", "Analytics", "Leadership"],
    posted: "1 day ago",
    applicants: 32,
    description: "Lead product strategy and drive innovation in our fast-growing startup.",
    featured: true,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignStudio",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $110k",
    logo: "🎨",
    tags: ["Figma", "Prototyping", "User Research"],
    posted: "3 days ago",
    applicants: 28,
    description: "Create beautiful and intuitive user experiences for our clients.",
    featured: false,
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataCorp",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130k - $170k",
    logo: "📊",
    tags: ["Python", "Machine Learning", "SQL"],
    posted: "1 week ago",
    applicants: 67,
    description: "Analyze complex datasets and build predictive models.",
    featured: true,
  },
]

export function FeaturedJobs() {
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover hand-picked positions from top companies looking for talented professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {featuredJobs.map((job, index) => (
            <Card
              key={job.id}
              className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg ${
                job.featured ? "ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50" : "bg-white"
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                      {job.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2 rounded-full transition-all duration-300 ${
                      savedJobs.includes(job.id)
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                {job.featured && (
                  <Badge className="w-fit bg-gradient-to-r from-yellow-400 to-orange-500 text-white">⭐ Featured</Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600">{job.description}</p>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {job.applicants} applicants
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-blue-50 bg-transparent">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-500">Posted {job.posted}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover:bg-blue-50 hover:border-blue-300 bg-transparent">
            View All Jobs
          </Button>
        </div>
      </div>
    </section>
  )
}
