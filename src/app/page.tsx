"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { useLanguage, Language } from "@/context/LanguageContext";

const GlobeMap = dynamic(() => import('@/components/GlobeMap'), { 
  ssr: false,
  loading: () => <div className="w-full h-[550px] flex items-center justify-center text-cobalt font-mono text-xs animate-pulse">CARREGANDO SISTEMA GLOBAL...</div>
});

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000 };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number;
      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2;
      }
      update(w: number, h: number) {
        const depthScale = 0.5 + (this.size / 2);
        
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.x -= dx * force * 0.03 * depthScale;
          this.y -= dy * force * 0.03 * depthScale;
        }

        this.x += this.vx * depthScale; 
        this.y += this.vy * depthScale;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw(ctx: CanvasRenderingContext2D) {
        const opacity = 0.4 + (this.size / 4);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(46, 91, 255, ${opacity})`; 
        ctx.shadowBlur = this.size * 5;
        ctx.shadowColor = "#2E5BFF";
        ctx.fill();
        
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(46, 91, 255, 0.08)";
          ctx.fill();
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const count = window.innerWidth < 768 ? 40 : 80;
      for (let i = 0; i < count; i++) particles.push(new Particle(canvas.width, canvas.height));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const connectionDist = 150;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          if (Math.abs(dx) < connectionDist && Math.abs(dy) < connectionDist) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(46, 91, 255, ${0.2 * (1 - dist / connectionDist)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none" />;
};

/* ═══════════════════════════════════════════
   MODULAR COMPONENTS
   ═══════════════════════════════════════════ */

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const langNames = {
    pt: "Português",
    en: "English",
    fr: "Français"
  };

  const navItems = [
    { key: "nav.home", href: "#hero" },
    { key: "nav.solutions", href: "#serviços" },
    { key: "nav.about", href: "#sobre" },
    { key: "nav.resources", href: "#sectores" },
    { key: "nav.contact", href: "#contacto" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 md:px-16 py-4 md:py-8 bg-black/40 backdrop-blur-3xl border-b border-white/5 transition-all">
      <a href="#hero" className="flex items-center gap-2 md:gap-6 no-underline group">
        <div 
          className="relative w-12 h-12 md:w-20 md:h-20 group-hover:scale-105 transition-transform bg-gradient-to-br from-cobalt to-cyan-400"
          style={{ maskImage: "url(/logo.png)", maskSize: "contain", maskRepeat: "no-repeat", WebkitMaskImage: "url(/logo.png)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }}
        />
        <div className="flex flex-col">
          <span className="font-display font-bold text-xl md:text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cobalt-light to-white">Aethris Tech</span>
        </div>
      </a>
      
      <div className="flex items-center gap-2 md:gap-6">
        <ul className="hidden lg:flex gap-10 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.key}>
              <a href={item.href} className="font-ui text-[11px] font-bold tracking-[0.1em] uppercase text-white/60 no-underline hover:text-white transition-colors relative group">
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cobalt transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Premium Language Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
            className="flex items-center gap-1.5 font-ui text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase border border-white/10 text-white/80 px-2.5 py-1.5 md:px-4 md:py-2 rounded-sm bg-white/5 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
          >
            <i className="ti ti-world text-xs md:text-sm text-cobalt" />
            <span>{language.toUpperCase()}</span>
            <i className={`ti ti-chevron-down text-[8px] md:text-[9px] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 md:w-36 bg-black/90 border border-white/10 backdrop-blur-2xl rounded-sm shadow-2xl p-1 z-50 flex flex-col gap-1">
              {(['pt', 'en', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`w-full text-left font-ui text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 md:px-4 md:py-2 rounded-sm transition-all ${
                    language === lang 
                      ? 'bg-cobalt text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {langNames[lang]}
                </button>
              ))}
            </div>
          )}
        </div>

        <a href="https://wa.me/244942766486" className="font-ui text-[9px] md:text-[11px] font-bold tracking-[0.1em] uppercase border border-white/20 text-white px-3.5 py-2 md:px-8 md:py-3 rounded-sm hover:bg-white hover:text-black transition-all backdrop-blur-md whitespace-nowrap">
          {t("nav.cta")}
        </a>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-start justify-center text-left px-6 md:px-16 pt-32 pb-16 bg-aether-grid overflow-hidden">
      <ParticleBackground />
      <div className="bg-orb-cobalt -top-20 -left-20 opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="bg-orb-cyan bottom-0 -right-20 opacity-30" />
      
      <div className="reveal flex items-center gap-3 text-white font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-8 z-10">
        <div className="w-10 h-[1px] bg-cobalt shadow-[0_0_10px_rgba(46,91,255,0.5)]" />
        {t("hero.badge")}
      </div>
      <h1 className="reveal font-display text-[6vw] lg:text-[7rem] font-medium leading-[1.1] tracking-tight text-white mb-8 z-10 text-left w-full max-w-7xl">
        {t("hero.title1")}<br />
        {t("hero.title2")} <span className="text-cobalt italic glow-text-cobalt">{t("hero.title3")}</span>
      </h1>
      <p className="reveal font-body text-lg md:text-xl text-white/60 font-normal max-w-2xl mb-12 z-10 text-left w-full self-start">
        {t("hero.desc")}
      </p>
      <div className="reveal flex gap-6 z-10 w-full max-w-7xl">
        <a href="#serviços" className="font-ui text-[12px] font-bold tracking-[0.12em] uppercase bg-cobalt text-white px-10 py-4 rounded-sm hover:bg-cobalt-dark transition-all shadow-lg shadow-cobalt/40">
          {t("hero.cta1")}
        </a>
        <a href="#sobre" className="font-ui text-[12px] font-bold tracking-[0.12em] uppercase text-white/80 px-10 py-4 rounded-sm hover:text-white transition-all flex items-center gap-2">
          {t("hero.cta2")} <i className="ti ti-chevron-right text-xs" />
        </a>
      </div>

      {/* Hero Footer Stats */}
      <div className="reveal mt-auto w-full max-w-7xl flex flex-col md:flex-row items-end justify-end gap-10 z-10 pb-10">
        <div className="glass-card p-8 flex gap-12 border-white/10 rounded-sm">
          <div className="text-left">
            <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("hero.stat1.title")}</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-white tracking-tight uppercase">{t("hero.stat1.val")}</span>
              <span className="font-ui text-[10px] text-emerald-400 font-bold">SENTINELA</span>
            </div>
          </div>
          <div className="text-left">
            <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("hero.stat2.title")}</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-white tracking-tight uppercase">{t("hero.stat2.val")}</span>
              <span className="font-ui text-[10px] text-cobalt font-bold">GLOBAL</span>
            </div>
          </div>
        </div>
      </div>
      <div className="reveal absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{t("hero.scroll")}</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cobalt to-transparent animate-pulse" />
      </div>
    </section>
  );
};

const About = () => {
  const { t } = useLanguage();

  const stats = [
    { num: "SOC", label: t("about.stat.soc.desc") },
    { num: "AI", label: t("about.stat.ai.desc") },
    { num: "24/7", label: t("about.stat.monitoring.desc") },
    { num: "AO", label: t("about.stat.location.desc") }
  ];

  return (
    <section id="sobre" className="py-24 md:py-32 px-6 md:px-16 bg-black-deep text-silver-light content-visibility-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        <div>
          <div className="reveal flex items-center gap-3 text-white/60 font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-6">
            <div className="w-8 h-[1px] bg-cobalt" />
            {t("about.badge")}
          </div>
          <h2 className="reveal font-display text-5xl md:text-8xl font-light leading-[1.05] text-white mb-8">
            {t("about.title1")}<br /><span className="italic text-black">{t("about.title2")}</span>
          </h2>
          <p className="reveal font-body text-lg text-white/80 leading-relaxed font-normal max-w-xl">
            {t("about.desc")}
          </p>
          <div className="reveal mt-10 p-8 border border-white/20 rounded-sm bg-white/5 shadow-sm">
            <p className="font-display text-2xl md:text-3xl italic text-white leading-relaxed">
              &ldquo;{t("about.quote")}&rdquo;
            </p>
            <cite className="block mt-6 font-ui text-[11px] font-bold uppercase tracking-widest text-silver-light not-italic">— {t("about.quote.cite")}</cite>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[1px] bg-white/10 border border-white/10 p-[1px]">
          {stats.map((stat) => (
            <div key={stat.label} className="reveal bg-black-deep p-10 text-center">
              <span className="font-display text-6xl font-light text-white block mb-2">{stat.num}</span>
              <span className="font-ui text-[11px] font-bold uppercase tracking-widest text-white">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Mission = () => {
  const { t } = useLanguage();

  const missionItems = [
    { id: "01", title: t("mission.item1.title"), desc: t("mission.item1.desc") },
    { id: "02", title: t("mission.item2.title"), desc: t("mission.item2.desc") },
    { id: "03", title: t("mission.item3.title"), desc: t("mission.item3.desc") }
  ];

  const values = [
    t("val.innovation"),
    t("val.integrity"),
    t("val.excellence"),
    t("val.collaboration"),
    t("val.transparency"),
    t("val.responsibility"),
    t("val.continuous"),
    t("val.real_impact")
  ];

  return (
    <section id="missão" className="py-24 md:py-32 px-6 md:px-16 bg-black content-visibility-auto">
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex items-center gap-3 text-white/60 font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-6">
          <div className="w-8 h-[1px] bg-cobalt" />
          {t("mission.badge")}
        </div>
        <h2 className="reveal font-display text-5xl md:text-8xl font-light leading-[1.05] text-white mb-16">
          {t("mission.title1")}<br /><span className="italic text-cobalt">{t("mission.title2")}</span>
        </h2>
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/5 border border-white/5">
          {missionItems.map((item) => (
            <div key={item.id} className="bg-black-light p-16 hover:bg-black transition-colors group border border-white/5">
              <div className="font-display text-9xl font-bold text-white/5 leading-none mb-8 group-hover:text-cobalt/20 transition-colors">{item.id}</div>
              <h3 className="font-ui text-lg font-bold uppercase tracking-[0.2em] text-white mb-6 group-hover:text-cobalt transition-colors">{item.title}</h3>
              <p className="font-body text-lg text-white/60 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-16 p-12 border border-white/10 rounded-sm bg-white/5 backdrop-blur-sm">
          <div className="font-ui text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-10">{t("mission.values.title")}</div>
          <div className="flex flex-wrap gap-4">
            {values.map((val) => (
              <span key={val} className="font-ui text-xs font-extrabold uppercase tracking-[0.2em] px-8 py-4 border border-white/20 text-white/80 hover:bg-cobalt hover:border-cobalt hover:text-white transition-all cursor-default shadow-sm">
                {val}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { t } = useLanguage();

  const servicesList = [
    { title: t("services.item1.title"), desc: t("services.item1.desc"), icon: "ti-shield-check" },
    { title: t("services.item2.title"), desc: t("services.item2.desc"), icon: "ti-users" },
    { title: t("services.item3.title"), desc: t("services.item3.desc"), icon: "ti-lock" },
    { title: t("services.item4.title"), desc: t("services.item4.desc"), icon: "ti-cloud" },
    { title: t("services.item5.title"), desc: t("services.item5.desc"), icon: "ti-code" },
    { title: t("services.item6.title"), desc: t("services.item6.desc"), icon: "ti-bolt" }
  ];

  return (
    <section id="serviços" className="relative py-24 md:py-32 px-6 md:px-16 bg-black-deep overflow-hidden content-visibility-auto">
      <div className="bg-orb-cobalt top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
      <div className="max-w-7xl mx-auto">
        <div className="reveal text-center mb-20">
          <p className="font-ui text-[11px] font-bold tracking-[0.3em] uppercase text-cobalt mb-4">{t("services.badge")}</p>
          <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">
            {t("services.title1")}<br />com <span className="text-cobalt italic">{t("services.title2")}</span>
          </h2>
        </div>
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesList.map((srv) => (
            <div key={srv.title} className="glass-card p-10 group relative border-white/5 rounded-lg overflow-hidden hover:border-cobalt/40 transition-all">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded flex items-center justify-center mb-8 group-hover:bg-cobalt/20 group-hover:border-cobalt transition-all">
                <i className={`ti ${srv.icon} text-2xl text-white/60 group-hover:text-cobalt`} />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-4">{srv.title}</h3>
              <p className="font-body text-sm text-white/40 leading-relaxed">{srv.desc}</p>
              <div className="absolute top-2 right-2 opacity-20 text-xs text-white/40 group-hover:text-cobalt group-hover:opacity-100 transition-all">↗</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const { t } = useLanguage();

  const statsItems = [
    { val: "100%", label: t("stats.item1.label") },
    { val: t("stats.item2.val"), label: t("stats.item2.label") },
    { val: "24/7", label: t("stats.item3.label") },
    { val: t("stats.item4.val"), label: t("stats.item4.label") }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 bg-black content-visibility-auto">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 text-left">
          <p className="font-ui text-[11px] font-bold tracking-[0.3em] uppercase text-cobalt mb-6">{t("stats.badge")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-16">
            {t("stats.title1")}<br /><span className="text-cobalt italic">{t("stats.title2")}</span>
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {statsItems.map((stat) => (
              <div key={stat.label} className="glass-card p-8 border-white/5 rounded-lg">
                <div className="font-display text-3xl font-bold text-white mb-2">{stat.val}</div>
                <div className="font-body text-xs text-white/40 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-cobalt/20 blur-[120px] rounded-full scale-75" />
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] border border-cobalt/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[140%] h-[140%] border border-white/5 rounded-full animate-[spin_35s_linear_infinite_reverse]" />
            <div className="relative w-[300px] h-[350px] bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md border border-white/20 rounded-2xl p-1 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cobalt shadow-[0_0_15px_rgba(46,91,255,0.8)] z-20 animate-[scan_3s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-br from-cobalt/40 via-transparent to-cyan/40 opacity-50" />
              <div className="w-full h-full border border-white/10 rounded-xl flex flex-col items-center justify-center gap-8 bg-black/40 relative z-10">
                <i className="ti ti-shield-check text-[120px] text-white glow-text-cobalt" />
                <div className="w-16 h-1 bg-cobalt shadow-[0_0_15px_rgba(46,91,255,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 bg-black-deep relative overflow-hidden content-visibility-auto">
      <div className="bg-orb-cobalt top-0 right-0 opacity-20" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 text-left z-10">
          <p className="font-ui text-[11px] font-bold tracking-[0.3em] uppercase text-cobalt mb-6">{t("map.badge")}</p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-10">
            {t("map.title1")}<br />{t("map.title2")} <span className="text-cobalt italic">{t("map.title3")}</span>
          </h2>
          <p className="font-body text-lg text-white/60 mb-12 max-w-lg">
            {t("map.desc")}
          </p>
          <ul className="space-y-6">
            {[t("map.point1"), t("map.point2"), t("map.point3")].map((item) => (
              <li key={item} className="flex items-center gap-4 text-white/80 font-ui text-xs font-bold uppercase tracking-widest">
                <div className="w-5 h-5 rounded-full border border-cobalt flex items-center justify-center bg-cobalt/20">
                  <i className="ti ti-check text-xs text-cobalt" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
          <GlobeMap />
          
          <div className="absolute bottom-10 right-10 glass-card p-6 border-white/10 rounded-sm z-20 animate-flicker">
            <p className="font-ui text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">{t("map.status.title")}</p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-white tracking-tight uppercase">{t("map.status.val")}</span>
              <span className="font-ui text-[10px] text-emerald-400 font-bold">100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Sectors = () => {
  const { t } = useLanguage();

  const sectorsList = [
    { id: "01", title: t("sectors.item1.title"), desc: t("sectors.item1.desc") },
    { id: "02", title: t("sectors.item2.title"), desc: t("sectors.item2.desc") },
    { id: "03", title: t("sectors.item3.title"), desc: t("sectors.item3.desc") },
    { id: "04", title: t("sectors.item4.title"), desc: t("sectors.item4.desc") },
    { id: "05", title: t("sectors.item5.title"), desc: t("sectors.item5.desc") },
    { id: "06", title: t("sectors.item6.title"), desc: t("sectors.item6.desc") }
  ];

  return (
    <section id="sectores" className="py-24 md:py-32 px-6 md:px-16 bg-black-deep content-visibility-auto">
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex items-center gap-3 text-black font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-6">
          <div className="w-8 h-[1px] bg-cobalt" />
          {t("sectors.badge")}
        </div>
        <h2 className="reveal font-display text-5xl md:text-8xl font-light leading-[1.05] text-silver-lightest mb-16">
          {t("sectors.title1")}<br /><span className="italic text-black">{t("sectors.title2")}</span>
        </h2>
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
          {sectorsList.map((sec) => (
            <div key={sec.id} className="bg-black-deep p-12 hover:bg-black-light border border-transparent hover:border-white/10 transition-all">
              <span className="font-display text-sm text-white/20 block mb-4 tracking-widest">{sec.id}</span>
              <h3 className="font-ui text-xs font-bold uppercase tracking-[0.15em] text-white mb-4">{sec.title}</h3>
              <p className="font-body text-sm text-white/60 leading-relaxed font-light">{sec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  const { t } = useLanguage();

  const productsList = [
    { title: "Sentinela AI", desc: t("products.item1.desc"), status: "Beta" },
    { title: "CYSA - Cyber Security & Assurance", desc: t("products.item2.desc"), status: t("products.coming") }
  ];

  return (
    <section id="produtos" className="relative py-24 md:py-32 px-6 md:px-16 bg-black overflow-hidden">
      <div className="bg-orb-cobalt -bottom-20 -left-20 opacity-30" />
      <div className="bg-orb-cyan top-0 -right-20 opacity-20" />
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex items-center gap-3 text-white/60 font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-6">
          <div className="w-8 h-[1px] bg-cobalt" />
          {t("products.badge")}
        </div>
        <h2 className="reveal font-display text-5xl md:text-8xl font-light leading-[1.05] text-white mb-16">
          {t("products.title1")}<br /><span className="italic text-cobalt">{t("products.title2")}</span>
        </h2>
        <div className="reveal grid grid-cols-1 md:grid-cols-2 gap-12">
          {productsList.map((prod) => (
            <div key={prod.title} className="group glass-card p-12 rounded-sm relative overflow-hidden transition-all hover:border-cobalt/50 shadow-2xl">
              <div className="flex justify-between items-start mb-8">
                <span className="font-ui text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-cobalt text-white shadow-[0_0_15px_rgba(46,91,255,0.4)]">{prod.status}</span>
                <i className="ti ti-arrow-up-right text-3xl opacity-0 group-hover:opacity-100 text-cobalt transition-all translate-y-2 group-hover:translate-y-0" />
              </div>
              <h3 className="font-display text-4xl font-medium mb-6 text-white group-hover:text-cobalt transition-colors duration-500">{prod.title}</h3>
              <p className="font-body text-lg text-white/60 leading-relaxed opacity-80 group-hover:text-white/80 transition-colors">{prod.desc}</p>
              <div className="mt-10 h-[1px] w-full bg-white/5 group-hover:bg-gradient-to-r group-hover:from-cobalt group-hover:to-transparent" />
            </div>
          ))}
        </div>
        <div className="reveal mt-16 text-center">
          <p className="font-display italic text-2xl text-black">{t("products.footer")}</p>
        </div>
      </div>
    </section>
  );
};

const AdditionalServices = () => {
  const { t } = useLanguage();

  const addServicesList = [
    { icon: 'ti-world-www', title: t("add.item1.title"), desc: t("add.item1.desc") },
    { icon: 'ti-layout-dashboard', title: t("add.item2.title"), desc: t("add.item2.desc") },
    { icon: 'ti-device-mobile', title: t("add.item3.title"), desc: t("add.item3.desc") },
    { icon: 'ti-palette', title: t("add.item4.title"), desc: t("add.item4.desc") }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-16 bg-black/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="reveal mb-16">
          <p className="font-ui text-[11px] font-bold tracking-[0.3em] uppercase text-cyan mb-4">{t("add.badge")}</p>
          <h2 className="font-display text-4xl md:text-5xl text-white">{t("add.title1")} <span className="text-cyan italic">{t("add.title2")}</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {addServicesList.map((item, i) => (
            <div key={i} className="reveal glass-card p-8 border-white/5 hover:border-cyan/30 transition-all group">
              <div className="w-12 h-12 rounded-sm bg-cyan/10 flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition-colors">
                <i className={`ti ${item.icon} text-2xl text-cyan`} />
              </div>
              <h3 className="font-display text-lg text-white mb-4 uppercase tracking-wider">{item.title}</h3>
              <p className="font-body text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { t } = useLanguage();

  const contactItems = [
    { label: t("contact.item1.label"), val: "+244 942 766 486", icon: "ti-brand-whatsapp", link: "https://wa.me/244942766486", color: "hover:bg-emerald-500/10" },
    { label: t("contact.item2.label"), val: "Aethris Tech", icon: "ti-brand-linkedin", link: "https://linkedin.com/company/aethristech", color: "hover:bg-blue-500/10" },
    { label: t("contact.item3.label"), val: "@aethris_tech", icon: "ti-brand-instagram", link: "https://www.instagram.com/aethris_tech?igsh=Z29lZGd4MzNhcXh2", color: "hover:bg-pink-500/10" },
    { label: t("contact.item4.label"), val: "aethristech@gmail.com", icon: "ti-mail", link: "mailto:aethristech@gmail.com", color: "hover:bg-cobalt/10" },
    { label: t("contact.item5.label"), val: "Huíla, Angola", icon: "ti-map-pin", link: "#", color: "hover:bg-white/10" },
    { label: t("contact.item6.label"), val: t("contact.item6.val"), icon: "ti-headset", link: "https://wa.me/244942766486", color: "hover:bg-cyan/10" }
  ];

  return (
    <section id="contacto" className="py-24 md:py-32 px-6 md:px-16 bg-black-deep overflow-hidden relative content-visibility-auto">
      <div className="bg-orb-cobalt -bottom-64 -right-64 opacity-20" />
      <div className="max-w-7xl mx-auto">
        <div className="reveal flex items-center gap-3 text-white/60 font-ui text-[11px] font-bold tracking-[0.28em] uppercase mb-6">
          <div className="w-8 h-[1px] bg-cobalt" />
          {t("contact.badge")}
        </div>
        <h2 className="reveal font-display text-5xl md:text-8xl font-light leading-[1.05] text-white mb-16">
          {t("contact.title1")}<br /><span className="italic text-cobalt">{t("contact.title2")}</span>
        </h2>
        
        <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/5 border border-white/5">
          {contactItems.map((item) => (
            <a key={item.label} href={item.link} target="_blank" rel="noopener noreferrer" className={`flex flex-col p-12 bg-black-light/40 transition-all no-underline group border border-transparent ${item.color}`}>
              <div className="w-14 h-14 bg-white/5 rounded-sm flex items-center justify-center mb-8 group-hover:bg-cobalt transition-all duration-500">
                <i className={`ti ${item.icon} text-2xl text-white group-hover:scale-110 transition-transform`} />
              </div>
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">{item.label}</p>
              <p className="font-display text-xl text-white group-hover:text-cobalt transition-colors">{item.val}</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                {t("contact.connect")} <i className="ti ti-arrow-right text-xs" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black-deep py-12 px-6 md:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div 
            className="relative w-16 h-16 bg-gradient-to-br from-cobalt to-cyan-400"
            style={{ maskImage: "url(/logo.png)", maskSize: "contain", maskRepeat: "no-repeat", WebkitMaskImage: "url(/logo.png)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat" }}
          />
          <div className="flex flex-col">
            <div className="font-display font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cobalt-light to-white">Aethris Tech</div>
          </div>
        </div>
        <p className="font-display italic text-white text-lg">{t("footer.quote")}</p>
        <p className="font-body text-[11px] text-white/80 font-light tracking-wider">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
};

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-bg-aether antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Mission />
        <Services />
        <StatsSection />
        <MapSection />
        <Sectors />
        <Products />
        <AdditionalServices />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
