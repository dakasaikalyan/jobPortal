"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    image: "👩‍💻",
    rating: 5,
    text: "This platform completely transformed my job search. The AI matching was incredibly accurate, and I landed my dream job at Google within 3 weeks!",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    image: "👨‍💼",
    rating: 5,
    text: "The quality of job listings here is outstanding. Every application I submitted led to meaningful conversations with hiring managers.",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Airbnb",
    image: "👩‍🎨",
    rating: 5,
    text: "I love how the platform showcases not just jobs, but company culture and growth opportunities. It helped me find the perfect cultural fit.",
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Hear from professionals who found their dream careers through our platform
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-12 text-center">
              <Quote className="w-12 h-12 mx-auto mb-6 text-yellow-400" />

              <div className="text-6xl mb-6">{currentTestimonial.image}</div>

              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{currentTestimonial.text}"
              </blockquote>

              <div className="flex justify-center mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="mb-8">
                <div className="font-bold text-xl">{currentTestimonial.name}</div>
                <div className="text-blue-200">
                  {currentTestimonial.role} at {currentTestimonial.company}
                </div>
              </div>

              <div className="flex justify-center items-center gap-4">
                <Button variant="ghost" size="icon" onClick={prevTestimonial} className="text-white hover:bg-white/20">
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>

                <Button variant="ghost" size="icon" onClick={nextTestimonial} className="text-white hover:bg-white/20">
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
