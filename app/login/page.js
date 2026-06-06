'use client'
import { useState } from 'react'
import { login } from '@/lib/supabase'
import Link from 'next/link'

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      await login(form)
      window.location.href = '/list'
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-green-800 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to manage your listings</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input className="border rounded p-2 w-full mb-3" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input className="border rounded p-2 w-full mb-4" type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        <button onClick={handleSubmit} disabled={loading} className="bg-green-800 text-white w-full py-2 rounded font-medium">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-4">No account yet? <Link href="/register" className="text-green-700 font-medium">Register free</Link></p>
      </div>
    </main>
  )
}
