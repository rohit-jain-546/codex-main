import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { mockData } from "../data/mockData";
import { ScrollReveal, StaggerContainer, StaggerItem } from "../components/animations/ScrollReveal";
import { useEffect, useState } from "react";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/image";
import SEO from "../components/SEO";

export default function Blogs() {
  const { hero } = mockData.blogs;

  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 6;
  const totalPages = Math.ceil(totalPosts / pageSize);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch total count for pagination
        const count = await client.fetch(`count(*[_type == "post"])`);
        setTotalPosts(count);

        // Fetch paginated posts
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        const result = await client.fetch(`*[_type == "post"] | order(date desc) [${start}...${end}] {
          _id,
          title,
          "slug": slug.current,
          category,
          readTime,
          date,
          desc,
          image,
          author->{
            name,
            "avatar": image
          }
        }`);

        if (result) {
          const formattedPosts = result.map((post: any) => ({
            ...post,
            image: post.image ? urlFor(post.image).url() : "https://via.placeholder.com/400x300?text=No+Image",
            author: {
              name: post.author?.name || "Unknown",
              avatar: post.author?.avatar ? urlFor(post.author.avatar).url() : "https://via.placeholder.com/150x150?text=No+Avatar"
            }
          }));
          setDynamicPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    fetchPosts();
  }, [currentPage]);

  return (
    <div className="bg-white min-h-screen">
      <SEO 
        title="Blogs | CODEX ITER" 
        description="Read our latest technical blogs, insights, and updates from the Codex community." 
      />
      <main className="px-6 md:px-20 py-12 max-w-7xl mx-auto w-full">

        {/* Header Section */}
        <ScrollReveal className="mb-16">
          <div className="inline-block border-2 border-slate-900 brutalist-shadow px-4 py-1 mb-4" style={{ backgroundColor: '#00B4D8' }}>
            <span className="text-xs font-black uppercase text-slate-900">{hero.version}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-slate-900 font-display">
            {hero.titlePart1}<br /><span className="text-primary italic">{hero.titlePart2}</span>
          </h1>
          <p className="text-xl max-w-2xl font-medium border-l-4 border-primary pl-6 py-2 text-slate-800">
            {hero.description}
          </p>
        </ScrollReveal>

        {/* Filter Tabs */}
        {/* <ScrollReveal delay={0.1} className="flex flex-wrap gap-4 mb-12">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              className={`px-6 py-2 border-2 border-slate-900 font-bold uppercase text-sm tracking-widest transition-colors ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 hover:bg-[#00B4D8]'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat}
            </motion.button>
          ))}
        </ScrollReveal> */}

        {/* Blog Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton Loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[450px] bg-slate-100 border-4 border-slate-900 brutalist-shadow animate-pulse" />
            ))
          ) : (
            dynamicPosts.map((post) => (
              <StaggerItem key={post.id || post._id}>
                <Link to={`/blogs/${post.slug}`} className="group h-full flex flex-col bg-white border-4 border-slate-900 brutalist-shadow-hover transition-all duration-300">
                  <div className="aspect-video bg-slate-200 overflow-hidden border-b-4 border-slate-900 relative">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                      src={post.image}
                      alt={post.title}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-sm" style={{ color: '#00B4D8' }}>schedule</span>
                      <span className="text-[10px] font-bold uppercase text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase leading-tight mb-4 group-hover:text-primary transition-colors font-display line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 font-medium mb-8 flex-1 line-clamp-3">
                      {post.desc}
                    </p>
                    <div className="flex items-center gap-3 pt-6 border-t-2 border-slate-900/10 mt-auto">
                      <img
                        className="w-8 h-8 rounded-full border-2 border-slate-900"
                        src={post.author?.avatar}
                        alt={post.author?.name}
                      />
                      <span className="text-sm font-black uppercase">{post.author?.name}</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <ScrollReveal delay={0.2} className="mt-20 flex justify-center items-center gap-4">
            <motion.button
              whileHover={currentPage > 1 ? { scale: 1.08, backgroundColor: "#00B4D8" } : {}}
              whileTap={currentPage > 1 ? { scale: 0.93 } : {}}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`size-12 border-2 border-slate-900 flex items-center justify-center transition-colors ${
                currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </motion.button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Basic logic to show current, first, last, and neighbors
                const isNearCurrent = Math.abs(pageNum - currentPage) <= 1;
                const isFirstOrLast = pageNum === 1 || pageNum === totalPages;

                if (!isNearCurrent && !isFirstOrLast) {
                  if (pageNum === 2 || pageNum === totalPages - 1) {
                    return <span key={pageNum} className="px-2 font-black">...</span>;
                  }
                  return null;
                }

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 border-2 font-black transition-all cursor-pointer ${
                      currentPage === pageNum 
                        ? 'border-slate-900 bg-primary text-white brutalist-shadow-sm -translate-x-1 -translate-y-1' 
                        : 'border-transparent hover:border-slate-300 text-slate-900'
                    }`}
                  >
                    {pageNum.toString().padStart(2, '0')}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={currentPage < totalPages ? { scale: 1.08, backgroundColor: "#00B4D8" } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.93 } : {}}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`size-12 border-2 border-slate-900 flex items-center justify-center transition-colors ${
                currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-900 cursor-pointer'
              }`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </motion.button>
          </ScrollReveal>
        )}
      </main>
    </div>
  );
}
