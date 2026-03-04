import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', fontFamily:'Inter, system-ui, sans-serif' }}>
      <div style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.04em', color:'#ffffff' }}>AVAIL</div>
      <h1 style={{ fontSize:'18px', fontWeight:600, color:'#e8e8e8' }}>Page not found</h1>
      <p style={{ fontSize:'14px', color:'#888888' }}>The page you are looking for does not exist.</p>
      <Link href="/dashboard" style={{ fontSize:'14px', color:'#3b82f6', textDecoration:'none' }}>&#x2190; Back to Dashboard</Link>
    </div>
  )
}
