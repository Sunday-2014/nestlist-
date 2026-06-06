'use client'
import { useState, useEffect } from 'react'
import { getListings } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    getListings().then(data => {
      setListings(data)
      setFiltered(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSearch = () => {
    let results = listings
    if (search) results = results.filter(l =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase()) ||
      l.neighborhood?.toLowerCase().includes(search.toLowerCase())
    )
    if (type) results = results.filter(l => l.property_type === type)
    if (maxPrice) results = results.filter(l => l.price <= parseInt(maxPrice))
    setFiltered(results)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-1" style={{
          background: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'shine 3s linear infinite'
        }}>EnjeraPressList.Com</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-4">Find and list rental properties</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link href="/login" className="border border-orange-600 text-orange-600 px-3 py-2 sm:px-4 rounded text-sm font-medium hover:bg-orange-600 hover:text-white transition">Sign in</Link>
          <Link href="/register" className="bg-orange-600 text-white px-3 py-2 sm:px-4 rounded text-sm font-medium hover:bg-orange-700 transition">Register</Link>
          <Link href="/list" className="bg-green-800 text-white px-3 py-2 sm:px-4 rounded text-sm font-medium hover:bg-green-900 transition">+ Add listing</Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
        <input
          className="border rounded p-2 w-full sm:flex-1"
          placeholder="Search city, neighborhood or title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <select className="border rounded p-2 flex-1 sm:flex-none" value={type} onChange={e => setType(e.target.value)}>
            <option value="">All types</option>
            {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="border rounded p-2 flex-1 sm:flex-none" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
            <option value="">Any price</option>
            <option value="1500">Under $1,500</option>
            <option value="2500">Under $2,500</option>
            <option value="3500">Under $3,500</option>
            <option value="5000">Under $5,000</option>
          </select>
          <button onClick={handleSearch} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition">Search</button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} found</p>

      {/* Listings */}
      {loading ? (
        <p className="text-gray-500">Loading listings...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No listings found</p>
          <Link href="/list" className="bg-orange-600 text-white px-4 py-2 rounded">Be the first to list</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(l => (
            <div key={l.id} className="border rounded-lg overflow-hidden hover:border-orange-400 transition bg-white bg-opacity-80">
              <div className="h-36 sm:h-40 bg-orange-50 flex items-center justify-center text-4xl">🏠</div>
              <div className="p-3 sm:p-4">
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{l.property_type}</p>
                <p className="font-semibold text-gray-800 mt-1 text-sm sm:text-base">{l.title}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">📍 {l.neighborhood} · {l.city}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">${l.price.toLocaleString()}<span className="text-xs sm:text-sm font-normal text-gray-500">/mo</span></p>
                    <p className="text-xs text-gray-500">{l.bedrooms}</p>
                  </div>
                  <a href={`mailto:${l.contact_email}`} className="border border-orange-600 text-orange-600 text-xs px-3 py-1 rounded-full hover:bg-orange-600 hover:text-white transition">Contact</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
