'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, Volume2, AlertCircle, CheckCircle } from 'lucide-react'
import { useVoiceChat } from '@/lib/use-voice-chat'

export default function TestVoicePage() {
  const [transcript, setTranscript] = useState('')
  const [testResult, setTestResult] = useState<string>('')
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid' | 'missing'>('checking')

  const { 
    isListening, 
    isSpeaking, 
    isSupported,
    toggleListening, 
    speak, 
    speakFallback 
  } = useVoiceChat({
    onTranscript: (text, isFinal) => {
      setTranscript(text)
      if (isFinal) {
        setTestResult(`✅ Speech recognition working! You said: "${text}"`)
      }
    },
    onError: (error) => {
      setTestResult(`❌ Error: ${error}`)
    }
  })

  const testBrowserTTS = () => {
    setTestResult('🔊 Testing browser TTS...')
    speakFallback('Hello! This is a test of browser text to speech.')
    setTimeout(() => setTestResult('✅ Browser TTS test complete'), 2000)
  }

  const testElevenLabsTTS = async () => {
    setTestResult('🔊 Testing ElevenLabs TTS...')
    try {
      await speak('Hello! This is a test of ElevenLabs text to speech.')
      setTimeout(() => setTestResult('✅ ElevenLabs TTS test complete'), 2000)
    } catch (error) {
      setTestResult('❌ ElevenLabs TTS failed, check console')
    }
  }

  const checkApiKey = async () => {
    setApiKeyStatus('checking')
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'test' })
      })
      
      if (response.ok) {
        setApiKeyStatus('valid')
      } else if (response.status === 500) {
        setApiKeyStatus('missing')
      } else {
        setApiKeyStatus('invalid')
      }
    } catch (error) {
      setApiKeyStatus('invalid')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🎤 Voice Features Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Browser Support</h3>
              <div className="flex items-center gap-2">
                {isSupported ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>✅ Speech Recognition supported</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>❌ Use Chrome/Edge browser</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">ElevenLabs API Key Status</h3>
              <div className="flex items-center gap-2 mb-2">
                {apiKeyStatus === 'checking' && <span>⏳ Checking...</span>}
                {apiKeyStatus === 'valid' && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>✅ API Key valid</span>
                  </>
                )}
                {apiKeyStatus === 'missing' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <span>⚠️ API Key not found</span>
                  </>
                )}
                {apiKeyStatus === 'invalid' && (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>❌ API Key invalid</span>
                  </>
                )}
              </div>
              <Button onClick={checkApiKey} size="sm" variant="outline">
                Check API Key
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Test Speech Recognition</h3>
              <Button 
                onClick={toggleListening}
                variant={isListening ? 'destructive' : 'default'}
                disabled={!isSupported}
              >
                <Mic className={`w-4 h-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                {isListening ? 'Stop' : 'Start'} Listening
              </Button>
              {transcript && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded">
                  <strong>You said:</strong> {transcript}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Test Text-to-Speech</h3>
              <div className="flex gap-2">
                <Button onClick={testBrowserTTS} disabled={isSpeaking}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Browser TTS
                </Button>
                <Button onClick={testElevenLabsTTS} disabled={isSpeaking}>
                  <Volume2 className="w-4 h-4 mr-2" />
                  ElevenLabs TTS
                </Button>
              </div>
              {isSpeaking && <div className="p-3 bg-purple-100 rounded">🔊 Speaking...</div>}
            </div>

            {testResult && (
              <div className="p-4 bg-muted rounded-lg">
                <p>{testResult}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
