import React, { useState, useEffect, useRef } from 'react'
import { Star, MapPin, Clock, Phone, Instagram, Calendar, Wifi, CreditCard, Scissors, ChevronDown, Menu, X, Award, Users, Heart } from 'lucide-react'
import logoImage from './assets/IMG_7057.jpg'
import jeffersonImage from './assets/jefferson.jpg'
import './App.css'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Reveal({ children, delay = 0, dir = 'up', className = '', style = {} }) {
  const [ref, inView] = useInView()
  const transforms = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)' }
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : transforms[dir],
      transition: `opacity 0.8s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${delay}s`
    }}>
      {children}
    </div>
  )
}

function ParticleField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${p.o})`
        ctx.fill()
      })
      particles.forEach((a, i) => particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(201,168,76,${0.08 * (1 - d / 120)})`
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }))
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }} />
}

function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView(0.5)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setTimeout(() => setHeroReady(true), 200)
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const ids = ['home','sobre','servicos','agenda','depoimentos','contato']
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 130) { setActiveSection(id); break }
      }
    }
    const onMouse = (e) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMouse)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse) }
  }, [])

  const scrollTo = (id) => { setMobileOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  const services = [
    { num: '01', name: 'Corte Clássico', desc: 'Tesoura ou máquina com acabamento impecável. Inclui lavagem e finalização profissional.', price: 'R$ 45', time: '30min', icon: '✂' },
    { num: '02', name: 'Barba Completa', desc: 'Modelagem artesanal, toalha quente e finalização com óleo premium para total cuidado.', price: 'R$ 40', time: '30min', icon: '🪒' },
    { num: '03', name: 'Corte + Barba', desc: 'O combo perfeito com desconto especial. Transformação completa em uma única visita.', price: 'R$ 75', time: '1h', icon: '⭐' },
    { num: '04', name: 'Corte + Sobrancelha', desc: 'Corte preciso combinado com design de sobrancelha masculina para visual definido.', price: 'R$ 55', time: '30min', icon: '💎' },
    { num: '05', name: 'Corte + Hidratação', desc: 'Estilo e tratamento capilar com produtos premium para cabelos saudáveis e brilhantes.', price: 'R$ 60', time: '45min', icon: '✨' },
    { num: '06', name: 'Pacote Completo', desc: 'Cabelo + Barba + Sobrancelha. A experiência Trend Blade completa e exclusiva.', price: 'R$ 80', time: '1h30', icon: '👑' },
  ]

  const schedule = [
    { day: 'Dom', closed: true },
    { day: 'Seg', closed: true },
    { day: 'Ter', hours: '09h', end: '19h', closed: false },
    { day: 'Qua', hours: '09h', end: '19h', closed: false },
    { day: 'Qui', hours: '09h', end: '19h', closed: false },
    { day: 'Sex', hours: '09h', end: '19h', closed: false },
    { day: 'Sáb', hours: '08h', end: '17h', closed: false },
  ]

  const testimonials = [
    { name: 'Carlos Silva', rating: 5, text: 'Atendimento impecável! O melhor corte que já fiz em Guarulhos. Me sinto renovado a cada visita.', initial: 'C', time: 'há 2 dias' },
    { name: 'Roberto Santos', rating: 5, text: 'Ambiente aconchegante, profissional extremamente dedicado. Já indiquei para toda a minha família!', initial: 'R', time: 'há 1 semana' },
    { name: 'André Costa', rating: 5, text: 'Caprichoso e atencioso em cada detalhe. Sempre saio satisfeito e com o visual perfeito.', initial: 'A', time: 'há 2 semanas' },
  ]

  const navLinks = [
    { id: 'home', label: 'Início' }, { id: 'sobre', label: 'Sobre' },
    { id: 'servicos', label: 'Serviços' }, { id: 'agenda', label: 'Agenda' },
    { id: 'depoimentos', label: 'Avaliações' }, { id: 'contato', label: 'Contato' },
  ]

  return (
    <div style={{ fontFamily:"'Barlow',sans-serif", background:'#0A0A0A', color:'#F5F0E8', overflowX:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        :root{--gold:#C9A84C;--gold-l:#E8C96A;--gold-d:#8B6914;--dark:#0A0A0A;--dark2:#0F0F0F;--mid:#181818;--mid2:#202020;--muted:#9A9080;--light:#F5F0E8;--red:#c0392b}
        .oswald{font-family:'Oswald',sans-serif} .bc{font-family:'Barlow Condensed',sans-serif}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#0A0A0A} ::-webkit-scrollbar-thumb{background:var(--gold-d);border-radius:2px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:1000;transition:all 0.4s}
        .nav.scrolled{background:rgba(10,10,10,0.97);backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,168,76,0.12);box-shadow:0 4px 30px rgba(0,0,0,0.4)}
        .nav-inner{max-width:1280px;margin:0 auto;padding:0 2.5rem;height:72px;display:flex;align-items:center;justify-content:space-between}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;cursor:pointer}
        .nav-logo img{height:38px;width:auto;transition:transform 0.3s} .nav-logo:hover img{transform:rotate(-5deg) scale(1.05)}
        .logo-text{font-family:'Oswald',sans-serif;font-weight:700;font-size:1.3rem;letter-spacing:0.1em;color:var(--gold)} .logo-text span{color:var(--light)}
        .nav-links{display:flex;align-items:center;gap:2rem;list-style:none}
        .nl{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--muted);background:none;border:none;cursor:pointer;transition:color 0.2s;padding:0;position:relative}
        .nl::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transition:transform 0.3s;transform-origin:left}
        .nl:hover,.nl.active{color:var(--gold)} .nl:hover::after,.nl.active::after{transform:scaleX(1)}
        .nav-cta{background:var(--gold)!important;color:var(--dark)!important;padding:0.55rem 1.5rem;border-radius:2px;font-weight:700!important;transition:all 0.2s!important}
        .nav-cta:hover{background:var(--gold-l)!important;transform:translateY(-2px);box-shadow:0 8px 25px rgba(201,168,76,0.3)!important} .nav-cta::after{display:none!important}
        .hamburger{display:none;background:none;border:1px solid rgba(201,168,76,0.3);border-radius:2px;cursor:pointer;color:var(--light);padding:6px 8px;transition:all 0.2s}
        .hamburger:hover{border-color:var(--gold);color:var(--gold)}
        .mmenu{position:fixed;inset:0;background:rgba(10,10,10,0.99);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;opacity:0;pointer-events:none;transition:opacity 0.3s}
        .mmenu.open{opacity:1;pointer-events:all}
        .mmenu-link{font-family:'Oswald',sans-serif;font-size:2.5rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--light);background:none;border:none;cursor:pointer;transition:color 0.2s} .mmenu-link:hover{color:var(--gold)}
        .mmenu-close{position:absolute;top:1.5rem;right:2rem;background:none;border:none;cursor:pointer;color:var(--muted);transition:color 0.2s} .mmenu-close:hover{color:var(--gold)}
        .btn-g{display:inline-flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.18em;text-transform:uppercase;background:var(--gold);color:var(--dark);padding:0.7rem 1.8rem;border:none;border-radius:2px;cursor:pointer;transition:all 0.3s}
        .btn-g:hover{background:var(--gold-l);transform:translateY(-3px);box-shadow:0 12px 35px rgba(201,168,76,0.35)}
        .btn-o{display:inline-flex;align-items:center;gap:0.5rem;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.18em;text-transform:uppercase;background:transparent;color:var(--gold);padding:0.7rem 1.8rem;border:1px solid var(--gold);border-radius:2px;cursor:pointer;transition:all 0.3s}
        .btn-o:hover{background:var(--gold);color:var(--dark);transform:translateY(-3px);box-shadow:0 12px 35px rgba(201,168,76,0.25)}
        .hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:120px 2.5rem 4rem}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(201,168,76,0.08) 0%, transparent 50%);pointer-events:none;z-index:2}
        .hero-inner{max-width:1280px;width:100%;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;position:relative;z-index:3}
        .hero-content{display:flex;flex-direction:column;gap:1.5rem}
        .hero-badge{display:inline-flex;align-items:center;gap:0.75rem;font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,168,76,0.3);padding:0.6rem 1.2rem;border-radius:20px;width:fit-content;background:rgba(201,168,76,0.05)}
        .hero-title{font-family:'Oswald',sans-serif;font-size:3.5rem;font-weight:700;line-height:1.1;letter-spacing:-0.02em;color:var(--light)}
        .hero-title .gold{color:var(--gold)}
        .hero-desc{font-size:1.05rem;line-height:1.7;color:var(--muted);max-width:450px}
        .hero-rating{display:flex;align-items:center;gap:0.8rem;font-size:0.95rem;color:var(--muted)}
        .hero-rating .stars{display:flex;gap:0.3rem;color:var(--gold)}
        .hero-cta{display:flex;gap:1rem;flex-wrap:wrap}
        .hero-image{position:relative;display:flex;align-items:center;justify-content:center;height:550px}
        .jefferson-frame{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
        .jefferson-circle{position:relative;width:320px;height:420px;border-radius:50% 50% 45% 45%;overflow:hidden;background:linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%);border:2px solid rgba(201,168,76,0.3);box-shadow:0 0 60px rgba(201,168,76,0.2), inset 0 0 40px rgba(201,168,76,0.1);animation:float 6s ease-in-out infinite}
        .jefferson-circle img{width:100%;height:100%;object-fit:cover;object-position:center}
        .jefferson-glow{position:absolute;inset:-20px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 30% 30%, rgba(201,168,76,0.15) 0%, transparent 70%);filter:blur(30px);animation:pulse-glow 4s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)}}
        @keyframes pulse-glow{0%,100%{opacity:0.5} 50%{opacity:1}}
        .marquee-section{background:linear-gradient(90deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 50%, rgba(201,168,76,0.1) 100%);border-top:1px solid rgba(201,168,76,0.2);border-bottom:1px solid rgba(201,168,76,0.2);padding:1.2rem 0;overflow:hidden;margin:3rem 0}
        .marquee-content{display:flex;gap:3rem;animation:scroll-marquee 20s linear infinite;white-space:nowrap}
        .marquee-item{font-family:'Oswald',sans-serif;font-size:1.2rem;font-weight:600;letter-spacing:0.1em;color:var(--gold);text-transform:uppercase}
        @keyframes scroll-marquee{0%{transform:translateX(0)} 100%{transform:translateX(-50%)}}
        .section{position:relative;padding:5rem 2.5rem;max-width:1280px;margin:0 auto}
        .section-title{font-family:'Oswald',sans-serif;font-size:2.8rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:3rem;color:var(--light)}
        .section-title .gold{color:var(--gold)}
        .services-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem}
        .service-card{background:linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%);border:1px solid rgba(201,168,76,0.2);padding:2rem;border-radius:4px;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);cursor:pointer;position:relative;overflow:hidden}
        .service-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg, rgba(201,168,76,0.1) 0%, transparent 100%);opacity:0;transition:opacity 0.4s}
        .service-card:hover{border-color:var(--gold);background:linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%);transform:translateY(-8px);box-shadow:0 20px 50px rgba(201,168,76,0.15)}
        .service-card:hover::before{opacity:1}
        .service-num{font-family:'Oswald',sans-serif;font-size:3rem;font-weight:700;color:var(--gold);opacity:0.3;margin-bottom:1rem}
        .service-icon{font-size:2.5rem;margin-bottom:1rem}
        .service-name{font-family:'Oswald',sans-serif;font-size:1.3rem;font-weight:600;margin-bottom:0.8rem;color:var(--light)}
        .service-desc{font-size:0.95rem;line-height:1.6;color:var(--muted);margin-bottom:1.5rem}
        .service-meta{display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;border-top:1px solid rgba(201,168,76,0.1)}
        .service-price{font-family:'Oswald',sans-serif;font-weight:700;color:var(--gold);font-size:1.2rem}
        .service-time{font-size:0.85rem;color:var(--muted)}
        .testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:2rem}
        .testimonial-card{background:linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%);border:1px solid rgba(201,168,76,0.2);padding:2rem;border-radius:4px;transition:all 0.4s}
        .testimonial-card:hover{border-color:var(--gold);background:linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%);transform:translateY(-8px)}
        .testimonial-header{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}
        .testimonial-avatar{width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg, var(--gold), var(--gold-d));display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--dark);font-size:1.2rem}
        .testimonial-info h4{font-family:'Oswald',sans-serif;font-weight:600;color:var(--light);margin-bottom:0.2rem}
        .testimonial-info .time{font-size:0.8rem;color:var(--muted)}
        .testimonial-rating{display:flex;gap:0.2rem;color:var(--gold);margin-bottom:1rem}
        .testimonial-text{font-size:0.95rem;line-height:1.7;color:var(--muted);font-style:italic}
        .contact-box{background:linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%);border:1px solid rgba(201,168,76,0.2);padding:2.5rem;border-radius:4px;margin-bottom:2rem}
        .contact-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:2rem}
        .citem{display:flex;gap:1.5rem}
        .cicon{width:50px;height:50px;border-radius:4px;background:rgba(201,168,76,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .clabel{font-family:'Oswald',sans-serif;font-size:1rem;font-weight:600;color:var(--light);margin-bottom:0.8rem;text-transform:uppercase;letter-spacing:0.05em}
        .cval{font-size:0.95rem;color:var(--muted);line-height:1.6}
        .sched-tbl{width:100%;border-collapse:collapse;font-size:0.9rem}
        .sched-tbl td{padding:0.6rem 0;border-bottom:1px solid rgba(201,168,76,0.1)}
        .sched-tbl td:first-child{color:var(--light);font-weight:500}
        .sched-tbl td:last-child{text-align:right;color:var(--muted)}
        .closed-row td:last-child{color:rgba(192,57,43,0.7);font-weight:600}
        .cbox{background:linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%);border:1px solid rgba(201,168,76,0.2);padding:2rem;border-radius:4px}
        .footer{background:var(--dark2);border-top:1px solid rgba(201,168,76,0.1);padding:3rem 2.5rem 1.5rem;margin-top:4rem}
        .footer-main{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:3rem;margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid rgba(201,168,76,0.1)}
        .footer-col-t{font-family:'Oswald',sans-serif;font-size:0.95rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
        .footer-txt{font-size:0.9rem;line-height:1.8;color:var(--muted)}
        .footer-bottom{max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;color:var(--muted)}
        .fbadge{background:var(--gold);color:var(--dark);padding:0.3rem 0.8rem;border-radius:2px;font-weight:700;font-size:0.75rem;letter-spacing:0.1em}
        @media(max-width:768px){
          .nav-inner{padding:0 1.5rem;height:60px}
          .nav-links{display:none}
          .hamburger{display:block}
          .hero{padding:100px 1.5rem 2rem;min-height:auto}
          .hero-inner{grid-template-columns:1fr;gap:2rem;padding-top:1rem}
          .hero-title{font-size:2.2rem}
          .hero-image{height:380px;margin-top:1rem}
          .jefferson-circle{width:260px;height:340px}
          .section{padding:3rem 1.5rem}
          .section-title{font-size:2rem;margin-bottom:2rem}
          .services-grid{grid-template-columns:1fr}
          .testimonials-grid{grid-template-columns:1fr}
          .contact-grid{grid-template-columns:1fr}
          .footer-main{grid-template-columns:1fr;gap:2rem}
          .footer-bottom{flex-direction:column;gap:1rem;text-align:center}
          .mmenu-link{font-size:1.8rem}
        }
        @media(max-width:480px){
          .hero-title{font-size:1.8rem}
          .hero-desc{font-size:0.95rem}
          .section-title{font-size:1.6rem}
          .hero-image{height:320px}
          .jefferson-circle{width:220px;height:290px}
          .service-card,.testimonial-card,.contact-box,.cbox{padding:1.5rem}
          .nav-inner{padding:0 1rem}
        }
      `}</style>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            <img src={logoImage} alt="Trend Blade" />
            <div className="logo-text">TREND <span>BLADE</span></div>
          </a>
          <ul className="nav-links">
            {navLinks.map(link => (
              <li key={link.id}>
                <button className={`nl ${activeSection === link.id ? 'active' : ''}`} onClick={() => scrollTo(link.id)}>
                  {link.label}
                </button>
              </li>
            ))}
            <li><button className="nl nav-cta" onClick={() => scrollTo('agenda')}>Agendar</button></li>
          </ul>
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div className={`mmenu ${mobileOpen ? 'open' : ''}`}>
        <button className="mmenu-close" onClick={() => setMobileOpen(false)}><X size={32} /></button>
        {navLinks.map(link => (
          <button key={link.id} className="mmenu-link" onClick={() => scrollTo(link.id)}>
            {link.label}
          </button>
        ))}
        <button className="mmenu-link" style={{color:'var(--gold)'}} onClick={() => scrollTo('agenda')}>Agendar</button>
      </div>

      <section id="home" className="hero">
        <ParticleField />
        <div className="hero-inner">
          <Reveal delay={0.1} dir="left" className="hero-content">
            <div className="hero-badge">🏆 Barbearia Premium • Guarulhos, SP</div>
            <h1 className="hero-title">Estilo & <span className="gold">Precisão</span> Redefinidos</h1>
            <p className="hero-desc">Mais que um corte — uma experiência premium. Transformamos seu visual com técnica, estilo e o melhor atendimento de Guarulhos.</p>
            <div className="hero-rating">
              <div className="stars">★★★★★</div>
              <span>5.0 (145 avaliações)</span>
            </div>
            <div className="hero-cta">
              <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g">
                <Calendar size={16} /> Agendar Agora
              </a>
              <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o">
                <Phone size={16} /> WhatsApp
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.2} dir="right" className="hero-image">
            <div className="jefferson-frame">
              <div className="jefferson-glow"></div>
              <div className="jefferson-circle">
                <img src={jeffersonImage} alt="Jefferson - Master Barber" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="marquee-section">
        <div className="marquee-content" style={{animation:'scroll-marquee 25s linear infinite'}}>
          <span className="marquee-item">✦ Profissionalismo</span>
          <span className="marquee-item">✦ Qualidade Premium</span>
          <span className="marquee-item">✦ Atendimento Familiar</span>
          <span className="marquee-item">✦ Técnicas Modernas</span>
          <span className="marquee-item">✦ Ambiente Aconchegante</span>
          <span className="marquee-item">✦ Profissionalismo</span>
          <span className="marquee-item">✦ Qualidade Premium</span>
          <span className="marquee-item">✦ Atendimento Familiar</span>
        </div>
      </div>

      <section id="sobre" className="section" style={{background:'linear-gradient(180deg, rgba(201,168,76,0.03) 0%, transparent 100%)'}}>
        <Reveal delay={0.1}>
          <h2 className="section-title">Sobre a <span className="gold">Trend Blade</span></h2>
        </Reveal>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'2rem'}}>
          <Reveal delay={0.15}>
            <div className="contact-box">
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🎯</div>
              <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,marginBottom:'1rem',color:'var(--gold)'}}>Nossa Missão</div>
              <p style={{fontSize:'0.95rem',lineHeight:1.7,color:'var(--muted)'}}>Transformar o visual e a autoconfiança de cada cliente através de técnicas precisas, produtos premium e atendimento personalizado.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="contact-box">
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>⭐</div>
              <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,marginBottom:'1rem',color:'var(--gold)'}}>Nossa Visão</div>
              <p style={{fontSize:'0.95rem',lineHeight:1.7,color:'var(--muted)'}}>Ser a barbearia referência em Guarulhos, conhecida pela excelência, inovação e compromisso com a satisfação total do cliente.</p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="contact-box">
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>💎</div>
              <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,marginBottom:'1rem',color:'var(--gold)'}}>Nossos Valores</div>
              <p style={{fontSize:'0.95rem',lineHeight:1.7,color:'var(--muted)'}}>Profissionalismo, qualidade, respeito e dedicação. Cada detalhe importa para proporcionar a melhor experiência.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="servicos" className="section">
        <Reveal delay={0.1}>
          <h2 className="section-title">Nossos <span className="gold">Serviços</span></h2>
        </Reveal>
        <div className="services-grid">
          {services.map((svc, i) => (
            <Reveal key={svc.num} delay={0.1 + i * 0.05}>
              <div className="service-card">
                <div className="service-num">{svc.num}</div>
                <div className="service-icon">{svc.icon}</div>
                <h3 className="service-name">{svc.name}</h3>
                <p className="service-desc">{svc.desc}</p>
                <div className="service-meta">
                  <span className="service-price">{svc.price}</span>
                  <span className="service-time">⏱ {svc.time}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="depoimentos" className="section" style={{background:'linear-gradient(180deg, rgba(201,168,76,0.03) 0%, transparent 100%)'}}>
        <Reveal delay={0.1}>
          <h2 className="section-title">O que Nossos <span className="gold">Clientes</span> Dizem</h2>
        </Reveal>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.1 + i * 0.1}>
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div className="testimonial-info">
                    <h4>{t.name}</h4>
                    <div className="time">{t.time}</div>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="agenda" className="section">
        <Reveal delay={0.1}>
          <h2 className="section-title">Agende Seu <span className="gold">Horário</span></h2>
        </Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'2rem'}}>
          <Reveal delay={0.15}>
            <div className="cbox">
              <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#C9A84C',marginBottom:'1.5rem'}}>Localização</div>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'1rem'}}>
                  <MapPin size={20} style={{color:'var(--gold)',marginTop:'0.2rem',flexShrink:0}} />
                  <div>
                    <div style={{fontWeight:600,color:'var(--light)',marginBottom:'0.3rem'}}>Av Papa Pio XII, nº 218</div>
                    <div style={{fontSize:'0.9rem',color:'var(--muted)'}}>Guarulhos, SP</div>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <Phone size={20} style={{color:'var(--gold)'}} />
                  <a href="tel:+5511951231443" style={{color:'var(--gold)',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={(e)=>e.target.style.color='var(--gold-l)'} onMouseLeave={(e)=>e.target.style.color='var(--gold)'}>
                    (11) 95123-1443
                  </a>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <Instagram size={20} style={{color:'var(--gold)'}} />
                  <a href="https://instagram.com/trendbladebarbearia" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={(e)=>e.target.style.color='var(--gold-l)'} onMouseLeave={(e)=>e.target.style.color='var(--gold)'}>
                    @trendbladebarbearia
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="cbox">
              <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#C9A84C',marginBottom:'1.5rem'}}>Horários de Funcionamento</div>
              <table className="sched-tbl">
                <tbody>
                  <tr className="closed-row"><td>Domingo</td><td>Fechado</td></tr>
                  <tr className="closed-row"><td>Segunda</td><td>Fechado</td></tr>
                  <tr><td>Terça a Sexta</td><td>09h às 19h</td></tr>
                  <tr><td>Sábado</td><td>08h às 17h</td></tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25} style={{marginTop:'2rem'}}>
          <div className="cbox">
            <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#C9A84C',marginBottom:'1.5rem'}}>Reserve Seu Espaço</div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.8rem'}}>
              <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g" style={{justifyContent:'center'}}>
                <Calendar size={16} /> Agendar pelo Booksy
              </a>
              <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o" style={{justifyContent:'center'}}>
                <Phone size={16} /> Enviar Mensagem no WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contato" className="section" style={{background:'linear-gradient(180deg, rgba(201,168,76,0.03) 0%, transparent 100%)'}}>
        <Reveal delay={0.1}>
          <h2 className="section-title">Por Que Nos <span className="gold">Escolher</span></h2>
        </Reveal>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'2rem'}}>
          {[
            { icon: '👨‍💼', title: 'Profissionais Especializados', desc: 'Equipe dedicada com anos de experiência em técnicas modernas e tradicionais.' },
            { icon: '🏡', title: 'Ambiente Aconchegante', desc: 'Espaço familiar e relaxante, perfeito para sua transformação.' },
            { icon: '✨', title: 'Qualidade Premium', desc: 'Produtos de alta qualidade e acabamento impecável em cada serviço.' },
            { icon: '💬', title: 'Atendimento Personalizado', desc: 'Escutamos suas necessidades e criamos o visual perfeito para você.' },
            { icon: '📍', title: 'Localização Privilegiada', desc: 'Centro de Guarulhos, fácil acesso e estacionamento disponível.' },
            { icon: '⭐', title: 'Avaliações 5 Estrelas', desc: 'Mais de 145 clientes satisfeitos e recomendando nossos serviços.' },
          ].map((item, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <div className="contact-box" style={{textAlign:'center'}}>
                <div style={{fontSize:'3rem',marginBottom:'1rem'}}>{item.icon}</div>
                <div style={{fontFamily:'Oswald',fontSize:'1.05rem',fontWeight:600,marginBottom:'0.8rem',color:'var(--light)'}}>{item.title}</div>
                <p style={{fontSize:'0.9rem',lineHeight:1.6,color:'var(--muted)'}}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}>
              <img src={logoImage} alt="Trend Blade" style={{height:36,width:'auto'}} />
              <span style={{fontFamily:'Oswald',fontWeight:700,fontSize:'1.2rem',letterSpacing:'0.1em',color:'#C9A84C'}}>TREND <span style={{color:'#F5F0E8'}}>BLADE</span></span>
            </div>
            <p className="footer-txt">Barbearia premium em Guarulhos com foco em estilo, precisão e atendimento familiar diferenciado.</p>
          </div>
          <div>
            <div className="footer-col-t">Contato</div>
            <div className="footer-txt">
              (11) 95123-1443<br/>
              @trendbladebarbearia<br/>
              Av Papa Pio XII, nº 218<br/>
              Guarulhos, SP
            </div>
          </div>
          <div>
            <div className="footer-col-t">Horários</div>
            <div className="footer-txt">
              <span style={{color:'rgba(192,57,43,0.7)'}}>Dom & Seg — Fechado</span><br/>
              Ter a Sex — 09h às 19h<br/>
              Sáb — 08h às 17h
            </div>
          </div>
        </div>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="footer-bottom">
            <span>© 2025 Trend Blade Barbearia. Estilo, precisão e sofisticação em Guarulhos.</span>
            <div className="fbadge">Homologação</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
