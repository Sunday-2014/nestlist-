'use client'
import Link from 'next/link'

export default function Privacy() {
  return (
    <div style={{minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui, -apple-system, sans-serif'}}>

      {/* NAVBAR */}
      <nav style={{background:'#ffffff', borderBottom:'2px solid #ea580c', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:100}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
            <div style={{position:'relative', width:'44px', height:'44px', flexShrink:0}}>
              <img src="/logo.gif" alt="logo" style={{width:'44px', height:'44px', borderRadius:'50%', border:'2px solid #d97706'}} />
              <span style={{position:'absolute', bottom:'-8px', right:'-12px', background:'#ea580c', color:'#ffffff', fontSize:'14px', fontWeight:'700', padding:'2px 7px', borderRadius:'6px', border:'2px solid #ffffff', whiteSpace:'nowrap', fontFamily:"'Dancing Script', cursive"}}>List</span>
            </div>
            <Link href="/" style={{fontSize:'clamp(14px, 4vw, 20px)', fontWeight:'800', textDecoration:'none', background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginLeft:'8px'}}>EnjeraPressList.Com</Link>
          </div>
          <Link href="/" style={{fontSize:'14px', fontWeight:'600', color:'#6b7280', textDecoration:'none'}}>← Back</Link>
        </div>
        <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
          <div style={{height:'6px', background:'#078930'}}></div>
          <div style={{height:'6px', background:'#FCDD09'}}></div>
          <div style={{height:'6px', background:'#DA121A'}}></div>
        </div>
      </nav>

      <div style={{maxWidth:'800px', margin:'0 auto', padding:'40px 16px 64px', boxSizing:'border-box'}}>

        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={{width:'64px', height:'64px', background:'#f0fdf4', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px', border:'2px solid #bbf7d0'}}>🔒</div>
          <h1 style={{fontSize:'clamp(24px, 5vw, 36px)', fontWeight:'800', color:'#111827', margin:'0 0 8px'}}>Privacy Policy</h1>
          <p style={{fontSize:'14px', color:'#6b7280', margin:'0'}}>Last updated: June 7, 2026</p>
        </div>

        {[
          {
            title: '1. Information We Collect',
            content: 'We collect information you provide when creating an account, including your name, email address, and phone number. We also collect information you provide when creating a listing, including property details, photos, and contact information. We automatically collect certain technical information such as your IP address, browser type, and pages visited.'
          },
          {
            title: '2. How We Use Your Information',
            content: 'We use your information to provide and improve our services, to communicate with you about your account and listings, to send important updates about the platform, and to ensure the safety and security of our users. We do not sell your personal information to third parties.'
          },
          {
            title: '3. Information Sharing',
            content: 'Your contact information (email and phone) is only revealed to other users when they click the "Reveal Contact Info" button on your listing. This is intentional — it allows renters to contact you directly. Your email address is verified through our authentication system and cannot be altered by other users.'
          },
          {
            title: '4. Data Security',
            content: 'We use Supabase, a secure cloud database provider, to store your data. All data is encrypted in transit using SSL/TLS. We implement row-level security policies to ensure users can only access their own data. Passwords are never stored in plain text.'
          },
          {
            title: '5. Cookies',
            content: 'We use browser local storage to save your language preference (English or Amharic) and authentication session. We do not use tracking cookies or third-party advertising cookies. You can clear your browser storage at any time.'
          },
          {
            title: '6. Photos and Videos',
            content: 'Photos and videos you upload are stored securely on Supabase Storage and are publicly accessible via a unique URL. When you delete a listing, we also delete the associated photos and videos from our storage.'
          },
          {
            title: '7. Your Rights',
            content: 'You have the right to access, update, or delete your personal information at any time through your Account Settings page. You can delete your listings from your Dashboard. To request complete account deletion, please contact us at info@enjerapresslist.com.'
          },
          {
            title: "8. Children's Privacy",
            content: 'EnjeraPressList.Com is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.'
          },
          {
            title: '9. Changes to This Policy',
            content: 'We may update this Privacy Policy from time to time. We will notify users of significant changes by posting a notice on the Site. Your continued use of the Site after changes are posted constitutes your acceptance of the updated policy.'
          },
          {
            title: '10. Contact Us',
            content: 'If you have any questions about this Privacy Policy or how we handle your data, please contact us at info@enjerapresslist.com. We take privacy seriously and will respond to all inquiries within 48 hours.'
          },
        ].map((section, i) => (
          <div key={i} style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize:'16px', fontWeight:'700', color:'#166534', margin:'0 0 10px'}}>{section.title}</h2>
            <p style={{fontSize:'14px', color:'#4b5563', lineHeight:'1.8', margin:'0'}}>{section.content}</p>
          </div>
        ))}

        <div style={{textAlign:'center', marginTop:'32px', padding:'20px', background:'#f0fdf4', borderRadius:'16px', border:'1px solid #bbf7d0'}}>
          <p style={{fontSize:'14px', color:'#166534', margin:'0 0 12px', fontWeight:'600'}}>Questions about your privacy?</p>
          <Link href="/contact" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'10px 24px', borderRadius:'10px', background:'#166534', textDecoration:'none', display:'inline-block'}}>Contact Us</Link>
        </div>
      </div>

      <footer style={{background:'#1f2937', borderTop:'3px solid #ea580c', padding:'24px 16px', textAlign:'center'}}>
        <div style={{display:'flex', justifyContent:'center', gap:'4px', marginBottom:'10px'}}>
          <div style={{height:'4px', width:'50px', background:'#078930', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#FCDD09', borderRadius:'2px'}}></div>
          <div style={{height:'4px', width:'50px', background:'#DA121A', borderRadius:'2px'}}></div>
        </div>
        <p style={{fontSize:'12px', color:'#9ca3af', margin:'0'}}>© 2026 EnjeraPressList.Com · <Link href="/terms" style={{color:'#9ca3af', textDecoration:'none'}}>Terms</Link> · <Link href="/privacy" style={{color:'#9ca3af', textDecoration:'none'}}>Privacy</Link></p>
      </footer>

    </div>
  )
}
