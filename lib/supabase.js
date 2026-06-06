import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function register({ email, password, firstName, lastName, phone }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: `${firstName} ${lastName}`, phone } }
  })
  if (error) throw error
  if (data.user) {
    await supabase.from('profiles')
      .update({ phone, full_name: `${firstName} ${lastName}` })
      .eq('id', data.user.id)
  }
  return data
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getListings({ search, type, maxPrice } = {}) {
  let query = supabase
    .from('listings')
    .select(`*, listing_images (public_url, position)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (type)     query = query.eq('property_type', type)
  if (maxPrice) query = query.lte('price', maxPrice)
  if (search)   query = query.or(
    `title.ilike.%${search}%,city.ilike.%${search}%,neighborhood.ilike.%${search}%`
  )
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createListing(listing) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('listings')
    .insert({ ...listing, user_id: user.id })
    .select().single()
  if (error) throw error
  return data
}

export async function updateListing(id, updates) {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteListing(id) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function uploadListingImage(listingId, file, position = 0) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const ext = file.name.split('.').pop()
  const path = `${user.id}/${listingId}/${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(path, file, { upsert: false })
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage
    .from('listing-images').getPublicUrl(path)
  const { data, error } = await supabase
    .from('listing_images')
    .insert({ listing_id: listingId, storage_path: path, public_url: publicUrl, position })
    .select().single()
  if (error) throw error
  return data
}
