import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: string;
  robots?: string;
  keywords?: string;
  twitterCard?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  robots = 'index,follow',
  keywords,
  twitterCard = 'summary_large_image',
}: SEOProps) {
  const location = useLocation();
  const siteUrl = 'https://codex-iter.in';
  const url = canonical || `${siteUrl}${location.pathname}`;
  
  // Fallback to a global default social preview image if none provided
  const defaultImage = `${siteUrl}/codex_dark.png`; // Using the existing icon as default
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="CODEX ITER" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Viewport & Language (usually in index.html, but safe to reinforce if needed) */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}
