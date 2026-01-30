'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Phone, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmergencyBannerProps {
  isVisible: boolean
  onDismiss?: () => void
  emergencyType?: 'warning' | 'critical' | 'info'
  message?: string
  showCallButton?: boolean
  phoneNumber?: string
}

export function EmergencyBanner({
  isVisible,
  onDismiss,
  emergencyType = 'warning',
  message = "If you are experiencing a medical emergency, please seek immediate help.",
  showCallButton = true,
  phoneNumber = "108"
}: EmergencyBannerProps) {
  if (!isVisible) return null

  const typeStyles = {
    warning: 'bg-orange-50 border-orange-200 text-orange-900 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-100',
    critical: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100',
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-100'
  }

  const iconStyles = {
    warning: 'text-orange-600 dark:text-orange-400',
    critical: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  }

  const buttonStyles = {
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    critical: 'bg-red-600 hover:bg-red-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        'border rounded-lg p-4 shadow-lg',
        typeStyles[emergencyType]
      )}
    >
      <div className="flex items-start gap-3">
        {/* Alert Icon */}
        <div className="flex-shrink-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <AlertTriangle className={cn('w-6 h-6', iconStyles[emergencyType])} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn(
              'font-semibold',
              emergencyType === 'critical' ? 'border-red-300 text-red-800 dark:border-red-600 dark:text-red-200' : '',
              emergencyType === 'warning' ? 'border-orange-300 text-orange-800 dark:border-orange-600 dark:text-orange-200' : '',
              emergencyType === 'info' ? 'border-blue-300 text-blue-800 dark:border-blue-600 dark:text-blue-200' : ''
            )}>
              {emergencyType === 'critical' ? 'CRITICAL' : emergencyType === 'warning' ? 'WARNING' : 'IMPORTANT'}
            </Badge>
            <h3 className="font-semibold">
              {emergencyType === 'critical' ? 'Medical Emergency' : emergencyType === 'warning' ? 'Seek Medical Attention' : 'Health Advisory'}
            </h3>
          </div>
          
          <p className="text-sm mb-3 leading-relaxed">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {showCallButton && (
              <Button
                size="sm"
                className={cn('flex items-center gap-2', buttonStyles[emergencyType])}
                onClick={() => window.location.href = `tel:${phoneNumber}`}
              >
                <Phone className="w-4 h-4" />
                Call Emergency {phoneNumber}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              className={cn(
                'border-current hover:bg-current/10',
                emergencyType === 'critical' ? 'text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/20' : '',
                emergencyType === 'warning' ? 'text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/20' : '',
                emergencyType === 'info' ? 'text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/20' : ''
              )}
              onClick={() => {
                // Find nearest hospital/clinic
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords
                    const query = encodeURIComponent(`nearest hospital near ${latitude},${longitude}`)
                    window.open(`https://www.google.com/maps/search/${query}`, '_blank')
                  })
                } else {
                  window.open('https://www.google.com/maps/search/nearest+hospital', '_blank')
                }
              }}
            >
              Find Nearest Hospital
            </Button>
          </div>
        </div>

        {/* Dismiss Button */}
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 hover:bg-current/10',
              emergencyType === 'critical' ? 'text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-900/20' : '',
              emergencyType === 'warning' ? 'text-orange-700 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-900/20' : '',
              emergencyType === 'info' ? 'text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/20' : ''
            )}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
