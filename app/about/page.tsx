"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Star
} from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Companies", value: "500+", icon: Globe },
    { label: "Jobs Posted", value: "10K+", icon: Target },
    { label: "Success Rate", value: "95%", icon: Award }
  ]

  const values = [
    {
      icon: Heart,
      title: "User-Centric",
      description: "We put our users first, ensuring every feature serves their career goals and aspirations."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and privacy are our top priorities with enterprise-grade security measures."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology and user experience."
    },
    {
      icon: Star,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service and platform."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former HR executive with 15+ years experience in talent acquisition and career development.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Tech leader with expertise in AI, machine learning, and scalable platform architecture.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product strategist passionate about creating intuitive user experiences that drive results.",
      image: "/placeholder-user.jpg"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About JobPortal Pro</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're on a mission to connect talented professionals with their dream careers, 
            making the job search process seamless and successful for everyone.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              To democratize career opportunities by providing a platform that connects talented individuals 
              with companies that value their skills and potential. We believe everyone deserves access to 
              meaningful work that aligns with their passions and goals.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Through innovative technology and human-centered design, we're transforming how people find 
              jobs and how companies discover talent, creating a more efficient and equitable job market.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become the world's most trusted platform for career growth, where every professional 
              can find their perfect opportunity and every company can build their dream team.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud of the positive impact we've made on countless careers and businesses
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These core values guide everything we do and shape our company culture
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind JobPortal Pro who are dedicated to your success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Lightbulb className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              JobPortal Pro was born from a simple observation: the job search process was broken. 
              Talented professionals were struggling to find opportunities that matched their skills, 
              while companies were missing out on exceptional candidates due to inefficient hiring processes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded in 2023, we set out to create a platform that would revolutionize how people 
              connect with career opportunities. We combined cutting-edge technology with deep insights 
              into the hiring process to build a solution that benefits both job seekers and employers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we're proud to have helped thousands of professionals find their dream jobs and 
              hundreds of companies build their dream teams. But our journey is just beginning, and 
              we're excited to continue innovating and improving the career landscape for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking for your next career move or seeking to hire exceptional talent, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
