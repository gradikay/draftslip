import React from 'react';
import WatercolorLogo from './WatercolorLogo';

// This component represents what our OG image should look like
// We can later use a service like @vercel/og to generate these server-side
// but for now we'll export a static image

const OgImage: React.FC = () => {
  return (
    <div className="relative w-[1200px] h-[630px] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-yellow-50 overflow-hidden p-12">
      {/* Background decoration */}
      <div className="absolute opacity-10 scale-150 -top-20 -left-20">
        <WatercolorLogo className="w-96 h-96" />
      </div>
      <div className="absolute opacity-10 scale-150 -bottom-20 -right-20">
        <WatercolorLogo className="w-96 h-96" />
      </div>
      
      {/* Main content */}
      <div className="flex items-center gap-8 mb-8">
        <WatercolorLogo className="w-32 h-32" />
        <h1 className="text-7xl font-bold text-primary">DraftSlip</h1>
      </div>
      
      <h2 className="text-4xl font-medium text-secondary text-center mb-8">
        Free Online Invoice Generator
      </h2>
      
      <p className="text-2xl text-gray-700 text-center max-w-3xl">
        Create beautiful, professional invoices in seconds. 
        No signup required. 100% free.
      </p>
      
      <div className="absolute bottom-8 text-lg text-gray-500">
        draftslip.com
      </div>
    </div>
  );
};

export default OgImage;