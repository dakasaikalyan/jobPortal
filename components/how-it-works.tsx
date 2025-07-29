import { Search, FileText, Users, Trophy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse thousands of job opportunities from top companies worldwide",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Apply with Ease",
    description: "Submit your application with our streamlined process and AI-powered matching",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Connect & Interview",
    description: "Get connected with hiring managers and schedule interviews seamlessly",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    title: "Land Your Dream Job",
    description: "Receive offers and start your new career journey with confidence",
    color: "from-orange-500 to-red-500",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to the perfect job in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card
                key={step.title}
                className="relative group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
