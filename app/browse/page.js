'use client'
import { useState, useEffect } from 'react'
import { getListings } from '@/lib/supabase'
import Link from 'next/link'

export default function Browse() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => { fetchListings() }, [])

  const fetchListings = async (filters = {}) => {
    setLoading(true)
    try {
      const data = await getListings(filters)
      setListings(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleFilter = () => {
    fetchListings({ search, type, maxPrice: maxPrice ? parseInt(maxPrice) : undefined })
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-green-700 text-sm">← Back</Link>
          <h1 className="text-2xl font-bold text-green-800 mt-1">Available rentals</h1>
        </div>
        <Link href="/list" className="bg-green-800 text-white px-4 py-2 rounded text-sm">+ List property</Link>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input className="border rounded p-2 flex-1 min-w-40" placeholder="Search city or address..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border rounded p-2" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All types</option>
          {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="border rounded p-2" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
          <option value="">Any price</option>
          <option value="1500">Under $1,500</option>
          <option value="2500">Under $2,500</option>
          <option value="3500">Under $3,500</option>
        </select>
        <button onClick={handleFilter} className="bg-green-800 text-white px-4 py-2 rounded text-sm">Search</button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading listings...</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No listings found</p>
          <Link href="/list" className="bg-green-800 text-white px-4 py-2 rounded">Be the first to list</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(l => (
            <div key={l.id} className="border rounded-lg overflow-hidden hover:border-green-600 transition">
              <div className="h-40 bg-green-50 flex items-center justify-center text-green-300 text-4xl">🏠</div>
              <div className="p-4">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">{l.property_type}</p>
                <p className="font-semibold text-gray-800 mt-1">{l.title}</p>
                <p className="text-sm text-gray-500 mt-1">📍 {l.neighborhood} · {l.city}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div>
                    <p className="font-semibold text-gray-800">${l.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                    <p className="text-xs text-gray-500">{l.bedrooms}</p>
                  </div>
                  <a href={`mailto:${l.contact_email}`} className="border border-green-700 text-green-700 text-xs px-3 py-1 rounded-full hover:bg-green-700 hover:text-white transition">Contact</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
