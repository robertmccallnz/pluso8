/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

declare interface ImportMetaEnv {
    // AI Services
    readonly OPENAI_API_KEY: string;
    readonly ANTHROPIC_API_KEY: string;
    readonly HUGGINGFACE_API_KEY: string;
    readonly TOGETHER_API_KEY: string;
    
    // Database & Infrastructure
    readonly SUPABASE_URL: string;
    readonly SUPABASE_ANON_KEY: string;
    readonly SUPABASE_SERVICE_ROLE_KEY: string;
    
    // Email & Payments
    readonly STRIPE_SECRET_KEY: string;
    readonly STRIPE_WEBHOOK_SECRET: string;
    readonly STRIPE_PRICE_ID: string;
    readonly RESEND_API_KEY: string;
    
    // Search & Other Services
    readonly SERPER_API_KEY: string;
    
    // App Configuration
    readonly APP_URL: string;
    readonly NODE_ENV: 'development' | 'production';
  }
  
  declare interface ImportMeta {
    readonly env: ImportMetaEnv;
  }