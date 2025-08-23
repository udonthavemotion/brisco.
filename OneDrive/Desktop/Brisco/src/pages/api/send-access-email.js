import { createClient } from '@supabase/supabase-js';

// Go High Level Configuration
const GHL_WEBHOOK_URL = import.meta.env.GHL_WEBHOOK_URL || process.env.GHL_WEBHOOK_URL;
const GHL_API_KEY = import.meta.env.GHL_API_KEY || process.env.GHL_API_KEY;

console.log('[BRISC API] Using Go High Level for email delivery');
console.log('[BRISC API] GHL Webhook URL present:', !!GHL_WEBHOOK_URL);
console.log('[BRISC API] GHL API Key present:', !!GHL_API_KEY);

// Fallback to Resend if GHL not configured (for transition period)
let resend = null;
const resendKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
if (!GHL_WEBHOOK_URL && !GHL_API_KEY && resendKey) {
  const { Resend } = await import('resend');
  resend = new Resend(resendKey);
  console.log('[BRISC API] Fallback: Using Resend (will be deprecated)');
}

// Go High Level Email Sending Function
async function sendEmailViaGHL(email, accessCode = 'light2025') {
  console.log(`[BRISC API] 🚀 Sending email via Go High Level to: ${email}`);
  
  if (GHL_WEBHOOK_URL) {
    // Option 1: Webhook approach (easiest)
    try {
      const webhookPayload = {
        email: email,
        accessCode: accessCode,
        timestamp: new Date().toISOString(),
        source: 'brisc_website',
        campaign: 'access_code_delivery'
      };
      
      console.log('[BRISC API] Triggering GHL webhook...');
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });
      
      if (!response.ok) {
        throw new Error(`GHL Webhook failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('[BRISC API] ✅ GHL webhook triggered successfully:', result);
      
      return {
        success: true,
        provider: 'ghl_webhook',
        messageId: result.id || 'webhook_triggered',
        message: 'Email queued via Go High Level automation'
      };
      
    } catch (error) {
      console.error('[BRISC API] GHL Webhook error:', error);
      throw error;
    }
  }
  
  throw new Error('No GHL configuration found (webhook URL required)');
}

console.log('[BRISC API] GHL email functions initialized');

// Initialize Supabase client for lead capture
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('[BRISC API] Supabase initialized successfully');
} else {
  console.warn('[BRISC API] Supabase credentials not found. Lead capture will be disabled.');
}

export async function POST({ request }) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[BRISC API] Processing access request for: ${email} - v3.0 (GHL Integration)`);

    // Step 1: Capture lead in Supabase (if configured)
    let leadCaptured = false;
    if (supabase) {
      try {
        const leadData = {
          email: email.toLowerCase().trim(),
          source: 'homepage_auth',
          ip: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || null
        };

        const { data: leadResult, error: leadError } = await supabase
          .from('leads')
          .insert([leadData])
          .select();

        if (leadError) {
          if (leadError.code === '23505') {
            console.log(`[BRISC API] Email ${email} already exists in leads table`);
            leadCaptured = true;
          } else {
            console.error('[BRISC API] Failed to capture lead:', leadError);
          }
        } else {
          console.log(`[BRISC API] Lead captured successfully:`, leadResult[0]);
          leadCaptured = true;
        }
      } catch (leadCaptureError) {
        console.error('[BRISC API] Lead capture error:', leadCaptureError);
      }
    }

    // Step 2: Send access email via Go High Level
    console.log(`[BRISC API] Sending access email to: ${email}`);
    console.log(`[BRISC API] Recipient email: ${email} (this should be the client's email, not yours)`);
    
    // Try Go High Level first (no restrictions!)
    if (GHL_WEBHOOK_URL) {
      try {
        console.log('[BRISC API] 🚀 Using Go High Level for email delivery (UNLIMITED)');
        const emailResult = await sendEmailViaGHL(email, 'light2025');
        
        console.log('[BRISC API] ✅ Email sent successfully via GHL:', emailResult);
        
        return new Response(JSON.stringify({ 
          success: true, 
          messageId: emailResult.messageId,
          message: emailResult.message,
          provider: emailResult.provider,
          leadCaptured: leadCaptured,
          supabaseConfigured: !!supabase
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
        
      } catch (ghlError) {
        console.error('[BRISC API] GHL failed:', ghlError.message);
        
        return new Response(JSON.stringify({ 
          error: 'Email service temporarily unavailable',
          details: 'Please try again in a moment',
          leadCaptured: leadCaptured,
          supportMessage: 'If the issue persists, please contact support.'
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // No email service configured
      console.error('[BRISC API] 🚨 CRITICAL: No email service configured');
      console.error('[BRISC API] Please configure GHL_WEBHOOK_URL in environment variables');
      
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        details: 'Please contact support - email delivery system needs configuration',
        leadCaptured: leadCaptured,
        supportMessage: 'The email service is currently being configured. Please try again in a few minutes.'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('[BRISC API] Server error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: import.meta.env.DEV ? error.message : 'Please try again'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}