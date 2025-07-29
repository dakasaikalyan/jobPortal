"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Building, CheckCircle } from "lucide-react"

const stats = [
  { icon: TrendingUp, label: "Active Jobs", value: 12500, suffix: "+" },
  { icon: Users, label: "Job Seekers", value: 85000, suffix: "+" },
  { icon: Building, label: "Companies", value: 2500, suffix: "+" },
  { icon: CheckCircle, label: "Success Stories", value: 15000, suffix: "+" },
]

export function StatsSection() {
  const [counters, setCounters] = useState(stats.map(() => 0))

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    stats.forEach((stat, index) => {
      const increment = stat.value / steps
      let currentStep = 0

      const timer = setInterval(() => {
        currentStep++
        setCounters((prev) => {
          const newCounters = [...prev]
          newCounters[index] = Math.min(Math.floor(increment * currentStep), stat.value)
          return newCounters
        })

        if (currentStep >= steps) {
          clearInterval(timer)
        }
      }, stepDuration)
    })
  }, [])

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {counters[index].toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
