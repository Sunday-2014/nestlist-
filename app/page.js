'use client'
import { useState, useEffect } from 'react'
import { getListings } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getListings().then(data => {
      setListings(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-green-800">Nest.list</h1>
        <div className="flex gap-3">
          <Link href="/login" className="border border-green-800 text-green-800 px-4 py-2 rounded text-sm">Sign in</Link>
          <Link href="/register" className="bg-green-800 text-white px-4 py-2 rounded text-sm">Register</Link>
        </div>
      </div>
      <p className="text-gray-500 mb-6">Find and list rental properties</p>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Latest listings</h2>
        <Link href="/list" className="bg-green-800 text-white px-4 py-2 rounded text-sm">+ Add listing</Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading listings...</p>
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Link href="/list" className="bg-green-800 text-white px-4 py-2 rounded">Be the first to list</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(l => (
            <div key={l.id} className="border rounded-lg overflow-hidden hover:border-green-600 transition">
              <div className="h-40 bg-green-50 flex items-center justify-center text-4xl">🏠</div>
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
