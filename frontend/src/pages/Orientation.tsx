import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/animations/ScrollReveal";
import codex from "../assets/codex_dark.png";
import codex_light from "../assets/code_light.png";
import SEO from "../components/SEO";

// ─── Reduced-motion guard (same pattern as existing pages) ───────────────────
const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ─── Staggered character reveal (reused from Home.tsx) ──────────────────────
function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const chars = text.split("");
  return (
    <span className={className} aria-label={text}>
      {prefersReduced
        ? text
        : chars.map((char, i) => (
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

// ─── Typing effect hook ──────────────────────────────────────────────────────
function useTypingEffect(text: string, startDelay: number, speed = 28) {
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

// ─── Sonar pulse button ──────────────────────────────────────────────────────
function SonarButton({
  children,
  className,
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const inner = (
    <>
      {children}
      {!prefersReduced && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ border: "2px solid #00B4D8" }}
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", repeatDelay: 0.5 }}
        />
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative ${className ?? ""}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`relative ${className ?? ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.button>
  );
}

// ─── Floating code fragment (same as Home.tsx) ───────────────────────────────
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

// ─── Orientation-specific Navbar ─────────────────────────────────────────────
function OrientationNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#domains", label: "Domains" },
    { href: "#timeline", label: "Timeline" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <motion.nav
      initial={prefersReduced ? {} : { y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      style={{
        backgroundColor: scrolled ? "rgba(3,4,94,0.95)" : undefined,
        backdropFilter: scrolled ? "blur(10px)" : undefined,
        transition: "background-color 300ms ease, backdrop-filter 300ms ease",
        willChange: "transform",
      }}
      className={`sticky top-0 z-50 border-b-4 border-slate-900 px-6 py-4 ${scrolled ? "" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="p-1">
            {scrolled
              ? <img src={codex_light} alt="CODEX ITER Logo" className="h-10 w-9" />
              : <img src={codex} alt="CODEX ITER Logo" className="h-10 w-9" />}
          </div>
          <span className={`text-2xl font-black tracking-tighter transition-colors ${scrolled ? "text-white" : "text-slate-900"}`}>
            CODEX ITER
          </span>
        </a>

        {/* Desktop links */}
        <motion.div
          className="hidden md:flex items-center gap-10"
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={prefersReduced ? {} : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
            >
              <a
                href={link.href}
                className={`font-bold transition-colors relative py-1 group ${
                  scrolled ? "text-white hover:text-[#00B4D8]" : "text-slate-900 hover:text-primary"
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-200" />
              </a>
            </motion.div>
          ))}

          <motion.a
            href="#register"
            initial={prefersReduced ? {} : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-primary text-white px-6 py-2 font-bold brutalist-shadow border-2 border-slate-900 transition-colors hover:bg-white hover:text-slate-900 cursor-pointer"
          >
            Register Now
          </motion.a>
        </motion.div>

        {/* Hamburger */}
        <button
          id="orientation-menu-toggle"
          className={`md:hidden flex items-center justify-center cursor-pointer transition-colors ${
            scrolled ? "text-white" : "text-slate-900"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <div className={`mt-4 pt-4 border-t-4 border-slate-900 flex flex-col gap-4 ${scrolled ? "border-white/20" : ""}`}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-bold hover:text-primary transition-colors px-2 py-1 ${
                    scrolled ? "text-white" : "text-slate-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#register"
                onClick={() => setMenuOpen(false)}
                className="bg-primary text-white px-6 py-3 font-bold brutalist-shadow border-2 border-slate-900 transition-all hover:bg-white hover:text-slate-900 w-full mt-2 text-center"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border-4 border-slate-900 brutalist-shadow bg-white cursor-pointer"
      whileHover={prefersReduced ? {} : { x: -2, y: -2, boxShadow: "6px 6px 0px 0px #03045E" }}
      transition={{ duration: 0.15 }}
      onClick={() => setOpen(!open)}
      role="button"
      aria-expanded={open}
      id={`faq-item-${index}`}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-mono text-sm font-bold text-primary shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide leading-tight">
            {question}
          </h3>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="material-symbols-outlined text-primary shrink-0 text-2xl"
        >
          add
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t-4 border-slate-900">
              <p className="text-slate-700 font-medium leading-relaxed pt-4 text-base">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DOMAINS = [
  {
    icon: "code_blocks",
    title: "Web & Systems",
    desc: "From responsive frontends to scalable cloud-native backends — build real products that ship.",
  },
  {
    icon: "neurology",
    title: "AI & Machine Learning",
    desc: "Work on neural architectures, NLP pipelines, and predictive models that solve real problems.",
  },
  {
    icon: "calculate",
    title: "Competitive Programming",
    desc: "Master data structures, algorithms, and graph theory to dominate on ICPC and Codeforces.",
  },
  {
    icon: "brush",
    title: "UI/UX & Product Design",
    desc: "Craft interfaces and experiences with Figma, design systems, and user research principles.",
  },
];

const STATS = [
  { value: "50+", label: "Active Projects & Mentorships", bg: "bg-background-light", valueCls: "text-primary", labelCls: "text-slate-900", span: 1 },
  { value: "150+", label: "Flagship Hackathons Won", bg: "bg-primary", valueCls: "text-white", labelCls: "text-white/90", span: 1 },
  { value: "1,000,000+", label: "Lines of Open Source Code", bg: "bg-slate-900", valueCls: "text-white", labelCls: "text-white/80", span: 2 },
];

const TIMELINE = [
  {
    phase: "01",
    title: "Applications Open",
    date: "Sep 15 – Oct 05, 2026",
    desc: "Fill out the recruitment form online. Tell us about yourself, your interests, and any projects you've worked on. No GPA cutoff — we hire on curiosity.",
    icon: "edit_note",
    color: "bg-background-light",
    accent: "text-primary",
  },
  {
    phase: "02",
    title: "Orientation & Info Session",
    date: "Oct 08, 2026",
    desc: "Attend our in-person orientation session. Meet current members, tour the lab, ask questions, and understand what each domain works on day-to-day.",
    icon: "groups",
    color: "bg-primary",
    accent: "text-white",
  },
  {
    phase: "03",
    title: "Technical Tasks",
    date: "Oct 10 – Oct 17, 2026",
    desc: "Complete a short domain-specific task designed to be educational, not eliminatory. There's no single right answer — we're looking for how you think.",
    icon: "terminal",
    color: "bg-background-light",
    accent: "text-primary",
  },
  {
    phase: "04",
    title: "Induction",
    date: "Oct 22, 2026",
    desc: "Successful candidates are welcomed into CODEX ITER. You'll be matched with a mentor, onboarded to an active project, and join the family.",
    icon: "verified",
    color: "bg-slate-900",
    accent: "text-white",
  },
];

const FAQS = [
  {
    question: "Do I need prior coding experience to apply?",
    answer:
      "No prior experience is required for most of our wings. We value curiosity and a willingness to learn over existing skill level. That said, competitive programming and AI/ML wings may expect some foundational comfort with programming logic. Our orientation session will help you find the right fit.",
  },
  {
    question: "What is the expected time commitment?",
    answer:
      "Most members dedicate 6–10 hours per week on average. This includes weekly domain meetings, project work, and optional workshops or events. During hackathon season it may be more — but it's always opt-in based on your bandwidth.",
  },
  {
    question: "Can students from all branches apply?",
    answer:
      "Absolutely. CODEX ITER is open to all undergraduate students of ITER, regardless of branch. We have members from CSE, ECE, Mechanical, Civil, and beyond. Diverse perspectives make our work stronger.",
  },
  {
    question: "Will I work on real projects or just learn theory?",
    answer:
      "Real projects, always. From day one you'll be contributing to active repositories, collaborating with seniors, and shipping work that may go live on our platform or in partner organizations. Theory is delivered through workshops alongside hands-on execution.",
  },
  {
    question: "Is there a fee to join CODEX ITER?",
    answer:
      "There is no fee to apply or join. CODEX ITER is a student-run, merit-based organization. Events and workshops hosted throughout the year are free for all members.",
  },
  {
    question: "What happens after I complete the technical task?",
    answer:
      "All submitted tasks are reviewed by domain leads within 3–5 days. Every applicant receives feedback regardless of outcome. Selected candidates are invited to an informal conversation before the final induction announcement.",
  },
];

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function Orientation() {
  const HERO_TITLE = "BUILD THE FUTURE:";
  const HERO_SUB1 = "RECRUITMENT";
  const HERO_SUB2 = "2026";

  const subheadDelay = 0.3 + HERO_TITLE.length * 0.04 + 0.5 + 400;
  const { displayed, done } = useTypingEffect(
    "Welcome freshmen and sophomore developers. Join a powerhouse of technical innovation.",
    subheadDelay
  );

  const CHAR_COUNT = (HERO_TITLE + " " + HERO_SUB1 + " " + HERO_SUB2).length;
  const ctaDelay = 0.3 + CHAR_COUNT * 0.04 + 0.8;

  return (
    <div>
      <SEO
        title="CODEX ITER | Recruitment 2026 — Orientation Portal"
        description="Apply to join CODEX ITER Intake 2026. Explore our domains, track the recruitment roadmap, and register for the orientation session."
        keywords="CODEX ITER recruitment 2026, orientation, join coding club, ITER Bhubaneswar"
      />

      {/* ── ORIENTATION NAVBAR ──────────────────────────────────────── */}
      <OrientationNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b-4 border-slate-900 grid-pattern bg-background-light">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          {/* Left: copy */}
          <div className="relative z-10">
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-block bg-primary text-white px-4 py-1 font-bold mb-6 text-sm uppercase tracking-widest font-mono"
            >
              RECRUITMENT // INTAKE 2026
            </motion.div>

            <h1 className="text-5xl md:text-[5rem] font-black leading-[0.9] text-slate-900 mb-6 font-display">
              <AnimatedHeading text={HERO_TITLE} />
              {" "}<br />
              <span className="text-primary italic">
                <AnimatedHeading text={HERO_SUB1} />
              </span>{" "}
              <br />
              <AnimatedHeading text={HERO_SUB2} />
            </h1>

            {/* Typing subheading */}
            <p className="text-xl font-medium text-slate-800 mb-10 max-w-lg border-l-4 border-primary pl-6 min-h-16">
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
              <SonarButton
                href="#register"
                className="bg-primary text-white px-8 py-4 text-lg font-black border-2 border-slate-900 font-display tracking-widest cursor-pointer uppercase inline-block text-center"
              >
                Register Now
              </SonarButton>
              <motion.a
                href="#timeline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-slate-900 text-white px-8 py-4 text-lg font-black border-2 border-slate-900 font-display tracking-widest cursor-pointer uppercase"
              >
                View Timeline
              </motion.a>
            </motion.div>
          </div>

          {/* Right: neo-brutalist terminal card */}
          <motion.div
            className="relative h-[500px] w-full flex items-center justify-center"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tilted background layer */}
            <motion.div
              className="absolute inset-0 bg-primary/10 border-4 border-slate-900 brutalist-shadow"
              animate={{ rotate: [3, 4, 3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Terminal card */}
            <div className="absolute inset-0 bg-slate-900 border-4 border-slate-900 brutalist-shadow -rotate-2 flex flex-col overflow-hidden">
              {/* Terminal chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-slate-700 bg-slate-800 shrink-0">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                <span className="ml-3 font-mono text-xs text-slate-400 tracking-widest">codex_recruit.sh</span>
              </div>
              {/* Terminal body */}
              <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden">
                <div className="text-slate-500 mb-2">// CODEX ITER — Intake 2026</div>
                <div className="text-primary mb-1">$ ./begin_recruitment.sh</div>
                <div className="text-green-400 mb-4">▶ Initializing recruitment sequence...</div>

                <div className="text-slate-300 mb-1">
                  <span className="text-yellow-400">while</span>
                  <span className="text-white">(curious) {"{"}</span>
                </div>
                <div className="text-slate-300 pl-6 mb-1">
                  <span className="text-[#00B4D8]">code</span>
                  <span className="text-white">();</span>
                </div>
                <div className="text-slate-300 pl-6 mb-1">
                  <span className="text-[#00B4D8]">innovate</span>
                  <span className="text-white">();</span>
                </div>
                <div className="text-slate-300 pl-6 mb-1">
                  <span className="text-[#00B4D8]">collaborate</span>
                  <span className="text-white">();</span>
                </div>
                <div className="text-white mb-4">{"}"}</div>

                <div className="text-slate-500 mb-1">// Domains accepting applications:</div>
                <div className="text-slate-300 mb-1">
                  <span className="text-primary">const</span> domains = [
                </div>
                {["\"Web & Systems\"", "\"AI / ML\"", "\"Competitive Programming\"", "\"UI/UX Design\""].map((d, i) => (
                  <div key={i} className="text-green-400 pl-6">{d},</div>
                ))}
                <div className="text-slate-300 mb-4">];</div>

                <motion.div
                  className="flex items-center gap-2"
                  animate={prefersReduced ? {} : { opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <span className="text-primary">$</span>
                  <span className="text-white">apply --intake=2026</span>
                  <span className="w-2 h-4 bg-primary inline-block" />
                </motion.div>
              </div>

              {/* Floating code fragments */}
              <FloatingCode text="const codex = true;" x="8%" y="10%" duration={7} delay={0} />
              <FloatingCode text="while(alive) { code(); }" x="40%" y="88%" duration={9} delay={1.5} />
              <FloatingCode text="</>" x="72%" y="18%" duration={11} delay={0.8} />
              <FloatingCode text="{{}}" x="18%" y="70%" duration={8} delay={2} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-b-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            <ScrollReveal className="lg:col-span-5">
              <h2 className="text-5xl font-black text-slate-900 mb-8 uppercase font-display leading-[1.1]">
                A Community<br />
                Built on <span className="text-primary underline">Results</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-sans">
                <p>
                  CODEX ITER isn't just a club — it's an ecosystem. In ten years we've launched startups, won national hackathons, and shipped open-source projects used by thousands.
                </p>
                <p>
                  When you join, you inherit a decade of collective knowledge, a senior-to-junior mentorship culture, and direct access to builders who are actively shipping.
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="lg:col-span-7 grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <StaggerItem key={i} className={stat.span === 2 ? "col-span-2" : ""}>
                  <div className={`p-8 border-4 border-slate-900 brutalist-shadow h-full ${stat.bg}`}>
                    <div className={`text-5xl font-black mb-2 font-display ${stat.valueCls}`}>
                      {stat.value}
                    </div>
                    <div className={`font-bold uppercase tracking-wide text-sm ${stat.labelCls}`}>
                      {stat.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── DOMAINS ──────────────────────────────────────────────────── */}
      <section id="domains" className="py-24 bg-background-light border-b-4 border-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="flex items-end justify-between mb-16">
            <h2 className="text-5xl font-black text-slate-900 uppercase leading-none font-display">
              What We<br /><span className="text-primary">Master</span>
            </h2>
            <div className="hidden md:block text-right font-mono font-bold text-slate-900 opacity-60">
              // RECRUITMENT WINGS
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAINS.map((domain, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="bg-white border-4 border-slate-900 p-8 cursor-pointer h-full"
                  whileHover={{ backgroundColor: "#0707f2", color: "#ffffff" }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className="material-symbols-outlined text-5xl mb-6 text-primary block"
                    style={{ transition: "color 0.2s" }}
                  >
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

      {/* ── TIMELINE ─────────────────────────────────────────────────── */}
      <section id="timeline" className="py-24 bg-white border-b-4 border-slate-900 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-5xl font-black text-slate-900 uppercase leading-none font-display">
                Recruitment<br /><span className="text-primary">Roadmap</span>
              </h2>
              <div className="hidden md:block text-right font-mono font-bold text-slate-900 opacity-60">
                // INDUCTION PHASES
              </div>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Vertical connector */}
            <div className="hidden md:block absolute left-[calc(2.5rem_-_2px)] top-0 bottom-0 w-1 bg-slate-900" />

            <StaggerContainer className="space-y-8">
              {TIMELINE.map((phase, i) => (
                <StaggerItem key={i}>
                  <div className="flex gap-6 md:gap-10 items-start">
                    {/* Phase badge */}
                    <div
                      className={`shrink-0 w-20 h-20 border-4 border-slate-900 brutalist-shadow flex flex-col items-center justify-center font-mono z-10 ${phase.color}`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-widest ${phase.accent}`}>Phase</span>
                      <span className={`text-2xl font-black font-display ${phase.accent}`}>{phase.phase}</span>
                    </div>

                    {/* Card */}
                    <motion.div
                      className="flex-1 border-4 border-slate-900 brutalist-shadow bg-white p-6"
                      whileHover={prefersReduced ? {} : { x: 4, boxShadow: "8px 8px 0px 0px #03045E" }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-2xl text-primary">{phase.icon}</span>
                          <h3 className="text-2xl font-black uppercase font-display text-slate-900">{phase.title}</h3>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary bg-background-light px-3 py-1 border-2 border-primary whitespace-nowrap shrink-0">
                          {phase.date}
                        </span>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed text-sm">{phase.desc}</p>
                    </motion.div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-background-light border-b-4 border-slate-900 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-5xl font-black text-slate-900 uppercase leading-none font-display">
                Got<br /><span className="text-primary">Questions?</span>
              </h2>
              <div className="hidden md:block text-right font-mono font-bold text-slate-900 opacity-60">
                // FAQ
              </div>
            </div>
          </ScrollReveal>

          <StaggerContainer className="space-y-4">
            {FAQS.map((faq, i) => (
              <StaggerItem key={i}>
                <FAQItem question={faq.question} answer={faq.answer} index={i} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section id="register" className="bg-primary py-24 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block bg-white text-primary px-4 py-1 font-bold mb-8 text-sm uppercase tracking-widest font-mono brutalist-shadow border-2 border-slate-900">
              Applications Open — Intake 2026
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white mb-8 uppercase leading-none italic font-display">
              Join The Codex.
            </h2>
            <p className="text-2xl font-bold text-white/90 mb-12 max-w-2xl mx-auto">
              Register for the orientation session and take the first step into a decade-long legacy of technical excellence.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <SonarButton
                href="https://forms.gle/"
                className="bg-white text-slate-900 px-12 py-6 text-xl md:text-2xl font-black border-4 border-slate-900 w-full md:w-auto font-display tracking-widest uppercase cursor-pointer inline-block text-center"
              >
                REGISTER NOW
              </SonarButton>
              <motion.a
                href="https://whatsapp.com/channel/0029Vb7SavAElagvuWq2i10a"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-slate-900 text-white px-12 py-6 text-xl md:text-2xl font-black border-4 border-slate-900 w-full md:w-auto font-display tracking-widest uppercase cursor-pointer text-center"
              >
                JOIN OUR CHANNEL
              </motion.a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
