import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://haammbfuchiraybzlkmr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYW1tYmZ1Y2hpcmF5Ynpsa21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTg2OTcsImV4cCI6MjA4NTM5NDY5N30.HIRCjikRM1rTuSdpTQsKfDJvIPKYPoh77oCzuHSF77w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
