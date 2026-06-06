'use client'
import { useState, useRef } from 'react'
import { createListing, getCurrentUser, uploadListingImage } from '@/lib/supabase'
import Link from 'next/link'

export default function ListProperty() {
  const [form, setForm] = useState({
    title:'', property_type:'Apartment', price:'', bedrooms:'1 bedroom',
    bathrooms:'1 bathroom', description:'', address:'', city:'', state:'DC',
    zip:'', neighborhood:'', contact_name:'', contact_email:'',
    contact_phone:'', contact_method:'Email', available_from:''
  })
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef(null)

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
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.src = URL.createObjectURL(file)
        video.onloadedmetadata = () => {
          if (video.duration > 30) { setError('Video must be 30 seconds or less'); return }
        }
        validFiles.push(file)
        validPreviews.push({ url: URL.createObjectURL(file), type: 'video' })
      } else {
        setError('Only JPG, PNG, WEBP images and MP4 videos allowed')
        return
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
    if (!form.price) { setError('Please add a price'); return }
    if (!form.city) { setError('Please add a city'); return }
    if (!form.contact_email) { setError('Please add a contact email'); return }
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) { window.location.href = '/login'; return }
      setUploadProgress('Saving listing...')
      const listing = await createListing({ ...form, price: parseInt(form.price) })
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

  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* Navbar */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'800px', margin:'0 auto', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'40px', height:'40px'}}>
              <img src="/logo.gif" alt="logo" style={{width:'40px', height:'40px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-1px', right:'-3px', background:'#ea580c', color:'#ffffff', fontSize:'10px', fontWeight:'900', width:'16px', height:'16px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ffffff'}}>L</span>
            </div>
            <Link href="/" style={{fontSize:'18px', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>EnjeraPressList.Com</Link>
          </div>
          <Link href="/" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back to listings</Link>
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

        {/* Property Details */}
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
                {['Apartment','House','Studio','Condo','Townhouse'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Monthly Rent (USD) *</label>
              <input style={inputStyle} type="number" placeholder="e.g. 1800" {...f('price')} />
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Bedrooms</label>
              <select style={inputStyle} {...f('bedrooms')}>
                {['Studio','1 bedroom','2 bedrooms','3 bedrooms','4+ bedrooms'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <select style={inputStyle} {...f('bathrooms')}>
                {['1 bathroom','1.5 bathrooms','2 bathrooms','3+ bathrooms'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle, minHeight:'100px', resize:'vertical'}} placeholder="Describe the property — highlights, nearby amenities, lease terms…" {...f('description')} />
          </div>
        </div>

        {/* Location */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 Location</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Street Address</label>
            <input style={inputStyle} placeholder="123 Maple Street, Apt 4B" {...f('address')} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>City *</label>
              <input style={inputStyle} placeholder="Washington" {...f('city')} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <select style={inputStyle} {...f('state')}>
                {['DC','VA','MD','NY','CA','TX','FL','IL','Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
            <div>
              <label style={labelStyle}>ZIP Code</label>
              <input style={inputStyle} placeholder="20001" {...f('zip')} />
            </div>
            <div>
              <label style={labelStyle}>Neighborhood</label>
              <input style={inputStyle} placeholder="Capitol Hill" {...f('neighborhood')} />
            </div>
          </div>
        </div>

        {/* Photos & Video */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📸 Photos & Video</div>
          <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'16px', fontWeight:'500', lineHeight:'1.6'}}>
            Upload up to <strong style={{color:'#111827'}}>4 photos</strong> and <strong style={{color:'#111827'}}>1 video (max 30 seconds)</strong>. Listings with photos get 3x more inquiries.
          </p>

          <div
            onClick={() => fileInputRef.current.click()}
            style={{
              border:'2px dashed #d1d5db', borderRadius:'12px',
              padding:'36px 24px', textAlign:'center', cursor:'pointer',
              background:'#f9fafb', marginBottom:'16px',
              transition:'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ea580c'; e.currentTarget.style.background='#fff7ed' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#d1d5db'; e.currentTarget.style.background='#f9fafb' }}
          >
            <div style={{fontSize:'40px', marginBottom:'10px'}}>📁</div>
            <p style={{fontSize:'15px', fontWeight:'700', color:'#374151', margin:'0 0 6px'}}>Click to upload photos or video</p>
            <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>JPG, PNG, WEBP · MP4 (max 30 sec) · Up to 4 photos + 1 video</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
              onChange={handleFileChange}
              style={{display:'none'}}
            />
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
                    <p style={{fontSize:'11px', color:'#6b7280', margin:'0', fontWeight:'600'}}>
                      {p.type === 'video' ? '🎥 Video' : `📷 Photo ${i+1}`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    style={{
                      position:'absolute', top:'6px', right:'6px',
                      background:'#ef4444', color:'#ffffff',
                      border:'none', borderRadius:'50%',
                      width:'24px', height:'24px', cursor:'pointer',
                      fontSize:'12px', fontWeight:'700',
                      display:'flex', alignItems:'center', justifyContent:'center'
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📞 Contact Information</div>
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
              <label style={labelStyle}>Contact Email *</label>
              <input style={inputStyle} type="email" placeholder="jane@example.com" {...f('contact_email')} />
            </div>
            <div>
              <label style={labelStyle}>Contact Phone</label>
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
          style={{
            width:'100%', padding:'16px', borderRadius:'12px',
            background: loading ? '#d1d5db' : '#ea580c',
            color:'#ffffff', fontSize:'16px', fontWeight:'800',
            border:'none', cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Publishing...' : '🚀 Publish Listing — Free'}
        </button>
      </div>
    </div>
  )
}

