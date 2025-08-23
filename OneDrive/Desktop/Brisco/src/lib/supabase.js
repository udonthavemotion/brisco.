// Supabase client configuration for BRISC leads management
import { createClient } from '@supabase/supabase-js'

// Environment variables for Supabase connection
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.SUPABASE_KEY || import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[BRISC] Supabase credentials not found. Lead capture will be disabled.')
}

// Create Supabase client (safe for frontend - only allows INSERT via RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Lead capture function (frontend-safe)
export async function captureEmailLead(email, additionalData = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[BRISC] Supabase not configured, skipping lead capture')
    return { success: false, error: 'Supabase not configured' }
  }

  try {
    const leadData = {
      email: email.toLowerCase().trim(),
      source: 'homepage_auth',
      ip: null, // Will be handled server-side if needed
      name: additionalData.name || null,
      ...additionalData
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()

    if (error) {
      // Handle duplicate email gracefully (unique constraint)
      if (error.code === '23505') {
        console.log('[BRISC] Email already exists in leads table')
        return { success: true, data: null, duplicate: true }
      }
      throw error
    }

    console.log('[BRISC] Lead captured successfully:', data)
    return { success: true, data: data[0], duplicate: false }

  } catch (error) {
    console.error('[BRISC] Failed to capture lead:', error)
    return { success: false, error: error.message }
  }
}

// Server-side lead capture with service role (for API routes)
export async function captureEmailLeadServer(email, additionalData = {}) {
  const serviceRoleKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    console.warn('[BRISC] Service role key not found, using anon key')
    return captureEmailLead(email, additionalData)
  }

  const supabaseServer = createClient(supabaseUrl, serviceRoleKey)

  try {
    const leadData = {
      email: email.toLowerCase().trim(),
      source: additionalData.source || 'api_endpoint',
      ip: additionalData.ip || null,
      name: additionalData.name || null,
      ...additionalData
    }

    const { data, error } = await supabaseServer
      .from('leads')
      .insert([leadData])
      .select()

    if (error) {
      if (error.code === '23505') {
        console.log('[BRISC] Email already exists in leads table')
        return { success: true, data: null, duplicate: true }
      }
      throw error
    }

    console.log('[BRISC] Lead captured successfully (server):', data)
    return { success: true, data: data[0], duplicate: false }

  } catch (error) {
    console.error('[BRISC] Failed to capture lead (server):', error)
    return { success: false, error: error.message }
  }
}
