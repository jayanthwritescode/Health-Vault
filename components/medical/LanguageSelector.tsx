'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface LanguageSelectorProps {
  languages: Language[]
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
  variant?: 'dropdown' | 'tabs' | 'grid'
  size?: 'sm' | 'md' | 'lg'
  showFlags?: boolean
  showNativeNames?: boolean
}

// Map custom sizes to Button component sizes
const mapSizeToButtonSize = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm': return 'sm' as const
    case 'md': return 'default' as const
    case 'lg': return 'lg' as const
    default: return 'default' as const
  }
}

export function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageChange,
  variant = 'dropdown',
  size = 'md',
  showFlags = true,
  showNativeNames = true
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage)

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  if (variant === 'tabs') {
    return (
      <div className="flex flex-wrap gap-1">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={selectedLanguage === language.code ? 'default' : 'ghost'}
            size={mapSizeToButtonSize(size)}
            onClick={() => onLanguageChange(language.code)}
            className={cn(
              'flex items-center gap-2',
              selectedLanguage === language.code && 'bg-primary text-primary-foreground'
            )}
          >
            {showFlags && <span className="text-base">{language.flag}</span>}
            <span>{showNativeNames ? language.nativeName : language.name}</span>
          </Button>
        ))}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {languages.map((language) => (
          <motion.button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={cn(
              'p-3 rounded-lg border text-left transition-all',
              selectedLanguage === language.code
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              {showFlags && <span className="text-lg">{language.flag}</span>}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {showNativeNames ? language.nativeName : language.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language.name}
                </div>
              </div>
              {selectedLanguage === language.code && (
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className="relative">
      <Button
        variant="outline"
        size={mapSizeToButtonSize(size)}
        onClick={() => setIsOpen(!isOpen)}
        className={cn('flex items-center gap-2 justify-between', sizeClasses[size])}
      >
        <div className="flex items-center gap-2">
          {showFlags && currentLanguage && (
            <span className="text-base">{currentLanguage.flag}</span>
          )}
          <span>
            {showNativeNames && currentLanguage ? currentLanguage.nativeName : currentLanguage?.name}
          </span>
        </div>
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-accent transition-colors',
                    selectedLanguage === language.code && 'bg-accent'
                  )}
                >
                  {showFlags && <span className="text-base">{language.flag}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {showNativeNames ? language.nativeName : language.name}
                    </div>
                    {showNativeNames && (
                      <div className="text-xs text-muted-foreground">
                        {language.name}
                      </div>
                    )}
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Default language configurations
export const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
]
