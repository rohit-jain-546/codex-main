import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { client } from "../../sanity/client";
import { Instagram, Linkedin, Mail } from "lucide-react";
import codex_light from "../../assets/code_light.png";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  };

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    client.fetch(`*[_type == "settings"][0]`).then(setSettings).catch(console.error);
  }, []);

  return (
    <footer ref={ref} className="bg-background-dark text-white py-20 px-6 border-t-4 border-slate-900">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Logo + description */}
        <motion.div
          className="col-span-2"
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemAnim} className="flex items-center gap-2 mb-8">
            {/* Pulsing logo */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="p-1">
                <img src={codex_light} alt="Codex Logo" className="h-10 w-9" />
              </div>
            </motion.div>
            <span className="text-3xl font-black tracking-tighter">CODEX ITER</span>
          </motion.div>
          <motion.p variants={itemAnim} className="text-slate-400 max-w-md font-medium text-lg leading-relaxed">
            A student-led engineering organization dedicated to technological excellence, open-source innovation, and building the future of the web.
          </motion.p>
        </motion.div>

        {/* Navigate */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h5 variants={itemAnim} className="font-black text-xl mb-6 uppercase tracking-widest text-primary">Navigate</motion.h5>
          <ul className="space-y-4 font-bold">
            {[{ to: "/", label: "THE JOURNEY" }, { to: "/blogs", label: "THE ARCHIVE" }, { to: "/events", label: "CURRENT OPS" }, { to: "/team", label: "THE SQUAD" }].map((l) => (
              <motion.li variants={itemAnim} key={l.to}>
                <Link className="hover:text-primary transition-colors" to={l.to}>{l.label}</Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Connect */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h5 variants={itemAnim} className="font-black text-xl mb-6 uppercase tracking-widest text-primary">Connect</motion.h5>
          <div className="flex gap-4">
            {[
              { icon: <Linkedin size={24} />, href: settings?.linkedin || "https://www.linkedin.com/company/codex-iter", id: "linkedin" },
              { icon: <Mail size={24} />, href: settings?.email ? `mailto:${settings.email}` : "mailto:codexiter@gmail.com", id: "email" },
              { icon: <Instagram size={24} />, href: settings?.instagram || "https://www.instagram.com/codexiter", id: "instagram" },
            ].map(({ icon, href, id }) => (
              <motion.a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemAnim}
                whileHover={{ rotate: 15, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="bg-white text-slate-900 p-2 border-2 border-primary hover:bg-primary hover:text-white transition-colors flex cursor-pointer"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-500 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <p className="text-sm text-center">© 2026 CODEX ITER. ALL RIGHTS RESERVED.</p>
      </motion.div>
    </footer>
  );
}
