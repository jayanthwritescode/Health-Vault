'use client'

import { motion } from 'framer-motion'
import { Check, Circle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  description?: string
  status: 'completed' | 'current' | 'pending' | 'error'
  icon?: React.ReactNode
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  showLabels?: boolean
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  showLabels = true,
  orientation = 'horizontal',
  size = 'md'
}: ProgressStepperProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }

  const lineClasses = {
    sm: 'h-0.5',
    md: 'h-1',
    lg: 'h-1.5'
  }

  const isVertical = orientation === 'vertical'

  return (
    <div className={cn(
      'flex',
      isVertical ? 'flex-col gap-4' : 'items-center gap-2'
    )}>
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = step.status === 'completed'
        const isError = step.status === 'error'
        const isPending = step.status === 'pending'

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              isVertical ? 'w-full' : 'flex-1'
            )}
          >
            {/* Step */}
            <div className="flex items-center">
              <motion.button
                onClick={() => onStepClick?.(index)}
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 font-medium transition-all',
                  sizeClasses[size],
                  isError
                    ? 'border-destructive bg-destructive text-destructive-foreground'
                    : isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isActive
                    ? 'border-primary bg-primary/10 text-primary border-2'
                    : 'border-muted-foreground bg-background text-muted-foreground',
                  onStepClick && !isPending ? 'cursor-pointer hover:scale-105' : 'cursor-default'
                )}
                whileHover={onStepClick && !isPending ? { scale: 1.05 } : {}}
                whileTap={onStepClick && !isPending ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <Check className="w-3/5 h-3/5" />
                ) : isError ? (
                  <AlertTriangle className="w-3/5 h-3/5" />
                ) : (
                  step.icon || <Circle className="w-2/5 h-2/5 fill-current" />
                )}

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>

              {/* Labels */}
              {showLabels && (
                <div className={cn(
                  'ml-3 text-left',
                  isVertical && 'ml-4'
                )}>
                  <div className={cn(
                    'font-medium',
                    isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {!isVertical && index < steps.length - 1 && (
              <div className={cn(
                'flex-1 mx-2 bg-muted',
                lineClasses[size],
                isCompleted && 'bg-primary'
              )}>
                {isCompleted && (
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>
            )}

            {/* Vertical connector */}
            {isVertical && index < steps.length - 1 && (
              <div className={cn(
                'absolute left-4 w-0.5 bg-muted ml-3.5',
                isCompleted && 'bg-primary'
              )}>
                {isCompleted && (
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
