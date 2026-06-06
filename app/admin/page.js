'use client'
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminPanel() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listings')
  const [deleting, setDeleting] = useState(null)
  const [stats, setStats] = useState({ totalListings:0, totalUsers:0, totalViews:0, activeListings:0 })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const u = await getCurrentUser()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', u.id)
      .single()
    if (!profile?.is_admin) { window.location.href = '/'; return }
    setIsAdmin(true)
    fetchData()
  }

  const fetchData = async () => {
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select('*, listing_images(public_url, position)')
      .order('created_at', { ascending: false })

    if (listingsError) console.error('Listings error:', listingsError)

    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) console.error('Users error:', usersError)

    if (listingsData) {
      setListings(listingsData)
      setStats({
        totalListings: listingsData.length,
        totalUsers: usersData?.length || 0,
        totalViews: listingsData.reduce((sum, l) => sum + (l.views || 0), 0),
        activeListings: listingsData.filter(l => l.is_active).length
      })
    }
    if (usersData) setUsers(usersData)
    setLoading(false)
  }

  const handleDeleteListing = async (id) => {
    if (!confirm('Delete this listing permanently?')) return
    setDeleting(id)
    await supabase.from('listing_images').delete().eq('listing_id', id)
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
    setStats(prev => ({...prev, totalListings: prev.totalListings - 1}))
    setDeleting(null)
  }

  const handleToggleActive = async (id, currentStatus) => {
    await supabase.from('listings').update({ is_active: !currentStatus }).eq('id', id)
    setListings(prev => prev.map(l => l.id === id ? {...l, is_active: !currentStatus} : l))
  }

  const handleToggleAdmin = async (userId, currentStatus) => {
    await supabase.from('profiles').update({ is_admin: !currentStatus }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? {...u, is_admin: !currentStatus} : u))
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'system-ui, -apple-system, sans-serif', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'#6b7280', fontSize:'16px'}}>Loading admin panel...</p>
    </div>
  )

  if (!isAdmin) return null

  return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#1f2937', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.2)', position:'sticky', top:0, zIndex:100, width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{position:'relative', width:'36px', height:'36px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'36px', height:'36px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-1px', right:'-3px', background:'#ea580c', color:'#ffffff', fontSize:'9px', fontWeight:'900', width:'15px', height:'15px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #1f2937'}}>L</span>
            </div>
            <div>
              <span style={{fontSize:'16px', fontWeight:'800', color:'#ffffff'}}>EnjeraPressList</span>
              <span style={{fontSize:'11px', color:'#ea580c', fontWeight:'700', marginLeft:'8px', background:'rgba(234,88,12,0.2)', padding:'2px 8px', borderRadius:'4px'}}>ADMIN</span>
            </div>
          </div>
          <div style={{display:'flex', gap:'8px'}}>
            <Link href="/" style={{fontSize:'13px', fontWeight:'600', color:'#9ca3af', padding:'7px 12px', borderRadius:'8px', border:'1px solid #374151', textDecoration:'none'}}>← View Site</Link>
            <Link href="/dashboard" style={{fontSize:'13px', fontWeight:'600', color:'#ffffff', padding:'7px 12px', borderRadius:'8px', border:'1px solid #374151', textDecoration:'none'}}>My Dashboard</Link>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'28px 16px 64px', boxSizing:'border-box'}}>

        {/* HEADER */}
        <div style={{marginBottom:'24px'}}>
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#111827', margin:'0 0 4px'}}>Admin Panel</h1>
          <p style={{fontSize:'14px', color:'#6b7280', margin:'0'}}>Manage all listings and users on EnjeraPressList.Com</p>
        </div>

        {/* STATS */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'12px', marginBottom:'28px'}}>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px 20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'36px', fontWeight:'800', color:'#ea580c', margin:'0'}}>{stats.totalListings}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Total Listings</p>
          </div>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px 20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'36px', fontWeight:'800', color:'#166534', margin:'0'}}>{stats.activeListings}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Active Listings</p>
          </div>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px 20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'36px', fontWeight:'800', color:'#1877F2', margin:'0'}}>{stats.totalUsers}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Total Users</p>
          </div>
          <div style={{background:'#ffffff', borderRadius:'14px', padding:'16px 20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', textAlign:'center'}}>
            <p style={{fontSize:'36px', fontWeight:'800', color:'#7c3aed', margin:'0'}}>{stats.totalViews}</p>
            <p style={{fontSize:'12px', color:'#6b7280', margin:'4px 0 0', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.05em'}}>Total Views</p>
          </div>
        </div>

        {/* TABS */}
        <div style={{display:'flex', gap:'4px', marginBottom:'20px', background:'#ffffff', padding:'4px', borderRadius:'12px', border:'1px solid #e5e7eb', width:'fit-content'}}>
          <button onClick={() => setTab('listings')} style={{fontSize:'13px', fontWeight:'700', padding:'8px 20px', borderRadius:'8px', border:'none', cursor:'pointer', background: tab === 'listings' ? '#ea580c' : 'transparent', color: tab === 'listings' ? '#ffffff' : '#6b7280', transition:'all 0.15s'}}>
            🏠 Listings ({listings.length})
          </button>
          <button onClick={() => setTab('users')} style={{fontSize:'13px', fontWeight:'700', padding:'8px 20px', borderRadius:'8px', border:'none', cursor:'pointer', background: tab === 'users' ? '#ea580c' : 'transparent', color: tab === 'users' ? '#ffffff' : '#6b7280', transition:'all 0.15s'}}>
            👥 Users ({users.length})
          </button>
        </div>

        {/* LISTINGS TAB */}
        {tab === 'listings' && (
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {listings.length === 0 ? (
              <div style={{textAlign:'center', padding:'60px', background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
                <p style={{color:'#6b7280'}}>No listings found</p>
              </div>
            ) : listings.map(l => {
              const firstImage = l.listing_images?.sort((a,b) => a.position - b.position)[0]
              return (
                <div key={l.id} style={{background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', flexWrap:'wrap'}}>
                  <div style={{width:'120px', minHeight:'100px', background:'linear-gradient(135deg, #fff7ed, #ffedd5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px', flexShrink:0, position:'relative', overflow:'hidden'}}>
                    {firstImage ? <img src={firstImage.public_url} alt="" style={{width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0}} /> : '🏠'}
                  </div>
                  <div style={{flex:'1', padding:'14px', minWidth:'200px'}}>
                    <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'10px', flexWrap:'wrap'}}>
                      <div style={{flex:1}}>
                        <div style={{display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px', flexWrap:'wrap'}}>
                          <span style={{background:'#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'4px'}}>{l.property_type}</span>
                          <span style={{background: l.is_active ? '#f0fdf4' : '#fef2f2', color: l.is_active ? '#166534' : '#dc2626', fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'4px', border: l.is_active ? '1px solid #bbf7d0' : '1px solid #fca5a5'}}>{l.is_active ? '✓ Active' : '✗ Inactive'}</span>
                          <span style={{background:'#f5f3ff', color:'#7c3aed', fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'4px', border:'1px solid #ddd6fe'}}>👁 {l.views || 0} views</span>
                        </div>
                        <p style={{fontSize:'14px', fontWeight:'700', color:'#111827', margin:'0 0 3px'}}>{l.title}</p>
                        <p style={{fontSize:'12px', color:'#6b7280', margin:'0 0 3px'}}>📍 {[l.neighborhood, l.city, l.state].filter(Boolean).join(', ')}</p>
                        <p style={{fontSize:'12px', color:'#9ca3af', margin:'0 0 3px'}}>💰 ${l.price?.toLocaleString()}/mo · {l.bedrooms}</p>
                        <p style={{fontSize:'11px', color:'#9ca3af', margin:'0'}}>📧 {l.contact_email} · Listed {new Date(l.created_at).toLocaleDateString()}</p>
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:'6px', flexShrink:0}}>
                        <Link href={`/listing/${l.id}`} style={{fontSize:'12px', fontWeight:'600', color:'#374151', padding:'6px 12px', borderRadius:'7px', border:'1.5px solid #d1d5db', textDecoration:'none', textAlign:'center', whiteSpace:'nowrap'}}>👁 View</Link>
                        <button onClick={() => handleToggleActive(l.id, l.is_active)} style={{fontSize:'12px', fontWeight:'600', color:'#ffffff', padding:'6px 12px', borderRadius:'7px', background: l.is_active ? '#d97706' : '#166534', border:'none', cursor:'pointer', whiteSpace:'nowrap'}}>
                          {l.is_active ? '⏸ Deactivate' : '▶ Activate'}
                        </button>
                        <button onClick={() => handleDeleteListing(l.id)} disabled={deleting === l.id} style={{fontSize:'12px', fontWeight:'600', color:'#ffffff', padding:'6px 12px', borderRadius:'7px', background: deleting === l.id ? '#d1d5db' : '#dc2626', border:'none', cursor: deleting === l.id ? 'not-allowed' : 'pointer', whiteSpace:'nowrap'}}>
                          {deleting === l.id ? '...' : '🗑 Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {users.length === 0 ? (
              <div style={{textAlign:'center', padding:'60px', background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
                <p style={{color:'#6b7280'}}>No users yet</p>
              </div>
            ) : users.map(u => (
              <div key={u.id} style={{background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                  <div style={{width:'44px', height:'44px', background: u.is_admin ? '#fff7ed' : '#f9fafb', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0, border: u.is_admin ? '2px solid #ea580c' : '2px solid #e5e7eb'}}>
                    {u.is_admin ? '👑' : '👤'}
                  </div>
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap'}}>
                      <p style={{fontSize:'14px', fontWeight:'700', color:'#111827', margin:'0'}}>{u.full_name || 'No name'}</p>
                      {u.is_admin && <span style={{background:'#fff7ed', color:'#ea580c', fontSize:'10px', fontWeight:'700', padding:'2px 8px', borderRadius:'4px', border:'1px solid #fed7aa'}}>👑 Admin</span>}
                    </div>
                    <p style={{fontSize:'12px', color:'#6b7280', margin:'2px 0 0'}}>{u.phone || 'No phone'}</p>
                    <p style={{fontSize:'11px', color:'#9ca3af', margin:'2px 0 0'}}>Joined {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{display:'flex', gap:'8px'}}>
                  {u.id !== user?.id ? (
                    <button
                      onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                      style={{fontSize:'12px', fontWeight:'600', color:'#ffffff', padding:'7px 14px', borderRadius:'8px', background: u.is_admin ? '#dc2626' : '#ea580c', border:'none', cursor:'pointer', whiteSpace:'nowrap'}}
                    >{u.is_admin ? 'Remove Admin' : '👑 Make Admin'}</button>
                  ) : (
                    <span style={{fontSize:'12px', color:'#9ca3af', padding:'7px 14px'}}>You (Owner)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'2px solid #ea580c', padding:'20px 16px', textAlign:'center'}}>
        <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>EnjeraPressList.Com Admin Panel · Restricted Access</p>
      </footer>

    </div>
  )
}
