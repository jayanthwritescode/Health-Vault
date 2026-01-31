'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Mic,
  MessageSquare,
  Clock,
  Shield,
  Languages,
  ArrowRight,
  Stethoscope,
  FileText,
  Activity,
  Calendar,
  Globe2,
  Zap,
  Lock,
  Users2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-clinical">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-clinical">
                <Stethoscope className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight">Health Vault</span>
                <div className="text-xs text-muted-foreground hidden sm:block">Healthcare Conversations</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => router.push('/patient/assistant')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              >
                For Patients
              </button>
              <button 
                onClick={() => router.push('/doctor')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              >
                For Doctors
              </button>
              <div className="flex items-center gap-2 text-sm">
                <Languages className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <span className="text-muted-foreground">8 Languages</span>
              </div>
            </nav>

            {/* CTA & Theme Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/auth/login')}
                className="bg-accent hover:bg-accent/90 text-white h-9 px-4 text-sm font-medium shadow-elevated hidden sm:flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/patient/select-language')}
                variant="outline"
                className="h-9 px-4 text-sm font-medium hidden sm:flex"
              >
                <Mic className="w-4 h-4 mr-2" strokeWidth={2} />
                Try Demo
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Asymmetric Hero - Text Left, Visual Right */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Content - Wider column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 pt-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Available 24/7 • No signup required
              </div>
              
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-clinical mb-6">
                Healthcare
                <br />
                conversations
                <br />
                <span className="text-primary">in your language</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-comfortable max-w-xl mb-10">
                Talk to your AI health assistant in 8 Indian languages. Get instant help with appointments, 
                medical reports, and health questions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/auth/signup')}
                  className="bg-accent hover:bg-accent/90 text-white h-12 px-6 text-base font-medium shadow-elevated"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => router.push('/patient/select-language')}
                  className="h-12 px-6 text-base font-medium border-2"
                >
                  <Mic className="w-4 h-4 mr-2" strokeWidth={2} />
                  Try Demo
                </Button>
              </div>
              
              {/* Inline stats - not in boxes */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
                <div>
                  <div className="text-2xl font-display font-bold text-foreground">8</div>
                  <div className="text-muted-foreground">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-foreground">100%</div>
                  <div className="text-muted-foreground">Free</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-foreground">24/7</div>
                  <div className="text-muted-foreground">Available</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual Element - Narrower column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Intentional overlap - breaks container */}
              <div className="relative lg:absolute lg:-right-12 lg:top-0 w-full lg:w-[120%]">
                <div className="rounded-xl bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 border border-primary/20 p-8 shadow-prominent relative overflow-hidden">
                  {/* Enhanced background pattern */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }} />
                  
                  {/* Main Feature Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                    {[
                      { icon: Mic, label: 'Voice Mode', desc: 'Speak naturally', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                      { icon: MessageSquare, label: 'Text Chat', desc: 'Type freely', color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20' },
                      { icon: Calendar, label: 'Schedule', desc: 'Book instantly', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
                      { icon: FileText, label: 'Reports', desc: 'Understand easily', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className={`bg-card border-2 ${item.border} rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:shadow-elevated transition-all cursor-default group`}
                      >
                        <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-clinical`}>
                          <item.icon className={`w-7 h-7 ${item.color}`} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{item.desc}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3 relative z-10">
                    {[
                      { icon: Shield, text: 'HIPAA Compliant & Secure', color: 'text-primary' },
                      { icon: Globe2, text: '8 Indian Languages', color: 'text-secondary' },
                      { icon: Zap, text: 'Instant AI Responses', color: 'text-accent' }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-3 hover:border-primary/30 transition-smooth"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-background flex items-center justify-center flex-shrink-0`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Enhanced decorative elements */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute -top-6 -left-6 w-28 h-28 bg-accent/10 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-2xl" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bento Box Features - Asymmetric Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Built for India's healthcare needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Comprehensive AI assistance that understands your language and context
            </p>
          </div>

          {/* Bento Grid - Intentionally asymmetric */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
            {/* Large feature - spans 4 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 bg-card border border-border rounded-lg p-8 shadow-clinical hover:shadow-elevated transition-smooth"
            >
              <Languages className="w-10 h-10 text-primary mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-2xl font-bold mb-3">8 Indian Languages</h3>
              <p className="text-muted-foreground leading-comfortable mb-6">
                Speak naturally in English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, or Kannada. 
                Our AI understands context, medical terminology, and regional dialects.
              </p>
              <div className="flex flex-wrap gap-2">
                {['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ'].map((lang, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {lang}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Small feature - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 bg-card border border-border rounded-lg p-6 shadow-clinical hover:shadow-elevated transition-smooth"
            >
              <Clock className="w-8 h-8 text-primary mb-3" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-bold mb-2">24/7 Access</h3>
              <p className="text-sm text-muted-foreground leading-comfortable">
                Get health assistance anytime, anywhere. No waiting rooms.
              </p>
            </motion.div>

            {/* Medium feature - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-card border border-border rounded-lg p-6 shadow-clinical hover:shadow-elevated transition-smooth"
            >
              <Shield className="w-8 h-8 text-primary mb-3" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground leading-comfortable">
                Enterprise-grade encryption. Your health data stays secure and private.
              </p>
            </motion.div>

            {/* Medium feature - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-card border border-border rounded-lg p-6 shadow-clinical hover:shadow-elevated transition-smooth"
            >
              <FileText className="w-8 h-8 text-primary mb-3" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-bold mb-2">Smart Docs</h3>
              <p className="text-sm text-muted-foreground leading-comfortable">
                Auto-generate SOAP notes, ICD-10 codes, and prescriptions instantly.
              </p>
            </motion.div>

            {/* Tall feature - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-primary text-primary-foreground rounded-lg p-6 shadow-clinical hover:shadow-elevated transition-smooth"
            >
              <Zap className="w-8 h-8 mb-3" strokeWidth={1.5} />
              <h3 className="font-display text-xl font-bold mb-2">Instant Responses</h3>
              <p className="text-sm opacity-90 leading-comfortable mb-4">
                Get immediate answers to health questions. No more waiting for callbacks.
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => router.push('/patient/assistant')}
                className="w-full"
              >
                Try Now
                <ArrowRight className="w-3 h-3 ml-2" strokeWidth={2} />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases - Side by side layout */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: For Patients */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                For Patients
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Your health companion
              </h2>
              <p className="text-muted-foreground leading-comfortable mb-6">
                Get help with appointments, understand medical reports, track medications, 
                and prepare for doctor visits—all in your preferred language.
              </p>
              <ul className="space-y-3">
                {[
                  'Schedule and manage appointments',
                  'Understand medical reports in simple terms',
                  'Get medication reminders and guidance',
                  'Prepare consultation history before visits',
                  'Ask health questions anytime'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => router.push('/patient/select-language')}
                className="mt-6 bg-accent hover:bg-accent/90 text-white"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
              </Button>
            </motion.div>

            {/* Right: For Doctors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full mb-4">
                For Doctors
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Clinical documentation, automated
              </h2>
              <p className="text-muted-foreground leading-comfortable mb-6">
                Focus on patient care while AI handles documentation. Generate complete 
                SOAP notes, ICD-10 codes, and prescriptions from voice or text.
              </p>
              <ul className="space-y-3">
                {[
                  'Voice-to-SOAP note conversion',
                  'Automatic ICD-10 code suggestions',
                  'Prescription generation and management',
                  'Patient history collection before visits',
                  'Multi-language consultation support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => router.push('/doctor')}
                variant="outline"
                className="mt-6 border-2"
              >
                Doctor Dashboard
                <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section - Minimal, not overdone */}
      <section className="py-12 md:py-16 border-y border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground">HIPAA-compliant infrastructure</span>
            </div>
            <div className="flex items-center gap-3">
              <Users2 className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              <span className="text-sm text-muted-foreground">Trusted by healthcare professionals</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Asymmetric, not centered */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-clinical mb-4">
                Start your first conversation today
              </h2>
              <p className="text-lg text-muted-foreground leading-comfortable mb-8">
                No signup, no credit card, no waiting. Just open and start talking to your AI health assistant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => router.push('/auth/signup')}
                  className="bg-accent hover:bg-accent/90 text-white h-12 px-6 text-base font-medium shadow-elevated"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" strokeWidth={2} />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => router.push('/patient/select-language')}
                  className="h-12 px-6 text-base font-medium border-2"
                >
                  <Mic className="w-4 h-4 mr-2" strokeWidth={2} />
                  Try Demo
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-end">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-8 max-w-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <div className="font-medium text-sm mb-1">Instant Access</div>
                      <div className="text-xs text-muted-foreground">No registration required</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <div className="font-medium text-sm mb-1">8 Languages</div>
                      <div className="text-xs text-muted-foreground">Speak in your preferred language</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <div className="font-medium text-sm mb-1">100% Free</div>
                      <div className="text-xs text-muted-foreground">Always free, unlimited usage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Asymmetric, structured */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
            {/* Brand - spans more */}
            <div className="col-span-2 md:col-span-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Stethoscope className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <span className="text-base font-semibold tracking-tight">Health Vault</span>
              </div>
              <p className="text-sm text-muted-foreground leading-comfortable max-w-xs">
                AI-powered healthcare conversations in 8 Indian languages. Available 24/7 for patients and doctors.
              </p>
            </div>

            {/* Links - compact columns */}
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/patient/assistant" className="hover:text-foreground transition-smooth">For Patients</a></li>
                <li><a href="/doctor" className="hover:text-foreground transition-smooth">For Doctors</a></li>
                <li><a href="/patient/select-language" className="hover:text-foreground transition-smooth">Voice Mode</a></li>
              </ul>
            </div>

            <div className="col-span-1 md:col-span-2">
              <h4 className="text-sm font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Languages</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Security</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-3">
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 Health Vault. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Made for India's healthcare</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
