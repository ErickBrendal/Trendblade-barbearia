import React, { useState, useEffect, useRef } from 'react'
import { Star, MapPin, Clock, Phone, Instagram, Calendar, Wifi, CreditCard, Scissors, ChevronDown, Menu, X } from 'lucide-react'
import logoImage from './assets/IMG_7057.jpg'
import jeffersonImage from './assets/jefferson.jpg'
import './App.css'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function AnimatedSection({ children, className = '', style = {}, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`
    }}>
      {children}
    </div>
  )
}

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100)
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const sections = ['home','sobre','servicos','agenda','depoimentos','contato']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const services = [
    { num: '01', name: 'Corte Clássico', desc: 'Tesoura ou máquina com acabamento impecável. Inclui lavagem e finalização.', price: 'R$ 45', time: '30min' },
    { num: '02', name: 'Barba Completa', desc: 'Modelagem, toalha quente e finalização com óleo premium para cuidado total.', price: 'R$ 40', time: '30min' },
    { num: '03', name: 'Corte + Barba', desc: 'O combo completo com desconto especial. Transformação total em uma visita.', price: 'R$ 75', time: '1h' },
    { num: '04', name: 'Corte + Sobrancelha', desc: 'Corte preciso com design de sobrancelha masculina para um visual definido.', price: 'R$ 55', time: '30min' },
    { num: '05', name: 'Corte + Hidratação', desc: 'Combinação perfeita de estilo e tratamento capilar com produtos premium.', price: 'R$ 60', time: '45min' },
    { num: '06', name: 'Pacote Completo', desc: 'Cabelo + Barba + Sobrancelha. A experiência Trend Blade completa.', price: 'R$ 80', time: '1h30' },
  ]

  const schedule = [
    { day: 'Dom', short: 'D', closed: true },
    { day: 'Seg', short: 'S', closed: true },
    { day: 'Ter', short: 'T', hours: '09h–19h', closed: false },
    { day: 'Qua', short: 'Q', hours: '09h–19h', closed: false },
    { day: 'Qui', short: 'Q', hours: '09h–19h', closed: false },
    { day: 'Sex', short: 'S', hours: '09h–19h', closed: false },
    { day: 'Sáb', short: 'S', hours: '08h–17h', closed: false },
  ]

  const testimonials = [
    { name: 'Carlos Silva', rating: 5, text: 'Atendimento impecável! O melhor corte que já fiz em Guarulhos. Profissional de verdade.', initial: 'C' },
    { name: 'Roberto Santos', rating: 5, text: 'Ambiente aconchegante e profissional muito dedicado. Já indiquei para vários amigos!', initial: 'R' },
    { name: 'André Costa', rating: 5, text: 'Profissional caprichoso e atencioso. Sempre saio satisfeito e com o visual impecável.', initial: 'A' },
  ]

  const navLinks = [
    { id: 'home', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'depoimentos', label: 'Avaliações' },
    { id: 'contato', label: 'Contato' },
  ]

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: '#0D0D0D', color: '#F5F0E8', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Barlow:ital,wght@0,300;0,400;0,500;1,300&family=Barlow+Condensed:wght@400;600;700&display=swap" rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        :root {
          --gold: #C9A84C; --gold-l: #E8C96A; --gold-d: #8B6914;
          --dark: #0D0D0D; --dark2: #111111; --mid: #1A1A1A; --mid2: #222222;
          --muted: #9A9080; --light: #F5F0E8; --red: #8B1A1A;
        }
        .oswald { font-family: 'Oswald', sans-serif; }
        .bc { font-family: 'Barlow Condensed', sans-serif; }

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: all 0.3s; }
        .nav.scrolled { background: rgba(13,13,13,0.97); backdrop-filter: blur(16px); box-shadow: 0 1px 0 rgba(201,168,76,0.15); }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; height: 70px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo img { height: 36px; width: auto; }
        .nav-logo-text { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.25rem; letter-spacing: 0.1em; color: var(--gold); }
        .nav-logo-text span { color: var(--light); }
        .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
        .nav-link { font-family: 'Barlow Condensed', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); background: none; border: none; cursor: pointer; transition: color 0.2s; padding: 0; }
        .nav-link:hover, .nav-link.active { color: var(--gold); }
        .nav-cta { background: var(--gold); color: var(--dark) !important; padding: 0.5rem 1.4rem; border-radius: 2px; font-weight: 700; }
        .nav-cta:hover { background: var(--gold-l); }
        .hamburger { display: none; background: none; border: none; cursor: pointer; color: var(--light); padding: 4px; }
        .mobile-menu { display: none; position: fixed; inset: 0; background: rgba(13,13,13,0.98); z-index: 999; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
        .mobile-menu.open { display: flex; }
        .mobile-link { font-family: 'Oswald', sans-serif; font-size: 2rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--light); background: none; border: none; cursor: pointer; transition: color 0.2s; }
        .mobile-link:hover { color: var(--gold); }
        .mobile-close { position: absolute; top: 1.5rem; right: 2rem; background: none; border: none; cursor: pointer; color: var(--muted); }

        /* HERO */
        .hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; position: relative; overflow: hidden; }
        .hero-left { display: flex; flex-direction: column; justify-content: center; padding: 8rem 3rem 6rem 6rem; position: relative; z-index: 2; }
        .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Barlow Condensed', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); border: 1px solid rgba(201,168,76,0.3); padding: 0.4rem 1rem; margin-bottom: 2rem; width: fit-content; }
        .hero-h1 { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: clamp(3.5rem, 5.5vw, 6rem); line-height: 0.92; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 1.5rem; }
        .hero-h1 .gold { color: var(--gold); }
        .hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.75; max-width: 380px; margin-bottom: 2rem; }
        .hero-stars { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2.5rem; }
        .hero-stars-label { font-size: 0.85rem; color: var(--muted); }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* HERO PHOTO */
        .hero-right { position: relative; overflow: hidden; }
        .jeff-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; filter: grayscale(15%) contrast(1.1) brightness(0.78) sepia(10%); transition: transform 0.8s ease, filter 0.5s ease; display: block; }
        .hero-right:hover .jeff-photo { transform: scale(1.04); filter: grayscale(5%) contrast(1.08) brightness(0.85) sepia(5%); }
        .jeff-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at 60% 40%, transparent 30%, rgba(0,0,0,0.6) 100%); z-index: 2; pointer-events: none; }
        .jeff-grad-left { position: absolute; inset: 0; background: linear-gradient(to right, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.2) 25%, transparent 50%); z-index: 3; pointer-events: none; }
        .jeff-grad-bottom { position: absolute; inset: 0; background: linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 40%); z-index: 3; pointer-events: none; }
        .cinema-top { display: none; }
        .cinema-bot { display: none; }
        .jeff-geo { position: absolute; top: 50%; left: 2rem; transform: translateY(-50%); width: 2px; height: 90px; background: linear-gradient(to bottom, transparent, var(--gold), transparent); z-index: 6; pointer-events: none; }
        .jeff-tag { position: absolute; bottom: 80px; right: 2rem; z-index: 10; text-align: right; pointer-events: none; }
        .jeff-tag-name { font-family: 'Oswald', sans-serif; font-weight: 300; font-size: 0.95rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); }
        .jeff-tag-role { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--muted); margin-top: 0.2rem; }
        .jeff-tag-line { width: 32px; height: 1px; background: var(--gold); margin-left: auto; margin-top: 0.5rem; }
        .scroll-hint { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.3rem; animation: bounce 2s infinite; }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }

        /* BTNS */
        .btn-g { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; background: var(--gold); color: var(--dark); padding: 0.9rem 2rem; border: none; border-radius: 2px; cursor: pointer; text-decoration: none; transition: background 0.2s, transform 0.15s; }
        .btn-g:hover { background: var(--gold-l); transform: translateY(-2px); }
        .btn-o { display: inline-flex; align-items: center; gap: 0.5rem; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; background: transparent; color: var(--gold); padding: 0.9rem 2rem; border: 1px solid rgba(201,168,76,0.4); border-radius: 2px; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .btn-o:hover { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.7); }

        /* SECTION */
        .section { padding: 6rem 0; }
        .section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .s-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.6rem; }
        .s-title { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: clamp(2rem, 4vw, 3rem); text-transform: uppercase; line-height: 1; letter-spacing: 0.02em; margin-bottom: 0.8rem; }
        .s-title span { color: var(--gold); }
        .s-div { width: 40px; height: 2px; background: var(--gold); margin-bottom: 2.5rem; }

        /* SOBRE */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .about-cards { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .about-card { background: var(--mid); border: 1px solid rgba(201,168,76,0.12); border-left: 3px solid var(--gold); border-radius: 3px; padding: 1.4rem 1.5rem; }
        .about-card-title { font-family: 'Oswald', sans-serif; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gold); margin-bottom: 0.5rem; }
        .about-card-text { font-size: 0.88rem; color: var(--muted); line-height: 1.7; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
        .stat-box { text-align: center; background: var(--mid2); border: 1px solid rgba(201,168,76,0.1); border-radius: 3px; padding: 1.5rem 1rem; }
        .stat-num { font-family: 'Oswald', sans-serif; font-size: 2.2rem; font-weight: 700; color: var(--gold); line-height: 1; }
        .stat-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-top: 0.3rem; }

        /* SERVICES */
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .svc-card { background: var(--mid2); border: 1px solid rgba(255,255,255,0.06); border-radius: 3px; padding: 2rem 1.6rem; position: relative; overflow: hidden; transition: border-color 0.25s, transform 0.2s; cursor: default; }
        .svc-card::before { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 0; background: var(--gold); transition: height 0.3s; border-radius: 0; }
        .svc-card:hover { border-color: rgba(201,168,76,0.35); transform: translateY(-4px); }
        .svc-card:hover::before { height: 100%; }
        .svc-num { font-family: 'Oswald', sans-serif; font-size: 2.8rem; font-weight: 700; color: rgba(201,168,76,0.1); line-height: 1; margin-bottom: 0.8rem; }
        .svc-name { font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.6rem; color: var(--light); }
        .svc-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.65; margin-bottom: 1.5rem; }
        .svc-footer { display: flex; align-items: center; justify-content: space-between; }
        .svc-price { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 600; color: var(--gold); }
        .svc-time { font-family: 'Barlow Condensed', sans-serif; font-size: 0.75rem; letter-spacing: 0.15em; color: var(--muted); display: flex; align-items: center; gap: 4px; }

        /* AGENDA */
        .agenda-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.75rem; }
        .day-card { background: var(--mid); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 1.3rem 0.5rem; text-align: center; transition: border-color 0.2s, transform 0.15s; position: relative; }
        .day-card:not(.closed):hover { border-color: rgba(201,168,76,0.4); transform: translateY(-3px); }
        .day-card.closed { opacity: 0.38; }
        .day-card.closed::after { content: 'FECHADO'; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-12deg); font-family: 'Barlow Condensed', sans-serif; font-size: 0.55rem; font-weight: 700; letter-spacing: 0.12em; color: #c0392b; border: 1px solid #c0392b; padding: 0.15rem 0.4rem; white-space: nowrap; }
        .day-name { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.8rem; }
        .day-hours { font-family: 'Oswald', sans-serif; font-size: 0.82rem; font-weight: 400; color: var(--light); line-height: 1.5; }

        /* JEFFERSON SECTION */
        .jeff-section { display: grid; grid-template-columns: 1fr 1fr; min-height: 680px; }
        .jeff-photo-side { position: relative; overflow: hidden; }
        .jeff-full-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; filter: grayscale(12%) contrast(1.12) brightness(0.8) sepia(8%); display: block; transition: transform 0.8s ease; }
        .jeff-photo-side:hover .jeff-full-img { transform: scale(1.04); }
        .jeff-overlay1 { position: absolute; inset: 0; background: radial-gradient(ellipse at 40% 50%, transparent 35%, rgba(0,0,0,0.55) 100%); z-index: 2; pointer-events: none; }
        .jeff-overlay2 { position: absolute; inset: 0; background: linear-gradient(to right, transparent 50%, var(--mid) 100%); z-index: 3; pointer-events: none; }
        .jeff-overlay3 { position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); z-index: 3; pointer-events: none; }
        .jeff-gold-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(to right, transparent, var(--gold) 30%, transparent); z-index: 5; pointer-events: none; }
        .jeff-text-side { background: var(--mid); display: flex; flex-direction: column; justify-content: center; padding: 5rem 4rem; }
        .jeff-quote { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 300; font-style: italic; line-height: 1.55; color: var(--light); position: relative; padding-left: 1.5rem; margin-bottom: 2rem; }
        .jeff-quote::before { content: '"'; position: absolute; left: -0.2rem; top: -0.8rem; font-size: 4rem; color: var(--gold); line-height: 1; font-family: 'Oswald', sans-serif; font-style: normal; }
        .jeff-name { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); }
        .jeff-role-txt { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--muted); margin-top: 0.3rem; }
        .jeff-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); }
        .jeff-spec-l { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); margin-bottom: 0.25rem; }
        .jeff-spec-v { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: var(--light); }

        /* TESTIMONIALS */
        .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .test-card { background: var(--mid2); border: 1px solid rgba(201,168,76,0.1); border-radius: 3px; padding: 2rem; position: relative; }
        .test-card::before { content: '"'; position: absolute; top: 1rem; right: 1.5rem; font-family: 'Oswald', sans-serif; font-size: 4rem; color: rgba(201,168,76,0.1); line-height: 1; }
        .test-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 600; color: var(--gold); margin-bottom: 1rem; }
        .test-stars { display: flex; gap: 3px; margin-bottom: 0.8rem; }
        .test-text { font-size: 0.9rem; color: var(--muted); line-height: 1.7; font-style: italic; margin-bottom: 1rem; }
        .test-name { font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 600; letter-spacing: 0.05em; color: var(--light); }

        /* CONTACT */
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
        .contact-item { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 2rem; }
        .contact-icon { width: 42px; height: 42px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); border-radius: 2px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .contact-label { font-family: 'Barlow Condensed', sans-serif; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.3rem; }
        .contact-val { font-size: 0.9rem; color: var(--muted); line-height: 1.7; }
        .contact-val a { color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .contact-val a:hover { color: var(--gold); }
        .sched-table { width: 100%; border-collapse: collapse; }
        .sched-table td { padding: 0.6rem 0; font-size: 0.88rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .sched-table td:first-child { color: var(--muted); }
        .sched-table td:last-child { text-align: right; color: var(--light); font-family: 'Barlow Condensed', sans-serif; font-size: 0.9rem; letter-spacing: 0.05em; }
        .closed-txt { color: #c0392b !important; }

        /* FOOTER */
        .footer { background: var(--dark2); border-top: 1px solid rgba(201,168,76,0.15); padding: 4rem 0 0; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        .footer-col-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--gold); margin-bottom: 1.2rem; }
        .footer-text { font-size: 0.875rem; color: var(--muted); line-height: 1.8; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(154,144,128,0.5); }
        .footer-badge { font-family: 'Barlow Condensed', sans-serif; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(201,168,76,0.35); border: 1px solid rgba(201,168,76,0.15); padding: 0.25rem 0.75rem; }

        /* DIVIDER BAND */
        .band { background: var(--gold); padding: 1.2rem 0; overflow: hidden; position: relative; }
        .band-inner { display: flex; gap: 4rem; animation: marquee 20s linear infinite; white-space: nowrap; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .band-item { font-family: 'Oswald', sans-serif; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--dark); display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }

        /* AMENITIES */
        .amenity-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; padding: 3rem 0; border-top: 1px solid rgba(201,168,76,0.1); margin-top: 0; }
        .amenity-item { display: flex; align-items: center; gap: 0.6rem; font-family: 'Barlow Condensed', sans-serif; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .about-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .jeff-section { grid-template-columns: 1fr; }
          .jeff-photo-side { min-height: 420px; }
          .jeff-overlay2 { background: linear-gradient(to top, var(--mid) 0%, transparent 60%); }
          .test-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 7rem 1.5rem 3rem; order: 2; }
          .hero-right { order: 1; min-height: 60vw; max-height: 80vh; }
          .jeff-grad-left { background: linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 50%); }
          .hero-h1 { font-size: clamp(2.5rem, 8vw, 4rem); }
          .hero-badge { font-size: 0.6rem; }
          .nav-links { display: none; }
          .hamburger { display: block; }
          .section { padding: 4rem 0; }
          .section-inner { padding: 0 1.25rem; }
          .services-grid { grid-template-columns: 1fr; }
          .agenda-grid { grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
          .agenda-grid > *:nth-child(5), .agenda-grid > *:nth-child(6), .agenda-grid > *:nth-child(7) { grid-column: span 1; }
          .test-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
          .jeff-text-side { padding: 3rem 1.5rem; }
          .stats-row { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
          .hero-actions { flex-direction: column; }
          .btn-g, .btn-o { justify-content: center; }
        }
        @media (max-width: 480px) {
          .agenda-grid { grid-template-columns: repeat(4, 1fr); }
          .jeff-specs { grid-template-columns: 1fr; gap: 1rem; }
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={28} /></button>
        {navLinks.map(l => (
          <button key={l.id} className="mobile-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
        ))}
        <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
           target="_blank" rel="noopener noreferrer" className="btn-g" onClick={() => setMobileOpen(false)}>
          Agendar Agora
        </a>
      </div>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#home" className="nav-logo" onClick={e => { e.preventDefault(); scrollTo('home') }}>
            <img src={logoImage} alt="Trend Blade" />
            <span className="nav-logo-text">TREND <span>BLADE</span></span>
          </a>
          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.id}>
                <button className={`nav-link ${activeSection === l.id ? 'active' : ''}`} onClick={() => scrollTo(l.id)}>
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                 target="_blank" rel="noopener noreferrer" className="nav-link nav-cta bc">
                Agendar
              </a>
            </li>
          </ul>
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero" style={{ background: 'linear-gradient(135deg,#0D0D0D 0%,#151008 50%,#0D0D0D 100%)' }}>
        <div className="hero-left" style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}>
          <div className="hero-badge">✦ Barbearia Premium · Guarulhos, SP</div>
          <h1 className="hero-h1">
            Estilo &amp;<br />
            <span className="gold">Precisão</span><br />
            Redefinidos
          </h1>
          <p className="hero-sub">Mais que um corte — uma experiência premium. Transformamos seu visual com técnica, estilo e o melhor atendimento de Guarulhos.</p>
          <div className="hero-stars">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#C9A84C" color="#C9A84C" />)}
            <span style={{ fontFamily: 'Oswald', fontSize: '1rem', color: '#C9A84C', marginLeft: 4 }}>5.0</span>
            <span className="hero-stars-label">· 145 avaliações no Google</span>
          </div>
          <div className="hero-actions">
            <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
               target="_blank" rel="noopener noreferrer" className="btn-g">
              <Calendar size={16} /> Agendar Agora
            </a>
            <button className="btn-o" onClick={() => scrollTo('servicos')}>
              <Scissors size={16} /> Ver Serviços
            </button>
          </div>
        </div>
        <div className="hero-right" style={{ opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
          <img className="jeff-photo" src={jeffersonImage} alt="Jefferson — Fundador Trend Blade"
               onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'linear-gradient(135deg,#1a1510,#2a2015)' }} />
          <div className="cinema-top" />
          <div className="cinema-bot" />
          <div className="jeff-vignette" />
          <div className="jeff-grad-left" />
          <div className="jeff-grad-bottom" />
          <div className="jeff-geo" />
          <div className="jeff-tag">
            <div className="jeff-tag-name">Jefferson</div>
            <div className="jeff-tag-role">Fundador & Master Barber</div>
            <div className="jeff-tag-line" />
          </div>
          <div className="scroll-hint" style={{ color: 'rgba(201,168,76,0.5)' }}>
            <ChevronDown size={18} />
          </div>
        </div>
      </section>

      {/* BAND */}
      <div className="band">
        <div className="band-inner">
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="band-item">✦ Corte Premium</span>
              <span className="band-item">✦ Barba Clássica</span>
              <span className="band-item">✦ 5.0 no Google</span>
              <span className="band-item">✦ Guarulhos, SP</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* SOBRE */}
      <section id="sobre" className="section" style={{ background: '#111' }}>
        <div className="section-inner">
          <div className="about-grid">
            <AnimatedSection>
              <div className="s-tag">Nossa história</div>
              <h2 className="s-title">Sobre a <span>Trend Blade</span></h2>
              <div className="s-div" />
              <p style={{ fontSize: '1rem', color: '#9A9080', lineHeight: 1.8, marginBottom: '2rem' }}>
                Localizada no coração de Guarulhos, a Trend Blade Barbearia nasceu da paixão por transformar o cuidado masculino em uma experiência única. Combinamos técnicas tradicionais com tendências modernas, criando um ambiente onde estilo, conforto e qualidade se encontram.
              </p>
              <div className="stats-row">
                {[{ num: '5.0', label: 'Nota Google' }, { num: '145+', label: 'Avaliações' }, { num: '10+', label: 'Anos de exp.' }].map((s, i) => (
                  <div key={i} className="stat-box">
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="about-cards">
                {[
                  { title: 'Experiência Premium', text: 'Cada cliente recebe atenção personalizada em um ambiente sofisticado e aconchegante.' },
                  { title: 'Técnica Apurada', text: 'Profissionais dedicados sempre atualizados com as últimas tendências e técnicas.' },
                  { title: 'Comodidade Total', text: 'Wi-Fi gratuito, cartão de crédito e atendimento personalizado para sua conveniência.' },
                ].map((c, i) => (
                  <div key={i} className="about-card">
                    <div className="about-card-title">{c.title}</div>
                    <div className="about-card-text">{c.text}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="section" style={{ background: '#0D0D0D' }}>
        <div className="section-inner">
          <AnimatedSection>
            <div className="s-tag">O que oferecemos</div>
            <h2 className="s-title">Nossos <span>Serviços</span></h2>
            <div className="s-div" />
          </AnimatedSection>
          <div className="services-grid">
            {services.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="svc-card">
                  <div className="svc-num">{s.num}</div>
                  <div className="svc-name">{s.name}</div>
                  <div className="svc-desc">{s.desc}</div>
                  <div className="svc-footer">
                    <div className="svc-price">{s.price}</div>
                    <div className="svc-time"><Clock size={12} />{s.time}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.3}>
            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem' }}>
              <p style={{ color: '#9A9080', fontSize: '0.85rem' }}>Agende seu horário pelo Booksy ou WhatsApp</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                   target="_blank" rel="noopener noreferrer" className="btn-g">
                  <Calendar size={16} /> Agendar pelo Booksy
                </a>
                <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer" className="btn-o">
                  <Phone size={16} /> WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* AGENDA */}
      <section id="agenda" className="section" style={{ background: '#111' }}>
        <div className="section-inner">
          <AnimatedSection>
            <div className="s-tag">Funcionamento</div>
            <h2 className="s-title">Horários de <span>Atendimento</span></h2>
            <div className="s-div" />
            <div className="agenda-grid">
              {schedule.map((d, i) => (
                <div key={i} className={`day-card ${d.closed ? 'closed' : ''}`}>
                  <div className="day-name">{d.day}</div>
                  {!d.closed && (
                    <div className="day-hours">{d.hours?.replace('–', '\n').split('\n').map((h, j) => <span key={j} style={{ display: 'block' }}>{h}</span>)}</div>
                  )}
                  {d.closed && <div className="day-hours" style={{ color: '#9A9080' }}>—</div>}
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: '#9A9080', letterSpacing: '0.04em' }}>
              * Domingo e Segunda-feira: fechado. Agendamentos via Booksy ou WhatsApp.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* JEFFERSON */}
      <section className="jeff-section">
        <div className="jeff-photo-side">
          <img className="jeff-full-img" src={jeffersonImage} alt="Jefferson — Master Barber"
               onError={e => { e.target.style.display='none'; e.target.parentElement.style.background='linear-gradient(135deg,#1a1510,#2a2015)'; e.target.parentElement.style.minHeight='500px' }} />
          <div className="jeff-overlay1" />
          <div className="jeff-overlay2" />
          <div className="jeff-overlay3" />
          <div className="jeff-gold-bar" />
        </div>
        <div className="jeff-text-side">
          <AnimatedSection>
            <div className="s-tag">O profissional por trás da arte</div>
            <div className="jeff-quote">
              Barbearia não é só corte de cabelo. É o lugar onde o homem cuida de si mesmo, com orgulho.
            </div>
            <div className="jeff-name">Jefferson</div>
            <div className="jeff-role-txt">Fundador & Master Barber — Trend Blade Barbearia</div>
            <div className="jeff-specs">
              {[
                { l: 'Especialidade', v: 'Cortes Degradê & Barba' },
                { l: 'Localização', v: 'Guarulhos, SP' },
                { l: 'Agendamento', v: 'Booksy & WhatsApp' },
                { l: 'Atendimento', v: 'Terça → Sábado' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="jeff-spec-l">{s.l}</div>
                  <div className="jeff-spec-v">{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                 target="_blank" rel="noopener noreferrer" className="btn-g" style={{ fontSize: '0.8rem' }}>
                <Calendar size={14} /> Agendar
              </a>
              <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer"
                 className="btn-o" style={{ fontSize: '0.8rem' }}>
                <Phone size={14} /> WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* AMENIDADES */}
      <div style={{ background: '#0D0D0D', padding: '0 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="amenity-row">
            {[{ icon: Wifi, t: 'Wi-Fi Gratuito' }, { icon: CreditCard, t: 'Cartão de Crédito' }, { icon: Scissors, t: 'Profissionais Especializados' }, { icon: Star, t: '5.0 no Google' }].map((a, i) => (
              <div key={i} className="amenity-item">
                <a.icon size={16} color="#C9A84C" /> {a.t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="section" style={{ background: '#111' }}>
        <div className="section-inner">
          <AnimatedSection>
            <div className="s-tag">Clientes satisfeitos</div>
            <h2 className="s-title">O que nossos <span>clientes</span> dizem</h2>
            <div className="s-div" />
          </AnimatedSection>
          <div className="test-grid">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="test-card">
                  <div className="test-avatar">{t.initial}</div>
                  <div className="test-stars">{[...Array(t.rating)].map((_, j) => <Star key={j} size={13} fill="#C9A84C" color="#C9A84C" />)}</div>
                  <div className="test-text">"{t.text}"</div>
                  <div className="test-name">{t.name}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="section" style={{ background: '#0D0D0D' }}>
        <div className="section-inner">
          <AnimatedSection>
            <div className="s-tag">Fale conosco</div>
            <h2 className="s-title">Entre em <span>Contato</span></h2>
            <div className="s-div" />
          </AnimatedSection>
          <div className="contact-grid">
            <AnimatedSection>
              {[
                { icon: MapPin, label: 'Endereço', val: 'Av Papa Pio XII, nº 218\nGuarulhos, São Paulo' },
                { icon: Phone, label: 'WhatsApp', val: '(11) 95123-1443', href: 'https://wa.me/5511951231443' },
                { icon: Instagram, label: 'Instagram', val: '@trendbladebarbearia', href: 'https://instagram.com/trendbladebarbearia' },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon"><c.icon size={18} color="#C9A84C" /></div>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    {c.href
                      ? <div className="contact-val"><a href={c.href} target="_blank" rel="noopener noreferrer">{c.val}</a></div>
                      : <div className="contact-val" style={{ whiteSpace: 'pre-line' }}>{c.val}</div>}
                  </div>
                </div>
              ))}
              <div className="contact-item">
                <div className="contact-icon"><Clock size={18} color="#C9A84C" /></div>
                <div style={{ flex: 1 }}>
                  <div className="contact-label">Horários</div>
                  <table className="sched-table">
                    <tbody>
                      <tr><td>Domingo</td><td className="closed-txt">Fechado</td></tr>
                      <tr><td>Segunda</td><td className="closed-txt">Fechado</td></tr>
                      <tr><td>Terça a Sexta</td><td>09h às 19h</td></tr>
                      <tr><td>Sábado</td><td>08h às 17h</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div style={{ background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 4, padding: '2.5rem' }}>
                <div style={{ fontFamily: 'Oswald', fontSize: '1.1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#C9A84C', marginBottom: '1.5rem' }}>
                  Agende seu Horário
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                     target="_blank" rel="noopener noreferrer" className="btn-g" style={{ justifyContent: 'center' }}>
                    <Calendar size={16} /> Agendar pelo Booksy
                  </a>
                  <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer"
                     className="btn-o" style={{ justifyContent: 'center' }}>
                    <Phone size={16} /> WhatsApp
                  </a>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                  <div style={{ fontFamily: 'Barlow Condensed', fontSize: '0.68rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem' }}>
                    Por que nos escolher
                  </div>
                  {['Profissionais especializados e dedicados', 'Ambiente aconchegante e sofisticado', 'Técnicas modernas e tradicionais', 'Atendimento personalizado', 'Localização privilegiada em Guarulhos'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.6rem', fontSize: '0.875rem', color: '#9A9080' }}>
                      <span style={{ color: '#C9A84C', fontSize: '0.6rem' }}>✦</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="section-inner">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <img src={logoImage} alt="Trend Blade" style={{ height: 36, width: 'auto' }} />
                <span style={{ fontFamily: 'Oswald', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#C9A84C' }}>
                  TREND <span style={{ color: '#F5F0E8' }}>BLADE</span>
                </span>
              </div>
              <p className="footer-text">Barbearia premium em Guarulhos com foco em estilo, precisão e atendimento diferenciado.</p>
            </div>
            <div>
              <div className="footer-col-title">Contato</div>
              <div className="footer-text" style={{ lineHeight: 2.2 }}>
                <div>(11) 95123-1443</div>
                <div>@trendbladebarbearia</div>
                <div>Av Papa Pio XII, nº 218</div>
                <div>Guarulhos, SP</div>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Horários</div>
              <div className="footer-text" style={{ lineHeight: 2.2 }}>
                <span style={{ color: 'rgba(192,57,43,0.8)' }}>Dom & Seg — Fechado</span><br />
                Ter a Sex — 09h às 19h<br />
                Sáb — 08h às 17h
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Trend Blade Barbearia. Estilo e sofisticação em Guarulhos.</span>
          <div className="footer-badge">Homologação</div>
        </div>
      </footer>
    </div>
  )
}
