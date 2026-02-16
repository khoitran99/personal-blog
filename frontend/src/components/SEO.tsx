import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
}

export function SEO({
  title,
  description = 'A minimalist collection of writings on technology, design, and life.',
  name = 'Khoi Tran',
  type = 'article',
}: SEOProps) {
  const fullTitle = title ? `${title} | ${name}` : name;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {/* End standard metadata tags */}

      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {/* End Facebook tags */}

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {/* End Twitter tags */}
    </Helmet>
  );
}
