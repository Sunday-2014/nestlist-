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
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{
        background:'#ffffff',
        borderBottom:'2px solid #ea580c',
        padding:'0',
        position:'sticky',
        top:0,
        zIndex:100,
        boxShadow:'0 2px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div>
            <span style={{
              fontSize:'22px',
              fontWeight:'800',
              background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)',
              backgroundSize:'200% auto',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              animation:'shine 3s linear infinite',
              letterSpacing:'-0.5px'
            }}>EnjeraPressList.Com</span>
            <div style={{fontSize:'11px', color:'#6b7280', fontWeight:'500', marginTop:'1px'}}>Free Rental Listings</div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <Link href="/login" style={{
              fontSize:'14px', fontWeight:'600', color:'#374151',
              padding:'8px 16px', borderRadius:'8px',
              border:'2px solid #d1d5db', background:'#ffffff',
              textDecoration:'none', display:'inline-block'
            }}>Sign in</Link>
            <Link href="/register" style={{
              fontSize:'14px', fontWeight:'700', color:'#ffffff',
              padding:'8px 18px', borderRadius:'8px',
              background:'#ea580c', border:'2px solid #ea580c',
              textDecoration:'none', display:'inline-block'
            }}>Register Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)', borderBottom:'1px solid #fdba74'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'48px 24px 40px', textAlign:'center'}}>
          <div style={{
            display:'inline-block', background:'#ea580c', color:'#ffffff',
            fontSize:'11px', fontWeight:'700', padding:'4px 14px',
            borderRadius:'99px', marginBottom:'16px', letterSpacing:'0.08em',
            textTransform:'uppercase'
          }}>100% Free · No Hidden Fees</div>
          <h2 style={{fontSize:'clamp(28px, 5vw, 48px)', fontWeight:'800', color:'#1f2937', margin:'0 0 14px', lineHeight:'1.2'}}>
            Find Your Perfect<br/>Rental Home
          </h2>
          <p style={{fontSize:'16px', color:'#4b5563', margin:'0 auto 32px', maxWidth:'480px', lineHeight:'1.6', fontWeight:'400'}}>
            Browse trusted rental listings. Connect directly with landlords — no agents, no fees.
          </p>

          {/* SEARCH BOX */}
          <div style={{
            background:'#ffffff', borderRadius:'16px', padding:'16px',
            maxWidth:'780px', margin:'0 auto',
            boxShadow:'0 4px 24px rgba(0,0,0,0.10)',
            border:'1px solid #e5e7eb'
          }}>
            <div style={{display:'flex', flexWrap:'wrap', gap:'10px', alignItems:'center'}}>
              <input
                style={{
                  flex:'1', minWidth:'200px', padding:'12px 16px',
                  borderRadius:'10px', border:'2px solid #e5e7eb',
                  fontSize:'14px', color:'#111827', outline:'none',
                  background:'#f9fafb', fontWeight:'500'
                }}
                placeholder="Search city, neighborhood or title..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <select
                style={{
                  padding:'12px 14px', borderRadius:'10px',
                  border:'2px solid #e5e7eb', fontSize:'14px',
                  color:'#111827', background:'#f9fafb',
                  fontWeight:'500', outline:'none'
                }}
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="">All types</option>
                {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
              </select>
              <select
                style={{
                  padding:'12px 14px', borderRadius:'10px',
                  border:'2px solid #e5e7eb', fontSize:'14px',
                  color:'#111827', background:'#f9fafb',
                  fontWeight:'500', outline:'none'
                }}
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
                style={{
                  padding:'12px 28px', borderRadius:'10px',
                  background:'#ea580c', color:'#ffffff',
                  fontSize:'14px', fontWeight:'700',
                  border:'none', cursor:'pointer',
                  whiteSpace:'nowrap'
                }}
              >Search</button>
            </div>
          </div>

          <div style={{marginTop:'20px'}}>
            <Link href="/list" style={{
              fontSize:'14px', fontWeight:'600', color:'#ea580c',
              textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'
            }}>+ List your property for free →</Link>
          </div>
        </div>
      </div>

      {/* LISTINGS */}
      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'32px 24px 64px'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px'}}>
          <div>
            <h3 style={{fontSize:'20px', fontWeight:'700', color:'#111827', margin:'0 0 2px'}}>Available Rentals</h3>
            <p style={{fontSize:'13px', color:'#6b7280', margin:'0', fontWeight:'500'}}>{filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} found</p>
          </div>
          <Link href="/list" style={{
            fontSize:'14px', fontWeight:'700', color:'#ffffff',
            padding:'10px 20px', borderRadius:'10px',
            background:'#166534', textDecoration:'none',
            display:'inline-block', border:'2px solid #166534'
          }}>+ Add Your Listing</Link>
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'80px 0'}}>
            <div className="spinner" style={{margin:'0 auto 16px'}}></div>
            <p style={{color:'#6b7280', fontSize:'14px'}}>Loading listings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign:'center', padding:'60px 24px',
            background:'#ffffff', borderRadius:'16px',
            border:'2px dashed #d1d5db'
          }}>
            <div style={{fontSize:'48px', marginBottom:'12px'}}>🏠</div>
            <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>No listings found</p>
            <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>Try a different search or be the first to list</p>
            <Link href="/list" style={{
              fontSize:'14px', fontWeight:'700', color:'#ffffff',
              padding:'12px 28px', borderRadius:'10px',
              background:'#ea580c', textDecoration:'none',
              display:'inline-block'
            }}>List Your Property Free</Link>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'20px'}}>
            {filtered.map(l => (
              <div key={l.id} style={{
                background:'#ffffff', borderRadius:'16px',
                border:'1px solid #e5e7eb', overflow:'hidden',
                transition:'transform 0.2s, box-shadow 0.2s',
                boxShadow:'0 1px 4px rgba(0,0,0,0.06)'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div style={{
                  height:'180px', background:'linear-gradient(135deg, #fff7ed, #ffedd5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'52px', position:'relative'
                }}>
                  🏠
                  <div style={{
                    position:'absolute', top:'12px', left:'12px',
                    background:'#ea580c', color:'#ffffff',
                    fontSize:'11px', fontWeight:'700',
                    padding:'4px 10px', borderRadius:'6px',
                    letterSpacing:'0.04em'
                  }}>{l.property_type}</div>
                </div>
                <div style={{padding:'16px'}}>
                  <p style={{fontSize:'15px', fontWeight:'700', color:'#111827', margin:'0 0 6px', lineHeight:'1.4'}}>{l.title}</p>
                  <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 14px', fontWeight:'500'}}>📍 {l.neighborhood}{l.neighborhood && l.city ? ' · ' : ''}{l.city}</p>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'12px', borderTop:'1px solid #f3f4f6'}}>
                    <div>
                      <p style={{fontSize:'20px', fontWeight:'800', color:'#111827', margin:'0', lineHeight:'1'}}>
                        ${l.price?.toLocaleString()}
                        <span style={{fontSize:'13px', fontWeight:'500', color:'#9ca3af'}}>/mo</span>
                      </p>
                      <p style={{fontSize:'12px', color:'#9ca3af', margin:'4px 0 0', fontWeight:'500'}}>{l.bedrooms}</p>
                    </div>
                    <a href={`mailto:${l.contact_email}`} style={{
                      fontSize:'13px', fontWeight:'700', color:'#ffffff',
                      padding:'9px 18px', borderRadius:'8px',
                      background:'#ea580c', textDecoration:'none',
                      display:'inline-block'
                    }}>Contact</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'28px 24px', textAlign:'center'}}>
        <p style={{fontSize:'15px', fontWeight:'700', color:'#ffffff', margin:'0 0 4px'}}>EnjeraPressList.Com</p>
        <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>Free rental listings · No fees · Connect directly with landlords</p>
      </footer>

    </div>
  )
}

