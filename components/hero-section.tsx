"use client"

import { useState } from "react"
import { Search, MapPin, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")

  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">10,000+ Jobs Available</span>
          </div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            Find Your
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Dream Job
            </span>
          </motion.h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 animate-slide-up delay-200">
            Connect with top employers and discover opportunities that match your skills and ambitions
          </p>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-gray-900 border-0 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 h-12 text-gray-900 border-0 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Popular searches */}
          <div className="mt-8 animate-fade-in delay-600">
            <p className="text-blue-200 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Frontend Developer", "Product Manager", "Data Scientist", "UX Designer", "DevOps Engineer"].map(
                (term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-all duration-300 hover:scale-105"
                  >
                    {term}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
