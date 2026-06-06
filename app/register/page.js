'use client'
import { useState } from 'react'
import { register } from '@/lib/supabase'
import Link from 'next/link'

export default function Register() {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setLoading(true)
    try {
      await register(form)
      window.location.href = '/list'
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">List your property for free</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex gap-3 mb-3">
          <input className="border rounded p-2 w-full" placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
          <input className="border rounded p-2 w-full" placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        </div>
        <input className="border rounded p-2 w-full mb-3" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="border rounded p-2 w-full mb-3" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        <input className="border rounded p-2 w-full mb-3" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <input className="border rounded p-2 w-full mb-4" type="password" placeholder="Confirm password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
        <button onClick={handleSubmit} disabled={loading} className="bg-green-800 text-white w-full py-2 rounded font-medium">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link href="/login" className="text-green-700 font-medium">Sign in</Link></p>
      </div>
    </main>
  )
}

