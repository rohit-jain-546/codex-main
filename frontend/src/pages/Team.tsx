import { motion } from "framer-motion";
import { mockData } from "../data/mockData";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/animations/ScrollReveal";
import TiltCard from "../components/animations/TiltCard";
import { useEffect, useState, useRef } from "react";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/image";
import SEO from "../components/SEO";

const prefersReduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Helper to get valid icon name
const getIcon = (platform: string) => {
  const p = platform?.toLowerCase();
  if (['link', 'camera', 'alternate_email', 'code', 'person', 'share'].includes(p)) return p;
  if (p === 'linkedin') return 'link';
  if (p === 'instagram') return 'camera';
  if (p === 'twitter' || p === 'x') return 'alternate_email';
  if (p === 'github' || p === 'web') return 'code';
  if (p === 'youtube') return 'share';
  return 'person';
};

// Card flip state
function TeamCard({ member }: { member: any }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        style={{ transformStyle: "preserve-3d", willChange: "transform", position: "relative", height: "100%" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front face */}
        <TiltCard
          maxTilt={12}
          liftY={10}
          className="bg-white border-4 border-slate-900 p-4 h-full"
        >
          <div className="aspect-square bg-slate-200 mb-6 overflow-hidden border-2 border-slate-900 relative">
            <img
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              src={member.image}
              alt={member.name}
            />
            {/* Social overlay slides up */}
            <div className="absolute bottom-0 left-0 right-0 bg-primary p-4 flex justify-center gap-6 opacity-0 translate-y-full hover:opacity-100 hover:translate-y-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              {member.socials?.map((social: any, i: number) => (
                <motion.a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                  initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="material-symbols-outlined">
                    {getIcon(social.platform)}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{member.name}</h3>
              <p className="text-primary font-bold uppercase text-sm mt-1">{member.role}</p>
            </div>
          </div>
          {!prefersReduced && (
            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase">Click to flip</div>
          )}
        </TiltCard>

        {/* Back face */}
        <div
          className="absolute inset-0 bg-primary text-white border-4 border-slate-900 p-8 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="material-symbols-outlined text-6xl mb-4 text-[#00B4D8]">
            {getIcon(member.socials?.[0]?.platform)}
          </span>
          <h3 className="text-2xl font-black uppercase mb-2">{member.name}</h3>
          <p className="font-bold text-white/80 text-sm uppercase tracking-widest mb-6">{member.role}</p>
          {/* <p className="text-white/60 text-sm mb-6">Engineering excellence since Day 1.</p> */}
          <div className="flex gap-4">
            {member.socials?.map((social: any, i: number) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="border-2 border-white p-2 hover:bg-white hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                <span className="material-symbols-outlined text-sm">
                  {getIcon(social.platform)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Team() {
  const { hero, members } = mockData.team;
  const [dynamicMembers, setDynamicMembers] = useState<any[]>(members);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Coordinator', 'Member', 'Team Leader', 'Core Member', 'Alumni'];

  const filteredMembers = activeFilter === 'All'
    ? dynamicMembers
    : dynamicMembers.filter(m => m.department === activeFilter);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const result = await client.fetch(`*[_type == "teamMember"] {
          _id,
          name,
          role,
          memberId,
          department,
          image,
          socials
        }`);

        if (result && result.length > 0) {
          const formattedMembers = result.map((m: any) => ({
            ...m,
            id: m.memberId,
            image: m.image ? urlFor(m.image).url() : "https://via.placeholder.com/300x300?text=No+Avatar"
          }));
          setDynamicMembers(formattedMembers);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="bg-background-light min-h-screen font-display text-slate-900">
      <SEO 
        title="Team | CODEX ITER" 
        description="Meet the force behind Codex ITER. The coordinators, members, and alumni." 
      />
      <main className="max-w-7xl mx-auto px-6 md:px-20 py-16">

        {/* Hero */}
        <ScrollReveal className="mb-20">
          <div className="inline-block bg-primary text-white px-4 py-1 mb-4 font-bold uppercase tracking-widest text-xs border-2 border-slate-900">
            {hero.label}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase leading-none tracking-tighter mb-6 font-display">
            {hero.titlePart1}<br /><span className="text-primary italic">{hero.titlePart2}</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl text-slate-700 border-l-8 border-primary pl-6">
            {hero.description}
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal delay={0.1} className="flex flex-wrap gap-4 mb-12">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 font-bold uppercase border-2 transition-colors duration-200 cursor-pointer ${activeFilter === filter
                  ? 'bg-primary text-white border-primary'
                  : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white'
                }`}
            >
              {filter}
            </motion.button>
          ))}
        </ScrollReveal>

        {/* 3D Card Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredMembers.map((member) => (
            <StaggerItem key={member._id || member.id}>
              <div className="group relative">
                <TeamCard member={member} />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>


      </main>
    </div>
  );
}
