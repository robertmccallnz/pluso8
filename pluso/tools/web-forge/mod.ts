// /Users/robertmccall/pluso8/src/tools/web-forge/mod.ts
import * as esbuild from "https://deno.land/x/esbuild@v0.19.4/mod.js";
import { ensureDir } from "https://deno.land/std@0.208.0/fs/ensure_dir.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

export interface WebsiteConfig {
  title: string;
  primaryColor?: string;
  sections: Section[];
  meta?: {
    description?: string;
    keywords?: string[];
    author?: string;
  };
  styles?: {
    fontFamily?: string;
    colorScheme?: 'light' | 'dark' | 'custom';
    customColors?: Record<string, string>;
  };
}

export interface Section {
  type: 'hero' | 'features' | 'contact' | 'gallery' | 'pricing' | 'testimonials';
  title?: string;
  subtitle?: string;
  items?: any[];
  layout?: 'grid' | 'list' | 'carousel';
  background?: 'light' | 'dark' | 'color' | 'gradient';
}

export class WebForge {
  private templatesDir: string;
  private outputDir: string;
  private defaultConfig: Partial<WebsiteConfig> = {
    primaryColor: 'blue',
    styles: {
      fontFamily: 'sans-serif',
      colorScheme: 'light'
    }
  };

  constructor(
    baseDir: string = ".",
    options: { templatesDir?: string; outputDir?: string } = {}
  ) {
    this.templatesDir = options.templatesDir || join(baseDir, "templates");
    this.outputDir = options.outputDir || join(baseDir, "generated-sites");
    this.initializeDirs();
  }

  private async initializeDirs() {
    await ensureDir(this.templatesDir);
    await ensureDir(this.outputDir);
  }

  async createTemplate(name: string, config: Partial<WebsiteConfig>) {
    const finalConfig = { ...this.defaultConfig, ...config };
    const template = this.generateReactTemplate(name, finalConfig);
    
    const templatePath = join(this.templatesDir, `${name}.tsx`);
    await Deno.writeTextFile(templatePath, template);
    
    return templatePath;
  }

  private generateReactTemplate(name: string, config: Partial<WebsiteConfig>) {
    return `
      import React from 'react';
      
      interface ${name}Props {
        customContent?: React.ReactNode;
      }
      
      export default function ${name}Site({ customContent }: ${name}Props) {
        return (
          <div className="min-h-screen bg-white">
            ${this.generateHead(config)}
            ${this.generateHeader(config)}
            <main>
              ${this.generateSections(config.sections || [])}
              {customContent}
            </main>
            ${this.generateFooter()}
          </div>
        );
      }
    `;
  }

  private generateHead(config: Partial<WebsiteConfig>) {
    return `
      <head>
        <title>${config.title}</title>
        ${config.meta?.description ? 
          `<meta name="description" content="${config.meta.description}" />` : ''}
        ${config.meta?.keywords ? 
          `<meta name="keywords" content="${config.meta.keywords.join(', ')}" />` : ''}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
    `;
  }

  private generateHeader(config: Partial<WebsiteConfig>) {
    return `
      <header className="bg-${config.primaryColor}-600 text-white p-6">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">${config.title}</h1>
          <div className="hidden md:flex space-x-4">
            <a href="#" className="hover:text-${config.primaryColor}-200">Home</a>
            <a href="#" className="hover:text-${config.primaryColor}-200">About</a>
            <a href="#" className="hover:text-${config.primaryColor}-200">Contact</a>
          </div>
        </nav>
      </header>
    `;
  }

  private generateSections(sections: Section[]) {
    return sections.map(section => {
      switch (section.type) {
        case 'hero':
          return this.generateHeroSection(section);
        case 'features':
          return this.generateFeaturesSection(section);
        case 'testimonials':
          return this.generateTestimonialsSection(section);
        case 'contact':
          return this.generateContactSection(section);
        default:
          return '';
      }
    }).join('\n');
  }

  private generateHeroSection(section: Section) {
    return `
      <section className="py-20 text-center bg-gradient-to-r from-${section.background || 'gray'}-50 to-${section.background || 'gray'}-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6">${section.title}</h2>
          <p className="text-xl text-gray-600 mb-8">${section.subtitle}</p>
          ${section.items?.[0]?.buttonText ? `
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              ${section.items[0].buttonText}
            </button>
          ` : ''}
        </div>
      </section>
    `;
  }

  async buildSite(name: string) {
    try {
      const result = await esbuild.build({
        entryPoints: [join(this.templatesDir, `${name}.tsx`)],
        bundle: true,
        outfile: join(this.outputDir, `${name}.js`),
        format: 'esm',
        platform: 'browser',
        minify: true,
        sourcemap: true,
        target: ['es2020', 'chrome80', 'firefox80', 'safari13'],
        loader: {
          '.tsx': 'tsx',
          '.ts': 'ts',
          '.jsx': 'jsx',
          '.js': 'js',
        },
      });

      return {
        success: true,
        path: join(this.outputDir, `${name}.js`),
        stats: result
      };
    } catch (error) {
      console.error('Build failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getGeneratedSite(name: string) {
    try {
      return await Deno.readTextFile(join(this.outputDir, `${name}.js`));
    } catch (error) {
      throw new Error(`Site ${name} not found`);
    }
  }
}

// Export utility functions
export const createWebForgeInstance = (baseDir?: string, options = {}) => {
  return new WebForge(baseDir, options);
};

export const validateConfig = (config: Partial<WebsiteConfig>): boolean => {
  // Add validation logic here
  return true;
};