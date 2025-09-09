const twilio = require('twilio')

class SMSService {
  constructor() {
    this.client = null
    this.isConfigured = false
    
    // Initialize Twilio if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
      this.isConfigured = true
    }
  }

  async sendOTP(phoneNumber, otp) {
    try {
      if (!this.isConfigured) {
        // Fallback to console log for development
        console.log(`SMS OTP for ${phoneNumber}: ${otp}`)
        return {
          success: true,
          message: 'OTP sent successfully (development mode)',
          sid: 'dev-' + Date.now()
        }
      }

      const message = await this.client.messages.create({
        body: `Your JobPortal verification code is: ${otp}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      })

      return {
        success: true,
        message: 'OTP sent successfully',
        sid: message.sid
      }
    } catch (error) {
      console.error('SMS sending error:', error)
      return {
        success: false,
        message: 'Failed to send SMS',
        error: error.message
      }
    }
  }

  async sendJobApplicationNotification(phoneNumber, jobTitle, companyName) {
    try {
      if (!this.isConfigured) {
        console.log(`Job Application SMS for ${phoneNumber}: You applied for ${jobTitle} at ${companyName}`)
        return { success: true, message: 'Notification sent (development mode)' }
      }

      const message = await this.client.messages.create({
        body: `Thank you for applying to ${jobTitle} at ${companyName}. We'll review your application and get back to you soon.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      })

      return {
        success: true,
        message: 'Notification sent successfully',
        sid: message.sid
      }
    } catch (error) {
      console.error('SMS notification error:', error)
      return {
        success: false,
        message: 'Failed to send notification',
        error: error.message
      }
    }
  }

  async sendApplicationStatusUpdate(phoneNumber, jobTitle, status) {
    try {
      if (!this.isConfigured) {
        console.log(`Status Update SMS for ${phoneNumber}: Your application for ${jobTitle} status: ${status}`)
        return { success: true, message: 'Status update sent (development mode)' }
      }

      const statusMessages = {
        'shortlisted': 'Congratulations! You have been shortlisted for',
        'rejected': 'Unfortunately, your application for',
        'hired': 'Great news! You have been selected for',
        'interview-scheduled': 'Your interview has been scheduled for'
      }

      const message = await this.client.messages.create({
        body: `${statusMessages[status] || 'Update on your application for'} ${jobTitle}. Please check your dashboard for details.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      })

      return {
        success: true,
        message: 'Status update sent successfully',
        sid: message.sid
      }
    } catch (error) {
      console.error('SMS status update error:', error)
      return {
        success: false,
        message: 'Failed to send status update',
        error: error.message
      }
    }
  }
}

module.exports = new SMSService()
