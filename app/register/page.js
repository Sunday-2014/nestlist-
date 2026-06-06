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
      window.location.href = '/dashboard'
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const inp = (field, placeholder, type='text') => (
    <input
      type={type}
      style={{width:'100%', padding:'12px 14px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'14px', color:'#111827', outline:'none', background:'#f9fafb', fontWeight:'500', boxSizing:'border-box'}}
      placeholder={placeholder}
      value={form[field]}
      onChange={e => setForm({...form, [field]: e.target.value})}
    />
  )

  const label = (text) => (
    <label style={{fontSize:'12px', fontWeight:'700', color:'#374151', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.06em'}}>{text}</label>
  )

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{position:'relative', width:'44px', height:'44px'}}>
              <img src="/logo.gif" alt="logo" style={{width:'44px', height:'44px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-2px', right:'-4px', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'900', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ffffff'}}>L</span>
            </div>
            <div>
              <Link href="/" style={{fontSize:'20px', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite', display:'block'}}>EnjeraPressList.Com</Link>
              <span style={{fontSize:'11px', color:'#6b7280', fontWeight:'500'}}>Free Rental Listings</span>
            </div>
          </div>
          <Link href="/login" style={{fontSize:'14px', fontWeight:'600', color:'#374151', padding:'8px 16px', borderRadius:'8px', border:'2px solid #d1d5db', background:'#ffffff', textDecoration:'none'}}>Sign in</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'8px', background:'#078930'}}></div>
          <div style={{height:'8px', background:'#FCDD09'}}></div>
          <div style={{height:'8px', background:'#DA121A'}}></div>
        </div>
      </nav>

      {/* FORM */}
      <div style={{maxWidth:'520px', margin:'60px auto', padding:'0 24px'}}>
        <div style={{background:'#ffffff', borderRadius:'20px', padding:'40px', border:'1px solid #e5e7eb', boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
          <div style={{textAlign:'center', marginBottom:'32px'}}>
            <div style={{width:'64px', height:'64px', background:'#fff7ed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px'}}>🏠</div>
            <h1 style={{fontSize:'26px', fontWeight:'800', color:'#111827', margin:'0 0 6px'}}>Create your account</h1>
            <p style={{fontSize:'14px', color:'#6b7280', margin:'0'}}>List your property for free — no fees ever</p>
          </div>

          {error && (
            <div style={{background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', color:'#dc2626', fontSize:'14px', fontWeight:'600'}}>
              ⚠️ {error}
            </div>
          )}

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'16px'}}>
            <div>{label('First name')}{inp('firstName', 'Jane')}</div>
            <div>{label('Last name')}{inp('lastName', 'Smith')}</div>
          </div>
          <div style={{marginBottom:'16px'}}>{label('Email address')}{inp('email', 'jane@example.com', 'email')}</div>
          <div style={{marginBottom:'16px'}}>{label('Phone number')}{inp('phone', '+1 (555) 000-0000', 'tel')}</div>
          <div style={{marginBottom:'16px'}}>{label('Password')}{inp('password', 'At least 8 characters', 'password')}</div>
          <div style={{marginBottom:'24px'}}>{label('Confirm password')}{inp('confirm', 'Repeat password', 'password')}</div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{width:'100%', padding:'14px', borderRadius:'12px', background: loading ? '#d1d5db' : '#ea580c', color:'#ffffff', fontSize:'15px', fontWeight:'800', border:'none', cursor: loading ? 'not-allowed' : 'pointer'}}
          >
            {loading ? '⏳ Creating account...' : '🚀 Create Account — Free'}
          </button>

          <p style={{textAlign:'center', fontSize:'14px', color:'#6b7280', marginTop:'20px'}}>
            Already have an account?{' '}
            <Link href="/login" style={{color:'#ea580c', fontWeight:'700', textDecoration:'none'}}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'20px 24px', textAlign:'center', marginTop:'60px'}}>
        <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>© 2026 EnjeraPressList.Com · Free rental listings</p>
      </footer>
    </div>
  )
}

