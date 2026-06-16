import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mockData } from "../data/mockData";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/animations/ScrollReveal";
import main_logo from "../assets/main_logo.png"
import { client } from "../sanity/client";
import { urlFor } from "../sanity/image";
import SEO from "../components/SEO";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Staggered character reveal
function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const chars = text.split("");
  return (
    <span className={className} aria-label={text}>
      {prefersReduced ? text : chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Typing effect hook
function useTypingEffect(text: string, startDelay: number, speed: number = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReduced) { setDisplayed(text); setDone(true); return; }
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [text, startDelay, speed]);

  return { displayed, done };
}


// Sonar pulse ring
function SonarButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className ?? ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      {!prefersReduced && (
        <motion.span
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ border: "2px solid #00B4D8" }}
          animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", repeatDelay: 0.5 }}
        />
      )}
    </motion.button>
  );
}

// Floating code fragment
function FloatingCode({ text, x, y, duration, delay }: { text: string; x: string; y: string; duration: number; delay: number }) {
  if (prefersReduced) return null;
  return (
    <motion.div
      className="absolute font-mono text-xs font-bold bg-slate-900 text-white px-2 py-1 pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -20, 5, -12, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: "easeInOut", repeatType: "mirror" }}
    >
      {text}
    </motion.div>
  );
}

