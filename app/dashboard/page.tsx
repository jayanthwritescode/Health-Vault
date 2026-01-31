'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Stethoscope, 
  User, 
  Calendar,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                <Stethoscope className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">Health Vault</span>
                <div className="text-xs text-muted-foreground">Dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {userName}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-muted-foreground">
              Choose your role to continue using Health Vault
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Patient Portal</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Access your health assistant and medical records
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-primary" />
                      <span>AI Health Assistant</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Medical Reports</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Appointments</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/patient/assistant')}
                  >
                    Enter Patient Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Doctor Portal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-elevated transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Doctor Portal</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Clinical dashboard and documentation tools
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>Appointments</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span>Clinical Documentation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-secondary" />
                      <span>Emergency Alerts</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push('/doctor')}
                  >
                    Enter Doctor Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{userName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <p className="font-medium text-xs">{user.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Account Created:</span>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
