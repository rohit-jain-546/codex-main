import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { mockData } from "../data/mockData";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import TiltCard from "../components/animations/TiltCard";
import { useEffect, useState } from "react";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/image";
import SEO from "../components/SEO";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Radial pulse node — sits on the shared left-5 axis
function PulseNode() {
  if (prefersReduced) return null;
  return (
    // Positioned relative to each event's .relative wrapper
    // left-5 = 20px matches the line's left-5 anchor; -translate-x-1/2 centres the dot on the line
    <div className="absolute -left-9 top-8 -translate-x-1/2 hidden md:block z-20">
      <span className="w-3 h-3 bg-primary rounded-full relative block">
        <motion.span
          className="absolute inset-[-4px] rounded-full border-2"
          style={{ borderColor: "#00B4D8" }}
          animate={{ scale: [1, 2.5], opacity: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </span>
    </div>
  );
}

function EventCard({ item, i }: { item: any, i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "0px 0px -10% 0px" });
  const fromLeft = i % 2 === 0;

  const eventDate = new Date(item.date);

  return (
    <motion.div
      ref={cardRef}
      initial={prefersReduced ? {} : { opacity: 0, x: fromLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <PulseNode />
      <TiltCard
        maxTilt={6}
        liftY={6}
        className="group relative grid grid-cols-1 lg:grid-cols-2 gap-0 border-4 border-primary bg-white brutalist-shadow hover:shadow-[12px_12px_0px_0px_#03045E] cursor-pointer"
        onClick={() => item.link && window.open(item.link, '_blank')}
      >
        <div className="h-64 lg:h-full overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-primary relative shrink-0">
          <div className={`absolute inset-0 mix-blend-multiply z-10 ${i % 2 === 0 ? 'bg-primary/20' : 'bg-[#00B4D8]/20'}`} />
          <img
            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
            src={item.image}
            alt={item.title}
          />
          <div className="absolute top-4 left-4 z-20 bg-primary text-white px-3 py-1 font-bold text-xs uppercase">{item.category}</div>
        </div>
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-slate-100">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">When</span>
                  <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 border-2 border-primary/10 rounded-sm">
                    <span className="material-symbols-outlined text-lg text-primary">calendar_today</span>
                    <span className="font-black text-sm uppercase text-slate-900">
                      {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Time</span>
                  <div className="flex items-center gap-2 bg-[#00B4D8]/10 px-3 py-2 border-2 border-[#00B4D8]/20 rounded-sm">
                    <span className="material-symbols-outlined text-lg text-[#00B4D8]">schedule</span>
                    <span className="font-black text-sm uppercase text-slate-900">
                      {eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
              {item.venue && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1">Where</span>
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 border-2 border-slate-900 brutalist-shadow-sm">
                    <span className="material-symbols-outlined text-lg text-[#00B4D8]">location_on</span>
                    <span className="font-black text-sm uppercase italic tracking-tighter">{item.venue}</span>
                  </div>
                </div>
              )}
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 font-display group-hover:text-[#00B4D8] transition-colors">{item.title}</h3>
            <p className="text-primary font-medium leading-snug mb-8 line-clamp-4">{item.desc}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-auto">
            {item.status === 'Past' ? (
              <div className="flex-1 bg-slate-200 text-slate-500 py-4 px-6 font-black uppercase tracking-widest border-2 border-slate-300 text-center cursor-not-allowed">
                Registrations Closed
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#00B4D8" }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 bg-primary text-white py-4 px-6 font-black uppercase tracking-widest transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.link) window.open(item.link, '_blank');
                }}
              >
                Register Now
              </motion.button>
            )}
            <motion.button
              whileHover={{ backgroundColor: "#03045E", color: "#ffffff" }}
              whileTap={{ scale: 0.97 }}
              className="p-4 border-4 border-primary transition-all cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: item.title, url: item.link });
                }
              }}
            >
              <span className="material-symbols-outlined block">share</span>
            </motion.button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}


export default function Events() {
  const { hero, items } = mockData.events;
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [dynamicEvents, setDynamicEvents] = useState<any[]>(items);
  const [activeStatus, setActiveStatus] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const statusFilters = ['All', 'Upcoming', 'Ongoing', 'Past'];
  const categoryFilters = ['All', 'Workshops', 'Competitions', 'Seminars'];

  const filteredEvents = dynamicEvents.filter(e => {
    const matchStatus = activeStatus === 'All' || e.status === activeStatus;
    const matchCategory = activeCategory === 'All' || e.category === activeCategory;
    return matchStatus && matchCategory;
  }).sort((a, b) => {
    const priority: Record<string, number> = { 'Ongoing': 1, 'Upcoming': 2, 'Past': 3 };
    const pA = priority[a.status] || 99;
    const pB = priority[b.status] || 99;
    
    if (pA !== pB) return pA - pB;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await client.fetch(`*[_type == "event"] | order(date desc) {
          _id,
          title,
          category,
          status,
          date,
          desc,
          image,
          link,
          venue
        }`);

        if (result && result.length > 0) {
          const formattedEvents = result.map((event: any) => ({
            ...event,
            image: event.image ? urlFor(event.image).url() : "https://via.placeholder.com/600x400?text=No+Event+Image"
          }));
          setDynamicEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-background-light text-primary min-h-screen">
      <SEO 
        title="Events | CODEX ITER" 
        description="Discover upcoming, ongoing, and past events at Codex ITER." 
      />
      <main className="flex-1 px-6 py-12 md:px-20 max-w-7xl mx-auto w-full">

        {/* Header */}
        <ScrollReveal className="mb-16">
          <div className="inline-block px-4 py-1 text-white text-xs font-black uppercase tracking-[0.3em] mb-4" style={{ backgroundColor: '#00B4D8' }}>
            {hero.label}
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-6 font-display">
            {hero.titlePart1}<br /><span className="text-white bg-primary px-2">{hero.titlePart2}</span>
          </h1>
          <p className="max-w-xl text-lg font-bold leading-tight border-l-4 border-primary pl-4 uppercase">
            {hero.description}
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.1} className="flex flex-col gap-6 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-black uppercase text-slate-400 text-sm tracking-widest mr-2">Status:</span>
            {statusFilters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStatus(filter)}
                className={`px-6 py-1.5 font-black uppercase text-xs transition-all duration-200 cursor-pointer ${activeStatus === filter 
                    ? 'bg-[#00B4D8] text-white shadow-[3px_3px_0px_0px_#03045E] border-2 border-[#03045E]' 
                    : 'bg-white text-slate-500 border-2 border-slate-200 hover:border-[#00B4D8] hover:text-[#00B4D8] hover:shadow-[3px_3px_0px_0px_rgba(0,180,216,0.3)]'
                  }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-black uppercase text-slate-400 text-sm tracking-widest mr-2">Category:</span>
            {categoryFilters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(filter)}
                className={`px-8 py-2 font-black uppercase text-sm border-2 border-primary transition-colors duration-200 cursor-pointer ${activeCategory === filter ? 'bg-primary text-white' : 'bg-transparent text-primary hover:bg-primary/10'
                  }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Timeline — single column, line + dots share left-5 axis */}
        <div ref={containerRef} className="relative">
          {/* Scroll-driven dashed vertical line at left: 20px */}
          <div className="hidden md:block absolute left-5 top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              className="w-full h-full origin-top"
              style={{
                scaleY,
                background: 'repeating-linear-gradient(to bottom, #03045E, #03045E 10px, transparent 10px, transparent 20px)',
              }}
            />
          </div>

          <div className="flex flex-col gap-16 md:pl-14">
            {filteredEvents.map((item, i) => (
              <EventCard key={item._id} item={item} i={i} />
            ))}

            <motion.div
              className="flex flex-col items-center justify-center border-4 border-dashed border-primary/40 py-12 bg-white/50"
              initial={prefersReduced ? {} : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="material-symbols-outlined text-primary/40 text-4xl mb-2">more_horiz</span>
              <p className="font-black uppercase tracking-[0.2em] text-primary/40">End of Current Iteration Cycle</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
