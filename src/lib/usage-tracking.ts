// Usage Tracking Utility
// This file contains the usage tracking function for AI services

import { supabase } from '@/lib/supabase';

export async function trackUsage(feature: string, metadata?: any) {
  try {
    await supabase.from('usage_tracking').insert({
      id: crypto.randomUUID(),
      user_id: 'demo-user', // Replace with actual user ID
      feature,
      action: 'generate',
      quantity: 1,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Usage tracking error:', error);
  }
}
