import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // GET /api/cart?userId=<id>
  if (req.method === 'GET') {
    const { userId } = req.query
    if (!userId) return res.status(422).json({ error: 'Missing userId' })

    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, items: data })
  }

  // POST /api/cart — add or increment
  if (req.method === 'POST') {
    const { userId, itemId, name, price, quantity = 1, image } = req.body
    if (!userId || !itemId) return res.status(422).json({ error: 'Missing userId or itemId' })

    // Check if item already in cart
    const { data: existing, error: fetchErr } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('item_id', itemId)
      .maybeSingle()

    if (fetchErr) return res.status(500).json({ error: fetchErr.message })

    if (existing) {
      const { error: updateErr } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)

      if (updateErr) return res.status(500).json({ error: updateErr.message })
      return res.json({ ok: true })
    }

    const { data: newItem, error: insertErr } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, item_id: itemId, name, price, quantity, image })
      .select('id')
      .single()

    if (insertErr) return res.status(500).json({ error: insertErr.message })
    return res.json({ ok: true, id: newItem.id })
  }

  // PUT /api/cart/<id> — update quantity (id from URL path)
  if (req.method === 'PUT') {
    const id = req.url.split('?')[0].split('/').filter(Boolean).pop()
    const { quantity } = req.body
    if (!id) return res.status(422).json({ error: 'Missing id' })
    if (typeof quantity === 'undefined') return res.status(422).json({ error: 'Missing quantity' })

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true })
  }

  // DELETE /api/cart/<id> (id from URL path)
  if (req.method === 'DELETE') {
    const id = req.url.split('?')[0].split('/').filter(Boolean).pop()
    if (!id) return res.status(422).json({ error: 'Missing id' })

    const { error, count } = await supabase
      .from('cart_items')
      .delete({ count: 'exact' })
      .eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, deleted: count })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
