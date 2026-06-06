'use client'
import { useState } from 'react'
import { createListing, getCurrentUser } from '@/lib/supabase'
import Link from 'next/link'

export default function ListProperty() {
  const [form, setForm] = useState({
    title:'', property_type:'Apartment', price:'', bedrooms:'1 bedroom',
    bathrooms:'1 bathroom', description:'', address:'', city:'', state:'DC',
    zip:'', neighborhood:'', contact_name:'', contact_email:'',
    contact_phone:'', contact_method:'Email', available_from:''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) { window.location.href = '/login'; return }
      await createListing({ ...form, price: parseInt(form.price) })
      window.location.href = '/browse'
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm({...form, [field]: e.target.value}) })

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <Link href="/" className="text-green-700 text-sm">← Back</Link>
      <h1 className="text-2xl font-bold text-green-800 mt-2 mb-1">List your property</h1>
      <p className="text-gray-500 text-sm mb-6">Fill in the details to publish your listing</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Property details</p>
      <input className="border rounded p-2 w-full mb-3" placeholder="Listing title" {...f('title')} />
      <div className="flex gap-3 mb-3">
        <select className="border rounded p-2 w-full" {...f('property_type')}>
          {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
        </select>
        <input className="border rounded p-2 w-full" placeholder="Monthly rent $" type="number" {...f('price')} />
      </div>
      <div className="flex gap-3 mb-3">
        <select className="border rounded p-2 w-full" {...f('bedrooms')}>
          {['Studio','1 bedroom','2 bedrooms','3 bedrooms','4+ bedrooms'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="border rounded p-2 w-full" {...f('bathrooms')}>
          {['1 bathroom','1.5 bathrooms','2 bathrooms','3+ bathrooms'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <textarea className="border rounded p-2 w-full mb-6" rows={3} placeholder="Description" {...f('description')} />

      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Location</p>
      <input className="border rounded p-2 w-full mb-3" placeholder="Street address" {...f('address')} />
      <div className="flex gap-3 mb-3">
        <input className="border rounded p-2 w-full" placeholder="City" {...f('city')} />
        <select className="border rounded p-2 w-full" {...f('state')}>
          {['DC','VA','MD','NY','CA','TX','FL','IL','Other'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex gap-3 mb-6">
        <input className="border rounded p-2 w-full" placeholder="ZIP code" {...f('zip')} />
        <input className="border rounded p-2 w-full" placeholder="Neighborhood" {...f('neighborhood')} />
      </div>

      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Contact information</p>
      <div className="flex gap-3 mb-3">
        <input className="border rounded p-2 w-full" placeholder="Your name" {...f('contact_name')} />
        <select className="border rounded p-2 w-full" {...f('contact_method')}>
          {['Email','Phone','Either'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="flex gap-3 mb-3">
        <input className="border rounded p-2 w-full" placeholder="Contact email" {...f('contact_email')} />
        <input className="border rounded p-2 w-full" placeholder="Contact phone" {...f('contact_phone')} />
      </div>
      <input className="border rounded p-2 w-full mb-6" type="date" {...f('available_from')} />

      <button onClick={handleSubmit} disabled={loading} className="bg-green-800 text-white w-full py-2 rounded font-medium">
        {loading ? 'Publishing...' : 'Publish listing'}
      </button>
    </main>
  )
}
