import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  children?: ReactNode;
}

const SEO = ({
  title = 'DraftSlip | Free Online Invoice Generator',
  description = 'Create, customize, and download professional invoices for free with DraftSlip. No signup required, 100% private, and instant PDF generation.',
  keywords = 'free invoice generator, invoice maker, create invoice pdf, professional invoice template, invoice creator, business invoice, no signup invoice',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.jpg',
  children,
}: SEOProps) => {
  const domain = 'https://draftslip.com';
  const fullCanonicalUrl = canonicalUrl ? `${domain}${canonicalUrl}` : domain;
  const fullOgImageUrl = ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`;
  
  const siteName = 'DraftSlip - Free Invoice Generator';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImageUrl} />
      
      {/* Additional SEO improvement tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="DraftSlip" />
      
      {/* Structured Data for Rich Results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": siteName,
          "url": domain,
          "description": description,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
      
      {children}
    </Helmet>
  );
};

export default SEO;