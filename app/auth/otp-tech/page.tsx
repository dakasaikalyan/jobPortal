"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-context"

export default function OtpTechPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const { showToast } = useToast()

  const send = async () => {
    if (!email) return
    await fetch("/api/auth/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) })
    showToast("Static OTP for tech demo is 123456", "info")
  }
  const verify = async () => {
    if (otp === "123456") {
      showToast("OTP verified (static demo)", "success")
    } else {
      showToast("Invalid OTP (demo expects 123456)", "error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OTP Tech Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={send}>Send OTP</Button>
            <Button variant="outline" onClick={() => setOtp("123456")}>Auto-fill 123456</Button>
          </div>
          <Input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={verify} className="w-full">Verify</Button>
        </CardContent>
      </Card>
    </div>
  )
}


