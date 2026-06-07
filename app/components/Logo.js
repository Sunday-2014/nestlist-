import Link from 'next/link'

export default function Logo({ size = 44, dark = false }) {
  return (
    <Link href="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'10px'}}>
      <div style={{position:'relative', width:`${size}px`, height:`${size}px`, flexShrink:0}}>
        <img
          src="/logo.gif"
          alt="EnjeraPressList logo"
          style={{
            width:`${size}px`,
            height:`${size}px`,
            borderRadius:'50%',
            display:'block',
            border:'2px solid #d97706'
          }}
        />
        <span style={{
          position:'absolute',
          bottom:'-12px',
          right:'-18px',
          background:'#ea580c',
          color:'#ffffff',
          fontSize:'16px',
          fontWeight:'700',
          padding:'3px 9px',
          borderRadius:'8px',
          border:`2px solid ${dark ? '#1f2937' : '#ffffff'}`,
          whiteSpace:'nowrap',
          fontFamily:"'Dancing Script', cursive",
          boxShadow:'0 1px 4px rgba(0,0,0,0.25)'
        }}>List</span>
      </div>
      <div style={{marginLeft:'8px'}}>
        <span style={{
          fontSize:'clamp(14px, 3.5vw, 22px)',
          fontWeight:'800',
          background:'linear-gradient(90deg, #ea580c, #f97316, #fb923c, #ea580c)',
          backgroundSize:'200% auto',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          animation:'shine 3s linear infinite',
          display:'block',
          letterSpacing:'-0.5px'
        }}>EnjeraPressList.Com</span>
        <span style={{
          fontSize:'10px',
          color: dark ? '#9ca3af' : '#6b7280',
          fontWeight:'500'
        }}>Free Rental Listings</span>
      </div>
    </Link>
  )
}
