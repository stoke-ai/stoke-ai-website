import GoffAdminLoginForm from '@/components/GoffAdminLoginForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign in — Goff Recruiting',
  description: 'Goff Welding internal recruiting platform.',
  robots: { index: false, follow: false },
};

export default function GoffRecruitingLoginPage() {
  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',fontFamily:'Lato,system-ui,-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <div style={{position:'fixed',inset:0,pointerEvents:'none',opacity:0.45,background:'radial-gradient(circle at 30% 20%, rgba(192,24,43,0.32), transparent 38%)'}} />
      <section style={{position:'relative',zIndex:1,width:'100%',maxWidth:'440px',background:'#121212',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',padding:'40px 36px',boxShadow:'0 24px 60px rgba(0,0,0,0.45)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'28px'}}>
          <div style={{width:'54px',height:'54px',borderRadius:'3px',background:'#c0182b',display:'grid',placeItems:'center',color:'#fff',fontFamily:'"Playfair Display",serif',fontWeight:800,fontSize:'18px',boxShadow:'0 2px 6px rgba(192,24,43,0.3)'}}>GW</div>
          <div>
            <strong style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',display:'block'}}>Goff Recruiting</strong>
            <span style={{color:'#b8b8b8',fontSize:'11px',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase'}}>Admin sign-in</span>
          </div>
        </div>
        <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'28px',lineHeight:1.1,margin:'0 0 8px',fontWeight:800}}>Sign in to continue.</h1>
        <p style={{color:'#aaa',fontSize:'14px',lineHeight:1.55,margin:'0 0 24px'}}>This area is for Austin and the Goff hiring team. Public applicants do not need to sign in — they apply at <a href="https://goff.stoke-ai.com" style={{color:'#ff7a8c',textDecoration:'underline'}}>goff.stoke-ai.com</a>.</p>
        <GoffAdminLoginForm />
      </section>
    </main>
  );
}
