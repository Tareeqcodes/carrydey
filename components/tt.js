// 'use client';

// import {
//   Users,  ArrowRight,
//    CheckCircle, 
// } from 'lucide-react';
// import Main from '@/components/Main';
// import Footer from '@/components/Footer';

// const C = {
//   maroon: '#3A0A21', orange: '#FF6B35', cream: '#FFF5EC',
//   cream2: '#FFF9F5', dark: '#0e0608', dark2: '#140a0d',
//   dark3: '#1c0e12', muted: '#9E8A82', white: '#ffffff',
//   green: '#10B981', blue: '#60A5FA',
// };

// export default function Page() {
//   return (
//     <div style={{ minHeight: '100vh', background: C.dark, fontFamily: "'DM Sans', sans-serif" }}>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,900;1,9..144,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

//         .f { font-family: 'Fraunces', serif; }

//         @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
//         .ticker { animation: tick 30s linear infinite; display:flex; width:max-content; }

//         @keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//         .up{opacity:0;animation:up .6s ease forwards}
//         .d1{animation-delay:.08s}.d2{animation-delay:.18s}.d3{animation-delay:.28s}.d4{animation-delay:.38s}

//         .lift{transition:transform .25s,box-shadow .25s}
//         .lift:hover{transform:translateY(-5px);box-shadow:0 20px 40px rgba(0,0,0,.3)}

//         .pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,107,53,.1);
//           border:1px solid rgba(255,107,53,.22);color:#FF6B35;border-radius:100px;
//           padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase}

//         .acc{position:relative;overflow:hidden;transition:border-color .25s}
//         .acc .bar{position:absolute;top:0;left:0;right:0;height:3px;transform:scaleX(0);transform-origin:left;transition:transform .35s}
//         .acc:hover{border-color:rgba(255,107,53,.4)!important}
//         .acc:hover .bar{transform:scaleX(1)}

//         .step-num{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;
//           justify-content:center;border:2px solid #FF6B35;color:#FF6B35;
//           font-family:'Fraunces',serif;font-size:20px;font-weight:700;flex-shrink:0}

//         .qmark{font-family:'Fraunces',serif;font-size:72px;line-height:1;color:#FF6B35;
//           opacity:.18;position:absolute;top:12px;left:20px;pointer-events:none}

//         @media(max-width:768px){
//           .how-g{grid-template-columns:1fr!important}
//           .aud-g{grid-template-columns:1fr!important}
//           .st-g{grid-template-columns:1fr 1fr!important}
//           .diff-g{grid-template-columns:1fr!important}
//           .pf-g{grid-template-columns:1fr!important}
//         }
//       `}</style>

//       {/* ══ 1. HERO ══════════════════════════════════════════ */}
//       <div style={{ background: C.cream2, borderRadius:28, margin:'12px 12px 0', overflow:'hidden' }}>
//         <div style={{
//           display:'flex', alignItems:'center', justifyContent:'space-between',
//           padding:'16px 28px', borderBottom:'1px solid rgba(58,10,33,.08)'
//         }}>
//           <span className="f" style={{ fontSize:21, fontWeight:700, color:C.maroon, letterSpacing:'-.02em' }}>
//             Carrydey
//           </span>
//           <div style={{ display:'flex', gap:8 }}>
//             {[{l:'Send',href:'/send'},{l:'Earn',href:'/courier',accent:true},{l:'Login',href:'/login'}].map(({l,href,accent})=>(
//               <a key={l} href={href} style={{
//                 fontSize:13,fontWeight:600,padding:'6px 16px',borderRadius:100,
//                 background:accent?C.orange:'rgba(58,10,33,.07)',
//                 color:accent?C.white:C.maroon,textDecoration:'none'
//               }}>{l}</a>
//             ))}
//           </div>
//         </div>
//         <Main />
//       </div>

