"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Briefcase, User, Search, Bell, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/AuthContext"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  // Role-based dashboard link
  let dashboardLink = "/dashboard"
  if (user?.role === "employer") dashboardLink = "/dashboard/employer"
  if (user?.role === "admin") dashboardLink = "/dashboard/admin"

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobPortal Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Find Jobs
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-blue-600 transition-colors">
              Companies
            </Link>
            <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">
              Resources
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                More <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/about">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/blog">Blog</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user && user.role === "admin" && (
              <Link href="/dashboard/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                Admin
              </Link>
            )}
            {user && user.role === "employer" && (
              <Link href="/dashboard/employer" className="text-gray-700 hover:text-blue-600 transition-colors">
                Employer
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            {!user && (
              <>
                <Button variant="outline" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full gap-2">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">
                Find Jobs
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600 transition-colors">
                Companies
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition-colors">
                Resources
              </Link>
              {user && (
                <Link href={dashboardLink} className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              )}
              {user && user.role === "admin" && (
                <Link href="/dashboard/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Admin
                </Link>
              )}
              {user && user.role === "employer" && (
                <Link href="/dashboard/employer" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Employer
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {!user && (
                  <>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                      <Link href="/auth/register">Get Started</Link>
                    </Button>
                  </>
                )}
                {user && (
                  <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
