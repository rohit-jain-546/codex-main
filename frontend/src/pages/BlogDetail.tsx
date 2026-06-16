import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { client } from "../sanity/client";
import { urlFor } from "../sanity/image";
import { PortableText } from "@portabletext/react";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import SEO from "../components/SEO";

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `*[_type == "post" && slug.current == $slug][0] {
          title,
          date,
          desc,
          image,
          content,
          author-> {
            name,
            image
          }
        }`;
        const result = await client.fetch(query, { slug });
        setPost(result);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-2xl font-black uppercase animate-pulse text-primary">Loading Post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-black uppercase mb-6">Post not found</h1>
        <Link to="/blogs" className="bg-primary text-white px-8 py-3 font-bold uppercase border-2 border-slate-900 brutalist-shadow">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background-light min-h-screen font-display text-slate-900 pb-20">
      <SEO 
        title={`${post.title} | CODEX ITER`}
        description={post.desc}
        image={post.image ? urlFor(post.image).url() : undefined}
        canonical={`https://codex-iter.in/blogs/${slug}`}
        type="article"
      />
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <ScrollReveal>
          <Link to="/blogs" className="inline-flex items-center gap-2 text-primary font-bold uppercase text-sm mb-8 hover:underline">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to all blogs
          </Link>
          
          <div className="mb-4 text-sm font-bold uppercase text-primary border-l-4 border-primary pl-4">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-12 py-6 border-y-2 border-slate-900/10">
            <div className="w-12 h-12 border-2 border-slate-900 rounded-full overflow-hidden">
              <img 
                src={post.author?.image ? urlFor(post.author.image).url() : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                alt={post.author?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Written by</p>
              <p className="font-black uppercase text-lg">{post.author?.name || "Member of Codex"}</p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="aspect-video w-full bg-slate-200 border-4 border-slate-900 overflow-hidden mb-16 brutalist-shadow">
            <img 
              src={urlFor(post.image).url()} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="prose prose-slate max-w-none">
          <div className="blog-content font-medium text-lg leading-relaxed text-slate-800 space-y-6">
            <PortableText value={post.content} components={portableTextComponents} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

const portableTextComponents = {
  block: {
    h2: ({children}: any) => <h2 className="text-3xl font-black uppercase mt-12 mb-6">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-2xl font-black uppercase mt-8 mb-4">{children}</h3>,
    normal: ({children}: any) => <p className="mb-6">{children}</p>,
    blockquote: ({children}: any) => (
      <blockquote className="border-l-8 border-primary pl-6 py-2 italic text-2xl font-bold bg-white/50 my-8">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}: any) => <li>{children}</li>,
  },
  marks: {
    link: ({children, value}: any) => (
      <a href={value.href} className="text-primary underline font-bold" target="_blank" rel="noreferrer">
        {children}
      </a>
    ),
    strong: ({children}: any) => <strong className="font-black text-slate-900">{children}</strong>,
  },
};
