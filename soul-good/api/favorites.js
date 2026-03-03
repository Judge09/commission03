import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pkfbdxcicvxaxqpcxayc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmJkeGNpY3Z4YXhxcGN4YXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzAyNDMsImV4cCI6MjA4ODA0NjI0M30.2xpXMcHaZyVCKkTqHpLv9Dp_PjjKg1mY9x43-Ju-QQI'
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(422).json({ error: 'Missing userId' })

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, favorites: data })
  }

  if (req.method === 'POST') {
    const { userId, itemId } = req.body
    if (!userId || !itemId) return res.status(422).json({ error: 'Missing userId or itemId' })

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, item_id: itemId })
      .select('id')
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, id: data.id })
  }

  if (req.method === 'DELETE') {
    const { userId, itemId } = req.body
    if (!userId || !itemId) return res.status(422).json({ error: 'Missing userId or itemId' })

    const { error, count } = await supabase
      .from('favorites')
      .delete({ count: 'exact' })
      .eq('user_id', userId)
      .eq('item_id', itemId)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, deleted: count })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
