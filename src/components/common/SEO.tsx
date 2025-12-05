import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  product?: {
    price?: string;
    currency?: string;
    brand?: string;
    category?: string;
    availability?: "InStock" | "OutOfStock" | "PreOrder";
  };
}

export default function SEO({
  title = "Уютный ремонт — Магазин товаров для ремонта",
  description = "Современный магазин товаров для ремонта: инструменты, стройматериалы, сантехника, электрика. Доставка по России, акции и удобная корзина.",
  canonical,
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  keywords = [],
  author,
  publishedTime,
  modifiedTime,
  product,
}: SEOProps) {
  const url = canonical || (typeof window !== 'undefined' ? window.location.href : undefined);
  const siteName = "Уютный ремонт";
  
  // Enhanced structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: "https://уютный-ремонт.рф",
    logo: "https://уютный-ремонт.рф/logo.png",
    description: "Интернет-магазин товаров для ремонта и строительства",
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
      addressLocality: "Москва"
    },
    telephone: "+7 (123) 456-78-90",
    email: "info@уютный-ремонт.рф",
    openingHours: "Mo-Su 09:00-18:00",
    sameAs: [
      "https://vk.com/cozy_repair",
      "https://t.me/cozy_repair"
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: "https://уютный-ремонт.рф",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://уютный-ремонт.рф/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  let productData = null;
  if (type === "product" && product) {
    productData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: title.replace(" - Уютный ремонт", ""),
      description,
      image,
      brand: {
        "@type": "Brand",
        name: product.brand || "Generic"
      },
      category: product.category,
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: product.currency || "RUB",
        availability: `https://schema.org/${product.availability || "InStock"}`,
        seller: {
          "@type": "Organization",
          name: siteName
        }
      }
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:locale" content="ru_RU" />
      
      {/* Article specific tags */}
      {type === "article" && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === "article" && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "article" && author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Mobile specific tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteData)}
      </script>
      {productData && (
        <script type="application/ld+json">
          {JSON.stringify(productData)}
        </script>
      )}
    </Helmet>
  );
}
