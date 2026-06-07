'use client'
import Link from 'next/link'

export default function Terms() {
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
          <div style={{width:'64px', height:'64px', background:'#fff7ed', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px', border:'2px solid #fed7aa'}}>📋</div>
          <h1 style={{fontSize:'clamp(24px, 5vw, 36px)', fontWeight:'800', color:'#111827', margin:'0 0 8px'}}>Terms of Service</h1>
          <p style={{fontSize:'14px', color:'#6b7280', margin:'0'}}>Last updated: June 7, 2026</p>
        </div>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By accessing or using EnjeraPressList.Com ("the Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Site. We reserve the right to update these terms at any time without prior notice.'
          },
          {
            title: '2. Description of Service',
            content: 'EnjeraPressList.Com is a free online platform that allows users to list and browse rental properties and real estate for sale in Ethiopia and the United States. We do not act as a real estate agent, broker, or landlord. We simply provide a platform for property owners and renters to connect directly.'
          },
          {
            title: '3. User Accounts',
            content: 'To list a property, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and truthful information when registering. We reserve the right to suspend or terminate accounts that violate these terms.'
          },
          {
            title: '4. Listing Rules',
            content: 'All listings must be for real, legitimate properties. You must be the property owner or authorized representative to list a property. Listings must include accurate information about the property, location, and price. We reserve the right to remove any listing that is fraudulent, misleading, or violates these terms.'
          },
          {
            title: '5. Free Listings',
            content: 'Basic listings on EnjeraPressList.Com are completely free. We offer optional paid featured listings that place your property at the top of search results for a set period. Featured listing fees are non-refundable once activated.'
          },
          {
            title: '6. Prohibited Content',
            content: 'You may not post listings that are fraudulent, misleading, or illegal. You may not use the Site to harass, threaten, or deceive other users. You may not post offensive, discriminatory, or inappropriate content. Strictly prohibited: any solicitation or promotion of sexual services, illegal drugs, weapons, firearms, or any other illegal activity. Listings found to contain such content will be immediately removed and the account permanently banned. We reserve the right to report such activity to the appropriate authorities.'
          },
          {
            title: '7. No Agency Relationship',
            content: 'EnjeraPressList.Com is not a real estate agency. We do not verify the accuracy of listings, the identity of users, or the condition of properties. Users interact with each other directly and at their own risk. We strongly encourage users to verify all information before making any rental or purchase decisions.'
          },
          {
            title: '8. Limitation of Liability',
            content: 'EnjeraPressList.Com is provided "as is" without any warranties. We are not liable for any damages arising from the use of the Site, including but not limited to rental disputes, property damage, fraud, or financial loss. Users are solely responsible for their interactions with other users.'
          },
          {
            title: '9. Privacy',
            content: 'Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy to understand our practices.'
          },
          {
            title: '10. Contact',
            content: 'If you have any questions about these Terms of Service, please contact us at info@enjerapresslist.com.'
          },
        ].map((section, i) => (
          <div key={i} style={{background:'#ffffff', borderRadius:'16px', padding:'24px', border:'1px solid #e5e7eb', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize:'16px', fontWeight:'700', color:'#ea580c', margin:'0 0 10px'}}>{section.title}</h2>
            <p style={{fontSize:'14px', color:'#4b5563', lineHeight:'1.8', margin:'0'}}>{section.content}</p>
          </div>
        ))}

        <div style={{textAlign:'center', marginTop:'32px', padding:'20px', background:'#fff7ed', borderRadius:'16px', border:'1px solid #fed7aa'}}>
          <p style={{fontSize:'14px', color:'#92400e', margin:'0 0 12px', fontWeight:'600'}}>Have questions about our terms?</p>
          <Link href="/contact" style={{fontSize:'14px', fontWeight:'700', color:'#ffffff', padding:'10px 24px', borderRadius:'10px', background:'#ea580c', textDecoration:'none', display:'inline-block'}}>Contact Us</Link>
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
