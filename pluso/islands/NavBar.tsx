// islands/NavBar.tsx
import { useState } from "preact/hooks";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20);
    });
  }

  const navLinks = [
    { href: "/legal", text: "leg_AL" },
    { href: "/petunia", text: "pet_UNIA" },
    { href: "/maia", text: "mai_A" },
    { href: "/about", text: "abo_UT" },
  ];

  return (
    <nav class={`
      fixed w-full top-0 z-50 
      transition-all duration-300
      ${isScrolled 
        ? 'bg-white/80 backdrop-blur shadow-sm' 
        : 'bg-transparent'}
    `}>
      <div class="
        container mx-auto px-6 py-4
        flex items-center justify-between
      ">
        {/* Logo */}
        <a 
          href="/" 
          class="
            font-mono text-xl font-bold
            hover:scale-105 transition-transform duration-300
          "
        >
          <span class="text-[#1E88E5]">plu_</span>
          <span class="text-[#00ACC1]">SO</span>
        </a>
        
        {/* Desktop Navigation */}
        <div class="hidden md:flex gap-8">
          {navLinks.map(link => (
            <a 
              key={link.href}
              href={link.href} 
              class="
                relative font-mono text-gray-800
                hover:text-[#FF6B00]
                transition-all duration-300
                after:content-['']
                after:absolute after:left-0 after:bottom-0
                after:w-0 after:h-0.5 after:bg-[#FF6B00]
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {link.text.split('_').map((part, index) => (
                <span class={index === 0 ? "text-[#FF6B00]" : "text-gray-900"}>
                  {part}
                  {index === 0 && "_"}
                </span>
              ))}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          class="md:hidden text-[#FF6B00] hover:text-[#F44D00] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            viewBox="0 0 24 24" 
            class="w-6 h-6" 
            stroke="currentColor" 
            stroke-width="2"
          >
            {isMobileMenuOpen ? (
              <path 
                d="M6 18L18 6M6 6l12 12" 
                fill="none"
              />
            ) : (
              <path 
                d="M4 6h16M4 12h16M4 18h16" 
                fill="none"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div class="
          md:hidden
          bg-white/90 backdrop-blur
          py-4 px-6 shadow-lg
        ">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              class="
                block py-2 font-mono
                hover:text-[#FF6B00] transition-colors
              "
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.text.split('_').map((part, index) => (
                <span class={index === 0 ? "text-[#FF6B00]" : "text-gray-900"}>
                  {part}
                  {index === 0 && "_"}
                </span>
              ))}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}