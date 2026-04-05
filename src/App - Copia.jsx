import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Star, MapPin, Clock, Phone, Instagram, Calendar, Wifi, CreditCard, Scissors } from 'lucide-react'
import logoImage from './assets/IMG_7057.jpg'
import jeffersonImage from './assets/jefferson.jpg'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [jeffVisible, setJeffVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setJeffVisible(true) },
      { threshold: 0.3 }
    )
    const el = document.getElementById('jefferson-section')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const services = [
    { name: 'Corte', price: 'R$ 45', duration: '30min', num: '01' },
    { name: 'Barba', price: 'R$ 40', duration: '30min', num: '02' },
    { name: 'Corte + Barba', price: 'R$ 75', duration: '1h', num: '03' },
    { name: 'Corte + Sobrancelha', price: 'R$ 55', duration: '30min', num: '04' },
    { name: 'Corte + Hidratação', price: 'R$ 60', duration: '30min', num: '05' },
    { name: 'Pacote Completo', price: 'R$ 80', duration: '1h', description: 'Cabelo + Barba + Sobrancelha', num: '06' }
  ]

  const testimonials = [
    { name: 'Carlos Silva', rating: 5, text: 'Atendimento impecável! O melhor corte que já fiz em Guarulhos.' },
    { name: 'Roberto Santos', rating: 5, text: 'Ambiente aconchegante e profissional muito dedicado. Recomendo!' },
    { name: 'André Costa', rating: 5, text: 'Profissional caprichoso e atencioso. Sempre saio satisfeito!' }
  ]

  // Agenda corrigida: Domingo e Segunda FECHADOS
  const schedule = [
    { day: 'Dom', hours: null, closed: true },
    { day: 'Seg', hours: null, closed: true },
    { day: 'Ter', hours: '09h–19h', closed: false },
    { day: 'Qua', hours: '09h–19h', closed: false },
    { day: 'Qui', hours: '09h–19h', closed: false },
    { day: 'Sex', hours: '09h–19h', closed: false },
    { day: 'Sáb', hours: '08h–17h', closed: false },
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>

      {/* GOOGLE FONTS */}
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Barlow:wght@300;400;500&family=Barlow+Condensed:wght@400;600&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --gold: #C9A84C;
          --gold-light: #E8C96A;
          --charcoal: #1A1A1A;
          --dark: #0D0D0D;
          --mid: #2A2A2A;
          --muted: #9A9080;
        }
        .oswald { font-family: 'Oswald', sans-serif; }
        .barlow-c { font-family: 'Barlow Condensed', sans-serif; }

        /* NAV */
        .nav-scrolled { background: rgba(13,13,13,0.98) !important; box-shadow: 0 1px 0 rgba(201,168,76,0.2); }
        .nav-link { font-size: 0.78rem; letter-spacing: 0.1em; text-transform: uppercase; color: #9A9080; transition: color 0.2s; text-decoration: none; background: none; border: none; cursor: pointer; }
        .nav-link:hover, .nav-link.active { color: #C9A84C; }
        .nav-cta { background: #C9A84C !important; color: #0D0D0D !important; padding: 0.5rem 1.2rem; font-weight: 600; letter-spacing: 0.1em; border-radius: 2px; }

        /* HERO */
        .hero-badge { display: inline-block; font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: #C9A84C; border: 1px solid rgba(201,168,76,0.35); padding: 0.4rem 1rem; margin-bottom: 1.5rem; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; }
        .hero-h1 { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: clamp(3rem,6vw,5.5rem); line-height: 0.95; text-transform: uppercase; letter-spacing: 0.02em; }
        .hero-h1 .accent { color: #C9A84C; display: block; }

        /* FOTO DO JEFFERSON — efeito cinematográfico */
        .jefferson-photo-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }
        .jefferson-photo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(10%) contrast(1.12) brightness(0.82) sepia(12%);
          display: block;
          transition: transform 0.8s ease, filter 0.8s ease;
        }
        .jefferson-photo-wrap:hover img {
          transform: scale(1.03);
          filter: grayscale(0%) contrast(1.08) brightness(0.88) sepia(8%);
        }
        /* Vignette */
        .jefferson-photo-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.65) 100%);
          z-index: 2;
          pointer-events: none;
        }
        /* Gradiente lateral */
        .jefferson-photo-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 55%, rgba(13,13,13,0.95) 100%),
                      linear-gradient(to bottom, rgba(13,13,13,0.5) 0%, transparent 20%, transparent 75%, rgba(13,13,13,0.8) 100%);
          z-index: 3;
          pointer-events: none;
        }
        /* Barras de cinema */
        .cinema-bar {
          position: absolute;
          left: 0; right: 0;
          height: 52px;
          background: #0D0D0D;
          z-index: 5;
          pointer-events: none;
        }
        .cinema-bar-top { top: 0; }
        .cinema-bar-bottom { bottom: 0; }
        /* Linha dourada vertical decorativa */
        .jeff-geo-line {
          position: absolute;
          top: 50%; left: 2.5rem;
          transform: translateY(-50%);
          width: 2px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
          z-index: 6;
        }
        /* Tag do barbeiro */
        .jeff-name-tag {
          position: absolute;
          bottom: 80px; right: 1.5rem;
          z-index: 10;
          text-align: right;
        }
        .jeff-name-tag-name {
          font-family: 'Oswald', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C9A84C;
        }
        .jeff-name-tag-role {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9A9080;
          margin-top: 0.2rem;
        }
        .jeff-name-tag-line {
          width: 36px;
          height: 1px;
          background: #C9A84C;
          margin-left: auto;
          margin-top: 0.5rem;
        }

        /* AGENDA */
        .agenda-day {
          background: #1A1A1A;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 4px;
          padding: 1.2rem 0.6rem;
          text-align: center;
          transition: border-color 0.2s, transform 0.15s;
          position: relative;
        }
        .agenda-day:hover:not(.closed) {
          border-color: rgba(201,168,76,0.4);
          transform: translateY(-3px);
        }
        .agenda-day.closed { opacity: 0.4; }
        .agenda-day.closed::after {
          content: 'FECHADO';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%) rotate(-12deg);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #8B1A1A;
          border: 1px solid #8B1A1A;
          padding: 0.15rem 0.4rem;
        }
        .agenda-day-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9A9080;
          margin-bottom: 0.7rem;
        }
        .agenda-day-hours {
          font-family: 'Oswald', sans-serif;
          font-size: 0.85rem;
          font-weight: 400;
          color: #F5F0E8;
          line-height: 1.4;
        }

        /* SERVICES */
        .service-card-custom {
          background: #111;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 1.8rem 1.5rem;
          position: relative;
          transition: border-color 0.25s;
          overflow: hidden;
        }
        .service-card-custom::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 0;
          background: #C9A84C;
          transition: height 0.3s;
        }
        .service-card-custom:hover { border-color: rgba(201,168,76,0.4); }
        .service-card-custom:hover::before { height: 100%; }
        .service-num {
          font-family: 'Oswald', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: rgba(201,168,76,0.1);
          line-height: 1;
          margin-bottom: 0.8rem;
        }

        /* SECTION TITLES */
        .section-tag-custom {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 0.6rem;
        }
        .section-title-custom {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: clamp(2rem,4vw,3rem);
          text-transform: uppercase;
          line-height: 1;
          letter-spacing: 0.02em;
          margin-bottom: 0.8rem;
        }
        .section-title-custom span { color: #C9A84C; }
        .divider-gold { width: 40px; height: 2px; background: #C9A84C; margin-bottom: 2rem; }

        /* JEFF SECTION */
        .jeff-section-fade {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.9s ease, transform 0.9s ease;
        }
        .jeff-section-fade.visible {
          opacity: 1;
          transform: translateX(0);
        }
        .jeff-quote {
          font-family: 'Oswald', sans-serif;
          font-size: 1.5rem;
          font-weight: 300;
          font-style: italic;
          line-height: 1.5;
          color: #F5F0E8;
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .jeff-quote::before {
          content: '"';
          position: absolute;
          left: 0; top: -0.5rem;
          font-size: 3.5rem;
          color: #C9A84C;
          line-height: 1;
          font-family: 'Oswald', sans-serif;
        }

        /* FOOTER */
        .footer-custom { background: #0D0D0D; border-top: 1px solid rgba(201,168,76,0.2); }
        .footer-col-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 1rem;
        }

        /* BTN GOLD */
        .btn-gold {
          background: #C9A84C;
          color: #0D0D0D;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.85rem 2rem;
          border-radius: 2px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .btn-gold:hover { background: #E8C96A; transform: translateY(-2px); }
        .btn-outline-gold {
          border: 1px solid rgba(201,168,76,0.5);
          color: #C9A84C;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.85rem 2rem;
          border-radius: 2px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .btn-outline-gold:hover { background: rgba(201,168,76,0.1); }
      `}</style>

      {/* NAV */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-black/80 backdrop-blur-sm'}`}
           style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Trend Blade Logo" className="h-9 w-auto" />
            <span className="oswald text-xl font-bold" style={{ color: '#C9A84C', letterSpacing: '0.08em' }}>
              TREND <span style={{ color: '#fff' }}>BLADE</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            {[
              { id: 'home', label: 'Início' },
              { id: 'sobre', label: 'Sobre' },
              { id: 'servicos', label: 'Serviços' },
              { id: 'agenda', label: 'Agenda' },
              { id: 'depoimentos', label: 'Avaliações' },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={`nav-link barlow-c ${activeSection === id ? 'active' : ''}`}>
                {label}
              </button>
            ))}
            <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
               target="_blank" rel="noopener noreferrer"
               className="nav-link nav-cta barlow-c">
              Agendar
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="pt-20 min-h-screen flex items-center"
               style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1510 50%, #0D0D0D 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="hero-badge">Barbearia Premium · Guarulhos, SP</div>
              <h1 className="hero-h1 mb-6">
                Estilo &amp;
                <span className="accent">Precisão</span>
                Redefinidos
              </h1>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: '#9A9080', maxWidth: 400 }}>
                Mais que um corte — uma experiência premium. Transformamos seu visual com técnica,
                estilo e o melhor atendimento de Guarulhos.
              </p>
              <div className="flex items-center gap-3 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#C9A84C' }} />
                ))}
                <span className="text-sm font-semibold">5.0</span>
                <span className="text-sm" style={{ color: '#9A9080' }}>(145 avaliações)</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                   target="_blank" rel="noopener noreferrer" className="btn-gold">
                  <Calendar className="h-4 w-4" /> Agendar Agora
                </a>
                <button onClick={() => scrollToSection('contato')} className="btn-outline-gold">
                  <Phone className="h-4 w-4" /> Contato
                </button>
              </div>
            </div>

            {/* FOTO DO JEFFERSON NO HERO */}
            <div className="relative" style={{ height: 520 }}>
              <div className="jefferson-photo-wrap" style={{ height: '100%', borderRadius: 4 }}>
                <img src={jeffersonImage} alt="Jefferson — Fundador Trend Blade"
                     onError={(e) => {
                       e.target.style.display = 'none'
                       e.target.parentElement.style.background = 'linear-gradient(135deg,#1a1510,#2a2015)'
                     }} />
                <div className="cinema-bar cinema-bar-top"></div>
                <div className="cinema-bar cinema-bar-bottom"></div>
                <div className="jeff-geo-line"></div>
                <div className="jeff-name-tag">
                  <div className="jeff-name-tag-name">Jefferson</div>
                  <div className="jeff-name-tag-role">Fundador & Master Barber</div>
                  <div className="jeff-name-tag-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-20" style={{ background: '#111' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="section-tag-custom">Nossa história</div>
            <div className="section-title-custom">Sobre a <span>Trend Blade</span></div>
            <div className="divider-gold"></div>
            <p className="text-lg mb-12 leading-relaxed max-w-2xl" style={{ color: '#9A9080' }}>
              Localizada no coração de Guarulhos, a Trend Blade Barbearia nasceu da paixão por transformar
              o cuidado masculino em uma experiência única. Combinamos técnicas tradicionais com tendências
              modernas, criando um ambiente onde estilo, conforto e qualidade se encontram.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Experiência Premium', text: 'Cada cliente recebe atenção personalizada em um ambiente sofisticado e aconchegante.' },
                { title: 'Técnica Apurada', text: 'Profissionais dedicados e caprichosos, sempre atualizados com as últimas tendências.' },
                { title: 'Comodidade Total', text: 'Wi-Fi gratuito, cartão de crédito e um ambiente aconchegante para sua conveniência.' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#1A1A1A',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 4,
                  padding: '1.8rem 1.5rem',
                  borderTop: '2px solid #C9A84C'
                }}>
                  <div className="oswald text-lg font-semibold mb-3" style={{ color: '#C9A84C', letterSpacing: '0.05em' }}>
                    {item.title}
                  </div>
                  <p style={{ color: '#9A9080', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-20" style={{ background: '#0D0D0D' }}>
        <div className="container mx-auto px-6">
          <div className="section-tag-custom">O que oferecemos</div>
          <div className="section-title-custom">Nossos <span>Serviços</span></div>
          <div className="divider-gold"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl">
            {services.map((service, index) => (
              <div key={index} className="service-card-custom">
                <div className="service-num">{service.num}</div>
                <div className="oswald text-lg font-semibold mb-1" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {service.name}
                </div>
                {service.description && (
                  <p style={{ color: '#9A9080', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{service.description}</p>
                )}
                <div className="flex items-center gap-2 mb-4" style={{ color: '#9A9080', fontSize: '0.82rem' }}>
                  <Clock className="h-3 w-3" />{service.duration}
                </div>
                <div className="oswald text-2xl font-semibold" style={{ color: '#C9A84C' }}>
                  {service.price}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <p style={{ color: '#9A9080', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Agende seu horário pelo Booksy ou WhatsApp
            </p>
            <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
               target="_blank" rel="noopener noreferrer" className="btn-gold">
              <Calendar className="h-4 w-4" /> Agendar pelo Booksy
            </a>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section id="agenda" className="py-20" style={{ background: '#111' }}>
        <div className="container mx-auto px-6">
          <div className="section-tag-custom">Funcionamento</div>
          <div className="section-title-custom">Horários de <span>Atendimento</span></div>
          <div className="divider-gold"></div>
          <div className="grid grid-cols-7 gap-3 max-w-3xl">
            {schedule.map((item, i) => (
              <div key={i} className={`agenda-day ${item.closed ? 'closed' : ''}`}>
                <div className="agenda-day-name">{item.day}</div>
                {!item.closed && (
                  <div className="agenda-day-hours">{item.hours?.replace('–', '\n').split('\n').map((h, j) => (
                    <span key={j} style={{ display: 'block' }}>{h}</span>
                  ))}</div>
                )}
                {item.closed && (
                  <div className="agenda-day-hours" style={{ color: '#9A9080', fontSize: '0.75rem' }}>—</div>
                )}
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: '#9A9080', letterSpacing: '0.05em' }}>
            * Domingo e Segunda-feira: atendimento fechado. Agendamento via Booksy ou WhatsApp.
          </p>
        </div>
      </section>

      {/* JEFFERSON — SEÇÃO DESTAQUE */}
      <section id="jefferson-section" style={{ background: '#0D0D0D', padding: 0 }}>
        <div className="grid md:grid-cols-2" style={{ minHeight: 600 }}>
          {/* FOTO EFEITO PREMIUM */}
          <div className="jefferson-photo-wrap" style={{ minHeight: 500, position: 'relative' }}>
            <img src={jeffersonImage} alt="Jefferson — Master Barber Trend Blade"
                 style={{ minHeight: 500 }}
                 onError={(e) => {
                   e.target.style.display = 'none'
                   e.target.parentElement.style.background = 'linear-gradient(135deg,#1a1510,#2a2015)'
                   e.target.parentElement.style.minHeight = '500px'
                 }} />
            <div className="cinema-bar cinema-bar-top"></div>
            <div className="cinema-bar cinema-bar-bottom"></div>
            <div className="jeff-geo-line"></div>
            {/* Linha dourada horizontal na base */}
            <div style={{
              position: 'absolute', bottom: 52, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(to right, transparent, #C9A84C 30%, transparent)',
              zIndex: 6
            }}></div>
          </div>

          {/* TEXTO */}
          <div id="jefferson-section-text" className={`jeff-section-fade ${jeffVisible ? 'visible' : ''}`}
               style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3.5rem', background: '#1A1A1A' }}>
            <div className="section-tag-custom">O profissional por trás da arte</div>
            <div className="jeff-quote">
              Barbearia não é só corte de cabelo. É o lugar onde o homem cuida de si mesmo, com orgulho.
            </div>
            <div className="oswald text-xl font-semibold" style={{ color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Jefferson
            </div>
            <div className="barlow-c text-xs mt-1" style={{ letterSpacing: '0.25em', textTransform: 'uppercase', color: '#9A9080' }}>
              Fundador & Master Barber — Trend Blade Barbearia
            </div>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
              marginTop: '2.5rem', paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {[
                { label: 'Especialidade', val: 'Cortes Degradê & Barba' },
                { label: 'Localização', val: 'Guarulhos, SP' },
                { label: 'Agendamento', val: 'Booksy & WhatsApp' },
                { label: 'Atendimento', val: 'Terça → Sábado' },
              ].map((spec, i) => (
                <div key={i}>
                  <div className="barlow-c" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9A9080', marginBottom: '0.3rem' }}>
                    {spec.label}
                  </div>
                  <div className="oswald" style={{ fontSize: '0.95rem', color: '#F5F0E8' }}>{spec.val}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                 target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ fontSize: '0.8rem' }}>
                <Calendar className="h-4 w-4" /> Agendar
              </a>
              <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer"
                 className="btn-outline-gold" style={{ fontSize: '0.8rem' }}>
                <Phone className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COMODIDADES */}
      <section style={{ padding: '4rem 0', background: '#111', borderTop: '1px solid rgba(201,168,76,0.1)' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="section-tag-custom" style={{ textAlign: 'center' }}>Diferenciais</div>
          <div className="flex flex-wrap justify-center gap-10 mt-6">
            {[
              { icon: Wifi, text: 'Wi-Fi Gratuito' },
              { icon: CreditCard, text: 'Cartão de Crédito' },
              { icon: Scissors, text: 'Profissionais Especializados' },
              { icon: Star, text: '5.0 no Google' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3" style={{ color: '#9A9080', fontSize: '0.9rem' }}>
                <item.icon className="h-5 w-5" style={{ color: '#C9A84C' }} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section id="depoimentos" className="py-20" style={{ background: '#0D0D0D' }}>
        <div className="container mx-auto px-6">
          <div className="section-tag-custom">Clientes satisfeitos</div>
          <div className="section-title-custom">O que nossos <span>clientes</span> dizem</div>
          <div className="divider-gold"></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: '#1A1A1A',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 4,
                padding: '1.8rem 1.5rem'
              }}>
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-current" style={{ color: '#C9A84C' }} />
                  ))}
                </div>
                <div className="oswald text-base font-semibold mb-2" style={{ letterSpacing: '0.05em' }}>{t.name}</div>
                <p style={{ color: '#9A9080', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-20" style={{ background: '#111' }}>
        <div className="container mx-auto px-6">
          <div className="section-tag-custom">Fale conosco</div>
          <div className="section-title-custom">Entre em <span>Contato</span></div>
          <div className="divider-gold"></div>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Endereço', content: 'Av Papa Pio XII, nº 218\nGuarulhos, São Paulo' },
                { icon: Phone, title: 'WhatsApp', content: '(11) 95123-1443', href: 'https://wa.me/5511951231443' },
                { icon: Instagram, title: 'Instagram', content: '@trendbladebarbearia', href: 'https://instagram.com/trendbladebarbearia' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <item.icon className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#C9A84C' }} />
                  <div>
                    <div className="oswald font-semibold text-sm mb-1" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.title}</div>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                         style={{ color: '#9A9080', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                         onMouseEnter={e => e.target.style.color = '#C9A84C'}
                         onMouseLeave={e => e.target.style.color = '#9A9080'}>
                        {item.content}
                      </a>
                    ) : (
                      <p style={{ color: '#9A9080', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {/* HORÁRIOS NO CONTATO */}
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 mt-1 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <div>
                  <div className="oswald font-semibold text-sm mb-2" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Horário de Funcionamento</div>
                  <div style={{ color: '#9A9080', fontSize: '0.88rem', lineHeight: 2 }}>
                    <span style={{ color: 'rgba(139,26,26,0.9)' }}>Domingo — Fechado</span><br />
                    <span style={{ color: 'rgba(139,26,26,0.9)' }}>Segunda — Fechado</span><br />
                    Terça a Sexta — 09h às 19h<br />
                    Sábado — 08h às 17h
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="oswald text-xl font-semibold mb-6" style={{ color: '#C9A84C', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Agende seu Horário
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://booksy.com/pt-br/270879_trend-blade-barbearia_barbearias_931546_guarulhos#ba_s=seo"
                   target="_blank" rel="noopener noreferrer"
                   className="btn-gold" style={{ justifyContent: 'center' }}>
                  <Calendar className="h-4 w-4" /> Agendar pelo Booksy
                </a>
                <a href="https://wa.me/5511951231443" target="_blank" rel="noopener noreferrer"
                   className="btn-outline-gold" style={{ justifyContent: 'center' }}>
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              </div>
              <div style={{
                marginTop: '2rem', padding: '1.5rem',
                background: '#1A1A1A', borderRadius: 4,
                border: '1px solid rgba(201,168,76,0.15)'
              }}>
                <div className="oswald font-semibold mb-3" style={{ color: '#C9A84C', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Por que escolher a Trend Blade?
                </div>
                <ul style={{ color: '#9A9080', fontSize: '0.85rem', lineHeight: 2.2 }}>
                  {['Profissionais especializados e dedicados', 'Ambiente aconchegante e sofisticado',
                    'Técnicas modernas e tradicionais', 'Atendimento personalizado',
                    'Localização privilegiada em Guarulhos'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span style={{ color: '#C9A84C', fontSize: '0.7rem' }}>✦</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-custom py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImage} alt="Trend Blade Logo" className="h-9 w-auto" />
                <span className="oswald text-xl font-bold" style={{ color: '#C9A84C', letterSpacing: '0.08em' }}>
                  TREND <span style={{ color: '#fff' }}>BLADE</span>
                </span>
              </div>
              <p style={{ color: '#9A9080', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Barbearia premium em Guarulhos com foco em estilo, precisão e atendimento diferenciado.
              </p>
            </div>
            <div>
              <div className="footer-col-title">Contato</div>
              <div style={{ color: '#9A9080', fontSize: '0.85rem', lineHeight: 2.2 }}>
                <div>(11) 95123-1443</div>
                <div>@trendbladebarbearia</div>
                <div>Av Papa Pio XII, nº 218 · Guarulhos</div>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Horários</div>
              <div style={{ color: '#9A9080', fontSize: '0.85rem', lineHeight: 2.2 }}>
                <span style={{ color: 'rgba(139,26,26,0.8)' }}>Dom & Seg — Fechado</span><br />
                Ter a Sex — 09h às 19h<br />
                Sáb — 08h às 17h
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'rgba(154,144,128,0.5)'
          }}>
            <span>© 2025 Trend Blade Barbearia. Estilo e sofisticação em Guarulhos.</span>
            <span className="barlow-c" style={{
              fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.35)', border: '1px solid rgba(201,168,76,0.15)',
              padding: '0.25rem 0.7rem'
            }}>Homologação</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