export default function Home() {
  const { hero, about, domains, updates } = mockData.home;
  const subheadDelay = 0.3 + hero.title.length * 0.04 + 0.5 + 400;
  const { displayed, done } = useTypingEffect(hero.description, subheadDelay);

  const CHAR_COUNT = (hero.title + " " + hero.subtitle1 + " " + hero.subtitle2).length;
  const ctaDelay = 0.3 + CHAR_COUNT * 0.04 + 0.8;

  const [dynamicUpdates, setDynamicUpdates] = useState<any[]>(updates); // Fallback to mock data initially

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const rawData = await client.fetch(`*[_type in ["event", "post"]] | order(date desc)[0...3] {
          _id,
          _type,
          title,
          "slug": slug.current,
          desc,
          date,
          image
        }`);

        const combined = rawData.map((item: any) => ({
          ...item,
          type: item._type === 'post' ? 'blog' : 'event',
          cta: item._type === 'post' ? 'READ MORE' : 'RSVP NOW',
          image: item.image ? urlFor(item.image).url() : "https://via.placeholder.com/600x400?text=No+Image"
        }));

        if (combined.length > 0) {
          setDynamicUpdates(combined);
        }
      } catch (error) {
        console.error("Error fetching dynamic updates:", error);
      }
    };

    fetchUpdates();
  }, []);

  return (
    <div>
      <SEO 
        title="CODEX ITER | A Decade of Technical Culture" 
        description="Join the league of exceptional developers and help us build the next decade of engineering culture." 
      />
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b-4 border-slate-900 grid-pattern bg-background-light">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          <div className="relative z-10">
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-block bg-primary text-white px-4 py-1 font-bold mb-6 text-sm uppercase tracking-widest"
            >
              {hero.established}
            </motion.div>

            <h1 className="text-5xl md:text-[5.5rem] font-black leading-[0.9] text-slate-900 mb-6 font-display">
              <AnimatedHeading text={hero.title} />{" "}
              <br />
              <span className="text-primary italic">
                <AnimatedHeading text={hero.subtitle1} />
              </span>{" "}
              <br />
              <AnimatedHeading text={hero.subtitle2} />
            </h1>

            {/* Typing subheading */}
            <p className="text-xl md:text-xl font-medium text-slate-800 mb-10 max-w-lg border-l-4 border-primary pl-6 min-h-16">
              {displayed}
              {!done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="ml-0.5 inline-block w-0.5 h-5 bg-primary"
                />
              )}
            </p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: ctaDelay / 1000 }}
            >
              <motion.button className="bg-slate-900 text-white px-8 py-4 text-lg font-black border-2 border-slate-900 font-display tracking-widest cursor-pointer">
                {hero.exploreBtn}
              </motion.button>
              <SonarButton className="bg-white text-slate-900 px-8 py-4 text-lg font-black border-2 border-slate-900 font-display tracking-widest cursor-pointer">
                {hero.stackBtn}
              </SonarButton>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            className="relative h-[500px] w-full flex items-center justify-center"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-primary/10 border-4 border-slate-900 brutalist-shadow"
              animate={{ rotate: [3, 4, 3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 bg-white border-4 border-slate-900 brutalist-shadow -rotate-2 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 grid-pattern" />
              <div className="relative z-10 text-center">
                <img src={main_logo} alt="CODEX ITER Main Logo" className="h-60 w-60" />
                <div className="mt-4 font-mono text-slate-900 font-bold bg-background-light p-2 tracking-widest text-sm">
                  {hero.loadingText}
                </div>
              </div>

              {/* Floating code fragments */}
              <FloatingCode text={hero.codeFrag1} x="8%" y="10%" duration={7} delay={0} />
              <FloatingCode text={hero.codeFrag2} x="55%" y="85%" duration={9} delay={1.5} />
              <FloatingCode text="</>" x="70%" y="20%" duration={11} delay={0.8} />
              <FloatingCode text="{}" x="20%" y="65%" duration={8} delay={2} />
              <FloatingCode text="//" x="80%" y="55%" duration={10} delay={0.3} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            <ScrollReveal className="lg:col-span-5">
              <h2 className="text-5xl font-black text-slate-900 mb-8 uppercase font-display leading-[1.1]">
                {about.titlePart1} <br />
                {about.titlePart2} <span className="text-primary underline">{about.titleHighlight}</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-sans">
                <p>{about.desc1}</p>
                <p>{about.desc2}</p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="lg:col-span-7 grid grid-cols-2 gap-4">
              {about.stats.map((stat, i) => (
                <StaggerItem key={i} className={stat.span === 2 ? 'col-span-2' : ''}>
                  <div
                    className={`p-8 border-4 border-slate-900 brutalist-shadow h-full ${stat.span === 2
                      ? 'bg-slate-900 text-white'
                      : i === 0
                        ? 'bg-background-light'
                        : 'bg-primary text-white'
                      }`}
                  >
                    <div className={`text-5xl font-black mb-2 font-display ${i === 0 ? 'text-primary' : ''}`}>
                      {stat.value}
                    </div>
                    <div className={`font-bold uppercase tracking-wide text-sm ${i === 0 ? 'text-slate-900' : ''}`}>
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>


          </div>
        </div>
      </section>

      {/* ── DOMAINS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background-light border-b-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="flex items-end justify-between mb-16">
            <h2 className="text-5xl font-black text-slate-900 uppercase leading-none font-display">
              What We <br /><span className="text-primary">Master</span>
            </h2>
            <div className="hidden md:block text-right font-mono font-bold text-slate-900 opacity-60">
              // TECHNICAL SPECIALIZATIONS
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="bg-white border-4 border-slate-900 p-8 cursor-pointer"
                  whileHover={{ backgroundColor: "#0707f2", color: "#ffffff" }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="material-symbols-outlined text-5xl mb-6 text-primary block" style={{ transition: "color 0.2s" }}>
                    {domain.icon}
                  </span>
                  <h3 className="text-2xl font-black mb-4 uppercase font-display">{domain.title}</h3>
                  <p className="font-medium opacity-80 text-sm leading-relaxed">{domain.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── LATEST UPDATES ──────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden border-b-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-5xl font-black text-slate-900 mb-16 text-center uppercase font-display">
              Pulse of the <span className="bg-primary text-white px-4 inline-block transform -rotate-2">Club</span>
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-3 gap-10">
            {dynamicUpdates.map((item, i) => (
              <StaggerItem key={item._id || i}>
                <Link
                  to={item.type === 'blog' ? `/blogs/${item.slug}` : '/events'}
                  className="group h-full flex flex-col bg-white border-4 border-slate-900 brutalist-shadow-hover transition-all duration-300"
                >
                  <div className="h-64 bg-slate-200 overflow-hidden relative border-b-4 border-slate-900 shrink-0">
                    <img
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                      src={item.image}
                    />
                    <div className={`absolute top-4 left-4 text-white px-3 py-1 font-bold text-sm tracking-wider uppercase ${item.type === 'blog' ? 'bg-primary' : 'bg-slate-900'}`}>
                      {item.type}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col grow">
                    <div className="text-sm font-bold text-primary mb-2 tracking-wide">
                      {item.type === 'event' ? new Date(item.date).toLocaleDateString() : new Date(item.date).toLocaleDateString()}
                    </div>
                    <h4 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors font-display line-clamp-3">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 mb-6 font-medium text-sm leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 font-black uppercase text-sm border-b-2 border-slate-900 pb-1 group-hover:text-primary group-hover:border-primary transition-colors">
                        {item.cta} <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="bg-primary py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase leading-none italic font-display">Are You Next?</h2>
            <p className="text-2xl font-bold text-white/90 mb-12 max-w-2xl mx-auto">
              Join the league of exceptional developers and help us build the next decade of engineering culture.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <SonarButton
                onClick={() => window.open("https://whatsapp.com/channel/0029Vb7SavAElagvuWq2i10a", "_blank")}
                className="bg-white text-slate-900 px-12 py-6 text-xl md:text-2xl font-black border-4 border-slate-900 w-full md:w-auto font-display tracking-widest uppercase cursor-pointer"
              >
                JOIN OUR CHANNEL
              </SonarButton>
              <motion.button
                onClick={() => window.open("mailto:codexiter@gmail.com", "_blank")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-slate-900 text-white px-12 py-6 text-xl md:text-2xl font-black border-4 border-slate-900 w-full md:w-auto font-display tracking-widest uppercase cursor-pointer"
              >
                PARTNER WITH US
              </motion.button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
