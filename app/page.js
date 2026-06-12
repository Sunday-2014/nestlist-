'use client'
import React, { useState, useEffect } from 'react'
import { getListings } from '@/lib/supabase'
import Link from 'next/link'
import { translations } from '../translations'

const ethMonths = ['መስከረም','ጥቅምት','ህዳር','ታህሳስ','ጥር','የካቲት','መጋቢት','ሚያዚያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ','ጳጉሜ']
const ethWeekdays = ['እሑድ','ሰኞ','ማክሰኞ','ረቡዕ','ሐሙስ','አርብ','ቅዳሜ']
const wdMap = {'Sunday':0,'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4,'Friday':5,'Saturday':6}

function toEthiopian(gDate) {
  const JDN = Math.floor((gDate - new Date(Date.UTC(1970,0,1))) / 86400000) + 2440588
  const diff = JDN - 1724221
  if (diff < 0) return {year:1, month:1, day:1}
  const cycle = Math.floor(diff / 1461)
  const remaining = diff % 1461
  const yearInCycle = Math.min(Math.floor(remaining / 365), 3)
  const year = cycle * 4 + yearInCycle + 1
  const dayOfYear = remaining - yearInCycle * 365
  const month = Math.floor(dayOfYear / 30) + 1
  const day = (dayOfYear % 30) + 1
  return {year, month, day}
}

function LiveClock() {
  const [ethTime, setEthTime] = useState('')
  const [ethDate, setEthDate] = useState('')
  const [dcTime, setDcTime] = useState('')
  const [dcDate, setDcDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const ethParts = new Intl.DateTimeFormat('en-US',{
        timeZone:'Africa/Addis_Ababa',
        hour:'numeric', minute:'2-digit', hour12:false
      }).formatToParts(now)
      const h24 = parseInt(ethParts.find(p=>p.type==='hour').value)
      const mm = ethParts.find(p=>p.type==='minute').value
      let h = h24 - 6
      if (h <= 0) h += 12
      if (h > 12) h -= 12
      const prefix = h24>=6&&h24<12?'ጥዋት':h24>=12&&h24<18?'ከሰዓት':h24>=18?'ከምሽቱ':'ከሌሊት'
      setEthTime(prefix + ' ' + h + ':' + mm)
      const ethDateStr = new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Addis_Ababa'}).format(now)
      const ethNow = new Date(ethDateStr + 'T00:00:00Z')
      const {year, month, day} = toEthiopian(ethNow)
      const wd = new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Addis_Ababa',weekday:'long'}).format(now)
      const monthName = ethMonths[Math.min(month-1, 12)]
      setEthDate(ethWeekdays[wdMap[wd]||0] + ' ' + monthName + ' ' + day + ', ' + year + ' ዓ.ም')
      const dcParts = new Intl.DateTimeFormat('en-US',{
        timeZone:'America/New_York',
        hour:'2-digit', minute:'2-digit', hour12:true
      }).formatToParts(now)
      setDcTime(dcParts.find(p=>p.type==='hour').value + ':' + dcParts.find(p=>p.type==='minute').value + ' ' + dcParts.find(p=>p.type==='dayPeriod').value)
      setDcDate(new Intl.DateTimeFormat('en-US',{
        timeZone:'America/New_York', weekday:'short', month:'short', day:'numeric', year:'numeric'
      }).format(now))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', marginBottom:'12px'}}>
      <div style={{display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap', justifyContent:'center'}}>
        <span style={{fontSize:'13px', fontWeight:'600', color:'#92400e'}}>አዲስ አበባ፡</span>
        <span style={{fontSize:'13px', fontWeight:'700', color:'#166534', fontFamily:'monospace'}}>{ethTime}</span>
        <span style={{fontSize:'12px', color:'#d97706'}}>|</span>
        <span style={{fontSize:'12px', color:'#92400e', fontWeight:'500'}}>{ethDate}</span>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap', justifyContent:'center'}}>
        <span style={{fontSize:'13px', fontWeight:'600', color:'#92400e'}}>DC / NY፡</span>
        <span style={{fontSize:'13px', fontWeight:'700', color:'#ea580c', fontFamily:'monospace'}}>{dcTime}</span>
        <span style={{fontSize:'12px', color:'#d97706'}}>|</span>
        <span style={{fontSize:'12px', color:'#92400e', fontWeight:'500'}}>{dcDate}</span>
      </div>
    </div>
  )
}

export default function Home() {
  const [listings, setListings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [listingType, setListingType] = useState('')
  const [lang, setLang] = useState('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('listings')
  const [jobFilter, setJobFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [jobSearch, setJobSearch] = useState('')
  const [carSearch, setCarSearch] = useState('')
  const [carTypeFilter, setCarTypeFilter] = useState('')
  const [carConditionFilter, setCarConditionFilter] = useState('')
  const [carListingType, setCarListingType] = useState('')

  const t = translations[lang]

  useEffect(() => {
    const savedLang = localStorage.getItem('enjera_lang') || 'en'
    setLang(savedLang)
    getListings().then(data => {
      const sorted = [...data].sort((a, b) => {
        const aFeatured = a.is_featured && new Date(a.featured_until) > new Date()
        const bFeatured = b.is_featured && new Date(b.featured_until) > new Date()
        if (aFeatured && !bFeatured) return -1
        if (!aFeatured && bFeatured) return 1
        return 0
      })
      setListings(sorted)
      setFiltered(sorted.filter(l => l.listing_category !== 'Job' && l.listing_category !== 'Vehicle'))
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
    let results = listings.filter(l => l.listing_category !== 'Job' && l.listing_category !== 'Vehicle')
    if (search) results = results.filter(l =>
      l.title?.toLowerCase().includes(search.toLowerCase()) ||
      l.city?.toLowerCase().includes(search.toLowerCase()) ||
      l.neighborhood?.toLowerCase().includes(search.toLowerCase())
    )
    if (type) results = results.filter(l => l.property_type === type)
    if (maxPrice) results = results.filter(l => (l.price || l.sale_price) <= parseInt(maxPrice))
    if (listingType) results = results.filter(l => (l.listing_type || 'Rent') === listingType)
    setFiltered(results)
  }

  const getJobListings = () => {
    let results = listings.filter(l => l.listing_category === 'Job')
    if (jobFilter) results = results.filter(l => l.job_employment_type === jobFilter)
    if (jobTypeFilter) results = results.filter(l => l.job_type === jobTypeFilter)
    if (jobSearch) results = results.filter(l =>
      l.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      l.city?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      l.description?.toLowerCase().includes(jobSearch.toLowerCase())
    )
    return results
  }

  const getCarListings = () => {
    let results = listings.filter(l => l.listing_category === 'Vehicle')
    if (carTypeFilter) results = results.filter(l => l.property_type === carTypeFilter)
    if (carConditionFilter) results = results.filter(l => l.vehicle_condition === carConditionFilter)
    if (carListingType) results = results.filter(l => l.listing_type === carListingType)
    if (carSearch) results = results.filter(l =>
      l.title?.toLowerCase().includes(carSearch.toLowerCase()) ||
      l.vehicle_make?.toLowerCase().includes(carSearch.toLowerCase()) ||
      l.vehicle_model?.toLowerCase().includes(carSearch.toLowerCase()) ||
      l.city?.toLowerCase().includes(carSearch.toLowerCase())
    )
    return results
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const showCardPrice = (l) => {
    if (l.listing_category === 'Job') return <span style={{fontSize:'13px', color:'#1877F2', fontWeight:'700'}}>{l.job_type || 'Job'}</span>
    if (l.currency === 'Contact') return <span style={{fontSize:'13px', color:'#ea580c', fontWeight:'700'}}>Contact for price</span>
    const isForSale = l.listing_type === 'Sale'
    const amount = isForSale ? l.sale_price : l.price
    const period = isForSale ? '' : `/${l.price_period === 'Per Day' ? 'day' : l.price_period === 'Per Year' ? 'yr' : l.price_period === 'Per Week' ? 'wk' : 'mo'}`
    if (l.currency === 'ETB') return <span>{amount?.toLocaleString()} <span style={{fontSize:'12px', fontWeight:'700', color:'#166534'}}>ETB</span><span style={{fontSize:'11px', color:'#9ca3af'}}>{period}</span></span>
    return <span>${amount?.toLocaleString()}<span style={{fontSize:'11px', color:'#9ca3af'}}>{period}</span></span>
  }

  const getCardBadge = (l) => {
    if (l.listing_category === 'Vehicle') {
      const icons = {Car:'🚗', Motorcycle:'🏍️', Bicycle:'🚲', Truck:'🚛', Van:'🚐'}
      const isVehicleRent = l.listing_type === 'Rent'
      return (
        <div style={{display:'flex', gap:'4px', flexWrap:'wrap'}}>
          <span style={{background:'#7c3aed', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{icons[l.property_type] || '🚗'} {l.property_type || 'Vehicle'}</span>
          <span style={{background: isVehicleRent ? '#ea580c' : '#166534', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{isVehicleRent ? '🔄 For Rent' : '🔑 For Sale'}</span>
        </div>
      )
    }
    if (l.listing_category === 'Job') {
      return l.job_employment_type === 'Looking for Work'
        ? <span style={{background:'#1877F2', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>👤 Looking for Work</span>
        : <span style={{background:'#166534', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>🏢 Hiring</span>
    }
    return <span style={{background: l.listing_type === 'Sale' ? '#166534' : '#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{l.listing_type === 'Sale' ? '🔑 For Sale' : '🏠 For Rent'}</span>
  }

  const jobListings = getJobListings()
  const carListings = getCarListings()

  const ListingCard = ({l}) => (
    <Link href={`/listing/${l.id}`} style={{textDecoration:'none'}}>
      <div style={{background:'#ffffff', borderRadius:'16px', border: l.is_featured && new Date(l.featured_until) > new Date() ? '2px solid #d97706' : '1px solid #e5e7eb', overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s', boxShadow: l.is_featured && new Date(l.featured_until) > new Date() ? '0 0 16px rgba(217,119,6,0.25)' : '0 1px 4px rgba(0,0,0,0.06)', height:'100%'}}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow= l.is_featured && new Date(l.featured_until) > new Date() ? '0 0 16px rgba(217,119,6,0.25)' : '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        {l.is_featured && new Date(l.featured_until) > new Date() && (
          <div style={{background:'linear-gradient(90deg, #d97706, #f59e0b)', padding:'4px 12px', textAlign:'center'}}>
            <span style={{fontSize:'11px', fontWeight:'700', color:'#ffffff'}}>⭐ Featured Listing</span>
          </div>
        )}
        {l.listing_images && l.listing_images.length > 0 ? (
          <div style={{height:'180px', position:'relative', overflow:'hidden'}}>
            <img src={l.listing_images.sort((a,b) => a.position - b.position)[0].public_url} alt={l.title} style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
            <div style={{position:'absolute', top:'12px', left:'12px', display:'flex', gap:'4px'}}>
              {getCardBadge(l)}
            </div>
            {l.listing_images.length > 1 && (
              <div style={{position:'absolute', bottom:'8px', right:'8px', background:'rgba(0,0,0,0.55)', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'6px'}}>+{l.listing_images.length - 1} photos</div>
            )}
          </div>
        ) : (
          <div style={{padding:'12px 14px 0', display:'flex', gap:'4px', flexWrap:'wrap'}}>
            {getCardBadge(l)}
            {l.listing_category !== 'Job' && l.listing_category !== 'Vehicle' && <span style={{background:'#f3f4f6', color:'#374151', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{l.property_type}</span>}
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
              <p style={{fontSize:'18px', fontWeight:'800', color:'#111827', margin:'0', lineHeight:'1'}}>{showCardPrice(l)}</p>
              {l.listing_category !== 'Job' && l.listing_category !== 'Vehicle' && <p style={{fontSize:'12px', color:'#9ca3af', margin:'4px 0 0', fontWeight:'500'}}>{l.bedrooms}</p>}
              {l.listing_category === 'Vehicle' && l.vehicle_year && <p style={{fontSize:'12px', color:'#9ca3af', margin:'4px 0 0', fontWeight:'500'}}>{l.vehicle_year} · {l.vehicle_condition}</p>}
            </div>
            <div style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'8px 16px', borderRadius:'8px', background:'#ea580c', whiteSpace:'nowrap'}}>{t.viewDetails}</div>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', margin:0, padding:0, overflowX:'hidden'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', width:'100%', boxSizing:'border-box'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'44px', height:'44px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'44px', height:'44px', borderRadius:'50%', display:'block', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-12px', right:'-18px', background:'#ea580c', color:'#ffffff', fontSize:'16px', fontWeight:'700', padding:'3px 9px', borderRadius:'8px', border:'2px solid #ffffff', whiteSpace:'nowrap', fontFamily:"'Dancing Script', cursive", boxShadow:'0 1px 4px rgba(0,0,0,0.25)'}}>List</span>
            </div>
            <div style={{marginLeft:'8px'}}>
              <span style={{fontSize:'clamp(15px, 4vw, 22px)', fontWeight:'800', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite', letterSpacing:'-0.5px', display:'block'}}>{t.siteName}</span>
              <span style={{fontSize:'10px', color:'#6b7280', fontWeight:'500'}}>{t.tagline}</span>
            </div>
          </div>

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

          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{background:'none', border:'2px solid #d1d5db', borderRadius:'8px', padding:'6px 10px', cursor:'pointer', fontSize:'20px', color:'#374151'}}>☰</button>
          )}
        </div>

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

        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930', width:'100%'}}></div>
          <div style={{height:'6px', background:'#FCDD09', width:'100%'}}></div>
          <div style={{height:'6px', background:'#DA121A', width:'100%'}}></div>
        </div>

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
          <div style={{display:'inline-block', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'4px 14px', borderRadius:'99px', marginBottom:'8px', letterSpacing:'0.08em', textTransform:'uppercase'}}>{t.badge}</div>
          <LiveClock />

          {!isMobile ? (
            <div style={{display:'flex', alignItems:'center', gap:'16px', margin:'0 0 12px', justifyContent:'center'}}>

              {/* LEFT AD — DESKTOP */}
              <div style={{width:'160px', minHeight:'110px', flexShrink:0, borderRadius:'12px', overflow:'hidden', border:'3px solid #d97706', position:'relative'}}>
                <a href="https://www.Enjerapress.com" target="_blank" rel="noopener noreferrer" style={{display:'block', textDecoration:'none'}}>
                  <video
                    id="desktop-ad-video-1"
                    ref={el => { if (el) { el.muted = true; el.play().catch(() => {}) } }}
                    src="/ads/Beryodes_Ad.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}}
                    onError={e => e.currentTarget.style.display='none'}
                  />
                </a>
                <div style={{position:'absolute', bottom:'6px', left:0, right:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6px'}}>
                  <span style={{fontSize:'9px', color:'#ffffff', fontWeight:'700', background:'rgba(0,0,0,0.5)', padding:'1px 6px', borderRadius:'4px'}}>Ad</span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const vid = document.getElementById('desktop-ad-video-1')
                      if (vid) { vid.muted = !vid.muted; if (!vid.muted) vid.play().catch(() => {}); e.currentTarget.textContent = vid.muted ? '🔇' : '🔊' }
                    }}
                    style={{background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'12px', color:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    🔇
                  </button>
                </div>
              </div>

              <h2 style={{fontSize:'clamp(20px, 3vw, 40px)', fontWeight:'800', color:'#1f2937', margin:'0', lineHeight:'1.2', flex:1}}>{t.heroTitle}</h2>

              {/* RIGHT AD — DESKTOP */}
              <div style={{width:'160px', minHeight:'110px', flexShrink:0, borderRadius:'12px', overflow:'hidden', border:'3px solid #d97706', position:'relative'}}>
                <a href="https://www.Enjerapress.com" target="_blank" rel="noopener noreferrer" style={{display:'block', textDecoration:'none'}}>
                  <video
                    id="desktop-ad-video-2"
                    ref={el => { if (el) { el.muted = true; el.play().catch(() => {}) } }}
                    src="/ads/Beryodes_Ad.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}}
                    onError={e => e.currentTarget.style.display='none'}
                  />
                </a>
                <div style={{position:'absolute', bottom:'6px', left:0, right:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 6px'}}>
                  <span style={{fontSize:'9px', color:'#ffffff', fontWeight:'700', background:'rgba(0,0,0,0.5)', padding:'1px 6px', borderRadius:'4px'}}>Ad</span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const vid = document.getElementById('desktop-ad-video-2')
                      if (vid) { vid.muted = !vid.muted; if (!vid.muted) vid.play().catch(() => {}); e.currentTarget.textContent = vid.muted ? '🔇' : '🔊' }
                    }}
                    style={{background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'22px', height:'22px', cursor:'pointer', fontSize:'12px', color:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    🔇
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <>
              <h2 style={{fontSize:'clamp(22px, 6vw, 40px)', fontWeight:'800', color:'#1f2937', margin:'0 0 12px', lineHeight:'1.2'}}>{t.heroTitle}</h2>

              {/* MOBILE AD */}
              <div style={{width:'100%', maxWidth:'340px', margin:'0 auto 16px', borderRadius:'12px', overflow:'hidden', border:'3px solid #d97706', position:'relative'}}>
                <a href="https://www.Enjerapress.com" target="_blank" rel="noopener noreferrer" style={{display:'block', textDecoration:'none'}}>
                  <video
                    id="mobile-ad-video"
                    ref={el => { if (el) { el.muted = true; el.play().catch(() => {}) } }}
                    src="/ads/Beryodes_Ad.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    style={{width:'100%', height:'160px', objectFit:'cover', display:'block'}}
                  />
                </a>
                <div style={{position:'absolute', bottom:'8px', left:0, right:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 10px'}}>
                  <span style={{fontSize:'10px', color:'#ffffff', fontWeight:'700', background:'rgba(0,0,0,0.5)', padding:'2px 8px', borderRadius:'4px'}}>Ad</span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      const vid = document.getElementById('mobile-ad-video')
                      if (vid) { vid.muted = !vid.muted; if (!vid.muted) vid.play().catch(() => {}); e.currentTarget.textContent = vid.muted ? '🔇' : '🔊' }
                    }}
                    style={{background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'28px', height:'28px', cursor:'pointer', fontSize:'14px', color:'#ffffff', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    🔇
                  </button>
                </div>
              </div>
            </>
          )}

          <p style={{fontSize:'clamp(14px, 3vw, 16px)', color:'#4b5563', margin:'0 auto 24px', maxWidth:'480px', lineHeight:'1.6'}}>{t.heroSubtitle}</p>

          {activeTab === 'listings' && (
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
                  <select style={{flex:'1', minWidth:'120px', padding:'11px 10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', fontWeight:'500', outline:'none'}} value={listingType} onChange={e => setListingType(e.target.value)}>
                    <option value="">🏠 All listings</option>
                    <option value="Rent">🏠 For Rent</option>
                    <option value="Sale">🔑 For Sale</option>
                  </select>
                  <select style={{flex:'1', minWidth:'120px', padding:'11px 10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', fontWeight:'500', outline:'none'}} value={type} onChange={e => setType(e.target.value)}>
                    <option value="">{t.allTypes}</option>
                    <option value="Apartment">{t.apartment}</option>
                    <option value="House">{t.house}</option>
                    <option value="Studio">{t.studio}</option>
                    <option value="Condo">{t.condo}</option>
                    <option value="Townhouse">{t.townhouse}</option>
                    <option value="Villa">Villa</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                    <option value="Land">Land</option>
                    <option value="Other">Other</option>
                  </select>
                  <select style={{flex:'1', minWidth:'120px', padding:'11px 10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', fontWeight:'500', outline:'none'}} value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                    <option value="">Any price</option>
                    <optgroup label="$ USD">
                      <option value="1500">Under $1,500</option>
                      <option value="2500">Under $2,500</option>
                      <option value="3500">Under $3,500</option>
                      <option value="5000">Under $5,000</option>
                      <option value="10000">Under $10,000</option>
                    </optgroup>
                    <optgroup label="🇪🇹 ETB">
                      <option value="5000">Under 5,000 ETB</option>
                      <option value="10000">Under 10,000 ETB</option>
                      <option value="20000">Under 20,000 ETB</option>
                      <option value="50000">Under 50,000 ETB</option>
                      <option value="100000">Under 100,000 ETB</option>
                    </optgroup>
                  </select>
                  <button onClick={handleSearch} style={{flex:'1', minWidth:'80px', padding:'11px 20px', borderRadius:'10px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', border:'none', cursor:'pointer', whiteSpace:'nowrap'}}>{t.search}</button>
                </div>
              </div>
            </div>
          )}

          <div style={{marginTop:'16px'}}>
            <Link href="/list" style={{fontSize:'14px', fontWeight:'600', color:'#ea580c', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'6px'}}>{t.listFree}</Link>
          </div>
        </div>
      </div>

      {/* MAIN TABS */}
      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'24px 16px 0', boxSizing:'border-box'}}>
        <div style={{display:'flex', gap:'8px', marginBottom:'24px', flexWrap:'wrap'}}>
          <button onClick={() => setActiveTab('listings')}
            style={{fontSize:'14px', fontWeight:'700', padding:'12px 24px', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s',
              background: activeTab === 'listings' ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#ffffff',
              color: activeTab === 'listings' ? '#ffffff' : '#6b7280',
              boxShadow: activeTab === 'listings' ? '0 4px 15px rgba(234,88,12,0.4)' : '0 1px 4px rgba(0,0,0,0.08)',
              border: activeTab === 'listings' ? 'none' : '2px solid #e5e7eb',
              transform: activeTab === 'listings' ? 'translateY(-1px)' : 'none'
            }}>
            🏠 Listings
          </button>
          <button onClick={() => setActiveTab('cars')}
            style={{fontSize:'14px', fontWeight:'700', padding:'12px 24px', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px',
              background: activeTab === 'cars' ? 'linear-gradient(135deg, #7c3aed, #9333ea, #a855f7)' : 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              color: activeTab === 'cars' ? '#ffffff' : '#7c3aed',
              boxShadow: activeTab === 'cars' ? '0 4px 15px rgba(124,58,237,0.5)' : '0 2px 8px rgba(124,58,237,0.15)',
              border: activeTab === 'cars' ? 'none' : '2px solid #ddd6fe',
              transform: activeTab === 'cars' ? 'translateY(-1px)' : 'none'
            }}>
            🚗 Cars
            {listings.filter(l => l.listing_category === 'Vehicle').length > 0 && (
              <span style={{background: activeTab === 'cars' ? 'rgba(255,255,255,0.3)' : '#7c3aed', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'2px 7px', borderRadius:'99px'}}>
                {listings.filter(l => l.listing_category === 'Vehicle').length}
              </span>
            )}
          </button>
          <button onClick={() => setActiveTab('jobs')}
            style={{fontSize:'14px', fontWeight:'700', padding:'12px 24px', borderRadius:'12px', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'6px',
              background: activeTab === 'jobs' ? 'linear-gradient(135deg, #1877F2, #2563eb, #3b82f6)' : 'linear-gradient(135deg, #eff6ff, #dbeafe)',
              color: activeTab === 'jobs' ? '#ffffff' : '#1877F2',
              boxShadow: activeTab === 'jobs' ? '0 4px 15px rgba(24,119,242,0.5)' : '0 2px 8px rgba(24,119,242,0.15)',
              border: activeTab === 'jobs' ? 'none' : '2px solid #bfdbfe',
              transform: activeTab === 'jobs' ? 'translateY(-1px)' : 'none'
            }}>
            💼 Jobs
            {listings.filter(l => l.listing_category === 'Job').length > 0 && (
              <span style={{background: activeTab === 'jobs' ? 'rgba(255,255,255,0.3)' : '#1877F2', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'2px 7px', borderRadius:'99px'}}>
                {listings.filter(l => l.listing_category === 'Job').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LISTINGS TAB */}
      {activeTab === 'listings' && (
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'0 16px 64px', boxSizing:'border-box'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
            <p style={{fontSize:'13px', color:'#6b7280', margin:'0', fontWeight:'500'}}>{filtered.length} {filtered.length === 1 ? t.listingFound : t.listingsFound}</p>
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
              {filtered.map(l => <ListingCard key={l.id} l={l} />)}
            </div>
          )}
        </div>
      )}

      {/* CARS TAB */}
      {activeTab === 'cars' && (
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'0 16px 64px', boxSizing:'border-box'}}>
          <div style={{background:'linear-gradient(135deg, #f5f3ff, #ede9fe)', borderRadius:'16px', padding:'24px', marginBottom:'20px', border:'1px solid #ddd6fe'}}>
            <h2 style={{fontSize:'22px', fontWeight:'800', color:'#4c1d95', margin:'0 0 8px'}}>🚗 Cars & Vehicles</h2>
            <p style={{fontSize:'14px', color:'#6d28d9', margin:'0 0 16px'}}>Browse cars, motorcycles, bicycles and more — direct from owners</p>
            <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'10px 18px', borderRadius:'10px', background:'#7c3aed', textDecoration:'none', display:'inline-block'}}>
              🚗 List Your Vehicle — Free
            </Link>
          </div>

          <div style={{background:'#ffffff', borderRadius:'16px', padding:'16px', marginBottom:'20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center'}}>
              <input
                style={{flex:'2', minWidth:'160px', padding:'10px 14px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', outline:'none', background:'#f9fafb'}}
                placeholder="Search make, model, city..."
                value={carSearch}
                onChange={e => setCarSearch(e.target.value)}
              />
              <select style={{flex:'1', minWidth:'130px', padding:'10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', outline:'none'}}
                value={carListingType} onChange={e => setCarListingType(e.target.value)}>
                <option value="">🚗 Sale & Rent</option>
                <option value="Sale">🔑 For Sale</option>
                <option value="Rent">🔄 For Rent</option>
              </select>
              <select style={{flex:'1', minWidth:'130px', padding:'10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', outline:'none'}}
                value={carTypeFilter} onChange={e => setCarTypeFilter(e.target.value)}>
                <option value="">All Vehicles</option>
                <option value="Car">🚗 Car</option>
                <option value="Motorcycle">🏍️ Motorcycle</option>
                <option value="Bicycle">🚲 Bicycle</option>
                <option value="Truck">🚛 Truck</option>
                <option value="Van">🚐 Van</option>
              </select>
              <select style={{flex:'1', minWidth:'130px', padding:'10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', outline:'none'}}
                value={carConditionFilter} onChange={e => setCarConditionFilter(e.target.value)}>
                <option value="">Any Condition</option>
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="For Parts">For Parts</option>
              </select>
            </div>
          </div>

          <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 16px', fontWeight:'500'}}>{carListings.length} vehicle{carListings.length !== 1 ? 's' : ''} found</p>

          {loading ? (
            <div style={{textAlign:'center', padding:'80px 0'}}>
              <div className="spinner" style={{margin:'0 auto 16px'}}></div>
              <p style={{color:'#6b7280', fontSize:'14px'}}>Loading vehicles...</p>
            </div>
          ) : carListings.length === 0 ? (
            <div style={{textAlign:'center', padding:'60px 24px', background:'#ffffff', borderRadius:'16px', border:'2px dashed #ddd6fe'}}>
              <div style={{fontSize:'48px', marginBottom:'12px'}}>🚗</div>
              <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>No vehicles found</p>
              <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>Be the first to list a car, motorcycle or bicycle!</p>
              <Link href="/list" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'12px 28px', borderRadius:'10px', background:'#7c3aed', textDecoration:'none', display:'inline-block'}}>
                List Your Vehicle — Free
              </Link>
            </div>
          ) : (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap:'16px'}}>
              {carListings.map(l => <ListingCard key={l.id} l={l} />)}
            </div>
          )}
        </div>
      )}

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'0 16px 64px', boxSizing:'border-box'}}>
          <div style={{background:'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius:'16px', padding:'24px', marginBottom:'20px', border:'1px solid #bfdbfe'}}>
            <h2 style={{fontSize:'22px', fontWeight:'800', color:'#1e3a8a', margin:'0 0 8px'}}>💼 Jobs Board / የስራ ቦርድ</h2>
            <p style={{fontSize:'14px', color:'#1d4ed8', margin:'0 0 16px'}}>Find jobs or post your opening — free for everyone · ለሁሉም ነፃ ነው</p>
            <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
              <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'10px 18px', borderRadius:'10px', background:'#1877F2', textDecoration:'none', display:'inline-block'}}>
                👤 I Need a Job / ስራ እፈልጋለሁ
              </Link>
              <Link href="/list" style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'10px 18px', borderRadius:'10px', background:'#166534', textDecoration:'none', display:'inline-block'}}>
                🏢 Post a Job / የስራ ቅጥር ማስታዎቂያ
              </Link>
            </div>
          </div>

          <div style={{background:'#ffffff', borderRadius:'16px', padding:'16px', marginBottom:'20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center'}}>
              <input
                style={{flex:'2', minWidth:'160px', padding:'10px 14px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', outline:'none', background:'#f9fafb'}}
                placeholder="Search jobs... / ስራ ፈልግ..."
                value={jobSearch}
                onChange={e => setJobSearch(e.target.value)}
              />
              <select style={{flex:'1', minWidth:'160px', padding:'10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', outline:'none'}}
                value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
                <option value="">👥 All Jobs</option>
                <option value="Looking for Work">👤 Looking for Work — ስራ እፈልጋለሁ</option>
                <option value="Hiring">🏢 Hiring — ሰራተኛ መቅጠር እንፈልጋለን</option>
              </select>
              <select style={{flex:'1', minWidth:'160px', padding:'10px', borderRadius:'10px', border:'2px solid #e5e7eb', fontSize:'13px', color:'#111827', background:'#f9fafb', outline:'none'}}
                value={jobTypeFilter} onChange={e => setJobTypeFilter(e.target.value)}>
                <option value="">🗂️ All Types</option>
                <option value="Full Time">Full Time / ሙሉ ጊዜ</option>
                <option value="Part Time">Part Time / ግማሽ ጊዜ</option>
                <option value="Contract">Contract / ኮንትራት</option>
                <option value="Day Job">Day Job / የቀን ስራ</option>
                <option value="Household Assistant">Household Assistant / የቤት ሰራተኛ</option>
                <option value="Home Care">Home Care / የቤት ጽዳት</option>
                <option value="Nanny">Nanny / ልጅ ተንከባካቢ</option>
                <option value="Driver">Driver / ሹፌር</option>
                <option value="Security">Security / ጠባቂ</option>
              </select>
            </div>
          </div>

          <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 16px', fontWeight:'500'}}>{jobListings.length} job{jobListings.length !== 1 ? 's' : ''} found</p>

          {loading ? (
            <div style={{textAlign:'center', padding:'80px 0'}}>
              <div className="spinner" style={{margin:'0 auto 16px'}}></div>
              <p style={{color:'#6b7280', fontSize:'14px'}}>Loading jobs...</p>
            </div>
          ) : jobListings.length === 0 ? (
            <div style={{textAlign:'center', padding:'60px 24px', background:'#ffffff', borderRadius:'16px', border:'2px dashed #bfdbfe'}}>
              <div style={{fontSize:'48px', marginBottom:'12px'}}>💼</div>
              <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>No jobs found / ምንም ስራ አልተገኘም</p>
              <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>Be the first to post a job or add your resume!</p>
              <Link href="/list" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'12px 28px', borderRadius:'10px', background:'#1877F2', textDecoration:'none', display:'inline-block'}}>
                Post a Job — Free / ስራ ያስገቡ
              </Link>
            </div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
              {jobListings.map(l => (
                <Link key={l.id} href={`/listing/${l.id}`} style={{textDecoration:'none'}}>
                  <div style={{background:'#ffffff', borderRadius:'16px', border:'1px solid #e5e7eb', padding:'18px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)', display:'flex', alignItems:'flex-start', gap:'14px', flexWrap:'wrap'}}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.10)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{width:'48px', height:'48px', borderRadius:'12px', background: l.job_employment_type === 'Hiring' ? '#f0fdf4' : '#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0, border: l.job_employment_type === 'Hiring' ? '2px solid #bbf7d0' : '2px solid #bfdbfe'}}>
                      {l.job_employment_type === 'Hiring' ? '🏢' : '👤'}
                    </div>
                    <div style={{flex:1, minWidth:'200px'}}>
                      <div style={{display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap', marginBottom:'6px'}}>
                        <span style={{background: l.job_employment_type === 'Hiring' ? '#166534' : '#1877F2', color:'#fff', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>
                          {l.job_employment_type === 'Hiring' ? '🏢 Hiring — ሰራተኛ ያስፈልጋል' : '👤 Looking for Work — ስራ እፈልጋለሁ'}
                        </span>
                        {l.job_type && <span style={{background:'#f3f4f6', color:'#374151', fontSize:'10px', fontWeight:'700', padding:'3px 8px', borderRadius:'5px'}}>{l.job_type}</span>}
                      </div>
                      <p style={{fontSize:'15px', fontWeight:'700', color:'#111827', margin:'0 0 4px'}}>{l.title}</p>
                      <p style={{fontSize:'12px', color:'#6b7280', margin:'0 0 4px'}}>📍 {l.neighborhood}{l.neighborhood && l.city ? ' · ' : ''}{l.city}</p>
                      {l.job_salary && <p style={{fontSize:'12px', color:'#166534', margin:'0', fontWeight:'600'}}>💰 {l.job_salary}</p>}
                      {l.description && <p style={{fontSize:'12px', color:'#9ca3af', margin:'6px 0 0', lineHeight:'1.5', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden'}}>{l.description}</p>}
                    </div>
                    <div style={{fontSize:'13px', fontWeight:'700', color:'#ffffff', padding:'8px 16px', borderRadius:'8px', background:'#1877F2', whiteSpace:'nowrap', alignSelf:'center'}}>
                      View Job
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'8px'}}>
          <div style={{position:'relative', width:'32px', height:'32px'}}>
            <img src="/logo.gif" alt="logo" style={{width:'32px', height:'32px', borderRadius:'50%', border:'2px solid #d97706'}} />
            <span style={{position:'absolute', bottom:'-6px', right:'-10px', background:'#ea580c', color:'#ffffff', fontSize:'12px', fontWeight:'700', padding:'2px 6px', borderRadius:'6px', border:'1px solid #1f2937', whiteSpace:'nowrap', fontFamily:"'Dancing Script', cursive"}}>List</span>
          </div>
          <p style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', margin:'0 0 0 8px'}}>{t.siteName}</p>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'10px', marginTop:'12px'}}>
          <div style={{height:'4px', width:'50px', background:'#078930', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#FCDD09', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#DA121A', borderRadius:'2px'}}></div>
        </div>
        <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>{t.footerTagline}</p>
        <div style={{display:'flex', justifyContent:'center', gap:'16px', marginTop:'10px', flexWrap:'wrap'}}>
          <Link href="/terms" style={{fontSize:'12px', color:'#9ca3af', textDecoration:'none'}}>📋 Terms of Service</Link>
          <Link href="/privacy" style={{fontSize:'12px', color:'#9ca3af', textDecoration:'none'}}>🔒 Privacy Policy</Link>
          <Link href="/contact" style={{fontSize:'12px', color:'#9ca3af', textDecoration:'none'}}>📬 Contact Us</Link>
        </div>
      </footer>

    </div>
  )
}

