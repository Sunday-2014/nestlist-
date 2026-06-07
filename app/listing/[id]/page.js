'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { use } from 'react'

export default function ListingDetail({ params }) {
  const { id } = use(params)
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePhoto, setActivePhoto] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [copied, setCopied] = useState(false)
  const [pageUrl, setPageUrl] = useState('https://enjerapresslist.com/listing/' + id)

  useEffect(() => {
    setPageUrl(window.location.href)
    fetchListing()
  }, [])

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*, listing_images(public_url, position, storage_path), listing_type, price_period, sale_price, down_payment, monthly_after_down, currency')
      .eq('id', id)
      .single()
    if (!error && data) {
      const sorted = data.listing_images?.sort((a,b) => a.position - b.position) || []
      setListing({...data, listing_images: sorted})
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)
    }
    setLoading(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRevealContact = async () => {
    setShowContact(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landlordEmail: listing.contact_email,
          landlordName: listing.contact_name,
          renterEmail: 'anonymous@visitor.com',
          renterName: 'A visitor',
          listingTitle: listing.title,
          message: ''
        })
      })
    } catch(e) {
      console.error('Email error:', e)
    }
  }

  const formatPrice = (amount, currency) => {
    if (!amount) return ''
    if (currency === 'ETB') return `${amount?.toLocaleString()} ETB`
    return `$${amount?.toLocaleString()}`
  }

  const images = listing?.listing_images?.filter(i => !i.storage_path?.match(/\.(mp4|mov|avi)$/i)) || []
  const videos = listing?.listing_images?.filter(i => i.storage_path?.match(/\.(mp4|mov|avi)$/i)) || []
  const isForSale = listing?.listing_type === 'Sale'

  const Navbar = () => (
    <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100, width:'100%', boxSizing:'border-box'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{position:'relative', width:'40px', height:'40px', flexShrink:0}}>
            <img src="/logo.gif" alt="logo" style={{width:'40px', height:'40px', borderRadius:'50%', border:'2px solid #d97706'}} />
            <span style={{position:'absolute', bottom:'-8px', right:'-12px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', padding:'2px 7px', borderRadius:'6px', border:'2px solid #ffffff', whiteSpace:'nowrap', fontFamily:"'Dancing Script', cursive"}}>List</span>
          </div>
          <Link href="/" style={{fontSize:'clamp(14px, 4vw, 20px)', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite', marginLeft:'8px'}}>EnjeraPressList.Com</Link>
        </div>
        <Link href="/" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none', whiteSpace:'nowrap'}}>← Back</Link>
      </div>
      <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
        <div style={{height:'6px', background:'#078930'}}></div>
        <div style={{height:'6px', background:'#FCDD09'}}></div>
        <div style={{height:'6px', background:'#DA121A'}}></div>
      </div>
    </nav>
  )

  const Footer = () => (
    <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
      <p style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', margin:'0 0 8px'}}>EnjeraPressList.Com</p>
      <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'10px'}}>
        <div style={{height:'4px', width:'50px', background:'#078930', borderRadius:'2px'}}></div>
        <div style={{height:'4px', width:'50px', background:'#FCDD09', borderRadius:'2px'}}></div>
        <div style={{height:'4px', width:'50px', background:'#DA121A', borderRadius:'2px'}}></div>
      </div>
      <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>Free rental listings · No fees · Connect directly with landlords</p>
    </footer>
  )

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>
      <Navbar />
      <div style={{textAlign:'center', padding:'80px 24px'}}>
        <p style={{color:'#6b7280', fontSize:'16px'}}>Loading listing...</p>
      </div>
      <Footer />
    </div>
  )

  if (!listing) return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>
      <Navbar />
      <div style={{textAlign:'center', padding:'80px 24px'}}>
        <div style={{fontSize:'48px', marginBottom:'16px'}}>🏠</div>
        <p style={{fontSize:'18px', fontWeight:'700', color:'#111827', margin:'0 0 8px'}}>Listing not found</p>
        <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 20px'}}>This listing may have been removed.</p>
        <Link href="/" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'12px 28px', borderRadius:'10px', background:'#ea580c', textDecoration:'none', display:'inline-block'}}>← Back to listings</Link>
      </div>
      <Footer />
    </div>
  )

  const shareText = `Check out this property: ${listing.title} - ${isForSale ? 'For Sale' : 'For Rent'} in ${listing.city}`

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', overflowX:'hidden'}}>
      <Navbar />

      <div style={{maxWidth:'900px', margin:'0 auto', padding:'24px 16px 64px', boxSizing:'border-box'}}>

        {/* PHOTO GALLERY */}
        {images.length > 0 ? (
          <div style={{marginBottom:'16px', borderRadius:'16px', overflow:'hidden', border:'1px solid #e5e7eb', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
            <img src={images[activePhoto]?.public_url} alt={listing.title} style={{width:'100%', height:'clamp(200px, 50vw, 420px)', objectFit:'cover', display:'block'}} />
            {images.length > 1 && (
              <div style={{display:'flex', gap:'8px', padding:'10px', background:'#ffffff', overflowX:'auto'}}>
                {images.map((img, i) => (
                  <img key={i} src={img.public_url} alt="" onClick={() => setActivePhoto(i)}
                    style={{width:'70px', height:'56px', objectFit:'cover', borderRadius:'8px', cursor:'pointer', flexShrink:0, border: i === activePhoto ? '3px solid #ea580c' : '3px solid transparent', opacity: i === activePhoto ? 1 : 0.7}} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{height:'200px', background:'linear-gradient(135deg, #fff7ed, #ffedd5)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'64px', marginBottom:'16px', border:'1px solid #e5e7eb'}}>🏠</div>
        )}

        {/* SHARE BUTTONS */}
        <div style={{background:'#ffffff', borderRadius:'16px', padding:'16px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
          <p style={{fontSize:'12px', fontWeight:'700', color:'#374151', margin:'0 0 10px', textTransform:'uppercase', letterSpacing:'0.06em'}}>📤 Share this listing</p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'8px'}}>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{padding:'11px 6px', borderRadius:'8px', background:'#25D366', color:'#ffffff', fontSize:'13px', fontWeight:'700', textAlign:'center', textDecoration:'none', display:'block'}}>📱 WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{padding:'11px 6px', borderRadius:'8px', background:'#1877F2', color:'#ffffff', fontSize:'13px', fontWeight:'700', textAlign:'center', textDecoration:'none', display:'block'}}>👍 Facebook</a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
              style={{padding:'11px 6px', borderRadius:'8px', background:'#0088cc', color:'#ffffff', fontSize:'13px', fontWeight:'700', textAlign:'center', textDecoration:'none', display:'block'}}>✈️ Telegram</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer"
              style={{padding:'11px 6px', borderRadius:'8px', background:'#000000', color:'#ffffff', fontSize:'13px', fontWeight:'700', textAlign:'center', textDecoration:'none', display:'block'}}>𝕏 Twitter (X)</a>
          </div>
          <button onClick={handleCopyLink}
            style={{width:'100%', padding:'10px', borderRadius:'8px', background: copied ? '#f0fdf4' : '#f9fafb', color: copied ? '#166534' : '#374151', fontSize:'13px', fontWeight:'700', border: copied ? '2px solid #bbf7d0' : '2px solid #e5e7eb', cursor:'pointer', transition:'all 0.2s', boxSizing:'border-box'}}>
            {copied ? '✅ Link Copied!' : '🔗 Copy Link'}
          </button>
        </div>

        {/* CONTACT CARD */}
        <div style={{background:'#ffffff', borderRadius:'16px', padding:'20px', border:'1px solid #e5e7eb', boxShadow:'0 4px 16px rgba(0,0,0,0.08)', marginBottom:'16px'}}>
          <h2 style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0 0 16px', paddingBottom:'10px', borderBottom:'2px solid #fed7aa'}}>Contact {isForSale ? 'Seller' : 'Landlord'}</h2>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', padding:'12px', background:'#f9fafb', borderRadius:'12px', border:'1px solid #e5e7eb'}}>
            <div style={{width:'46px', height:'46px', background:'#fff7ed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0, border:'2px solid #fed7aa'}}>👤</div>
            <div>
              <p style={{fontSize:'15px', fontWeight:'700', color:'#111827', margin:'0'}}>{listing.contact_name || 'Owner'}</p>
              <p style={{fontSize:'12px', color:'#6b7280', margin:'0', fontWeight:'500'}}>Prefers: {listing.contact_method}</p>
            </div>
          </div>
          {!showContact ? (
            <div>
              <div style={{background:'#f9fafb', borderRadius:'10px', padding:'14px', marginBottom:'12px', border:'2px dashed #d1d5db', textAlign:'center'}}>
                <p style={{fontSize:'13px', color:'#6b7280', margin:'0 0 4px', fontWeight:'600'}}>📧 ••••••@••••••.com</p>
                {listing.contact_phone && <p style={{fontSize:'13px', color:'#6b7280', margin:'0', fontWeight:'600'}}>📞 ••• ••• ••••</p>}
              </div>
              <button onClick={handleRevealContact}
                style={{display:'block', width:'100%', padding:'14px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', textAlign:'center', borderRadius:'10px', border:'none', cursor:'pointer', marginBottom:'10px', boxSizing:'border-box'}}>
                👁 Reveal Contact Info
              </button>
            </div>
          ) : (
            <div>
              <div style={{background:'#f9fafb', borderRadius:'10px', padding:'12px', marginBottom:'10px', border:'1px solid #e5e7eb'}}>
                <p style={{fontSize:'11px', color:'#6b7280', margin:'0 0 4px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Email</p>
                <a href={`mailto:${listing.contact_email}`} style={{fontSize:'14px', fontWeight:'600', color:'#ea580c', textDecoration:'none', wordBreak:'break-all'}}>{listing.contact_email}</a>
              </div>
              {listing.contact_phone && (
                <div style={{background:'#f9fafb', borderRadius:'10px', padding:'12px', marginBottom:'10px', border:'1px solid #e5e7eb'}}>
                  <p style={{fontSize:'11px', color:'#6b7280', margin:'0 0 4px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Phone</p>
                  <a href={`tel:${listing.contact_phone}`} style={{fontSize:'14px', fontWeight:'600', color:'#166534', textDecoration:'none'}}>{listing.contact_phone}</a>
                </div>
              )}
              <a href={`mailto:${listing.contact_email}`} style={{display:'block', width:'100%', padding:'12px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', textAlign:'center', borderRadius:'10px', textDecoration:'none', marginBottom:'8px', boxSizing:'border-box'}}>✉️ Send Email</a>
              {listing.contact_phone && (
                <a href={`tel:${listing.contact_phone}`} style={{display:'block', width:'100%', padding:'12px', background:'#166534', color:'#ffffff', fontSize:'14px', fontWeight:'700', textAlign:'center', borderRadius:'10px', textDecoration:'none', boxSizing:'border-box'}}>📞 Call Now</a>
              )}
            </div>
          )}
          <div style={{marginTop:'12px', padding:'10px', background:'#f0fdf4', borderRadius:'10px', border:'1px solid #bbf7d0'}}>
            <p style={{fontSize:'12px', color:'#166534', margin:'0', lineHeight:'1.6', textAlign:'center', fontWeight:'500'}}>🔒 Contact directly — no middlemen, no fees</p>
          </div>
        </div>

        {/* TITLE + STATS */}
        <div style={{background:'#ffffff', borderRadius:'16px', padding:'20px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
          <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px', flexWrap:'wrap'}}>
            <span style={{background: isForSale ? '#166534' : '#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'700', padding:'4px 10px', borderRadius:'6px'}}>
              {isForSale ? '🔑 For Sale' : '🏠 For Rent'}
            </span>
            <span style={{background:'#f9fafb', color:'#374151', fontSize:'11px', fontWeight:'700', padding:'4px 10px', borderRadius:'6px', border:'1px solid #e5e7eb'}}>{listing.property_type}</span>
            <span style={{background:'#f9fafb', color:'#6b7280', fontSize:'11px', fontWeight:'700', padding:'4px 10px', borderRadius:'6px', border:'1px solid #e5e7eb'}}>👁 {listing.views || 0} views</span>
          </div>

          <h1 style={{fontSize:'clamp(18px, 4vw, 26px)', fontWeight:'800', color:'#111827', margin:'0 0 8px', lineHeight:'1.3'}}>{listing.title}</h1>
          <p style={{fontSize:'14px', color:'#6b7280', margin:'0 0 16px', fontWeight:'500'}}>
            📍 {[listing.address, listing.neighborhood, listing.city, listing.state, listing.zip].filter(Boolean).join(', ')}
          </p>

          <div style={{display:'flex', flexWrap:'wrap', gap:'10px'}}>
            {!isForSale && listing.currency !== 'Contact' && (
              <div style={{background:'#fff7ed', borderRadius:'10px', padding:'10px 16px', border:'1px solid #fed7aa', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#9a3412', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Price</p>
                <p style={{fontSize:'20px', fontWeight:'800', color:'#ea580c', margin:'0'}}>{formatPrice(listing.price, listing.currency)}</p>
                {listing.price_period && <p style={{fontSize:'11px', color:'#9a3412', margin:'2px 0 0', fontWeight:'500'}}>{listing.price_period}</p>}
              </div>
            )}
            {listing.currency === 'Contact' && (
              <div style={{background:'#fff7ed', borderRadius:'10px', padding:'10px 16px', border:'1px solid #fed7aa', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#9a3412', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Price</p>
                <p style={{fontSize:'16px', fontWeight:'700', color:'#ea580c', margin:'0'}}>Contact for price</p>
              </div>
            )}
            {isForSale && listing.currency !== 'Contact' && listing.sale_price && (
              <div style={{background:'#f0fdf4', borderRadius:'10px', padding:'10px 16px', border:'1px solid #bbf7d0', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#166534', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Sale Price</p>
                <p style={{fontSize:'20px', fontWeight:'800', color:'#166534', margin:'0'}}>{formatPrice(listing.sale_price, listing.currency)}</p>
              </div>
            )}
            {isForSale && listing.down_payment && (
              <div style={{background:'#eff6ff', borderRadius:'10px', padding:'10px 16px', border:'1px solid #bfdbfe', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#1d4ed8', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Down Payment</p>
                <p style={{fontSize:'18px', fontWeight:'800', color:'#1d4ed8', margin:'0'}}>{formatPrice(listing.down_payment, listing.currency)}</p>
              </div>
            )}
            {isForSale && listing.monthly_after_down && (
              <div style={{background:'#fdf4ff', borderRadius:'10px', padding:'10px 16px', border:'1px solid #e9d5ff', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#7c3aed', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Monthly After Down</p>
                <p style={{fontSize:'18px', fontWeight:'800', color:'#7c3aed', margin:'0'}}>{formatPrice(listing.monthly_after_down, listing.currency)}</p>
                <p style={{fontSize:'11px', color:'#7c3aed', margin:'2px 0 0', fontWeight:'500'}}>per month</p>
              </div>
            )}
            <div style={{background:'#f9fafb', borderRadius:'10px', padding:'10px 16px', border:'1px solid #e5e7eb', textAlign:'center'}}>
              <p style={{fontSize:'11px', color:'#6b7280', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Bedrooms</p>
              <p style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0'}}>{listing.bedrooms}</p>
            </div>
            <div style={{background:'#f9fafb', borderRadius:'10px', padding:'10px 16px', border:'1px solid #e5e7eb', textAlign:'center'}}>
              <p style={{fontSize:'11px', color:'#6b7280', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Bathrooms</p>
              <p style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0'}}>{listing.bathrooms}</p>
            </div>
            {listing.available_from && (
              <div style={{background:'#f0fdf4', borderRadius:'10px', padding:'10px 16px', border:'1px solid #bbf7d0', textAlign:'center'}}>
                <p style={{fontSize:'11px', color:'#166534', margin:'0 0 2px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em'}}>Available</p>
                <p style={{fontSize:'14px', fontWeight:'700', color:'#166534', margin:'0'}}>{new Date(listing.available_from).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</p>
              </div>
            )}
          </div>
        </div>

        {/* DESCRIPTION */}
        {listing.description && (
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'20px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0 0 12px', paddingBottom:'10px', borderBottom:'2px solid #fed7aa'}}>About this property</h2>
            <p style={{fontSize:'14px', color:'#4b5563', lineHeight:'1.8', margin:'0', whiteSpace:'pre-wrap'}}>{listing.description}</p>
          </div>
        )}

        {/* VIDEO */}
        {videos.length > 0 && (
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'20px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize:'16px', fontWeight:'700', color:'#111827', margin:'0 0 12px', paddingBottom:'10px', borderBottom:'2px solid #fed7aa'}}>🎥 Property Video</h2>
            <video src={videos[0].public_url} controls style={{width:'100%', borderRadius:'10px', maxHeight:'320px'}} />
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}
