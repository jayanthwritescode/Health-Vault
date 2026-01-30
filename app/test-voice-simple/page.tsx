'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react'
import { useVoiceChat } from '@/lib/use-voice-chat'

export default function TestVoiceSimplePage() {
  const [transcript, setTranscript] = useState('')
  const [testResult, setTestResult] = useState<string>('')

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

  const testTTS = () => {
    setTestResult('🔊 Testing text-to-speech...')
    speakFallback('Hello! Voice mode is working correctly.')
    setTimeout(() => setTestResult('✅ Text-to-speech test complete'), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🎤 Voice Mode Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Browser Support Check */}
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

            {/* Speech Recognition Test */}
            <div className="space-y-3">
              <h3 className="font-semibold">Test Speech Recognition</h3>
              <Button 
                onClick={toggleListening}
                variant={isListening ? 'destructive' : 'default'}
                disabled={!isSupported}
                className="w-full"
              >
                <Mic className={`w-4 h-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </Button>
              {transcript && (
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded">
                  <strong>You said:</strong> {transcript}
                </div>
              )}
            </div>

            {/* Text-to-Speech Test */}
            <div className="space-y-3">
              <h3 className="font-semibold">Test Text-to-Speech</h3>
              <Button 
                onClick={testTTS} 
                disabled={isSpeaking}
                className="w-full"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Test Voice Output
              </Button>
              {isSpeaking && (
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded">
                  🔊 Speaking...
                </div>
              )}
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="p-4 bg-muted rounded-lg">
                <p>{testResult}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Click "Start Listening" to test speech recognition</li>
                <li>Speak clearly into your microphone</li>
                <li>Click "Test Voice Output" to test text-to-speech</li>
                <li>Allow microphone permissions when prompted</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
