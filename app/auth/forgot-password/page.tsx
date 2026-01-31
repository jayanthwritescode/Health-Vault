'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Stethoscope, 
  Mail, 
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/contexts/auth-context'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { resetPassword, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await resetPassword(email)
      
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-clinical border-border/50">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Email Sent!</h2>
              <p className="text-muted-foreground mb-4">
                We've sent password reset instructions to your email address. 
                Please check your inbox and follow the link to reset your password.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={() => router.push('/auth/login')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
                <Link 
                  href="/"
                  className="block text-sm text-primary hover:underline"
                >
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link 
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Forgot Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-clinical border-border/50">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                  <Stethoscope className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <p className="text-muted-foreground">
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11"
                  disabled={isLoading || loading}
                >
                  {isLoading || loading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Instructions'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link 
                    href="/auth/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access for Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-3">Quick Access</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/patient/assistant')}
              className="text-xs"
            >
              Try as Patient
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/doctor')}
              className="text-xs"
            >
              Try as Doctor
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
