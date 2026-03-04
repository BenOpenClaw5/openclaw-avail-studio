'use client'
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px', fontFamily:'Inter, system-ui, sans-serif' }}>
      <div style={{ fontSize:'24px', fontWeight:700, letterSpacing:'-0.04em', color:'#ffffff' }}>AVAIL</div>
      <h1 style={{ fontSize:'18px', fontWeight:600, color:'#e8e8e8' }}>Something went wrong</h1>
      <p style={{ fontSize:'14px', color:'#888888' }}>An unexpected error occurred.</p>
      <button onClick={reset} style={{ padding:'8px 20px', background:'#2563eb', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontFamily:'inherit' }}>Reload page</button>
    </div>
  )
}
