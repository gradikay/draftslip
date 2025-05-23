import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'WebApplication' | 'Organization' | 'FAQPage' | 'BreadcrumbList';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  // Base organization data
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DraftSlip',
    url: 'https://draftslip.com',
    logo: 'https://draftslip.com/logo.png',
    sameAs: [
      'https://twitter.com/draftslip',
      'https://facebook.com/draftslip',
      'https://linkedin.com/company/draftslip'
    ]
  };

  // Web application data
  const webAppData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'DraftSlip - Free Invoice Generator',
    url: 'https://draftslip.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    description: 'Create, customize, and download professional invoices for free with DraftSlip. No signup required, 100% private, and instant PDF generation.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127'
    }
  };

  // Choose which data to use based on type
  let structuredData;
  
  switch (type) {
    case 'Organization':
      structuredData = { ...organizationData, ...data };
      break;
    case 'WebApplication':
      structuredData = { ...webAppData, ...data };
      break;
    default:
      structuredData = { '@context': 'https://schema.org', '@type': type, ...data };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;