'use client'
import Link from 'next/link'

export default function Contact() {
  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'44px', height:'44px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'44px', height:'44px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-2px', right:'-4px', background:'#ea580c', color:'#ffffff', fontSize:'11px', fontWeight:'900', width:'20px', height:'20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ffffff'}}>L</span>
            </div>
            <div>
              <Link href="/" style={{fontSize:'clamp(15px, 4vw, 22px)', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shine 3s linear infinite', display:'block'}}>EnjeraPressList.Com</Link>
              <span style={{fontSize:'10px', color:'#6b7280', fontWeight:'500'}}>Free Rental Listings</span>
            </div>
          </div>
          <Link href="/" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back to listings</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'700px', margin:'0 auto', padding:'40px 16px 64px', boxSizing:'border-box'}}>

        {/* HEADER */}
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={{width:'72px', height:'72px', background:'linear-gradient(135deg, #fff7ed, #ffedd5)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'32px', border:'2px solid #fed7aa'}}>📬</div>
          <h1 style={{fontSize:'clamp(24px, 5vw, 36px)', fontWeight:'800', color:'#111827', margin:'0 0 8px'}}>Contact Us</h1>
          <p style={{fontSize:'15px', color:'#6b7280', margin:'0', lineHeight:'1.6'}}>We're here to help! Reach out to us using any of the methods below.</p>
        </div>

        {/* CONTACT CARDS */}
        <div style={{display:'flex', flexDirection:'column', gap:'16px', marginBottom:'32px'}}>

          {/* EMAIL */}
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
            <div style={{width:'56px', height:'56px', background:'#fff7ed', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0, border:'2px solid #fed7aa'}}>📧</div>
            <div style={{flex:1}}>
              <p style={{fontSize:'12px', fontWeight:'700', color:'#6b7280', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em'}}>Email us</p>
              <a href="mailto:Temesgen.getie@enjerapress.com" style={{fontSize:'18px', fontWeight:'700', color:'#ea580c', textDecoration:'none', display:'block', marginBottom:'4px'}}>Temesgen.getie@enjerapress.com</a>
              <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>We reply within 24 hours</p>
            </div>
            <a href="mailto:Temesgen.getie@enjerapress.com" style={{padding:'10px 20px', background:'#ea580c', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', whiteSpace:'nowrap'}}>Send Email</a>
          </div>

          {/* PHONE */}
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
            <div style={{width:'56px', height:'56px', background:'#f0fdf4', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0, border:'2px solid #bbf7d0'}}>📞</div>
            <div style={{flex:1}}>
              <p style={{fontSize:'12px', fontWeight:'700', color:'#6b7280', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em'}}>Call us</p>
              <a href="tel:+12025550100" style={{fontSize:'18px', fontWeight:'700', color:'#166534', textDecoration:'none', display:'block', marginBottom:'4px'}}>(202)670-1224
</a>
              <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>Mon - Fri, 9am - 6pm EST</p>
            </div>
            <a href="tel:+12025550100" style={{padding:'10px 20px', background:'#166534', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', whiteSpace:'nowrap'}}>Call Now</a>
          </div>

          {/* WHATSAPP */}
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
            <div style={{width:'56px', height:'56px', background:'#f0fdf4', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0, border:'2px solid #bbf7d0'}}>📱</div>
            <div style={{flex:1}}>
              <p style={{fontSize:'12px', fontWeight:'700', color:'#6b7280', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em'}}>WhatsApp</p>
              <a href="https://wa.me/12025550100" target="_blank" rel="noopener noreferrer" style={{fontSize:'18px', fontWeight:'700', color:'#25D366', textDecoration:'none', display:'block', marginBottom:'4px'}}>(202)670-1224
</a>
              <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>Message us anytime</p>
            </div>
            <a href="https://wa.me/12025550100" target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px', background:'#25D366', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', whiteSpace:'nowrap'}}>WhatsApp</a>
          </div>

          {/* LOCATION */}
          <div style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
            <div style={{width:'56px', height:'56px', background:'#eff6ff', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0, border:'2px solid #bfdbfe'}}>📍</div>
            <div style={{flex:1}}>
              <p style={{fontSize:'12px', fontWeight:'700', color:'#6b7280', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em'}}>Location</p>
              <p style={{fontSize:'18px', fontWeight:'700', color:'#1d4ed8', margin:'0 0 4px'}}>Washington, DC</p>
              <p style={{fontSize:'13px', color:'#9ca3af', margin:'0'}}>Serving the greater DC metro area</p>
            </div>
          </div>

        </div>

        {/* SOCIAL LINKS */}
        <div style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', textAlign:'center'}}>
          <p style={{fontSize:'13px', fontWeight:'700', color:'#374151', margin:'0 0 16px', textTransform:'uppercase', letterSpacing:'0.06em'}}>Follow us on social media</p>
          <div style={{display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap'}}>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px', background:'#1877F2', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px'}}>👍 Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px', background:'#000000', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px'}}>𝕏 Twitter (X)</a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" style={{padding:'10px 20px', background:'#0088cc', color:'#ffffff', borderRadius:'10px', textDecoration:'none', fontSize:'13px', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px'}}>✈️ Telegram</a>
          </div>
        </div>

        {/* FAQ */}
        <div style={{marginTop:'32px'}}>
          <h2 style={{fontSize:'20px', fontWeight:'800', color:'#111827', margin:'0 0 16px'}}>Frequently Asked Questions</h2>
          <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {[
              { q:'Is listing a property free?', a:'Yes! Listing your property on EnjeraPressList.Com is 100% free. No hidden fees, no commissions.' },
              { q:'How do I list my property?', a:'Simply register an account, click "+ Add Listing" and fill in your property details. Your listing goes live immediately.' },
              { q:'How do renters contact me?', a:'Renters can reveal your contact information directly on your listing page and reach out to you by email or phone.' },
              { q:'Can I upload photos and videos?', a:'Yes! You can upload up to 4 photos and 1 video (max 30 seconds) for each listing.' },
              { q:'How do I edit or delete my listing?', a:'Sign in to your account, go to My Dashboard, and click the Edit or Delete button on your listing.' },
            ].map((item, i) => (
              <div key={i} style={{background:'#ffffff', borderRadius:'12px', padding:'16px 20px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                <p style={{fontSize:'14px', fontWeight:'700', color:'#111827', margin:'0 0 6px'}}>❓ {item.q}</p>
                <p style={{fontSize:'13px', color:'#6b7280', margin:'0', lineHeight:'1.6'}}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginBottom:'8px'}}>
          <div style={{position:'relative', width:'32px', height:'32px'}}>
            <img src="/logo.gif" alt="logo" style={{width:'32px', height:'32px', borderRadius:'50%', border:'2px solid #d97706'}} />
            <span style={{position:'absolute', bottom:'-1px', right:'-3px', background:'#ea580c', color:'#ffffff', fontSize:'8px', fontWeight:'900', width:'13px', height:'13px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #1f2937'}}>L</span>
          </div>
          <p style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', margin:'0'}}>EnjeraPressList.Com</p>
        </div>
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

