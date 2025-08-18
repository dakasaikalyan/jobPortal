"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  BookOpen,
  ArrowRight,
  Tag,
  TrendingUp
} from "lucide-react"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    "all",
    "career-tips",
    "interview-prep",
    "resume-writing",
    "job-search",
    "workplace",
    "industry-news"
  ]

  const blogPosts = [
    {
      id: 1,
      title: "10 Essential Interview Questions You Should Prepare For",
      excerpt: "Master these common interview questions to boost your confidence and increase your chances of landing the job.",
      author: "Sarah Johnson",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "interview-prep",
      image: "/placeholder.jpg",
      tags: ["Interview", "Career Tips", "Preparation"]
    },
    {
      id: 2,
      title: "How to Write a Resume That Stands Out in 2024",
      excerpt: "Learn the latest resume writing techniques and formatting tips to make your application shine in today's competitive job market.",
      author: "Michael Chen",
      date: "2024-01-12",
      readTime: "8 min read",
      category: "resume-writing",
      image: "/placeholder.jpg",
      tags: ["Resume", "Career Development", "Job Search"]
    },
    {
      id: 3,
      title: "The Future of Remote Work: Trends and Predictions",
      excerpt: "Explore how remote work is evolving and what it means for job seekers and employers in the coming years.",
      author: "Emily Rodriguez",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "workplace",
      image: "/placeholder.jpg",
      tags: ["Remote Work", "Future of Work", "Trends"]
    },
    {
      id: 4,
      title: "Networking Strategies That Actually Work",
      excerpt: "Discover proven networking techniques that can help you build meaningful professional relationships and advance your career.",
      author: "David Kim",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "career-tips",
      image: "/placeholder.jpg",
      tags: ["Networking", "Career Growth", "Relationships"]
    },
    {
      id: 5,
      title: "Top Skills Employers Are Looking for in 2024",
      excerpt: "Stay ahead of the curve by developing the most in-demand skills that will make you attractive to employers this year.",
      author: "Lisa Wang",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "career-tips",
      image: "/placeholder.jpg",
      tags: ["Skills", "Career Development", "2024 Trends"]
    },
    {
      id: 6,
      title: "How to Successfully Change Careers at Any Age",
      excerpt: "Age is just a number when it comes to career changes. Learn how to navigate a successful transition regardless of your stage in life.",
      author: "Robert Smith",
      date: "2024-01-03",
      readTime: "9 min read",
      category: "career-tips",
      image: "/placeholder.jpg",
      tags: ["Career Change", "Transition", "Personal Growth"]
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'career-tips': 'Career Tips',
      'interview-prep': 'Interview Prep',
      'resume-writing': 'Resume Writing',
      'job-search': 'Job Search',
      'workplace': 'Workplace',
      'industry-news': 'Industry News'
    }
    return labels[category] || category
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Career Insights & Tips</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay ahead in your career with expert advice, industry insights, and practical tips 
            from our team of career professionals and industry experts.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles, topics, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All Posts" : getCategoryLabel(category)}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-full">
                  <img
                    src={filteredPosts[0].image}
                    alt={filteredPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {getCategoryLabel(filteredPosts[0].category)}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {filteredPosts[0].author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(filteredPosts[0].date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {filteredPosts[0].readTime}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold mb-4 leading-tight">
                    {filteredPosts[0].title}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {filteredPosts[0].excerpt}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filteredPosts[0].tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-fit">
                    Read Full Article
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-48">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {getCategoryLabel(post.category)}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatDate(post.date)}
                  </span>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all categories</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Stay Updated with Career Insights</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Get the latest career tips, industry news, and job search strategies delivered 
                directly to your inbox. Never miss an opportunity to advance your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
