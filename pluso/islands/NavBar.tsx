// islands/NavBar.tsx
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { href: "/", text: "home_PAGE" },
    { href: "/maia", text: "mai_A" },
    { href: "/jeff", text: "jeff_LEGAL" },
    { href: "/petunia", text: "pet_UNIA" },
    { href: "/about", text: "abo_UT" },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    h('nav', {
      class: `
        fixed w-full top-0 z-50 
        transition-all duration-300
        ${isScrolled ? "bg-white/80 backdrop-blur shadow-sm" : "bg-transparent"}
      `
    }, [
      h('div', { 
        class: "container mx-auto px-6 py-4 flex items-center" 
      }, [
        // Logo
        h('a', { 
          href: "/", 
          class: "font-mono text-xl font-bold hover:scale-105 transition-transform duration-300"
        }, [
          h('span', { class: "text-[#1E88E5]" }, "plu_"),
          h('span', { class: "text-[#00ACC1]" }, "SO")
        ]),
        
        // Desktop Navigation
        h('div', { 
          class: "hidden md:flex gap-8 justify-center flex-1",
          style: "margin-left: auto; margin-right: auto;"
        },
          navLinks.map((link) => 
            h('a', { 
              key: link.href,
              href: link.href,
              class: `
                relative font-mono text-gray-800
                hover:text-[#1E88E5]
                transition-all duration-300
                after:content-['']
                after:absolute after:left-0 after:bottom-0
                after:w-0 after:h-0.5 after:bg-[#1E88E5]
                after:transition-all after:duration-300
                hover:after:w-full
              `
            }, 
              link.text.split("_").map((part, index) => 
                h('span', { 
                  key: part,
                  class: index === 0 ? "text-[#1E88E5]" : "text-gray-900"
                }, [
                  part,
                  index === 0 ? "_" : null
                ])
              )
            )
          )
        ),

        // Mobile Menu Toggle
        h(Button, {
          variant: "ghost",
          size: "icon",
          class: "md:hidden text-[#1E88E5] hover:text-[#00ACC1] transition-colors",
          onClick: toggleMobileMenu
        }, [
          isMobileMenuOpen 
            ? h('svg', { 
                class: "w-6 h-6", 
                viewBox: "0 0 24 24", 
                fill: "none", 
                stroke: "currentColor", 
                strokeWidth: "2"
              }, [
                h('path', { d: "M6 18L18 6M6 6l12 12" })
              ])
            : h('svg', { 
                class: "w-6 h-6", 
                viewBox: "0 0 24 24", 
                fill: "none", 
                stroke: "currentColor", 
                strokeWidth: "2"
              }, [
                h('path', { d: "M4 6h16M4 12h16M4 18h16" })
              ])
        ]),
      ]),

      // Mobile Navigation
      isMobileMenuOpen && h('div', { 
        class: "md:hidden bg-white/90 backdrop-blur py-4 px-6 shadow-lg"
      }, 
        navLinks.map((link) => 
          h('a', {
            key: link.href,
            href: link.href,
            class: "block py-2 font-mono hover:text-[#1E88E5] transition-colors",
            onClick: () => setIsMobileMenuOpen(false)
          }, 
            link.text.split("_").map((part, index) => 
              h('span', { 
                key: part,
                class: index === 0 ? "text-[#1E88E5]" : "text-gray-900"
              }, [
                part,
                index === 0 ? "_" : null
              ])
            )
          )
        )
      )
    ])
  );
}