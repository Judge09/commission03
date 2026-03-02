import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body
  if (!email) return res.status(422).json({ error: 'Missing email' })
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.status(422).json({ error: 'Please use your Gmail address' })
  }

  // Upsert user — insert if not exists, return existing if already there
  const { data: existing, error: fetchErr } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .maybeSingle()

  if (fetchErr) return res.status(500).json({ error: fetchErr.message })

  if (existing) {
    return res.json({ ok: true, user: existing })
  }

  const { data: newUser, error: insertErr } = await supabase
    .from('users')
    .insert({ email, updated_at: new Date().toISOString() })
    .select('id, email')
    .single()

  if (insertErr) return res.status(500).json({ error: insertErr.message })

  return res.json({ ok: true, user: newUser })
}
