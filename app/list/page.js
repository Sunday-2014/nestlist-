'use client'
import { useState, useRef, useEffect } from 'react'
import { createListing, getCurrentUser, uploadListingImage } from '@/lib/supabase'
import Link from 'next/link'

export default function ListProperty() {
  const [form, setForm] = useState({
    title:'', listing_category:'Property', property_type:'Apartment', listing_type:'Rent',
    price:'', currency:'USD', price_period:'Per Month',
    sale_price:'', down_payment:'', monthly_after_down:'',
    bedrooms:'1 bedroom', bathrooms:'1 bathroom', description:'',
    address:'', city:'', state:'', zip:'', neighborhood:'',
    vehicle_make:'', vehicle_model:'', vehicle_year:'', vehicle_mileage:'', vehicle_condition:'Good',
    job_type:'Full Time', job_employment_type:'Full Time', job_company:'', job_salary:'', job_experience:'Any', job_language:'Both',
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
    if (form.listing_category === 'Property') {
      if (form.listing_type === 'Rent' && !form.price && form.currency !== 'Contact') { setError('Please add a rental price'); return }
      if (form.listing_type === 'Sale' && !form.sale_price && form.currency !== 'Contact') { setError('Please add a sale price'); return }
    } else if (form.listing_category === 'Vehicle') {
      if (!form.sale_price && form.currency !== 'Contact') { setError('Please add a price'); return }
    }
    if (!form.contact_phone) { setError('Please add a contact phone number'); return }
    setLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) { window.location.href = '/login'; return }
      setUploadProgress('Saving listing...')
      const listing = await createListing({
        ...form,
        price: form.listing_category === 'Vehicle' && form.listing_type === 'Rent'
          ? parseInt(form.sale_price?.toString().replace(/,/g, '') || '0')
          : form.price ? parseInt(form.price.toString().replace(/,/g, '')) : 0,
        sale_price: form.listing_category === 'Vehicle' && form.listing_type === 'Sale'
          ? parseInt(form.sale_price?.toString().replace(/,/g, '') || '0')
          : form.sale_price ? parseInt(form.sale_price.toString().replace(/,/g, '')) : null,
        down_payment: form.down_payment ? parseInt(form.down_payment.toString().replace(/,/g, '')) : null,
        monthly_after_down: form.monthly_after_down ? parseInt(form.monthly_after_down.toString().replace(/,/g, '')) : null,
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

  const isProperty = form.listing_category === 'Property'
  const isVehicle = form.listing_category === 'Vehicle'
  const isJob = form.listing_category === 'Job'
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
          <h1 style={{fontSize:'28px', fontWeight:'800', color:'#111827', margin:'0 0 6px'}}>Create New Listing</h1>
          <p style={{fontSize:'15px', color:'#6b7280', margin:'0'}}>Fill in the details below. Your listing will be live immediately — 100% free.</p>
        </div>

        {error && (
          <div style={{background:'#fef2f2', border:'2px solid #fca5a5', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', color:'#dc2626', fontSize:'14px', fontWeight:'600'}}>
            ⚠️ {error}
          </div>
        )}

        {/* LISTING CATEGORY */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📋 What are you listing?</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
            <button onClick={() => setForm({...form, listing_category:'Property', listing_type:'Rent'})}
              style={{padding:'16px', borderRadius:'12px', border: isProperty ? '3px solid #ea580c' : '2px solid #e5e7eb', background: isProperty ? '#fff7ed' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
              <div style={{fontSize:'28px', marginBottom:'6px'}}>🏠</div>
              <p style={{fontSize:'14px', fontWeight:'700', color: isProperty ? '#ea580c' : '#374151', margin:'0 0 2px'}}>Property</p>
              <p style={{fontSize:'11px', color:'#6b7280', margin:'0'}}>House, Apartment, Land</p>
            </button>
            <button onClick={() => setForm({...form, listing_category:'Vehicle', listing_type:'Sale', currency:'USD'})}
              style={{padding:'16px', borderRadius:'12px', border: isVehicle ? '3px solid #7c3aed' : '2px solid #e5e7eb', background: isVehicle ? '#f5f3ff' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
              <div style={{fontSize:'28px', marginBottom:'6px'}}>🚗</div>
              <p style={{fontSize:'14px', fontWeight:'700', color: isVehicle ? '#7c3aed' : '#374151', margin:'0 0 2px'}}>Vehicle</p>
              <p style={{fontSize:'11px', color:'#6b7280', margin:'0'}}>Car, Motorcycle, Bicycle</p>
            </button>
            <button onClick={() => setForm({...form, listing_category:'Job', listing_type:'Sale', currency:'Contact'})}
              style={{padding:'16px', borderRadius:'12px', border: isJob ? '3px solid #1877F2' : '2px solid #e5e7eb', background: isJob ? '#eff6ff' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
              <div style={{fontSize:'28px', marginBottom:'6px'}}>💼</div>
              <p style={{fontSize:'14px', fontWeight:'700', color: isJob ? '#1877F2' : '#374151', margin:'0 0 2px'}}>Job</p>
              <p style={{fontSize:'11px', color:'#6b7280', margin:'0'}}>Full time, Part time, Contract</p>
            </button>
          </div>
        </div>

        {/* PROPERTY LISTING TYPE */}
        {isProperty && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>🏷️ Listing Type</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              <button onClick={() => setForm({...form, listing_type:'Rent'})}
                style={{padding:'16px', borderRadius:'12px', border: isRent ? '3px solid #ea580c' : '2px solid #e5e7eb', background: isRent ? '#fff7ed' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                <div style={{fontSize:'24px', marginBottom:'6px'}}>🏠</div>
                <p style={{fontSize:'15px', fontWeight:'700', color: isRent ? '#ea580c' : '#374151', margin:'0 0 2px'}}>For Rent</p>
                <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Monthly / Daily / Yearly</p>
              </button>
              <button onClick={() => setForm({...form, listing_type:'Sale'})}
                style={{padding:'16px', borderRadius:'12px', border: isSale ? '3px solid #166534' : '2px solid #e5e7eb', background: isSale ? '#f0fdf4' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                <div style={{fontSize:'24px', marginBottom:'6px'}}>🔑</div>
                <p style={{fontSize:'15px', fontWeight:'700', color: isSale ? '#166534' : '#374151', margin:'0 0 2px'}}>For Sale</p>
                <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Full sale / down payment</p>
              </button>
            </div>
          </div>
        )}

        {/* VEHICLE LISTING TYPE */}
        {isVehicle && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>🏷️ Vehicle Listing Type</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
              <button onClick={() => setForm({...form, listing_type:'Sale'})}
                style={{padding:'16px', borderRadius:'12px', border: isSale ? '3px solid #7c3aed' : '2px solid #e5e7eb', background: isSale ? '#f5f3ff' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                <div style={{fontSize:'24px', marginBottom:'6px'}}>🔑</div>
                <p style={{fontSize:'15px', fontWeight:'700', color: isSale ? '#7c3aed' : '#374151', margin:'0 0 2px'}}>For Sale</p>
                <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Selling my vehicle</p>
              </button>
              <button onClick={() => setForm({...form, listing_type:'Rent'})}
                style={{padding:'16px', borderRadius:'12px', border: isRent ? '3px solid #ea580c' : '2px solid #e5e7eb', background: isRent ? '#fff7ed' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                <div style={{fontSize:'24px', marginBottom:'6px'}}>🔄</div>
                <p style={{fontSize:'15px', fontWeight:'700', color: isRent ? '#ea580c' : '#374151', margin:'0 0 2px'}}>For Rent</p>
                <p style={{fontSize:'12px', color:'#6b7280', margin:'0'}}>Renting my vehicle</p>
              </button>
            </div>
          </div>
        )}

        {/* PROPERTY DETAILS */}
        {isProperty && (
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
        )}

        {/* VEHICLE DETAILS */}
        {isVehicle && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>🚗 Vehicle Details</div>
            <div style={{marginBottom:'14px'}}>
              <label style={labelStyle}>Listing Title *</label>
              <input style={inputStyle} placeholder="e.g. 2020 Toyota Corolla — Excellent Condition" {...f('title')} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Vehicle Type</label>
                <select style={inputStyle} {...f('property_type')}>
                  <option value="Car">🚗 Car</option>
                  <option value="Motorcycle">🏍️ Motorcycle</option>
                  <option value="Bicycle">🚲 Bicycle</option>
                  <option value="Truck">🚛 Truck</option>
                  <option value="Van">🚐 Van</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Condition</label>
                <select style={inputStyle} {...f('vehicle_condition')}>
                  {['Excellent','Very Good','Good','Fair','For Parts'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Make (Brand)</label>
                <input style={inputStyle} placeholder="e.g. Toyota, Honda, BMW" {...f('vehicle_make')} />
              </div>
              <div>
                <label style={labelStyle}>Model</label>
                <input style={inputStyle} placeholder="e.g. Corolla, Civic, X5" {...f('vehicle_model')} />
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Year</label>
                <input style={inputStyle} placeholder="e.g. 2020" {...f('vehicle_year')} />
              </div>
              <div>
                <label style={labelStyle}>Mileage / KM</label>
                <input style={inputStyle} placeholder="e.g. 45,000 km" {...f('vehicle_mileage')} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea style={{...inputStyle, minHeight:'100px', resize:'vertical'}} placeholder="Describe the vehicle — features, history, reason for selling or renting…" {...f('description')} />
            </div>
          </div>
        )}

        {/* JOB DETAILS */}
        {isJob && (
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>💼 Job Details</div>

            <div style={{marginBottom:'16px'}}>
              <label style={labelStyle}>I am / እኔ ነኝ</label>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                <button onClick={() => setForm({...form, job_employment_type:'Looking for Work'})}
                  style={{padding:'14px', borderRadius:'12px', border: form.job_employment_type === 'Looking for Work' ? '3px solid #1877F2' : '2px solid #e5e7eb', background: form.job_employment_type === 'Looking for Work' ? '#eff6ff' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                  <div style={{fontSize:'24px', marginBottom:'6px'}}>👤</div>
                  <p style={{fontSize:'14px', fontWeight:'700', color: form.job_employment_type === 'Looking for Work' ? '#1877F2' : '#374151', margin:'0 0 2px'}}>Looking for Work</p>
                  <p style={{fontSize:'11px', color:'#6b7280', margin:'0'}}>ስራ እፈልጋለሁ</p>
                </button>
                <button onClick={() => setForm({...form, job_employment_type:'Hiring'})}
                  style={{padding:'14px', borderRadius:'12px', border: form.job_employment_type === 'Hiring' ? '3px solid #166534' : '2px solid #e5e7eb', background: form.job_employment_type === 'Hiring' ? '#f0fdf4' : '#f9fafb', cursor:'pointer', textAlign:'center'}}>
                  <div style={{fontSize:'24px', marginBottom:'6px'}}>🏢</div>
                  <p style={{fontSize:'14px', fontWeight:'700', color: form.job_employment_type === 'Hiring' ? '#166534' : '#374151', margin:'0 0 2px'}}>Hiring / Employee Needed</p>
                  <p style={{fontSize:'11px', color:'#6b7280', margin:'0'}}>ሰራተኛ ያስፈልጋል</p>
                </button>
              </div>
            </div>

            <div style={{marginBottom:'16px'}}>
              <label style={labelStyle}>Post Language / የልጥፍ ቋንቋ</label>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                {[
                  {value:'English', label:'🇺🇸 English Only'},
                  {value:'Amharic', label:'🇪🇹 አማርኛ Only'},
                  {value:'Both', label:'🌍 Both / ሁለቱም'}
                ].map(l => (
                  <button key={l.value} onClick={() => setForm({...form, job_language:l.value})}
                    style={{padding:'8px 14px', borderRadius:'8px', border: form.job_language === l.value ? '2px solid #1877F2' : '2px solid #e5e7eb', background: form.job_language === l.value ? '#eff6ff' : '#f9fafb', color: form.job_language === l.value ? '#1877F2' : '#374151', fontWeight:'700', fontSize:'12px', cursor:'pointer'}}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:'14px'}}>
              <label style={labelStyle}>Job Title * / የስራ ርዕስ</label>
              <input style={inputStyle} placeholder="e.g. House Cleaner / የቤት ሰራተኛ ያስፈልጋል" {...f('title')} />
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Job Type / የስራ አይነት</label>
                <select style={inputStyle} {...f('job_type')}>
                  <option value="Full Time">Full Time / ሙሉ ጊዜ</option>
                  <option value="Part Time">Part Time / ግማሽ ጊዜ</option>
                  <option value="Contract">Contract / ኮንትራት</option>
                  <option value="Day Job">Day Job / የቀን ስራ</option>
                  <option value="Household Assistant">Household Assistant / የቤት ሰራተኛ</option>
                  <option value="Home Care">Home Care / የቤት እንክብካቤ</option>
                  <option value="Nanny">Nanny / አያሪ</option>
                  <option value="Driver">Driver / ሹፌር</option>
                  <option value="Security">Security / ጠባቂ</option>
                  <option value="Other">Other / ሌላ</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Experience / ልምድ</label>
                <select style={inputStyle} {...f('job_experience')}>
                  <option value="Any">Any / ማንኛውም</option>
                  <option value="No Experience">No Experience / ልምድ አያስፈልግም</option>
                  <option value="1+ Years">1+ Years / 1+ አመት</option>
                  <option value="2+ Years">2+ Years / 2+ አመት</option>
                  <option value="5+ Years">5+ Years / 5+ አመት</option>
                </select>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
              <div>
                <label style={labelStyle}>Company / ድርጅት (optional)</label>
                <input style={inputStyle} placeholder="e.g. Family Home / ቤተሰብ" {...f('job_company')} />
              </div>
              <div>
                <label style={labelStyle}>Salary / ደሞዝ (optional)</label>
                <input style={inputStyle} placeholder="e.g. $500/mo or 15,000 ETB" {...f('job_salary')} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Job Description * / የስራ ዝርዝር</label>
              <textarea style={{...inputStyle, minHeight:'120px', resize:'vertical'}}
                placeholder="Describe the job — duties, requirements, schedule, benefits...&#10;&#10;የስራ ዝርዝር ያስገቡ — ተግባራት፣ መስፈርቶች፣ የስራ ሰዓት…" {...f('description')} />
            </div>
          </div>
        )}

        {/* PRICING */}
        {!isJob && (
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

            {/* PROPERTY RENT PRICING */}
            {isProperty && isRent && !isContact && (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
                <div>
                  <label style={labelStyle}>Rental Price *</label>
                  <input style={inputStyle} type="text" inputMode="numeric"
                    placeholder={form.currency === 'ETB' ? 'e.g. 15,000' : 'e.g. 1,800'}
                    value={formatNumber(form.price)}
                    onChange={e => handlePriceChange('price', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Price Period</label>
                  <select style={inputStyle} {...f('price_period')}>
                    {['Per Month','Per Day','Per Year','Per Week'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* PROPERTY SALE PRICING */}
            {isProperty && isSale && !isContact && (
              <div>
                <div style={{marginBottom:'14px'}}>
                  <label style={labelStyle}>Total Sale Price *</label>
                  <input style={inputStyle} type="text" inputMode="numeric"
                    placeholder={form.currency === 'ETB' ? 'e.g. 5,000,000' : 'e.g. 250,000'}
                    value={formatNumber(form.sale_price)}
                    onChange={e => handlePriceChange('sale_price', e.target.value)} />
                </div>
                <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'14px', marginBottom:'14px'}}>
                  <p style={{fontSize:'13px', fontWeight:'700', color:'#166534', margin:'0 0 10px'}}>💳 Down Payment Options (optional)</p>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
                    <div>
                      <label style={{...labelStyle, color:'#166534'}}>Down Payment</label>
                      <input style={inputStyle} type="text" inputMode="numeric"
                        placeholder={form.currency === 'ETB' ? 'e.g. 500,000' : 'e.g. 50,000'}
                        value={formatNumber(form.down_payment)}
                        onChange={e => handlePriceChange('down_payment', e.target.value)} />
                    </div>
                    <div>
                      <label style={{...labelStyle, color:'#166534'}}>Monthly After Down</label>
                      <input style={inputStyle} type="text" inputMode="numeric"
                        placeholder={form.currency === 'ETB' ? 'e.g. 20,000' : 'e.g. 1,500'}
                        value={formatNumber(form.monthly_after_down)}
                        onChange={e => handlePriceChange('monthly_after_down', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VEHICLE SALE PRICING */}
            {isVehicle && isSale && !isContact && (
              <div style={{marginBottom:'14px'}}>
                <label style={labelStyle}>Vehicle Sale Price *</label>
                <input style={inputStyle} type="text" inputMode="numeric"
                  placeholder={form.currency === 'ETB' ? 'e.g. 1,200,000' : 'e.g. 25,000'}
                  value={formatNumber(form.sale_price)}
                  onChange={e => handlePriceChange('sale_price', e.target.value)} />
              </div>
            )}

            {/* VEHICLE RENT PRICING */}
            {isVehicle && isRent && !isContact && (
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
                <div>
                  <label style={labelStyle}>Rental Price *</label>
                  <input style={inputStyle} type="text" inputMode="numeric"
                    placeholder={form.currency === 'ETB' ? 'e.g. 2,000' : 'e.g. 80'}
                    value={formatNumber(form.price)}
                    onChange={e => handlePriceChange('price', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Rental Period</label>
                  <select style={inputStyle} {...f('price_period')}>
                    {['Per Day','Per Week','Per Month'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            )}

            {isContact && (
              <div style={{background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px', padding:'14px'}}>
                <p style={{fontSize:'13px', color:'#92400e', margin:'0', fontWeight:'600'}}>📞 Price will be hidden — buyers will contact you directly.</p>
              </div>
            )}
          </div>
        )}

        {/* LOCATION */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📍 Location {isJob ? '/ አካባቢ' : ''}</div>
          <div style={{marginBottom:'14px'}}>
            <label style={labelStyle}>Street Address {isJob ? '(optional)' : ''}</label>
            <input style={inputStyle} placeholder={isJob ? 'e.g. Bole Area / ቦሌ አካባቢ' : 'e.g. Bole Road, House No. 123'} {...f('address')} />
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>City * {isJob ? '/ ከተማ' : ''}</label>
              <input style={inputStyle} placeholder="e.g. Addis Ababa or Washington DC"
                list="city-suggestions" {...f('city')} />
              <datalist id="city-suggestions">
                <option value="Addis Ababa" /><option value="Dire Dawa" /><option value="Bahir Dar" />
                <option value="Gondar" /><option value="Mekelle" /><option value="Hawassa" />
                <option value="Jimma" /><option value="Adama" /><option value="Bishoftu" />
                <option value="Washington DC" /><option value="New York, NY" /><option value="Los Angeles, CA" />
                <option value="Dallas, TX" /><option value="Minneapolis, MN" /><option value="Atlanta, GA" />
                <option value="Seattle, WA" /><option value="Houston, TX" /><option value="Chicago, IL" />
              </datalist>
            </div>
            <div>
              <label style={labelStyle}>State / Region {isJob ? '/ ክልል' : ''}</label>
              <input style={inputStyle} placeholder="e.g. Amhara, Oromia, DC, VA" {...f('state')} />
            </div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px'}}>
            <div>
              <label style={labelStyle}>ZIP / Postal Code</label>
              <input style={inputStyle} placeholder="20001" {...f('zip')} />
            </div>
            <div>
              <label style={labelStyle}>Neighborhood {isJob ? '/ ሰፈር' : '/ Subcity'}</label>
              <input style={inputStyle} placeholder={isJob ? 'e.g. Bole / ቦሌ' : 'e.g. Bole, Capitol Hill'}
                list="neighborhood-suggestions" {...f('neighborhood')} />
              <datalist id="neighborhood-suggestions">
                <option value="Bole" /><option value="CMC" /><option value="Megenagna" />
                <option value="Sarbet" /><option value="Summit" /><option value="Ayat" />
                <option value="Kazanchis" /><option value="Piassa" /><option value="Gerji" />
              </datalist>
            </div>
          </div>
        </div>

        {/* PHOTOS */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>📸 {isJob ? 'Photos (optional) / ፎቶ' : 'Photos & Video'}</div>
          <p style={{fontSize:'13px', color:'#6b7280', marginBottom:'16px', lineHeight:'1.6'}}>
            {isJob ? 'Add a company logo or job-related photo (optional)' : 'Upload up to 4 photos and 1 video. Listings with photos get 3x more inquiries.'}
          </p>
          <div onClick={() => fileInputRef.current.click()}
            style={{border:'2px dashed #d1d5db', borderRadius:'12px', padding:'36px 24px', textAlign:'center', cursor:'pointer', background:'#f9fafb', marginBottom:'16px'}}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ea580c'; e.currentTarget.style.background='#fff7ed' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#d1d5db'; e.currentTarget.style.background='#f9fafb' }}>
            <div style={{fontSize:'40px', marginBottom:'10px'}}>📁</div>
            <p style={{fontSize:'15px', fontWeight:'700', color:'#374151', margin:'0 0 6px'}}>Click to upload photos</p>
            <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>JPG, PNG, WEBP · MP4 (max 30 sec)</p>
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
          <div style={sectionTitleStyle}>📞 Contact {isJob ? '/ አድራሻ' : 'Information'}</div>
          <div style={{background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'12px 14px', marginBottom:'16px'}}>
            <p style={{fontSize:'13px', color:'#166534', margin:'0', fontWeight:'600'}}>🔒 Your registered email is automatically used as your contact email.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px'}}>
            <div>
              <label style={labelStyle}>Your Name * {isJob ? '/ ስምዎ' : ''}</label>
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
          {!isJob && (
            <div>
              <label style={labelStyle}>Available From</label>
              <input style={{...inputStyle, width:'auto'}} type="date" {...f('available_from')} />
            </div>
          )}
        </div>

        {uploadProgress && (
          <div style={{background:'#fff7ed', border:'2px solid #fed7aa', borderRadius:'12px', padding:'14px 18px', marginBottom:'16px', color:'#92400e', fontSize:'14px', fontWeight:'600', textAlign:'center'}}>
            ⏳ {uploadProgress}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{width:'100%', padding:'16px', borderRadius:'12px', background: loading ? '#d1d5db' : '#ea580c', color:'#ffffff', fontSize:'16px', fontWeight:'800', border:'none', cursor: loading ? 'not-allowed' : 'pointer'}}>
          {loading ? '⏳ Publishing...' : '🚀 Publish Listing — Free'}
        </button>
      </div>
    </div>
  )
}