//       {/* ══ 2. TICKER ════════════════════════════════════════ */}
//       <div style={{ background:C.maroon, margin:'8px 12px', borderRadius:12, overflow:'hidden', padding:'10px 0' }}>
//         <div className="ticker">
//           {['120+ Active Riders','Same-Day Delivery','You Set the Price','Verified Couriers',
//             'Real-Time Tracking','Agency Dashboards','Lagos · Kano · Abuja','Free to Join','Book in 2 Minutes',
//             '120+ Active Riders','Same-Day Delivery','You Set the Price','Verified Couriers',
//             'Real-Time Tracking','Agency Dashboards','Lagos · Kano · Abuja','Free to Join','Book in 2 Minutes',
//           ].map((t,i)=>(
//             <span key={i} style={{
//               whiteSpace:'nowrap',color:'#fff',fontSize:13,fontWeight:500,
//               padding:'0 32px',letterSpacing:'.04em',display:'flex',alignItems:'center',gap:10
//             }}>
//               <span style={{width:5,height:5,background:C.orange,borderRadius:'50%',flexShrink:0,display:'inline-block'}}/>
//               {t}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* ══ 3. WHAT IS CARRYDEY ══════════════════════════════ */}
//       <section style={{ margin:'8px 12px' }}>
//         <div style={{ background:C.dark2, border:'1px solid rgba(255,255,255,.05)', borderRadius:24, padding:'56px 40px 48px' }}>
//           <div className="pill up">⚡ What We Do</div>
//           <h2 className="f up d1" style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:700, color:C.white, letterSpacing:'-.025em', lineHeight:1.1, margin:'20px 0 16px', maxWidth:640 }}>
//             Nigeria's logistics platform —{' '}
//             <em style={{ color:C.orange, fontStyle:'italic' }}>not just another courier app</em>
//           </h2>
//           <p className="up d2" style={{ fontSize:16, color:C.muted, lineHeight:1.75, maxWidth:580, marginBottom:48 }}>
//             Carrydey is a three-sided marketplace connecting senders, independent couriers,
//             and logistics agencies. You propose the price. The courier accepts or counters.
//             No middlemen. No surprises.
//           </p>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.04)', borderRadius:16, overflow:'hidden' }} className="diff-g">
//             {[
//               { icon:'💬', title:'You Agree the Price', body:'Propose a fare. Your courier accepts or counters. No fixed rates imposed on anyone.' },
//               { icon:'🏢', title:'Agencies Get a Dashboard', body:'Logistics agencies manage their entire fleet — assign riders, track all deliveries, view history.' },
//               { icon:'🔓', title:'Open Marketplace', body:'Any verified courier or agency can join. Not a closed fleet. Better availability, better prices.' },
//             ].map(({icon,title,body},i)=>(
//               <div key={i} className={`up d${i+2}`} style={{ background:C.dark3, padding:'36px 28px' }}>
//                 <div style={{ fontSize:32, marginBottom:16 }}>{icon}</div>
//                 <h3 style={{ fontSize:15, fontWeight:700, color:C.white, marginBottom:10 }}>{title}</h3>
//                 <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{body}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ══ 5. THREE AUDIENCES ═══════════════════════════════ */}
//       <section style={{ margin:'8px 12px' }}>
//         <div style={{ background:C.dark2, border:'1px solid rgba(255,255,255,.05)', borderRadius:24, padding:'56px 40px' }}>
//           <div className="pill up"><Users size={11}/> Built for Everyone</div>
//           <h2 className="f up d1" style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700, color:C.white, letterSpacing:'-.02em', margin:'20px 0 40px', lineHeight:1.15 }}>
//             One platform. Three sides.
//           </h2>
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }} className="aud-g">
//             {[
//               { emoji:'📦', role:'Senders & Vendors', color:C.orange,
//                 points:['Book in under 2 minutes','Propose your own fare','Pick courier or agency','Live GPS tracking','Customer gets tracking link'],
//                 cta:'Send a package', href:'/send' },
//               { emoji:'🏍️', role:'Independent Couriers', color:C.green,
//                 points:['Jobs delivered to your phone','See fare before you accept','Work any hours you choose','No sign-up fee ever','Consistent income'],
//                 cta:'Start earning', href:'/courier' },
//               { emoji:'🏢', role:'Logistics Agencies', color:C.blue,
//                 points:['Full agency dashboard','Assign jobs to your riders','Track all deliveries at once','Manage fleet performance','Replace WhatsApp chaos'],
//                 cta:'Join as agency', href:'/courier' },
//             ].map(({emoji,role,color,points,cta,href},i)=>(
//               <div key={i} className={`acc lift up d${i+1}`} style={{ background:C.dark3, border:'1px solid rgba(255,255,255,.06)', borderRadius:20, padding:'32px 28px' }}>
//                 <div className="bar" style={{ background:color }}/>
//                 <div style={{ width:52,height:52,borderRadius:14,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:20 }}>{emoji}</div>
//                 <h3 style={{ fontSize:17, fontWeight:700, color:C.white, marginBottom:18 }}>{role}</h3>
//                 <ul style={{ listStyle:'none',padding:0,margin:'0 0 28px',display:'flex',flexDirection:'column',gap:10 }}>
//                   {points.map((p,j)=>(
//                     <li key={j} style={{ display:'flex',alignItems:'flex-start',gap:10,fontSize:13,color:C.muted,lineHeight:1.5 }}>
//                       <CheckCircle size={14} style={{ color,flexShrink:0,marginTop:2 }}/>{p}
//                     </li>
//                   ))}
//                 </ul>
//                 <a href={href} style={{ display:'inline-flex',alignItems:'center',gap:6,fontSize:13,fontWeight:700,color,textDecoration:'none' }}>
//                   {cta} <ArrowRight size={14}/>
//                 </a>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>



