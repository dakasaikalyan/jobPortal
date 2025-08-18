"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, MapPin, Users, Globe } from "lucide-react"

interface Company {
  _id: string
  name: string
  description: string
  location: string
  industry: string
  size: string
  website: string
  logo: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([])

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companies)
    } else {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCompanies(filtered)
    }
  }, [searchTerm, companies])

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies")
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies || [])
      } else {
        // If API fails, show sample data
        setCompanies([
          {
            _id: "1",
            name: "TechCorp Solutions",
            description: "Leading technology solutions provider specializing in AI and machine learning applications.",
            location: "San Francisco, CA",
            industry: "Technology",
            size: "500-1000",
            website: "https://techcorp.com",
            logo: "/placeholder-logo.png"
          },
          {
            _id: "2",
            name: "Green Energy Co.",
            description: "Sustainable energy solutions for a cleaner future.",
            location: "Austin, TX",
            industry: "Energy",
            size: "100-500",
            website: "https://greenenergy.com",
            logo: "/placeholder-logo.png"
          },
          {
            _id: "3",
            name: "HealthTech Innovations",
            description: "Revolutionary healthcare technology improving patient outcomes.",
            location: "Boston, MA",
            industry: "Healthcare",
            size: "1000+",
            website: "https://healthtech.com",
            logo: "/placeholder-logo.png"
          }
        ])
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
      // Show sample data on error
      setCompanies([
        {
          _id: "1",
          name: "TechCorp Solutions",
          description: "Leading technology solutions provider specializing in AI and machine learning applications.",
          location: "San Francisco, CA",
          industry: "Technology",
          size: "500-1000",
          website: "https://techcorp.com",
          logo: "/placeholder-logo.png"
        },
        {
          _id: "2",
          name: "Green Energy Co.",
          description: "Sustainable energy solutions for a cleaner future.",
          location: "Austin, TX",
          industry: "Energy",
          size: "100-500",
          website: "https://greenenergy.com",
          logo: "/placeholder-logo.png"
        },
        {
          _id: "3",
          name: "HealthTech Innovations",
          description: "Revolutionary healthcare technology improving patient outcomes.",
          location: "Boston, MA",
          industry: "Healthcare",
          size: "1000+",
          website: "https://healthtech.com",
          logo: "/placeholder-logo.png"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Companies</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Explore top companies across various industries and find your next career opportunity
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
              placeholder="Search companies by name, industry, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company._id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4">
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <CardTitle className="text-xl font-semibold">{company.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {company.industry} • {company.size} employees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{company.size} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  View Jobs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
