'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase, getCurrentUser, updateListing, uploadListingImage } from '@/lib/supabase'
import Link from 'next/link'
import { use } from 'react'

export default function EditListing({ params }) {
  const { id } = use(params)
  const [form, setForm] = useState({
    title:'', property_type:'Apartment', listing_type:'Rent',
    price:'', currency:'USD', price_period:'Per Month',
    sale_price:'', down_payment:'', monthly_after_down:'',
    bedrooms:'1 bedroom', bathrooms:'1 bathroom', description:'',
    address:'', city:'', state:'', zip:'', neighborhood:'',
    contact_name:'', contact_email:'', contact_phone:'',
    contact_method:'Email', available_from:''
  })
  const [existingImages, setExistingImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    checkUserAndLoad()
  }, [])

  const checkUserAndLoad = async () => {
    const user = await getCurrentUser()
    if (!user) { window.location.href = '/login'; return }
    const { data, error } = await supabase
      .from('listings')
      .select('*, listing_images(id, public_url, position, storage_path)')
      .eq('id', id)
      .single()
    if (error || !data) { window.location.href = '/dashboard'; return }
    if (data.user_id !== user.id) { window.location.href = '/dashboard'; return }
    const sorted = data.listing_images?.sort((a,b) => a.position - b.position) || []
    setExistingImages(sorted)
    setForm({
      title: data.title || '',
      property_type: data.property_type || 'Apartment',
      listing_type: data.listing_type || 'Rent',
      price: data.price || '',
      currency: data.currency || 'USD',
      price_period: data.price_period || 'Per Month',
      sale_price: data.sale_price || '',
      down_payment: data.down_payment || '',
      monthly_after_down: data.monthly_after_down || '',
      bedrooms: data.bedrooms || '1 bedroom',
      bathrooms: data.bathrooms || '1 bathroom',
      description: data.description || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip: data.zip || '',
      neighborhood: data.neighborhood || '',
      contact_name: data.contact_name || '',
      contact_email: data.contact_email || '',
      contact_phone: data.contact_phone || '',
      contact_method: data.contact_method || 'Email',
      available_from: data.available_from || ''
    })
    setLoading(false)
  }

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files)
    const existingImageCount = existingImages.filter(i => !i.storage_path?.match(/\.(mp4|mov|avi)$/i)).length
    const existingVideoCount = existingImages.filter(i => i.storage_path?.match(/\.(mp4|mov|avi)$/i)).length
    const newImageCount = newFiles.filter(f => f.type.startsWith('image/')).length
    const newVideoCount = newFiles.filter(f => f.type.startsWith('video/')).length
    const addImages = selected.filter(f => f.type.startsWith('image/'))
    const addVideos = selected.filter(f => f.type.startsWith('video/'))
    if (existingImageCount + newImageCount + addImages.length > 4) { setError('Maximum 4 photos allowed'); return }
    if (existingVideoCount + newVideoCount + addVideos.length > 1) { setError('Maximum 1 video allowed'); return }
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
    setNewFiles(prev => [...prev, ...validFiles])
    setNewPreviews(prev => [...prev, ...validPreviews])
  }

  const removeExistingImage = async (imageId, storagePath) => {
    try {
      await supabase.storage.from('listing-images').remove([storagePath])
      await supabase.from('listing_images').delete().eq('id', imageId)
      setExistingImages(prev => prev.filter(i => i.id !== imageId))
    } catch (e) {
      setError('Error removing image: ' + e.message)
    }
  }

  const removeNewFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index))
    setNewPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.title) { setError('Please add a title'); return }
    if (!form.city) { setError('Please add a city'); return }
    if (form.listing_type === 'Rent' && !form.price && form.currency !== 'Contact') { setError('Please add a rental price'); return }
    if (form.listing_type === 'Sale' && !form.sale_price && form.currency !== 'Contact') { setError('Please add a sale price'); return }
    if (!form.contact_phone) { setError('Please add a contact phone number'); return }
    setSaving(true)
    try {
      await updateListing(id, {
        ...form,
        price: form.price ? parseInt(form.price.toString().replace(/,/g, '')) : 0,
        sale_price: form.sale_price ? parseInt(form.sale_price.toString().replace(/,/g, '')) : null,
        down_payment: form.down_payment ? parseInt(form.down_payment.toString().replace(/,/g, '')) : null,
        monthly_after_down: form.monthly_after_down ? parseInt(form.monthly_after_down.toString().replace(/,/g, '')) : null,
      })
      if (newFiles.length > 0) {
        const startPosition = existingImages.length
        for (let i = 0; i < newFiles.length; i++) {
          setUploadProgress(`Uploading file ${i + 1} of ${newFiles.length}...`)
          await uploadListingImage(id, newFiles[i], startPosition + i)
        }
      }
      window.location.href = '/dashboard'
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
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

  const formatNumber = (val) => {
    if (!val) return ''
    const num = val.toString().replace(/,/g, '')
    if (isNaN(num)) return val
    return parseInt(num).toLocaleString()
  }

  const handlePriceChange = (field, value) => {
    const raw = value.replace(/[^0-9]/g, '')
    setForm({...form, [field]: raw})
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <p style={{color:'#6b7280', fontSize:'16px'}}>Loading listing...</p>
    </div>
  )

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
          <Link href="/dashboard" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back to dashboard</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'32px 24px 64px'}}>
        <div style={{marginBottom:'28px'}}>
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#111827', margin:'0 0 6px'}}>Edit Listing</h1>
          <p style={{fontSize:'15px', color:'#6b7280', margin:'0'}}>Update your property details below.</p>
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
            <button onClick={() => setForm({...form, listing_type:'Rent'})}
              style={{padding:'16px', borderRadius:'12px', border: isRent ? '3px solid #ea580c' : '2px solid #e5e7eb', background: isRent ? '#fff7ed' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
              <div style={{fontSize:'24px', marginBottom:'6px'}}>🏠</div>
              <p style={{fontSize:'15px', fontWeight:'700', color: isRent ? '#ea580c' : '#374151', margin:'0 0 2px'}}>For Rent</p>
              <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Monthly / Daily / Yearly rental</p>
            </button>
            <button onClick={() => setForm({...form, listing_type:'Sale'})}
              style={{padding:'16px', borderRadius:'12px', border: isSale ? '3px solid #166534' : '2px solid #e5e7eb', background: isSale ? '#f0fdf4' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
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
            <textarea style={{...inputStyle, minHeight:'100px', resize:'vertical'}} placeholder="Describe the property…" {...f('description')} />
          </div>
        </div>

        {/* PRICING */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>💰 Pricing</div>
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

          {isRent && !isContact && (
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Rental Price *</label>
                <input
                  style={inputStyle}
                  type="text"
                  inputMode="numeric"
                  placeholder={form.currency === 'ETB' ? 'e.g. 15,000' : 'e.g. 1,800'}
                  value={formatNumber(form.price)}
                  onChange={e => handlePriceChange('price', e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Price Period</label>
                <select style={inputStyle} {...f('price_period')}>
                  {['Per Month','Per Day','Per Year','Per Week'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}

          {isSale && !isContact && (
            <div>
              <div style={{marginBottom:'14px'}}>
                <label style={labelStyle}>Total Sale Price *</label>
                <input
                  style={inputStyle}
                  type="text"
                  inputMode="numeric"
                  placeholder={form.currency === 'ETB' ? 'e.g. 5,000,000' : 'e.g. 250,000'}
                  value={formatNumber(form.sale_price)}
                  onChange={e => handlePriceChange('sale_price', e.target.value)}
                />
              </div>
              <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'14px', marginBottom:'14px'}}>
                <p style={{fontSize:'13px', fontWeight:'700', color:'#166534', margin:'0 0 10px'}}>💳 Down Payment Options (optional)</p>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                  <div>
                    <label style={{...labelStyle, color:'#166534'}}>Down Payment</label>
                    <input
                      style={inputStyle}
                      type="text"
                      inputMode="numeric"
                      placeholder={form.currency === 'ETB' ? 'e.g. 500,000' : 'e.g. 50,000'}
                      value={formatNumber(form.down_payment)}
                      onChange={e => handlePriceChange('down_payment', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{...labelStyle, color:'#166534'}}>Monthly After Down Payment</label>
                    <input
                      style={inputStyle}
                      type="text"
                      inputMode="numeric"
                      placeholder={form.currency === 'ETB' ? 'e.g. 20,000' : 'e.g. 1,500'}
                      value={formatNumber(form.monthly_after_down)}
                      onChange={e => handlePriceChange('monthly_after_down', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {isContact && (
            <div style={{background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px', padding:'14px'}}>
              <p style={{fontSize:'13px', color:'#92400e', margin:'0', fontWeight:'600'}}>📞 Price will be hidden — buyers will contact you directly for pricing details.</p>
            </div>
          )}
        </div>

        {/* LOCATION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 Location</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Street Address</label>
            <input style={inputStyle} placeholder="e.g. Bole Road, House No. 123" {...f('address')} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>City *</label>
              <input style={inputStyle} placeholder="e.g. Addis Ababa or Washington DC" {...f('city')} />
            </div>
            <div>
              <label style={labelStyle}>State / Region</label>
              <input style={inputStyle} placeholder="e.g. Amhara, Oromia, DC, VA" {...f('state')} />
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

          {existingImages.length > 0 && (
            <div style={{marginBottom:'16px'}}>
              <p style={{fontSize:'13px', fontWeight:'700', color:'#374151', marginBottom:'10px'}}>Current photos — click ✕ to remove</p>
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'10px'}}>
                {existingImages.map((img, i) => (
                  <div key={img.id} style={{position:'relative', borderRadius:'10px', overflow:'hidden', border:'2px solid #e5e7eb'}}>
                    {img.storage_path?.match(/\.(mp4|mov|avi)$/i) ? (
                      <video src={img.public_url} style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}} />
                    ) : (
                      <img src={img.public_url} alt="" style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}} />
                    )}
                    <div style={{padding:'4px 8px', background:'#ffffff'}}>
                      <p style={{fontSize:'10px', color:'#6b7280', margin:'0', fontWeight:'600'}}>
                        {img.storage_path?.match(/\.(mp4|mov|avi)$/i) ? '🎥 Video' : `📷 Photo ${i+1}`}
                      </p>
                    </div>
                    <button onClick={() => removeExistingImage(img.id, img.storage_path)}
                      style={{position:'absolute', top:'6px', right:'6px', background:'#ef4444', color:'#ffffff', border:'none', borderRadius:'50%', width:'24px', height:'24px', cursor:'pointer', fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            onClick={() => fileInputRef.current.click()}
            style={{border:'2px dashed #d1d5db', borderRadius:'12px', padding:'28px 24px', textAlign:'center', cursor:'pointer', background:'#f9fafb', marginBottom:'12px'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ea580c'; e.currentTarget.style.background='#fff7ed' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#d1d5db'; e.currentTarget.style.background='#f9fafb' }}
          >
            <div style={{fontSize:'32px', marginBottom:'8px'}}>📁</div>
            <p style={{fontSize:'14px', fontWeight:'700', color:'#374151', margin:'0 0 4px'}}>Click to add more photos or video</p>
            <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>JPG, PNG, WEBP · MP4 (max 30 sec)</p>
            <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={handleFileChange} style={{display:'none'}} />
          </div>

          {newPreviews.length > 0 && (
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'10px'}}>
              {newPreviews.map((p, i) => (
                <div key={i} style={{position:'relative', borderRadius:'10px', overflow:'hidden', border:'2px solid #fed7aa'}}>
                  {p.type === 'image' ? (
                    <img src={p.url} alt="" style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}} />
                  ) : (
                    <video src={p.url} style={{width:'100%', height:'110px', objectFit:'cover', display:'block'}} controls />
                  )}
                  <div style={{padding:'4px 8px', background:'#fff7ed'}}>
                    <p style={{fontSize:'10px', color:'#9a3412', margin:'0', fontWeight:'600'}}>
                      {p.type === 'video' ? '🎥 New video' : '📷 New photo'}
                    </p>
                  </div>
                  <button onClick={() => removeNewFile(i)} style={{position:'absolute', top:'6px', right:'6px', background:'#ef4444', color:'#ffffff', border:'none', borderRadius:'50%', width:'24px', height:'24px', cursor:'pointer', fontSize:'12px', fontWeight:'700', display:'flex', alignItems:'center', justifyContent:'center'}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📞 Contact Information</div>
          <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px'}}>
            <p style={{fontSize:'13px', color:'#166534', margin:'0', fontWeight:'600'}}>🔒 Your registered email is used as contact email and cannot be changed.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Your Name</label>
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

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          <Link href="/dashboard" style={{padding:'16px', borderRadius:'12px', background:'#ffffff', color:'#374151', fontSize:'15px', fontWeight:'700', border:'2px solid #d1d5db', textAlign:'center', textDecoration:'none', display:'block'}}>
            Cancel
          </Link>
          <button onClick={handleSubmit} disabled={saving}
            style={{padding:'16px', borderRadius:'12px', background: saving ? '#d1d5db' : '#ea580c', color:'#ffffff', fontSize:'15px', fontWeight:'800', border:'none', cursor: saving ? 'not-allowed' : 'pointer'}}>
            {saving ? '⏳ Saving...' : '✅ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