//       {/* ══ 8. COMPARISON TABLE ══════════════════════════════ */}
//       <section style={{ margin:'8px 12px' }}>
//         <div style={{ background:C.cream2, borderRadius:24, padding:'56px 40px' }}>
//           <div style={{ textAlign:'center', marginBottom:48 }}>
//             <div className="pill up" style={{ background:'rgba(58,10,33,.08)',borderColor:'rgba(58,10,33,.15)',color:C.maroon }}>Different Category</div>
//             <h2 className="f up d1" style={{ fontSize:'clamp(24px,3.5vw,38px)',fontWeight:700,color:C.maroon,letterSpacing:'-.02em',margin:'20px 0 12px' }}>
//               Not just another delivery app
//             </h2>
//             <p className="up d2" style={{ fontSize:15,color:'#6B4955',maxWidth:460,margin:'0 auto' }}>
//               Every other Nigerian logistics app locks you into their prices and their fleet. Carrydey doesn't.
//             </p>
//           </div>
//           <div style={{ maxWidth:700,margin:'0 auto',borderRadius:16,overflow:'hidden',border:'1px solid rgba(58,10,33,.1)' }}>
//             <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:C.maroon }}>
//               {['Feature','Others','Carrydey'].map((h,i)=>(
//                 <div key={i} style={{ padding:'14px 20px',fontSize:12,fontWeight:700,color:i===2?C.orange:'rgba(255,255,255,.65)',textTransform:'uppercase',letterSpacing:'.06em',borderRight:i<2?'1px solid rgba(255,255,255,.1)':'none' }}>{h}</div>
//               ))}
//             </div>
//             {[
//               ['Fare negotiation','✗  Fixed price only','✓  You propose it'],
//               ['Agency dashboard','✗  Not available','✓  Full fleet management'],
//               ['Open marketplace','✗  Closed fleet','✓  Any verified courier'],
//               ['Courier + Agency','✗  One type only','✓  Both fully supported'],
//               ['Sign-up fee','✗  Sometimes charged','✓  Always free'],
//             ].map(([feat,other,us],i)=>(
//               <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',background:i%2===0?'#fff':C.cream2,borderTop:'1px solid rgba(58,10,33,.07)' }}>
//                 <div style={{ padding:'14px 20px',fontSize:13,fontWeight:600,color:C.maroon,borderRight:'1px solid rgba(58,10,33,.07)' }}>{feat}</div>
//                 <div style={{ padding:'14px 20px',fontSize:13,color:'#b45353',borderRight:'1px solid rgba(58,10,33,.07)' }}>{other}</div>
//                 <div style={{ padding:'14px 20px',fontSize:13,color:'#16a34a',fontWeight:600 }}>{us}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

     

//       {/* ══ FOOTER ═══════════════════════════════════════════ */}
//       <div style={{ margin:'8px 12px 12px' }}>
//         <Footer />
//       </div>

//     </div>
//   );
// }