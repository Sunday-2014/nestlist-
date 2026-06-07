'use client'
import { useState, useRef, useEffect } from 'react'
import { createListing, getCurrentUser, uploadListingImage } from '@/lib/supabase'
import Link from 'next/link'

export default function ListProperty() {
  const [form, setForm] = useState({
    title:'', property_type:'Apartment', listing_type:'Rent',
    price:'', currency:'USD', price_period:'Per Month',
    sale_price:'', down_payment:'', monthly_after_down:'',
    bedrooms:'1 bedroom', bathrooms:'1 bathroom', description:'',
    address:'', city:'', state:'DC', zip:'', neighborhood:'',
    contact_name:'', contact_email:'', contact_phone:'',
    contact_method:'Email', available_from:''
  })
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const user = await getCurrentUser()
    if (!user) { window.location.href = '/login'; return }
    setForm(prev => ({
      ...prev,
      contact_email: user.email,
      contact_name: user.user_metadata?.full_name || ''
    }))
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    const existingImages = files.filter(f => f.type.startsWith('image/'))
    const existingVideos = files.filter(f => f.type.startsWith('video/'))
    const newImages = selected.filter(f => f.type.startsWith('image/'))
    const newVideos = selected.filter(f => f.type.startsWith('video/'))
    if (existingImages.length + newImages.length > 4) { setError('Maximum 4 photos allowed'); return }
    if (existingVideos.length + newVideos.length > 1) { setError('Maximum 1 video allowed'); return }
    const validFiles = []
    const validPreviews = []
    for (const file of selected) {
      if (file.type.startsWith('image/')) {
        validFiles.push(file)
        validPreviews.push({ url: URL.createObjectURL(file), type: 'image' })
      } else if (file.type.startsWith('video/')) {
        validFiles.push(file)
        validPreviews.push({ url: URL.createObjectURL(file), type: 'video' })
      }
    }
    setError('')
    setFiles(prev => [...prev, ...validFiles])
    setPreviews(prev => [...prev, ...validPreviews])
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.title) { setError('Please add a title'); return }
    if (!form.city) { setError('Please add a city'); return }
    if (form.listing_type === 'Rent' && !form.price && form.currency !== 'Contact') { setError('Please add a rental price'); return }
    if (form.listing_type === 'Sale' && !form.sale_price && form.currency !== 'Contact') { setError('Please add a sale price'); return }
    if (!form.contact_phone) { setError('Please add a contact phone number'); return }
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) { window.location.href = '/login'; return }
      setUploadProgress('Saving listing...')
      const listing = await createListing({
        ...form,
        price: form.price ? parseInt(form.price) : null,
        sale_price: form.sale_price ? parseInt(form.sale_price) : null,
        down_payment: form.down_payment ? parseInt(form.down_payment) : null,
        monthly_after_down: form.monthly_after_down ? parseInt(form.monthly_after_down) : null,
      })
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          setUploadProgress(`Uploading file ${i + 1} of ${files.length}...`)
          await uploadListingImage(listing.id, files[i], i)
        }
      }
      window.location.href = '/'
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
    setUploadProgress('')
  }

  const f = (field) => ({ value: form[field], onChange: e => setForm({...form, [field]: e.target.value}) })

  const inputStyle = {
    width:'100%', padding:'11px 14px', borderRadius:'10px',
    border:'2px solid #e5e7eb', fontSize:'14px', color:'#111827',
    outline:'none', background:'#f9fafb', fontWeight:'500',
    boxSizing:'border-box'
  }

  const lockedInputStyle = {
    ...inputStyle, background:'#f3f4f6', color:'#6b7280', cursor:'not-allowed'
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

  const isRent = form.listing_type === 'Rent'
  const isSale = form.listing_type === 'Sale'
  const isContact = form.currency === 'Contact'

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'800px', margin:'0 auto', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'40px', height:'40px'}}>
              <img src="/logo.gif" alt="logo" style={{width:'40px', height:'40px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-8px', right:'-12px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', padding:'2px 7px', borderRadius:'6px', border:'2px solid #ffffff', whiteSpace:'nowrap', fontFamily:"'Dancing Script', cursive"}}>List</span>
            </div>
            <Link href="/" style={{fontSize:'18px', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginLeft:'8px'}}>EnjeraPressList.Com</Link>
          </div>
          <Link href="/" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back to listings</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'32px 24px 64px'}}>
        <div style={{marginBottom:'28px'}}>
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#111827', margin:'0 0 6px'}}>List Your Property</h1>
          <p style={{fontSize:'15px', color:'#6b7280', margin:'0'}}>Fill in the details below. Your listing will be live immediately — 100% free.</p>
        </div>

        {error && (
          <div style={{background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', color:'#dc2626', fontSize:'14px', fontWeight:'600'}}>
            ⚠️ {error}
          </div>
        )}

        {/* LISTING TYPE */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🏷️ Listing Type</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <button
              onClick={() => setForm({...form, listing_type:'Rent'})}
              style={{padding:'16px', borderRadius:'12px', border: isRent ? '3px solid #ea580c' : '2px solid #e5e7eb', background: isRent ? '#fff7ed' : '#f9fafb', cursor:'pointer', textAlign:'center', transition:'all 0.15s'}}
            >
              <div style={{fontSize:'24px', marginBottom:'6px'}}>🏠</div>
              <p style={{fontSize:'15px', fontWeight:'700', color: isRent ? '#ea580c' : '#374151', margin:'0 0 2px'}}>For Rent</p>
              <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Monthly / Daily / Yearly rental</p>
            </button>
            <button
              onClick={() => setForm({...form, listing_type:'Sale'})}
              style={{padding:'16px', borderRadius:'12px', border: isSale ? '3px solid #166534' : '2px solid #e5e7eb', background: isSale ? '#f0fdf4' : '#f9fafb', cursor:'pointer', textAlign:'center', transition:'all 0.15s'}}
            >
              <div style={{fontSize:'24px', marginBottom:'6px'}}>🔑</div>
              <p style={{fontSize:'15px', fontWeight:'700', color: isSale ? '#166534' : '#374151', margin:'0 0 2px'}}>For Sale</p>
              <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Full sale / down payment</p>
            </button>
          </div>
        </div>

        {/* PROPERTY DETAILS */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>🏠 Property Details</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Listing Title *</label>
            <input style={inputStyle} placeholder="e.g. Bright 2BR apartment near downtown" {...f('title')} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Property Type</label>
              <select style={inputStyle} {...f('property_type')}>
                {['Apartment','House','Studio','Condo','Townhouse','Villa','Office','Shop','Land','Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Bedrooms</label>
              <select style={inputStyle} {...f('bedrooms')}>
                {['Studio','1 bedroom','2 bedrooms','3 bedrooms','4 bedrooms','5+ bedrooms','N/A'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <select style={inputStyle} {...f('bathrooms')}>
                {['1 bathroom','1.5 bathrooms','2 bathrooms','3+ bathrooms','N/A'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle, minHeight:'100px', resize:'vertical'}} placeholder="Describe the property — highlights, nearby amenities, terms…" {...f('description')} />
          </div>
        </div>

        {/* PRICING */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>💰 Pricing</div>

          {/* CURRENCY */}
          <div style={{marginBottom:'16px'}}>
            <label style={labelStyle}>Currency</label>
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
              {['USD','ETB','Contact'].map(c => (
                <button key={c} onClick={() => setForm({...form, currency:c})}
                  style={{padding:'8px 16px', borderRadius:'8px', border: form.currency === c ? '2px solid #ea580c' : '2px solid #e5e7eb', background: form.currency === c ? '#fff7ed' : '#f9fafb', color: form.currency === c ? '#ea580c' : '#374151', fontWeight:'700', fontSize:'13px', cursor:'pointer'}}>
                  {c === 'USD' ? '$ USD' : c === 'ETB' ? '🇪🇹 ETB ብር' : '📞 Contact for price'}
                </button>
              ))}
            </div>
          </div>

          {/* RENT PRICING */}
          {isRent && !isContact && (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Rental Price *</label>
                <input style={inputStyle} type="number" placeholder={form.currency === 'ETB' ? 'e.g. 15000' : 'e.g. 1800'} {...f('price')} />
              </div>
              <div>
                <label style={labelStyle}>Price Period</label>
                <select style={inputStyle} {...f('price_period')}>
                  {['Per Month','Per Day','Per Year','Per Week'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* SALE PRICING */}
          {isSale && !isContact && (
            <div>
              <div style={{marginBottom:'14px'}}>
                <label style={labelStyle}>Total Sale Price *</label>
                <input style={inputStyle} type="number" placeholder={form.currency === 'ETB' ? 'e.g. 5000000' : 'e.g. 250000'} {...f('sale_price')} />
              </div>
              <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'14px', marginBottom:'14px'}}>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#166534', margin:'0 0 10px'}}>💳 Down Payment Options (optional)</p>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                  <div>
                    <label style={{...labelStyle, color:'#166534'}}>Down Payment</label>
                    <input style={inputStyle} type="number" placeholder={form.currency === 'ETB' ? 'e.g. 500000' : 'e.g. 50000'} {...f('down_payment')} />
                  </div>
                  <div>
                    <label style={{...labelStyle, color:'#166534'}}>Monthly After Down Payment</label>
                    <input style={inputStyle} type="number" placeholder={form.currency === 'ETB' ? 'e.g. 20000' : 'e.g. 1500'} {...f('monthly_after_down')} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isContact && (
            <div style={{background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px', padding:'14px'}}>
              <p style={{fontSize:'13px', color:'#92400e', margin:'0', fontWeight:'600'}}>📞 Price will be hidden — renters will contact you directly for pricing details.</p>
            </div>
          )}
        </div>

        {/* LOCATION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 Location</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Street Address</label>
            <input style={inputStyle} placeholder="123 Maple Street, Apt 4B" {...f('address')} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>City *</label>
              <input style={inputStyle} placeholder="e.g. Addis Ababa or Washington DC" {...f('city')} />
            </div>
            <div>
              <label style={labelStyle}>State / Region</label>
              <input style={inputStyle} placeholder="e.g. Oromia, DC, VA" {...f('state')} />
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
            <div>
              <label style={labelStyle}>ZIP / Postal Code</label>
              <input style={inputStyle} placeholder="20001" {...f('zip')} />
            </div>
            <div>
              <label style={labelStyle}>Neighborhood / Subcity</label>
              <input style={inputStyle} placeholder="e.g. Bole, Capitol Hill" {...f('neighborhood')} />
            </div>
          </div>
        </div>

        {/* PHOTOS & VIDEO */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📸 Photos & Video</div>
          <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'16px', fontWeight:'500', lineHeight:'1.6'}}>
            Upload up to <strong style={{color:'#111827'}}>4 photos</strong> and <strong style={{color:'#111827'}}>1 video (max 30 seconds)</strong>. Listings with photos get 3x more inquiries.
          </p>
          <div
            onClick={() => fileInputRef.current.click()}
            style={{border:'2px dashed #d1d5db', borderRadius:'12px', padding:'36px 24px', textAlign:'center', cursor:'pointer', background:'#f9fafb', marginBottom:'16px', transition:'all 0.2s'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ea580c'; e.currentTarget.style.background='#fff7ed' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#d1d5db'; e.currentTarget.style.background='#f9fafb' }}
          >
            <div style={{fontSize:'40px', marginBottom:'10px'}}>📁</div>
            <p style={{fontSize:'15px', fontWeight:'700', color:'#374151', margin:'0 0 6px'}}>Click to upload photos or video</p>
            <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>JPG, PNG, WEBP · MP4 (max 30 sec) · Up to 4 photos + 1 video</p>
            <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={handleFileChange} style={{display:'none'}} />
          </div>
          {previews.length > 0 && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'10px'}}>
              {previews.map((p, i) => (
                <div key={i} style={{position:'relative', borderRadius:'10px', overflow:'hidden', border:'2px solid #e5e7eb'}}>
                  {p.type === 'image' ? (
                    <img src={p.url} alt="" style={{width:'100%', height:'120px', objectFit:'cover', display:'block'}} />
                  ) : (
                    <video src={p.url} style={{width:'100%', height:'120px', objectFit:'cover', display:'block'}} controls />
                  )}
                  <div style={{padding:'6px 8px', background:'#ffffff'}}>
                    <p style={{fontSize:'11px', color:'#6b7280', margin:'0', fontWeight:'600'}}>{p.type === 'video' ? '🎥 Video' : `📷 Photo ${i+1}`}</p>
                  </div>
                  <button onClick={() => removeFile(i)} style={{position:'absolute', top:'6px', right:'6px', background:'#ef4444', color:'#ffffff', border:'none', borderRadius:'50%', width:'24px', height:'24px', cursor:'pointer', fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📞 Contact Information</div>
          <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px'}}>
            <p style={{fontSize:'13px', color:'#166534', margin:'0', fontWeight:'600'}}>🔒 Your registered email is automatically used as your contact email.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input style={inputStyle} placeholder="Jane Smith" {...f('contact_name')} />
            </div>
            <div>
              <label style={labelStyle}>Preferred Contact</label>
              <select style={inputStyle} {...f('contact_method')}>
                {['Email','Phone','Either'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Contact Email 🔒 Verified</label>
              <input style={lockedInputStyle} value={form.contact_email} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone *</label>
              <input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000" {...f('contact_phone')} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Available From</label>
            <input style={{...inputStyle, width:'auto'}} type="date" {...f('available_from')} />
          </div>
        </div>

        {uploadProgress && (
          <div style={{background:'#fff7ed', border:'2px solid #fed7aa', borderRadius:'12px', padding:'14px 18px', marginBottom:'16px', color:'#92400e', fontSize:'14px', fontWeight:'600', textAlign:'center'}}>
            ⏳ {uploadProgress}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{width:'100%', padding:'16px', borderRadius:'12px', background: loading ? '#d1d5db' : '#ea580c', color:'#ffffff', fontSize:'16px', fontWeight:'800', border:'none', cursor: loading ? 'not-allowed' : 'pointer'}}
        >
          {loading ? '⏳ Publishing...' : '🚀 Publish Listing — Free'}
        </button>
      </div>
    </div>
  )
}
