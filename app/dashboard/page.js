'use client'
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, deleteListing, logout } from '@/lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const u = await getCurrentUser()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    fetchMyListings(u.id)
  }

  const fetchMyListings = async (userId) => {
    const { data, error } = await supabase
      .from('listings')
      .select('*, listing_images(public_url, position)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!error) setListings(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return
    setDeleting(id)
    try {
      await deleteListing(id)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (e) {
      alert('Error deleting listing: ' + e.message)
    }
    setDeleting(null)
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await logout()
      window.location.href = '/'
    } catch (e) {
      alert('Error signing out: ' + e.message)
    }
    setSigningOut(false)
  }

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', overflowX:'hidden'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100, width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'40px', height:'40px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'40px', height:'40px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-2px', right:'-4px', background:'#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'900', width:'18px', height:'18px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ffffff'}}>L</span>
            </div>
            <Link href="/" style={{fontSize:'clamp(14px, 4vw, 20px)', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite'}}>EnjeraPressList.Com</Link>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'7px 12px', borderRadius:'8px', background:'#ea580c', textDecoration:'none', whiteSpace:'nowrap'}}>+ New Listing</Link>
            <Link href="/" style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'7px 12px', borderRadius:'8px', border:'2px solid #d1d5db', textDecoration:'none', whiteSpace:'nowrap'}}>← Home</Link>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              style={{fontSize:'13px', fontWeight:'600', color:'#dc2626', padding:'7px 12px', borderRadius:'8px', border:'2px solid #fca5a5', background:'#fef2f2', cursor:'pointer', whiteSpace:'nowrap'}}
            >{signingOut ? 'Signing out...' : '🚪 Sign out'}</button>
          </div>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'1000px', margin:'0 auto', padding:'28px 16px 64px', boxSizing:'border-box'}}>

        {/* HEADER */}
        <div style={{background:'#ffffff', borderRadius:'16px', padding:'20px 24px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', marginBottom:'24px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'14px'}}>
              <div style={{width:'52px', height:'52px', background:'#ea580c', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0, color:'#ffffff', fontWeight:'800'}}>
                {user?.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h1 style={{fontSize:'clamp(18px, 4vw, 24px)', fontWeight:'800', color:'#111827', margin:'0 0 2px'}}>My Dashboard</h1>
                <p style={{fontSize:'13px', color:'#6b7280', margin:'0'}}>{user?.user_metadata?.full_name || 'Welcome back'}</p>
                <p style={{fontSize:'11px', color:'#9ca3af', margin:'2px 0 0'}}>{user?.email}</p>
              </div>
            </div>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
              <Link href="/account" style={{
                fontSize:'13px', fontWeight:'700', color:'#374151',
                padding:'9px 16px', borderRadius:'10px',
                background:'#ffffff', border:'2px solid #d1d5db',
                textDecoration:'none', whiteSpace:'nowrap',
                display:'inline-block'
              }}>⚙️ Account Settings</Link>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                style={{
                  fontSize:'13px', fontWeight:'700', color:'#ffffff',
                  padding:'9px 16px', borderRadius:'10px',
                  background: signingOut ? '#d1d5db' : '#dc2626',
                  border:'none', cursor: signingOut ? 'not-allowed' : 'pointer',
                  whiteSpace:'nowrap'
                }}
              >🚪 {signingOut ? 'Signing out...' : 'Sign out'}</button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'12px', marginBottom:'24px'}}>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'32px', fontWeight:'800', color:'#ea580c', margin:'0'}}>{listings.length}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Total Listings</p>
          </div>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'32px', fontWeight:'800', color:'#166534', margin:'0'}}>{listings.filter(l => l.is_active).length}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Active</p>
          </div>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'32px', fontWeight:'800', color:'#d97706', margin:'0'}}>{listings.filter(l => l.listing_images?.length > 0).length}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>With Photos</p>
          </div>
        </div>

        {/* LISTINGS */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'10px'}}>
          <h2 style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0'}}>Your Listings</h2>
          <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'8px 16px', borderRadius:'8px', background:'#ea580c', textDecoration:'none', whiteSpace:'nowrap'}}>+ Add New Listing</Link>
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'60px 0'}}>
            <p style={{color:'#6b7280', fontSize:'16px'}}>Loading your listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 24px', background:'#ffffff', borderRadius:'16px', border:'2px dashed #d1d5db'}}>
            <div style={{fontSize:'48px', marginBottom:'12px'}}>🏠</div>
            <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>No listings yet</p>
            <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>Create your first listing and start receiving inquiries</p>
            <Link href="/list" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'12px 28px', borderRadius:'10px', background:'#ea580c', textDecoration:'none', display:'inline-block'}}>+ Create First Listing</Link>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
            {listings.map(l => {
              const firstImage = l.listing_images?.sort((a,b) => a.position - b.position)[0]
              return (
                <div key={l.id} style={{background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', flexWrap:'wrap'}}>

                  {/* IMAGE */}
                  <div style={{width:'140px', minHeight:'120px', background:'linear-gradient(135deg, #fff7ed, #ffedd5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', flexShrink:0, position:'relative', overflow:'hidden'}}>
                    {firstImage ? (
                      <img src={firstImage.public_url} alt="" style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0}} />
                    ) : '🏠'}
                  </div>

                  {/* INFO */}
                  <div style={{flex:'1', padding:'16px', minWidth:'200px'}}>
                    <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px', flexWrap:'wrap'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', flexWrap:'wrap'}}>
                          <span style={{background:'#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{l.property_type}</span>
                          <span style={{background: l.is_active ? '#f0fdf4' : '#fef2f2', color: l.is_active ? '#166534' : '#dc2626', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px', border: l.is_active ? '1px solid #bbf7d0' : '1px solid #fca5a5'}}>{l.is_active ? '✓ Active' : '✗ Inactive'}</span>
                        </div>
                        <p style={{fontSize:'15px', fontWeight:'700', color:'#111827', margin:'0 0 4px', lineHeight:'1.3'}}>{l.title}</p>
                        <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 8px'}}>📍 {[l.neighborhood, l.city, l.state].filter(Boolean).join(', ')}</p>
                        <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
                          <span style={{fontSize:'16px', fontWeight:'800', color:'#ea580c'}}>${l.price?.toLocaleString()}<span style={{fontSize:'12px', fontWeight:'500', color:'#9ca3af'}}>/mo</span></span>
                          <span style={{fontSize:'13px', color:'#6b7280', fontWeight:'500'}}>{l.bedrooms}</span>
                          <span style={{fontSize:'13px', color:'#6b7280', fontWeight:'500'}}>{l.listing_images?.length || 0} photos</span>
                        </div>
                        <p style={{fontSize:'11px', color:'#9ca3af', margin:'8px 0 0'}}>Listed {new Date(l.created_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</p>
                      </div>

                      {/* ACTIONS */}
                      <div style={{display:'flex', flexDirection:'column', gap:'8px', flexShrink:0}}>
                        <Link href={`/listing/${l.id}`} style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'7px 14px', borderRadius:'8px', border:'2px solid #d1d5db', textDecoration:'none', textAlign:'center', whiteSpace:'nowrap'}}>👁 View</Link>
                        <Link href={`/edit/${l.id}`} style={{fontSize:'13px', fontWeight:'600', color:'#ffffff', padding:'7px 14px', borderRadius:'8px', background:'#166534', textDecoration:'none', textAlign:'center', whiteSpace:'nowrap'}}>✏️ Edit</Link>
                        <button
                          onClick={() => handleDelete(l.id)}
                          disabled={deleting === l.id}
                          style={{fontSize:'13px', fontWeight:'600', color:'#ffffff', padding:'7px 14px', borderRadius:'8px', background: deleting === l.id ? '#d1d5db' : '#dc2626', border:'none', cursor: deleting === l.id ? 'not-allowed' : 'pointer', whiteSpace:'nowrap'}}
                        >{deleting === l.id ? '...' : '🗑 Delete'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
