import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body
  if (!email) return res.status(422).json({ error: 'Missing email' })
  if (!password) return res.status(422).json({ error: 'Missing password' })
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(422).json({ error: 'Please use your Gmail address' })
  }

  // Check if user exists
  const { data: existing, error: fetchErr } = await supabase
    .from('users')
    .select('id, email, password')
    .eq('email', email)
    .maybeSingle()

  if (fetchErr) return res.status(500).json({ error: fetchErr.message })

  if (existing) {
    // Validate password for returning users
    if (existing.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' })
    }
    return res.json({ ok: true, user: { id: existing.id, email: existing.email } })
  }

  // New user — store email and password
  const { data: newUser, error: insertErr } = await supabase
    .from('users')
    .insert({ email, password, updated_at: new Date().toISOString() })
    .select('id, email')
    .single()

  if (insertErr) return res.status(500).json({ error: insertErr.message })

  return res.json({ ok: true, user: newUser })
}
