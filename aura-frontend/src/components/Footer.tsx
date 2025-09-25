export function Footer() {
  const footerSections = [
    {
      title: 'Mental Health Services',
      links: ['']
    },
    {
      title: 'Resources',
      links: ['']
    },
    {
      title: 'Support',
      links: ['']
    },
    {
      title: 'About',
      links: ['']
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-pink-50 via-green-25 to-blue-50 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h5 className="mb-4 text-sm">{section.title}</h5>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              SIH 2025 NOVANERDS
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                NOVANERDS
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}