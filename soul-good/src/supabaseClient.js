import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pkfbdxcicvxaxqpcxayc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmJkeGNpY3Z4YXhxcGN4YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzAyNDMsImV4cCI6MjA4ODA0NjI0M30.2xpXMcHaZyVCKkTqHpLv9Dp_PjjKg1mY9x43-Ju-QQI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
