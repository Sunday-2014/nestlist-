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
    <div className="min-h-screen" style={{background: 'linear-gradient(160deg, #f0fdf4 0%, #fff7ed 50%, #ffffff 100%)'}}>

      {/* Navbar */}
      <nav style={{background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb'}} className="sticky top-0 z-50 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold" style={{
            background: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 3s linear infinite'
          }}>EnjeraPressList.Com</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition px-3 py-2">Sign in</Link>
            <Link href="/register" className="text-sm font-medium text-white px-4 py-2 rounded-lg transition" style={{background: 'linear-gradient(135deg, #ea580c, #f97316)'}}>Register free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-8 text-center">
        <div className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">Free property listings</div>
        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">Find your next<br className="hidden sm:block"/> rental home</h2>
        <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-xl mx-auto">Browse verified rental listings. No fees, no middlemen — connect directly with landlords.</p>

        {/* Search box */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-3 sm:p-4 mb-4" style={{border: '1px solid #e5e7eb'}}>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none bg-gray-50 border border-gray-200 focus:border-orange-400 focus:bg-white transition"
              placeholder="Search by city, neighborhood or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <select
              className="px-3 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 outline-none focus:border-orange-400 transition"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="">All types</option>
              {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select
              className="px-3 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 outline-none focus:border-orange-400 transition"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            >
              <option value="">Any price</option>
              <option value="1500">Under $1,500</option>
              <option value="2500">Under $2,500</option>
              <option value="3500">Under $3,500</option>
              <option value="5000">Under $5,000</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition"
              style={{background: 'linear-gradient(135deg, #ea580c, #f97316)'}}
            >Search</button>
          </div>
        </div>

        <Link href="/list" className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition">
          + List your property for free →
        </Link>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-gray-500">{filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} available</p>
          <Link href="/list" className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition" style={{background: 'linear-gradient(135deg, #14532d, #166534)'}}>+ Add listing</Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading listings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">🏠</p>
            <p className="text-gray-700 font-semibold mb-2">No listings found</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or be the first to list</p>
            <Link href="/list" className="inline-block text-sm font-semibold text-white px-6 py-3 rounded-xl transition" style={{background: 'linear-gradient(135deg, #ea580c, #f97316)'}}>List your property free</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(l => (
              <div key={l.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group" style={{border: '1px solid #e5e7eb'}}>
                <div className="h-44 flex items-center justify-center text-5xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fff7ed, #fef3c7)'}}>
                  🏠
                  <div className="absolute top-3 left-3 bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">{l.property_type}</div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-gray-900 text-base leading-snug mb-1 group-hover:text-orange-600 transition">{l.title}</p>
                  <p className="text-sm text-gray-400 mb-3">📍 {l.neighborhood}{l.neighborhood && l.city ? ' · ' : ''}{l.city}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-gray-900">${l.price?.toLocaleString()}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                      <p className="text-xs text-gray-400">{l.bedrooms}</p>
                    </div>
                    <a href={`mailto:${l.contact_email}`} className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition" style={{background: 'linear-gradient(135deg, #ea580c, #f97316)'}}>Contact</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center">
        <p className="text-sm text-gray-400">© 2026 EnjeraPressList.Com · Free rental listings · No fees</p>
      </footer>

    </div>
  )
}


