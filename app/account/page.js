'use client'
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import Link from 'next/link'
import Logo from '@/app/components/Logo'


export default function Account() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const u = await getCurrentUser()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    setForm(prev => ({
      ...prev,
      full_name: u.user_metadata?.full_name || '',
      phone: u.user_metadata?.phone || '',
      email: u.email || ''
    }))
    setLoading(false)
  }

  const handleUpdateProfile = async () => {
    setError('')
    setMessage('')
    if (!form.full_name) { setError('Please enter your full name'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.full_name,
          phone: form.phone
        }
      })
      if (error) throw error
      await supabase.from('profiles').update({
        full_name: form.full_name,
        phone: form.phone
      }).eq('id', user.id)
      setMessage('✅ Profile updated successfully!')
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const handleUpdateEmail = async () => {
    setError('')
    setMessage('')
    if (!form.email) { setError('Please enter an email address'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address'); return }
    if (form.email === user.email) { setError('This is already your current email'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ email: form.email })
      if (error) throw error
      setMessage('✅ Confirmation email sent! Check your new inbox and click the link to confirm your new email address.')
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const handleUpdatePassword = async () => {
    setError('')
    setMessage('')
    if (!form.new_password) { setError('Please enter a new password'); return }
    if (form.new_password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (form.new_password !== form.confirm_password) { setError('Passwords do not match'); return }
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: form.new_password })
      if (error) throw error
      setMessage('✅ Password updated successfully!')
      setForm(prev => ({ ...prev, new_password: '', confirm_password: '' }))
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const inputStyle = {
    width:'100%', padding:'11px 14px', borderRadius:'10px',
    border:'2px solid #e5e7eb', fontSize:'14px', color:'#111827',
    outline:'none', background:'#f9fafb', fontWeight:'500',
    boxSizing:'border-box'
  }

  const labelStyle = {
    fontSize:'12px', fontWeight:'700', color:'#374151',
    display:'block', marginBottom:'6px', textTransform:'uppercase',
    letterSpacing:'0.06em'
  }

  const sectionStyle = {
    background:'#ffffff', borderRadius:'16px', padding:'24px',
    border:'1px solid #e5e7eb', marginBottom:'20px',
    boxShadow:'0 1px 4px rgba(0,0,0,0.05)'
  }

  const sectionTitleStyle = {
    fontSize:'15px', fontWeight:'700', color:'#ea580c',
    marginBottom:'18px', paddingBottom:'10px',
    borderBottom:'2px solid #fed7aa',
    display:'flex', alignItems:'center', gap:'8px'
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'#6b7280', fontSize:'16px'}}>Loading account...</p>
    </div>
  )

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'800px', margin:'0 auto', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <Logo />
          </div>
          <Link href="/dashboard" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back to dashboard</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'600px', margin:'0 auto', padding:'32px 24px 64px'}}>

        {/* HEADER */}
        <div style={{marginBottom:'28px'}}>
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#111827', margin:'0 0 6px'}}>Account Settings</h1>
          <p style={{fontSize:'15px', color:'#6b7280', margin:'0'}}>Update your profile, email and password</p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div style={{background:'#f0fdf4', border:'2px solid #bbf7d0', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', color:'#166534', fontSize:'14px', fontWeight:'600'}}>
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div style={{background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', color:'#dc2626', fontSize:'14px', fontWeight:'600'}}>
            ⚠️ {error}
          </div>
        )}

        {/* CURRENT ACCOUNT INFO */}
        <div style={{...sectionStyle, background:'linear-gradient(135deg, #fff7ed, #ffedd5)', border:'1px solid #fed7aa'}}>
          <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
            <div style={{width:'56px', height:'56px', background:'#ea580c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0, color:'#ffffff', fontWeight:'800'}}>
              {form.full_name ? form.full_name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <p style={{fontSize:'17px', fontWeight:'800', color:'#111827', margin:'0 0 2px'}}>{form.full_name || 'Your Name'}</p>
              <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 2px'}}>{user?.email}</p>
              <p style={{fontSize:'11px', color:'#9ca3af', margin:'0'}}>Member since {new Date(user?.created_at).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</p>
            </div>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>👤 Profile Information</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              placeholder="Jane Smith"
              value={form.full_name}
              onChange={e => setForm({...form, full_name: e.target.value})}
            />
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={labelStyle}>Phone Number</label>
            <input
              style={inputStyle}
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
          </div>
          <button
            onClick={handleUpdateProfile}
            disabled={saving}
            style={{width:'100%', padding:'13px', borderRadius:'10px', background: saving ? '#d1d5db' : '#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', border:'none', cursor: saving ? 'not-allowed' : 'pointer'}}
          >
            {saving ? '⏳ Saving...' : '💾 Save Profile'}
          </button>
        </div>

        {/* EMAIL SECTION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📧 Change Email Address</div>
          <div style={{background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px'}}>
            <p style={{fontSize:'13px', color:'#92400e', margin:'0', fontWeight:'600'}}>⚠️ Changing your email will also update the contact email on all your listings. A confirmation link will be sent to your new email.</p>
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Current Email</label>
            <input
              style={{...inputStyle, background:'#f3f4f6', color:'#6b7280', cursor:'not-allowed'}}
              value={user?.email}
              readOnly
            />
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={labelStyle}>New Email Address</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="newemail@example.com"
              value={form.email === user?.email ? '' : form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </div>
          <button
            onClick={handleUpdateEmail}
            disabled={saving}
            style={{width:'100%', padding:'13px', borderRadius:'10px', background: saving ? '#d1d5db' : '#166534', color:'#ffffff', fontSize:'14px', fontWeight:'700', border:'none', cursor: saving ? 'not-allowed' : 'pointer'}}
          >
            {saving ? '⏳ Sending...' : '📧 Update Email'}
          </button>
        </div>

        {/* PASSWORD SECTION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🔑 Change Password</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>New Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="At least 8 characters"
              value={form.new_password}
              onChange={e => setForm({...form, new_password: e.target.value})}
            />
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Repeat new password"
              value={form.confirm_password}
              onChange={e => setForm({...form, confirm_password: e.target.value})}
            />
          </div>
          <button
            onClick={handleUpdatePassword}
            disabled={saving}
            style={{width:'100%', padding:'13px', borderRadius:'10px', background: saving ? '#d1d5db' : '#374151', color:'#ffffff', fontSize:'14px', fontWeight:'700', border:'none', cursor: saving ? 'not-allowed' : 'pointer'}}
          >
            {saving ? '⏳ Updating...' : '🔑 Update Password'}
          </button>
        </div>

        {/* DANGER ZONE */}
        <div style={{...sectionStyle, border:'2px solid #fca5a5'}}>
          <div style={{...sectionTitleStyle, color:'#dc2626', borderBottomColor:'#fca5a5'}}>⚠️ Danger Zone</div>
          <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 16px', lineHeight:'1.6'}}>
            Once you delete your account all your listings and data will be permanently removed. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (confirm('Are you absolutely sure? This will permanently delete your account and all your listings.')) {
                alert('Please contact support to delete your account.')
              }
            }}
            style={{width:'100%', padding:'13px', borderRadius:'10px', background:'#ffffff', color:'#dc2626', fontSize:'14px', fontWeight:'700', border:'2px solid #fca5a5', cursor:'pointer'}}
          >
            🗑 Delete My Account
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
        <p style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', margin:'0 0 8px'}}>EnjeraPressList.Com</p>
        <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'10px'}}>
          <div style={{height:'4px', width:'50px', background:'#078930', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#FCDD09', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#DA121A', borderRadius:'2px'}}></div>
        </div>
        <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>Free rental listings · No fees · Connect directly with landlords</p>
      </footer>

    </div>
  )
}


