export function TemplateCard({ 
  title, 
  description, 
  href, 
  color 
}: { 
  title: string, 
  description: string, 
  href: string, 
  color: 'primary' | 'secondary' | 'accent' 
}) {
  const colorClasses = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    accent: "bg-accent text-accent-foreground"
  };
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md border border-gray-100 template-card">
      <div className={`p-4 ${colorClasses[color]} card-header`}>
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <div className="p-6 card-content">
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={href} 
          className="text-primary hover:text-secondary inline-flex items-center template-link"
        >
          Use this template
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}