// Global Supabase type declarations
declare module '@/lib/supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export const supabase: SupabaseClient | null;
  export const supabaseClient: SupabaseClient | null;
  export const supabaseUrl: string | undefined;
  export const supabaseAnonKey: string | undefined;
  export function isSupabaseConfigured(): boolean;
  export default supabaseClient;
}

declare module '@/lib/openai' {
  export const openaiClient: any | null;
  export const openai: any | null;
  export function isOpenAIConfigured(): boolean;
  export function createCompletion(prompt: string, options?: any): Promise<string>;
}

declare module '@/lib/usage-tracking' {
  export function trackUsage(feature: string, metadata?: any): Promise<void>;
}

declare module '@/lib/document-generation/prompts' {
  export function generateArizaPrompt(details: any): string;
  export function generateShartnomaPrompt(details: any): string;
  export function generateDavoprompt(details: any): string;
  export function generateVozPrompt(details: any): string;
  export function generateIshHuquqiPrompt(details: any): string;
  export function generateGenericPrompt(details: any): string;
}

declare module '@/lib/document-generation/utils' {
  export function getDocumentTitle(type: string, details: any): string;
  export function calculateConfidence(content: string): number;
  export function getMockDocument(type: string, details: any): any;
}

declare module '@/lib/irac-analysis/utils' {
  export function extractSection(text: string, section: string): string;
  export function extractSources(text: string): string[];
  export function calculateConfidence(caseText: string, response: string): number;
  export function getMockAnalysis(caseText: string): any;
}
