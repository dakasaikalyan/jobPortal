"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  Target, 
  TrendingUp,
  Award,
  Lightbulb,
  Calendar,
  Download
} from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      id: 1,
      title: "Resume Writing Guide",
      description: "Learn how to create a compelling resume that stands out to employers",
      type: "Guide",
      category: "Career Development",
      duration: "15 min read",
      icon: FileText,
      tags: ["Resume", "Career Tips", "Job Search"]
    },
    {
      id: 2,
      title: "Interview Preparation",
      description: "Master common interview questions and techniques to ace your next interview",
      type: "Video Series",
      category: "Interview Skills",
      duration: "45 min",
      icon: Video,
      tags: ["Interview", "Preparation", "Communication"]
    },
    {
      id: 3,
      title: "Networking Strategies",
      description: "Build meaningful professional relationships and expand your career network",
      type: "Guide",
      category: "Networking",
      duration: "20 min read",
      icon: Users,
      tags: ["Networking", "Relationships", "Career Growth"]
    },
    {
      id: 4,
      title: "Salary Negotiation",
      description: "Learn effective strategies to negotiate your salary and benefits",
      type: "Webinar",
      category: "Compensation",
      duration: "60 min",
      icon: TrendingUp,
      tags: ["Salary", "Negotiation", "Benefits"]
    },
    {
      id: 5,
      title: "Career Change Guide",
      description: "Navigate a successful career transition with our comprehensive guide",
      type: "Guide",
      category: "Career Transition",
      duration: "30 min read",
      icon: Target,
      tags: ["Career Change", "Transition", "Planning"]
    },
    {
      id: 6,
      title: "Personal Branding",
      description: "Build a strong personal brand that sets you apart in your industry",
      type: "Course",
      category: "Personal Branding",
      duration: "2 hours",
      icon: Award,
      tags: ["Branding", "Online Presence", "Professional Image"]
    }
  ]

  const categories = [
    "All",
    "Career Development",
    "Interview Skills", 
    "Networking",
    "Compensation",
    "Career Transition",
    "Personal Branding"
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Career Resources</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Access expert advice, guides, and tools to accelerate your career growth and job search success
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "All" ? "default" : "secondary"}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <resource.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {resource.duration}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {resource.category}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Access Resource
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Need Personalized Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our career advisors are here to provide personalized guidance and support for your unique career journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-blue-50">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">1-on-1 Coaching</h3>
              <p className="text-sm text-gray-600">Get personalized career advice from industry experts</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-purple-50">
              <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Career Planning</h3>
              <p className="text-sm text-gray-600">Develop a strategic roadmap for your career goals</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-green-50">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Skill Development</h3>
              <p className="text-sm text-gray-600">Identify and develop in-demand skills for your field</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
