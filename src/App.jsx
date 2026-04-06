import React, { useState, useEffect, useRef } from 'react'
import { Star, MapPin, Clock, Phone, Instagram, Calendar, Wifi, CreditCard, Scissors, ChevronDown, Menu, X, Award, Users, Heart, Wind } from 'lucide-react'
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
    { num: '01', name: 'Corte', desc: 'Corte com tesoura ou máquina com acabamento impecável. Inclui lavagem e finalização profissional.', price: 'R$ 45', time: '30min', icon: '✂' },
    { num: '02', name: 'Barba', desc: 'Modelagem artesanal, toalha quente e finalização com óleo premium para total cuidado.', price: 'R$ 40', time: '30min', icon: '🪒' },
    { num: '03', name: 'Corte + Barba', desc: 'O combo perfeito com desconto especial. Transformação completa em uma única visita.', price: 'R$ 75', time: '1h', icon: '⭐' },
    { num: '04', name: 'Corte + Sobrancelha', desc: 'Corte preciso combinado com design de sobrancelha masculina para visual definido.', price: 'R$ 55', time: '30min', icon: '💎' },
    { num: '05', name: 'Corte + Hidratação', desc: 'Estilo e tratamento capilar com produtos premium para cabelos saudáveis e brilhantes.', price: 'R$ 60', time: '30min', icon: '✨' },
    { num: '06', name: 'Corte + Barba + Sobrancelha', desc: 'Cabelo + Barba + Sobrancelha. A experiência Trend Blade completa e exclusiva.', price: 'R$ 80', time: '1h', icon: '👑' },
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
    { name: 'Angel Isaid', rating: 5, text: 'Faz 10 anos não cortaba com outro barbeiro e hj conheci o Jeferson, me deixou super a vontade passou muita confiança no trabalho dele, humildade demais!', initial: 'A', time: 'há 1 semana', response: 'Fala irmão! Muito obrigado pelo feedback, de verdade! Fico feliz demais que tenha curtido o resultado. Aqui a gente faz tudo com atenção e capricho pra entregar sempre o melhor. Quando quiser, só colar de novo que será um prazer te atender!' },
    { name: 'Francisco', rating: 5, text: 'Profissional de altíssima qualidade serviço feito com perfeição!', initial: 'F', time: 'há 2 meses' },
    { name: 'Erik', rating: 5, text: 'Top demais', initial: 'E', time: 'há 5 dias' },
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
        .hero{position:relative;min-height:100vh;display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;align-items:center;padding:120px 2.5rem 4rem;overflow:hidden}
        .hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(201,168,76,0.08) 0%, transparent 50%);pointer-events:none;z-index:2}
        .hero-left{display:flex;flex-direction:column;gap:1.5rem;position:relative;z-index:3}
        .hero-badge{display:inline-flex;align-items:center;gap:0.75rem;font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,168,76,0.3);padding:0.6rem 1.2rem;border-radius:20px;width:fit-content;background:rgba(201,168,76,0.05)}
        .hero-h1{font-family:'Oswald',sans-serif;font-size:3.5rem;font-weight:700;line-height:1.1;letter-spacing:-0.02em;color:var(--light)}
        .hero-h1 .gold{color:var(--gold)}
        .hero-h1 .outline{color:var(--light);text-decoration:underline;text-decoration-color:var(--gold);text-decoration-thickness:2px;text-underline-offset:6px}
        .hero-sub{font-size:1.05rem;line-height:1.7;color:var(--muted);max-width:450px}
        .hero-stars{display:flex;align-items:center;gap:0.8rem;font-size:0.95rem;color:var(--muted)}
        .hero-actions{display:flex;gap:1rem;flex-wrap:wrap}
        .hero-right{position:relative;display:flex;align-items:center;justify-content:center;height:550px;z-index:3}
        .jeff-portrait-wrap{position:relative;width:320px;height:420px}
        .jeff-circle{position:relative;width:100%;height:100%;border-radius:50% 50% 45% 45%;overflow:hidden;background:linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%);border:2px solid rgba(201,168,76,0.3);box-shadow:0 0 60px rgba(201,168,76,0.2), inset 0 0 40px rgba(201,168,76,0.1);animation:float 6s ease-in-out infinite}
        .jeff-circle img{width:100%;height:100%;object-fit:cover;object-position:center}
        .jeff-glow{position:absolute;inset:-20px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 30% 30%, rgba(201,168,76,0.15) 0%, transparent 70%);filter:blur(30px);animation:pulse-glow 4s ease-in-out infinite;pointer-events:none}
        .jeff-label{position:absolute;bottom:0;left:0;right:0;z-index:5;padding:1.5rem 1.2rem;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent)}
        .jeff-label-name{font-family:'Oswald',sans-serif;font-weight:600;font-size:1.1rem;letter-spacing:0.15em;text-transform:uppercase;color:#fff}
        .jeff-label-role{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-top:0.2rem}
        @keyframes float{0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)}}
        @keyframes pulse-glow{0%,100%{opacity:0.5} 50%{opacity:1}}
        .band{background:linear-gradient(90deg,var(--gold-d),var(--gold),var(--gold-d));padding:1rem 0;overflow:hidden}
        .band-track{display:flex;animation:marquee 25s linear infinite;white-space:nowrap}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .band-item{font-family:'Oswald',sans-serif;font-size:0.8rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--dark);padding:0 2.5rem;display:inline-flex;align-items:center;gap:0.8rem;flex-shrink:0}
        .band-dot{width:4px;height:4px;background:var(--dark);border-radius:50%;opacity:0.4}
        .sec{position:relative;padding:5rem 2.5rem}
        .inner{max-width:1280px;margin:0 auto}
        .stag{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:0.8rem}
        .stitle{font-family:'Oswald',sans-serif;font-size:2.8rem;font-weight:700;letter-spacing:-0.02em;margin-bottom:3rem;color:var(--light)}
        .stitle span{color:var(--gold)}
        .sdiv{width:60px;height:2px;background:linear-gradient(to right,var(--gold),transparent);margin:1.5rem 0 2.5rem}
        .about-layout{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:start}
        .about-text p{font-size:1rem;color:var(--muted);line-height:1.85;margin-bottom:1.5rem}
        .about-cards{display:flex;flex-direction:column;gap:1px}
        .acard{background:var(--mid);border-left:2px solid var(--gold);padding:1.5rem 1.8rem;transition:background 0.3s,transform 0.3s;cursor:default}
        .acard:hover{background:var(--mid2);transform:translateX(6px)}
        .acard-icon{width:36px;height:36px;background:rgba(201,168,76,0.1);border-radius:2px;display:flex;align-items:center;justify-content:center;margin-bottom:0.8rem;color:var(--gold)}
        .acard-title{font-family:'Oswald',sans-serif;font-size:0.95rem;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--light);margin-bottom:0.4rem}
        .acard-text{font-size:0.85rem;color:var(--muted);line-height:1.65}
        .counters{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.04);margin-top:2.5rem}
        .counter-box{background:var(--dark2);padding:1.8rem 1rem;text-align:center}
        .counter-num{font-family:'Oswald',sans-serif;font-size:2.5rem;font-weight:700;color:var(--gold);line-height:1;display:block}
        .counter-label{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);margin-top:0.3rem;display:block}
        .svcs{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.04)}
        .svc{background:var(--dark2);padding:2.2rem 2rem;position:relative;overflow:hidden;transition:background 0.3s,transform 0.3s;cursor:default}
        .svc::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,168,76,0.05) 0%,transparent 60%);opacity:0;transition:opacity 0.3s}
        .svc:hover{background:var(--mid);transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.4)} .svc:hover::after{opacity:1}
        .svc-icon{font-size:1.5rem;margin-bottom:0.8rem;display:block}
        .svc-num{font-family:'Oswald',sans-serif;font-size:3rem;font-weight:700;color:rgba(201,168,76,0.08);line-height:1;position:absolute;top:1rem;right:1.5rem}
        .svc-name{font-family:'Oswald',sans-serif;font-size:1rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--light);margin-bottom:0.7rem}
        .svc-desc{font-size:0.83rem;color:var(--muted);line-height:1.7;margin-bottom:1.8rem}
        .svc-footer{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.05);padding-top:1.2rem}
        .svc-price{font-family:'Oswald',sans-serif;font-size:1.6rem;font-weight:700;color:var(--gold)}
        .svc-time{font-family:'Barlow Condensed',sans-serif;font-size:0.72rem;letter-spacing:0.15em;color:var(--muted);display:flex;align-items:center;gap:4px}
        .agenda-wrap{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:rgba(255,255,255,0.04)}
        .dcard{background:var(--dark2);padding:1.8rem 0.5rem;text-align:center;position:relative;transition:background 0.2s,transform 0.2s}
        .dcard:not(.closed):hover{background:var(--mid);transform:translateY(-3px)}
        .dcard.closed{opacity:0.35}
        .dcard.closed::after{content:'FECHADO';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-12deg);font-family:'Barlow Condensed',sans-serif;font-size:0.52rem;font-weight:700;letter-spacing:0.15em;color:var(--red);border:1px solid var(--red);padding:0.15rem 0.4rem;white-space:nowrap}
        .dname{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);margin-bottom:0.8rem}
        .dhours{font-family:'Oswald',sans-serif;font-size:0.85rem;color:var(--light);line-height:1.6} .dhours .end{display:block;font-size:0.75rem;color:var(--muted)}
        .jeff-section{display:grid;grid-template-columns:45% 55%;min-height:700px}
        .jeff-img-side{position:relative;overflow:hidden}
        .jeff-full{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;filter:grayscale(10%) contrast(1.12) brightness(0.8);transition:transform 0.8s,filter 0.5s}
        .jeff-img-side:hover .jeff-full{transform:scale(1.04);filter:grayscale(0%) contrast(1.08) brightness(0.85)}
        .jeff-ov1{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 50%,transparent 30%,rgba(0,0,0,0.5) 100%);z-index:2;pointer-events:none}
        .jeff-ov2{position:absolute;inset:0;background:linear-gradient(to right,transparent 55%,#0A0A0A 100%);z-index:3;pointer-events:none}
        .jeff-ov3{position:absolute;bottom:0;left:0;right:0;height:35%;background:linear-gradient(to top,rgba(0,0,0,0.4),transparent);z-index:3;pointer-events:none}
        .jeff-accent{position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(to right,transparent,var(--gold) 25%,transparent);z-index:5;pointer-events:none}
        .jeff-text-wrap{background:#0A0A0A;display:flex;flex-direction:column;justify-content:center;padding:5rem 4.5rem}
        .jeff-quote-big{font-family:'Oswald',sans-serif;font-size:1.6rem;font-weight:300;font-style:italic;line-height:1.5;color:var(--light);position:relative;padding-left:1.5rem;margin-bottom:2rem}
        .jeff-quote-big::before{content:'"';position:absolute;left:-0.3rem;top:-1rem;font-size:5rem;color:var(--gold);line-height:1;font-family:'Oswald',sans-serif;font-style:normal;opacity:0.6}
        .jeff-name-big{font-family:'Oswald',sans-serif;font-weight:700;font-size:1.3rem;text-transform:uppercase;letter-spacing:0.12em;color:var(--gold)}
        .jeff-role-big{font-family:'Barlow Condensed',sans-serif;font-size:0.7rem;letter-spacing:0.28em;text-transform:uppercase;color:var(--muted);margin-top:0.3rem}
        .jeff-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:2.5rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.06)}
        .jspec-l{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--muted);margin-bottom:0.25rem}
        .jspec-v{font-family:'Oswald',sans-serif;font-size:0.95rem;color:var(--light)}
        .test-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(255,255,255,0.04)}
        .tcard{background:var(--dark2);padding:2.2rem;position:relative;transition:background 0.2s,transform 0.2s}
        .tcard:hover{background:var(--mid);transform:translateY(-3px)}
        .tcard-quote{position:absolute;top:1rem;right:1.5rem;font-family:'Oswald',sans-serif;font-size:5rem;color:rgba(201,168,76,0.06);line-height:1;pointer-events:none}
        .tavatar{width:46px;height:46px;border-radius:50%;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.25);display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:1.1rem;font-weight:600;color:var(--gold);margin-bottom:1rem}
        .tstars{display:flex;gap:3px;margin-bottom:1rem}
        .ttext{font-size:0.9rem;color:var(--muted);line-height:1.75;font-style:italic;margin-bottom:1.2rem}
        .tname{font-family:'Oswald',sans-serif;font-size:0.9rem;font-weight:600;letter-spacing:0.06em;color:var(--light)}
        .ttime{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;letter-spacing:0.15em;color:var(--muted);margin-top:0.2rem}
        .contact-layout{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start}
        .citem{display:flex;align-items:flex-start;gap:1rem;margin-bottom:2rem}
        .cicon{width:44px;height:44px;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.18);border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
        .citem:hover .cicon{background:rgba(201,168,76,0.15);border-color:var(--gold)}
        .clabel{font-family:'Barlow Condensed',sans-serif;font-size:0.62rem;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem}
        .cval{font-size:0.9rem;color:var(--muted);line-height:1.7} .cval a{color:var(--muted);text-decoration:none;transition:color 0.2s} .cval a:hover{color:var(--gold)}
        .sched-tbl{width:100%;border-collapse:collapse} .sched-tbl td{padding:0.65rem 0;font-size:0.88rem;border-bottom:1px solid rgba(255,255,255,0.04)}
        .sched-tbl td:first-child{color:var(--muted)} .sched-tbl td:last-child{text-align:right;font-family:'Barlow Condensed',sans-serif;letter-spacing:0.05em}
        .sched-tbl .closed-row td{color:rgba(192,57,43,0.7)!important}
        .cbox{background:var(--mid);border:1px solid rgba(201,168,76,0.12);border-radius:3px;padding:2.5rem;position:relative;overflow:hidden}
        .cbox::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(to right,var(--gold-d),var(--gold),var(--gold-d))}
        .footer{background:var(--dark2);border-top:1px solid rgba(201,168,76,0.1)}
        .footer-main{max-width:1280px;margin:0 auto;padding:4rem 2.5rem 3rem;display:grid;grid-template-columns:1.8fr 1fr 1fr;gap:3rem}
        .footer-col-t{font-family:'Barlow Condensed',sans-serif;font-size:0.65rem;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);margin-bottom:1.2rem}
        .footer-txt{font-size:0.875rem;color:var(--muted);line-height:2}
        .footer-bottom{border-top:1px solid rgba(255,255,255,0.04);padding:1.5rem 2.5rem;max-width:1280px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;color:rgba(154,144,128,0.45)}
        .fbadge{font-family:'Barlow Condensed',sans-serif;font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(201,168,76,0.3);border:1px solid rgba(201,168,76,0.12);padding:0.25rem 0.8rem}
        .amenities{background:var(--mid);border-top:1px solid rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.04);padding:2rem 2.5rem;display:flex;justify-content:center;flex-wrap:wrap;gap:2.5rem}
        .amen{display:flex;align-items:center;gap:0.6rem;font-family:'Barlow Condensed',sans-serif;font-size:0.78rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);transition:color 0.2s} .amen:hover{color:var(--gold)}
        @media(max-width:1024px){
          .hero{grid-template-columns:1fr} .hero-right{justify-content:flex-start;padding:2rem 2.5rem 4rem} .hero-left{padding:0}
          .jeff-portrait-wrap{width:280px} 
          .svcs{grid-template-columns:repeat(2,1fr)} .about-layout{grid-template-columns:1fr;gap:3rem}
          .jeff-section{grid-template-columns:1fr} .jeff-img-side{min-height:500px} .jeff-ov2{background:linear-gradient(to top,#0A0A0A 0%,transparent 50%)}
          .jeff-text-wrap{padding:3rem 2.5rem} .test-grid{grid-template-columns:1fr 1fr} .footer-main{grid-template-columns:1fr 1fr}
        }
        @media(max-width:768px){
          .nav-links{display:none} .hamburger{display:block}
          .hero{padding:100px 1.5rem 3rem;min-height:auto;gap:3rem} .hero-left{padding:0} .hero-right{padding:3rem 0 4rem;justify-content:center} .jeff-portrait-wrap{width:100%;max-width:300px;margin:0 auto}
          .sec{padding:3rem 1.5rem} .inner{padding:0} .svcs{grid-template-columns:1fr} .agenda-wrap{grid-template-columns:repeat(4,1fr)}
          .test-grid{grid-template-columns:1fr} .contact-layout{grid-template-columns:1fr;gap:2.5rem}
          .stitle{font-size:2rem;margin-bottom:2rem}
          .hero-h1{font-size:2.2rem}
          .jeff-section{grid-template-columns:1fr}
          .footer-main{grid-template-columns:1fr;gap:2rem;padding:3rem 1.5rem 2rem} .footer-bottom{flex-direction:column;gap:1rem;text-align:center;padding:1.5rem}
          .jeff-grid{grid-template-columns:1fr} .counters{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:480px){
          .hero{padding:90px 1rem 2.5rem;gap:2.5rem}
          .hero-h1{font-size:1.8rem}
          .hero-sub{font-size:0.95rem}
          .hero-actions{flex-direction:column;align-items:flex-start}
          .btn-g,.btn-o{width:100%}
          .hero-right{padding:2.5rem 0 3rem!important}
          .jeff-portrait-wrap{width:240px;height:320px;margin:0 auto}
          .sec{padding:2.5rem 1rem}
          .stitle{font-size:1.6rem}
          .svcs{grid-template-columns:1fr}
          .agenda-wrap{grid-template-columns:repeat(3,1fr)}
          .test-grid{grid-template-columns:1fr}
          .contact-layout{grid-template-columns:1fr;gap:2rem}
          .footer-main{grid-template-columns:1fr;gap:1.5rem;padding:2rem 1rem 1.5rem}
          .about-layout{gap:2rem}
          .counters{grid-template-columns:1fr}
        }
      `}</style>

      <div className={`mmenu ${mobileOpen?'open':''}`}>
        <button className="mmenu-close" onClick={()=>setMobileOpen(false)}><X size={30}/></button>
        {navLinks.map(l=><button key={l.id} className="mmenu-link" onClick={()=>scrollTo(l.id)}>{l.label}</button>)}
        <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g" style={{fontSize:'1rem',padding:'1rem 2.5rem'}}><Calendar size={18}/> Agendar Agora</a>
      </div>

      <nav className={`nav ${scrolled?'scrolled':''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo">
            <img src={logoImage} alt="Trend Blade"/>
            <span className="logo-text">TREND <span>BLADE</span></span>
          </a>
          <ul className="nav-links">
            {navLinks.map(l=><li key={l.id}><button className={`nl ${activeSection===l.id?'active':''}`} onClick={()=>scrollTo(l.id)}>{l.label}</button></li>)}
            <li><a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="nl nav-cta bc">Agendar</a></li>
          </ul>
          <button className="hamburger" onClick={()=>setMobileOpen(true)}><Menu size={22}/></button>
        </div>
      </nav>

      <section id="home" className="hero">
        <ParticleField/>
        <div className="hero-left" style={{opacity:heroReady?1:0,transform:heroReady?'none':'translateY(30px)',transition:'all 0.9s cubic-bezier(.16,1,.3,1)'}}>
          <div className="hero-badge">✦ Barbearia Premium · Guarulhos, SP</div>
          <h1 className="hero-h1"><span style={{display:'block'}}>Estilo &amp;</span><span className="gold">Precisão</span><span className="outline">Redefinidos</span></h1>
          <p className="hero-sub">Mais que um corte — uma experiência premium. Transformamos seu visual com técnica, estilo e o melhor atendimento de Guarulhos.</p>
          <div className="hero-stars">
            {[...Array(5)].map((_,i)=><Star key={i} size={14} fill="#C9A84C" color="#C9A84C"/>)}
            <span style={{fontFamily:'Oswald',fontSize:'1rem',color:'#C9A84C',marginLeft:4}}>5.0</span>
            <span style={{fontSize:'0.82rem',color:'#9A9080'}}>· 145 avaliações no Google</span>
          </div>
          <div className="hero-actions">
            <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g"><Calendar size={16}/> Agendar Agora</a>
            <button className="btn-o" onClick={()=>scrollTo('servicos')}><Scissors size={16}/> Ver Serviços</button>
          </div>
        </div>
        <div className="hero-right" style={{opacity:heroReady?1:0,transition:'opacity 1.2s ease 0.4s'}}>
          <div className="jeff-portrait-wrap">
            <div className="jeff-glow"></div>
            <div className="jeff-circle">
              <img src={jeffersonImage} alt="Jeferson Gomes — Fundador Trend Blade" onError={e=>{e.target.parentElement.style.background='linear-gradient(180deg,#1a1510,#2a2015)';e.target.parentElement.style.minHeight='500px';e.target.style.display='none'}}/>
            </div>
            <div className="jeff-label"><div className="jeff-label-name">Jeferson Gomes</div><div className="jeff-label-role">Fundador & Master Barber</div></div>
          </div>
        </div>
      </section>

      <div className="band"><div className="band-track">{[...Array(10)].map((_,i)=><React.Fragment key={i}><span className="band-item"><span className="band-dot"/>Corte Premium</span><span className="band-item"><span className="band-dot"/>Barba Clássica</span><span className="band-item"><span className="band-dot"/>5.0 Google</span><span className="band-item"><span className="band-dot"/>Guarulhos SP</span></React.Fragment>)}</div></div>

      <section id="sobre" className="sec" style={{background:'#0F0F0F'}}>
        <div className="inner">
          <div className="about-layout">
            <Reveal>
              <div className="stag">Nossa história</div><h2 className="stitle">Sobre a <span>Trend Blade</span></h2><div className="sdiv"/>
              <div className="about-text"><p>Localizada no coração de Guarulhos, a Trend Blade Barbearia nasceu da paixão por transformar o cuidado masculino em uma experiência única. Combinamos técnicas tradicionais com tendências modernas.</p><p>Cada cliente que entra pela nossa porta é tratado com atenção personalizada, em um ambiente aconchegante onde estilo, conforto e qualidade se encontram.</p></div>
              <div className="counters">
                <div className="counter-box"><span className="counter-num"><Counter target={5} suffix=".0"/></span><span className="counter-label">Nota Google</span></div>
                <div className="counter-box"><span className="counter-num"><Counter target={145} suffix="+"/></span><span className="counter-label">Avaliações</span></div>
                <div className="counter-box"><span className="counter-num"><Counter target={10} suffix="+"/></span><span className="counter-label">Anos exp.</span></div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="about-cards">
                {[{icon:Award,title:'Experiência Premium',text:'Cada cliente recebe atenção personalizada em um ambiente sofisticado e aconchegante.'},{icon:Scissors,title:'Técnica Apurada',text:'Profissionais sempre atualizados com as últimas tendências e técnicas de barbearia.'},{icon:Heart,title:'Ambiente Familiar',text:'Um espaço acolhedor onde você se sente em casa — tranquilo, confortável e exclusivo.'},{icon:Users,title:'Atendimento Dedicado',text:'Cada visita é única. Conhecemos você, seu estilo e suas preferências pessoais.'}].map((c,i)=>(
                  <div key={i} className="acard"><div className="acard-icon"><c.icon size={18}/></div><div className="acard-title">{c.title}</div><div className="acard-text">{c.text}</div></div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="servicos" className="sec" style={{background:'#0A0A0A'}}>
        <div className="inner">
          <Reveal><div className="stag">O que oferecemos</div><h2 className="stitle">Nossos <span>Serviços</span></h2><div className="sdiv"/></Reveal>
          <div className="svcs">{services.map((s,i)=><Reveal key={i} delay={i*0.07}><div className="svc"><div className="svc-num">{s.num}</div><span className="svc-icon">{s.icon}</span><div className="svc-name">{s.name}</div><div className="svc-desc">{s.desc}</div><div className="svc-footer"><div className="svc-price">{s.price}</div><div className="svc-time"><Clock size={11}/>{s.time}</div></div></div></Reveal>)}</div>
          <Reveal delay={0.3}><div style={{marginTop:'3rem',display:'flex',gap:'1rem',flexWrap:'wrap'}}><a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g"><Calendar size={16}/> Agendar pelo Booksy</a><a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o"><Phone size={16}/> WhatsApp</a></div></Reveal>
        </div>
      </section>

      <section id="agenda" className="sec" style={{background:'#0F0F0F'}}>
        <div className="inner">
          <Reveal><div className="stag">Funcionamento</div><h2 className="stitle">Horários de <span>Atendimento</span></h2><div className="sdiv"/></Reveal>
          <Reveal delay={0.1}>
            <div className="agenda-wrap">{schedule.map((d,i)=><div key={i} className={`dcard ${d.closed?'closed':''}`}><div className="dname">{d.day}</div>{!d.closed?<div className="dhours">{d.hours}<span className="end">{d.end}</span></div>:<div className="dhours" style={{color:'#9A9080'}}>—</div>}</div>)}</div>
            <p style={{marginTop:'1.5rem',fontSize:'0.78rem',color:'#9A9080',letterSpacing:'0.04em'}}>* Domingo e Segunda-feira: fechado. Agendamentos via Booksy ou WhatsApp.</p>
          </Reveal>
        </div>
      </section>

      <div className="jeff-section">
        <div className="jeff-img-side">
          <img className="jeff-full" src={jeffersonImage} alt="Jeferson Gomes — Master Barber" onError={e=>{e.target.style.display='none';e.target.parentElement.style.background='linear-gradient(135deg,#1a1510,#2a2015)';e.target.parentElement.style.minHeight='500px'}}/>
          <div className="jeff-ov1"/><div className="jeff-ov2"/><div className="jeff-ov3"/><div className="jeff-accent"/>
        </div>
        <div className="jeff-text-wrap">
          <Reveal dir="right">
            <div className="stag">O mestre por trás da arte</div>
            <div className="jeff-quote-big">Barbearia não é só corte de cabelo. É o lugar onde o homem cuida de si mesmo, com orgulho e confiança.</div>
            <div className="jeff-name-big">Jeferson Gomes</div><div className="jeff-role-big">Fundador & Master Barber — Trend Blade Barbearia</div>
            <div className="jeff-grid">{[{l:'Especialidade',v:'Cortes Degradê & Barba'},{l:'Localização',v:'Guarulhos, SP'},{l:'Agendamento',v:'Booksy & WhatsApp'},{l:'Atendimento',v:'Terça → Sábado'}].map((s,i)=><div key={i}><div className="jspec-l">{s.l}</div><div className="jspec-v">{s.v}</div></div>)}</div>
            <div style={{marginTop:'2.5rem',display:'flex',gap:'1rem',flexWrap:'wrap'}}><a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g" style={{fontSize:'0.82rem'}}><Calendar size={14}/> Agendar</a><a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o" style={{fontSize:'0.82rem'}}><Phone size={14}/> WhatsApp</a></div>
          </Reveal>
        </div>
      </div>

      <div className="amenities">{[{icon:Wifi,t:'Wi-Fi Gratuito'},{icon:CreditCard,t:'Cartão de Crédito'},{icon:Wind,t:'Ambiente Climatizado'},{icon:Scissors,t:'Especialistas'},{icon:Star,t:'5.0 Google'},{icon:Heart,t:'Ambiente Familiar'}].map((a,i)=><div key={i} className="amen"><a.icon size={15} color="#C9A84C"/>{a.t}</div>)}</div>

      <section id="depoimentos" className="sec" style={{background:'#0F0F0F'}}>
        <div className="inner">
          <Reveal><div className="stag">Clientes satisfeitos</div><h2 className="stitle">O que nossos <span>clientes</span> dizem</h2><div className="sdiv"/></Reveal>
          <div className="test-grid">{testimonials.map((t,i)=><Reveal key={i} delay={i*0.1}><div className="tcard"><div className="tcard-quote">"</div><div style={{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'1rem'}}><div className="tavatar">{t.initial}</div><div><div className="tname">{t.name}</div><div className="ttime">{t.time}</div></div></div><div className="tstars">{[...Array(t.rating)].map((_,j)=><Star key={j} size={12} fill="#C9A84C" color="#C9A84C"/>)}</div><div className="ttext">"{t.text}"</div>{t.response && <div style={{marginTop:'1.2rem',paddingTop:'1rem',borderTop:'1px solid rgba(255,255,255,0.1)',fontSize:'0.8rem',color:'var(--gold)',fontStyle:'italic'}}>Resposta: {t.response}</div>}</div></Reveal>)}</div>
        </div>
      </section>

      <section id="contato" className="sec" style={{background:'#0A0A0A'}}>
        <div className="inner">
          <Reveal><div className="stag">Fale conosco</div><h2 className="stitle">Entre em <span>Contato</span></h2><div className="sdiv"/></Reveal>
          <div className="contact-layout">
            <Reveal>
              {[{icon:MapPin,label:'Endereço',val:'Av Papa Pio XII, nº 218\nGuarulhos, São Paulo'},{icon:Phone,label:'WhatsApp',val:'(11) 95123-1443',href:'https://wa.me/5511951231443'},{icon:Instagram,label:'Instagram',val:'@trendbladebarbearia',href:'https://instagram.com/trendbladebarbearia'}].map((c,i)=>(
                <div key={i} className="citem"><div className="cicon"><c.icon size={18} color="#C9A84C"/></div><div><div className="clabel">{c.label}</div>{c.href?<div className="cval"><a href={c.href} target="_blank" rel="noopener noreferrer">{c.val}</a></div>:<div className="cval" style={{whiteSpace:'pre-line'}}>{c.val}</div>}</div></div>
              ))}
              <div className="citem"><div className="cicon"><Clock size={18} color="#C9A84C"/></div><div style={{flex:1}}><div className="clabel">Horários</div><table className="sched-tbl"><tbody><tr className="closed-row"><td>Domingo</td><td>Fechado</td></tr><tr className="closed-row"><td>Segunda</td><td>Fechado</td></tr><tr><td>Terça a Sexta</td><td>09h às 19h</td></tr><tr><td>Sábado</td><td>08h às 17h</td></tr></tbody></table></div></div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="cbox">
                <div style={{fontFamily:'Oswald',fontSize:'1.1rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#C9A84C',marginBottom:'1.5rem'}}>Agende seu Horário</div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.8rem',marginBottom:'2rem'}}>
                  <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo" target="_blank" rel="noopener noreferrer" className="btn-g" style={{justifyContent:'center'}}><Calendar size={16}/> Agendar pelo Booksy</a>
                  <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o" style={{justifyContent:'center'}}><Phone size={16}/> WhatsApp</a>
                </div>
                <div style={{borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'1.5rem'}}>
                  <div style={{fontFamily:'Oswald',fontSize:'0.9rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:'#C9A84C',marginBottom:'1rem'}}>Por que nos escolher</div>
                  {['Profissionais especializados e dedicados','Ambiente familiar e aconchegante','Técnicas modernas e tradicionais','Atendimento personalizado','Localização privilegiada em Guarulhos'].map((item,i)=><div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:'0.6rem',fontSize:'0.875rem',color:'#9A9080'}}><span style={{color:'#C9A84C',fontSize:'0.6rem'}}>✦</span>{item}</div>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div><div style={{display:'flex',alignItems:'center',gap:10,marginBottom:'1rem'}}><img src={logoImage} alt="Trend Blade" style={{height:36,width:'auto'}}/><span style={{fontFamily:'Oswald',fontWeight:700,fontSize:'1.2rem',letterSpacing:'0.1em',color:'#C9A84C'}}>TREND <span style={{color:'#F5F0E8'}}>BLADE</span></span></div><p style={{fontSize:'0.875rem',color:'var(--muted)',lineHeight:2}}>Barbearia premium em Guarulhos com foco em estilo, precisão e atendimento familiar diferenciado.</p></div>
          <div><div className="footer-col-t">Contato</div><div className="footer-txt">(11) 95123-1443<br/>@trendbladebarbearia<br/>Av Papa Pio XII, nº 218<br/>Guarulhos, SP</div></div>
          <div><div className="footer-col-t">Horários</div><div className="footer-txt"><span style={{color:'rgba(192,57,43,0.7)'}}>Dom & Seg — Fechado</span><br/>Ter a Sex — 09h às 19h<br/>Sáb — 08h às 17h</div></div>
        </div>
        <div style={{maxWidth:1280,margin:'0 auto'}}><div className="footer-bottom"><div><span>© 2026 Trend Blade Barbearia. Estilo, precisão e sofisticação em Guarulhos.</span><br/><span style={{fontSize:'0.65rem',color:'rgba(154,144,128,0.6)',marginTop:'0.5rem',display:'block'}}>Desenvolvido por <a href="https://www.eblsolucoescorp.tec.br/" target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)',textDecoration:'none',transition:'color 0.2s'}} onMouseEnter={(e)=>e.target.style.color='var(--gold-l)'} onMouseLeave={(e)=>e.target.style.color='var(--gold)'}>@erickAlmida</a></span></div><div className="fbadge">Homologação</div></div></div>
      </footer>
    </div>
  )
}
