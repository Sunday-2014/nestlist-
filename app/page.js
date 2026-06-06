'use client'
import { useState, useEffect } from 'react'
import { getListings } from '@/lib/supabase'
import Link from 'next/link'
import { translations } from '../translations'

export default function Home() {
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [lang, setLang] = useState('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const t = translations[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('enjera_lang') || 'en'
    setLang(savedLang)
    getListings().then(data => {
      setListings(data)
      setFiltered(data)
      setLoading(false)
    }).catch(() => setLoading(false))
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'am' : 'en'
    setLang(newLang)
    localStorage.setItem('enjera_lang', newLang)
  }

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

  const showPrice = (l) => {
    if (l.currency === 'Contact') return <span style={{fontSize:'14px', color:'#ea580c', fontWeight:'700'}}>Contact for price</span>
    if (l.currency === 'ETB') return <span>{l.price?.toLocaleString()} <span style={{fontSize:'13px', color:'#166534', fontWeight:'700'}}>ETB</span><span style={{fontSize:'12px', fontWeight:'500', color:'#9ca3af'}}>/mo</span></span>
    return <span>${l.price?.toLocaleString()}<span style={{fontSize:'12px', fontWeight:'500', color:'#9ca3af'}}>/mo</span></span>
  }

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', margin:0, padding:0, overflowX:'hidden'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>

          {/* LOGO */}
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'44px', height:'44px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'44px', height:'44px', borderRadius:'50%', display:'block', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-2px', right:'-4px', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'900', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ffffff'}}>L</span>
            </div>
            <div>
              <span style={{fontSize:'clamp(14px, 3.5vw, 22px)', fontWeight:'800', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite', display:'block'}}>{t.siteName}</span>
              <span style={{fontSize:'10px', color:'#6b7280', fontWeight:'500'}}>{t.tagline}</span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          {!isMobile && (
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <button onClick={toggleLang} style={{fontSize:'12px', fontWeight:'700', color:'#374151', padding:'6px 10px', borderRadius:'8px', border:'2px solid #d1d5db', background:'#ffffff', cursor:'pointer', whiteSpace:'nowrap'}}>
                🌍 {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
              <Link href="/dashboard" style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'7px 12px', borderRadius:'8px', border:'2px solid #d1d5db', background:'#ffffff', textDecoration:'none', whiteSpace:'nowrap'}}>{t.myListings}</Link>
              <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'7px 12px', borderRadius:'8px', background:'#166534', textDecoration:'none', whiteSpace:'nowrap'}}>{t.addListing}</Link>
              <Link href="/login" style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'7px 12px', borderRadius:'8px', border:'2px solid #d1d5db', background:'#ffffff', textDecoration:'none', whiteSpace:'nowrap'}}>{t.signIn}</Link>
              <Link href="/register" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'7px 12px', borderRadius:'8px', background:'#ea580c', textDecoration:'none', whiteSpace:'nowrap'}}>Sign up free</Link>
            </div>
          )}

          {/* MOBILE HAMBURGER */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{background:'none', border:'2px solid #d1d5db', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'20px', color:'#374151'}}
            >☰</button>
          )}
        </div>

        {/* MOBILE MENU */}
        {isMobile && menuOpen && (
          <div style={{background:'#ffffff', borderTop:'1px solid #e5e7eb', padding:'12px 16px', display:'flex', flexDirection:'column', gap:'8px'}}>
            <button onClick={() => { toggleLang(); setMenuOpen(false) }} style={{fontSize:'13px', fontWeight:'700', color:'#374151', padding:'10px', borderRadius:'8px', border:'2px solid #d1d5db', background:'#ffffff', cursor:'pointer', textAlign:'left'}}>
              🌍 {lang === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
            </button>
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'10px', borderRadius:'8px', border:'2px solid #d1d5db', textDecoration:'none', display:'block'}}>{t.myListings}</Link>
            <Link href="/list" onClick={() => setMenuOpen(false)} style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'10px', borderRadius:'8px', background:'#166534', textDecoration:'none', display:'block', textAlign:'center'}}>{t.addListing}</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{fontSize:'13px', fontWeight:'600', color:'#374151', padding:'10px', borderRadius:'8px', border:'2px solid #d1d5db', textDecoration:'none', display:'block', textAlign:'center'}}>{t.signIn}</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'10px', borderRadius:'8px', background:'#ea580c', textDecoration:'none', display:'block', textAlign:'center'}}>Sign up free</Link>
          </div>
        )}

        {/* ETHIOPIAN FLAG STRIPES */}
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930', width:'100%'}}></div>
          <div style={{height:'6px', background:'#FCDD09', width:'100%'}}></div>
          <div style={{height:'6px', background:'#DA121A', width:'100%'}}></div>
        </div>

        {/* CONTACT US BAR */}
        <div style={{background:'linear-gradient(90deg, #fef3c7, #fde68a, #fef3c7)', width:'100%', padding:'7px 16px', boxSizing:'border-box'}}>
          <div style={{maxWidth:'1100px', margin:'0 auto', display:'flex', alignItems:'center'}}>
            <Link href="/contact" style={{fontSize:'13px', fontWeight:'700', color:'#92400e', textDecoration:'none', display:'flex', alignItems:'center', gap:'6px'}}>
              📬 Contact Us
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)', borderBottom:'1px solid #fdba74', width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'32px 16px 28px', textAlign:'center'}}>
          <div style={{display:'inline-block', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'4px 14px', borderRadius:'99px', marginBottom:'12px', letterSpacing:'0.08em', textTransform:'uppercase'}}>{t.badge}</div>

          {/* HERO TITLE — AD FRAMES ONLY ON DESKTOP */}
          {!isMobile ? (
            <div style={{display:'flex', alignItems:'center', gap:'16px', margin:'0 0 12px', justifyContent:'center'}}>
              <div style={{width:'160px', minHeight:'110px', flexShrink:0, border:'3px solid #d97706', borderRadius:'12px', background:'linear-gradient(135deg, #fef3c7, #fde68a)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'12px', textAlign:'center', boxShadow:'0 0 14px rgba(217,119,6,0.35)', cursor:'pointer'}}>
                <p style={{fontSize:'12px', fontWeight:'800', color:'#92400e', margin:'0 0 4px', lineHeight:'1.4'}}>This place is open for Ad</p>
                <p style={{fontSize:'10px', color:'#b45309', margin:'0', lineHeight:'1.4'}}>Contact us to advertise</p>
              </div>
              <h2 style={{fontSize:'clamp(20px, 3vw, 40px)', fontWeight:'800', color:'#1f2937', margin:'0', lineHeight:'1.2', flex:1}}>{t.heroTitle}</h2>
              <div style={{width:'160px', minHeight:'110px', flexShrink:0, border:'3px solid #d97706', borderRadius:'12px', background:'linear-gradient(135deg, #fef3c7, #fde68a)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'12px', textAlign:'center', boxShadow:'0 0 14px rgba(217,119,6,0.35)', cursor:'pointer'}}>
                <p style={{fontSize:'12px', fontWeight:'800', color:'#92400e', margin:'0 0 4px', lineHeight:'1.4'}}>This place is open for Ad</p>
                <p style={{fontSize:'10px', color:'#b45309', margin:'0', lineHeight:'1.4'}}>Contact us to advertise</p>
              </div>
            </div>
          ) : (
            <h2 style={{fontSize:'clamp(22px, 6vw, 40px)', fontWeight:'800', color:'#1f2937', margin:'0 0 12px', lineHeight:'1.2'}}>{t.heroTitle}</h2>
          )}

          <p style={{fontSize:'clamp(14px, 3vw, 16px)', color:'#4b5563', margin:'0 auto 24px', maxWidth:'480px', lineHeight:'1.6'}}>{t.heroSubtitle}</p>

          {/* SEARCH BOX */}
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'12px', maxWidth:'780px', margin:'0 auto', boxShadow:'0 4px 24px rgba(0,0,0,0.10)', border:'1px solid #e5e7eb', boxSizing:'border-box'}}>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              <input
                style={{width:'100%', padding:'12px 16px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'14px', color:'#111827', outline:'none', background:'#f9fafb', fontWeight:'500', boxSizing:'border-box'}}
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                <select style={{flex:'1', minWidth:'120px', padding:'11px 10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', fontWeight:'500', outline:'none'}} value={type} onChange={e => setType(e.target.value)}>
                  <option value="">{t.allTypes}</option>
                  <option value="Apartment">{t.apartment}</option>
                  <option value="House">{t.house}</option>
                  <option value="Studio">{t.studio}</option>
                  <option value="Condo">{t.condo}</option>
                  <option value="Townhouse">{t.townhouse}</option>
                </select>
                <select style={{flex:'1', minWidth:'120px', padding:'11px 10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', fontWeight:'500', outline:'none'}} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                  <option value="">{t.anyPrice}</option>
                  <option value="1500">{t.under1500}</option>
                  <option value="2500">{t.under2500}</option>
                  <option value="3500">{t.under3500}</option>
                  <option value="5000">{t.under5000}</option>
                </select>
                <button onClick={handleSearch} style={{flex:'1', minWidth:'80px', padding:'11px 20px', borderRadius:'10px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', border:'none', cursor:'pointer', whiteSpace:'nowrap'}}>{t.search}</button>
              </div>
            </div>
          </div>

          <div style={{marginTop:'16px'}}>
            <Link href="/list" style={{fontSize:'14px', fontWeight:'600', color:'#ea580c', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>{t.listFree}</Link>
          </div>
        </div>
      </div>

      {/* LISTINGS */}
      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'24px 16px 64px', boxSizing:'border-box'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
          <div>
            <h3 style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 2px'}}>{t.availableRentals}</h3>
            <p style={{fontSize:'13px', color:'#6b7280', margin:'0', fontWeight:'500'}}>{filtered.length} {filtered.length === 1 ? t.listingFound : t.listingsFound}</p>
          </div>
          <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'9px 16px', borderRadius:'10px', background:'#166534', textDecoration:'none', display:'inline-block', border:'2px solid #166534', whiteSpace:'nowrap'}}>{t.addYourListing}</Link>
        </div>

        {loading ? (
          <div style={{textAlign:'center', padding:'80px 0'}}>
            <div className="spinner" style={{margin:'0 auto 16px'}}></div>
            <p style={{color:'#6b7280', fontSize:'14px'}}>Loading listings...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'60px 24px', background:'#ffffff', borderRadius:'16px', border:'2px dashed #d1d5db'}}>
            <div style={{fontSize:'48px', marginBottom:'12px'}}>🏠</div>
            <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>{t.noListingsFound}</p>
            <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>{t.tryDifferent}</p>
            <Link href="/list" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'12px 28px', borderRadius:'10px', background:'#ea580c', textDecoration:'none', display:'inline-block'}}>{t.listPropertyFree}</Link>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap:'16px'}}>
            {filtered.map(l => (
              <Link key={l.id} href={`/listing/${l.id}`} style={{textDecoration:'none'}}>
                <div style={{background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb', overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', height:'100%'}}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {l.listing_images && l.listing_images.length > 0 ? (
                    <div style={{height:'180px', position:'relative', overflow:'hidden'}}>
                      <img src={l.listing_images.sort((a,b) => a.position - b.position)[0].public_url} alt={l.title} style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
                      <div style={{position:'absolute', top:'12px', left:'12px', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'4px 10px', borderRadius:'6px'}}>{l.property_type}</div>
                      {l.listing_images.length > 1 && (
                        <div style={{position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,0.55)', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'6px'}}>+{l.listing_images.length - 1} photos</div>
                      )}
                    </div>
                  ) : (
                    <div style={{padding:'12px 14px 0'}}>
                      <span style={{background:'#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{l.property_type}</span>
                    </div>
                  )}
                  <div style={{padding:'14px'}}>
                    <p style={{fontSize:'15px', fontWeight:'700', color:'#111827', margin:'0 0 6px', lineHeight:'1.4'}}>{l.title}</p>
                    <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 6px', fontWeight:'500'}}>📍 {l.neighborhood}{l.neighborhood && l.city ? ' · ' : ''}{l.city}</p>
                    {l.description && !l.listing_images?.length && (
                      <p style={{fontSize:'12px', color:'#9ca3af', margin:'0 0 10px', lineHeight:'1.5', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{l.description}</p>
                    )}
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'10px', borderTop:'1px solid #f3f4f6'}}>
                      <div>
                        <p style={{fontSize:'18px', fontWeight:'800', color:'#111827', margin:'0', lineHeight:'1'}}>{showPrice(l)}</p>
                        <p style={{fontSize:'12px', color:'#9ca3af', margin:'4px 0 0', fontWeight:'500'}}>{l.bedrooms}</p>
                      </div>
                      <div style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'8px 16px', borderRadius:'8px', background:'#ea580c', whiteSpace:'nowrap'}}>{t.viewDetails}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'8px'}}>
          <div style={{position:'relative', width:'32px', height:'32px'}}>
            <img src="/logo.gif" alt="logo" style={{width:'32px', height:'32px', borderRadius:'50%', border:'2px solid #d97706'}} />
            <span style={{position:'absolute', bottom:'-1px', right:'-3px', background:'#ea580c', color:'#ffffff', fontSize:'8px', fontWeight:'900', width:'13px', height:'13px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #1f2937'}}>L</span>
          </div>
          <p style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', margin:'0'}}>{t.siteName}</p>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'10px'}}>
          <div style={{height:'4px', width:'50px', background:'#078930', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#FCDD09', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#DA121A', borderRadius:'2px'}}></div>
        </div>
        <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>{t.footerTagline}</p>
      </footer>

    </div>
  )
}
