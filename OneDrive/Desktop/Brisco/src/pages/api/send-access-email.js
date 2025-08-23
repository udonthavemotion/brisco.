import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Initialize Resend with API key from environment variables
const resend = new Resend(import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY || 're_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt');

// Initialize Supabase client for lead capture
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
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

    console.log(`[BRISC API] Processing access request for: ${email}`);

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
          // Handle duplicate email gracefully (unique constraint)
          if (leadError.code === '23505') {
            console.log(`[BRISC API] Email ${email} already exists in leads table`);
            leadCaptured = true; // Still consider it captured
          } else {
            console.error('[BRISC API] Failed to capture lead:', leadError);
            // Don't fail the email send if lead capture fails
          }
        } else {
          console.log(`[BRISC API] Lead captured successfully:`, leadResult[0]);
          leadCaptured = true;
        }
      } catch (leadCaptureError) {
        console.error('[BRISC API] Lead capture error:', leadCaptureError);
        // Continue with email send even if lead capture fails
      }
    }

    // Step 2: Send access email via Resend
    console.log(`[BRISC API] Sending access email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'BRISC Access <onboarding@resend.dev>', // Temporary - will switch to access@brisclothing.com after verification
      to: [email],
      subject: '🔥 Your BRISC Exclusive Access Code - Be Your Own Light',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BRISC Exclusive Access</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #000000 0%, #111111 100%); min-height: 100vh;">
          <div style="max-width: 580px; margin: 0 auto; background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%); color: #ffffff; padding: 60px 30px; border: 1px solid #1a1a1a; box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
            
            <!-- Exclusive Header -->
            <div style="text-align: center; margin-bottom: 50px; position: relative;">
              <div style="background: linear-gradient(45deg, #333333, #1a1a1a); width: 2px; height: 40px; margin: 0 auto 30px; opacity: 0.6;"></div>
              
              <img src="https://www.brisclothing.com/images/Product%20Assets/brevisidsg1.png" 
                   alt="BRISC" 
                   style="width: 120px; height: auto; margin-bottom: 25px; filter: brightness(1.1) contrast(1.2);" />
              
              <div style="background: linear-gradient(45deg, #333333, #1a1a1a); width: 2px; height: 40px; margin: 30px auto 0; opacity: 0.6;"></div>
            </div>
            
            <!-- Exclusive Access Banner -->
            <div style="text-align: center; margin-bottom: 50px; position: relative;">
              <div style="background: linear-gradient(90deg, transparent, #333333, transparent); height: 1px; width: 100%; margin-bottom: 30px;"></div>
              
              <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 15px 0; font-weight: 300; letter-spacing: 8px; text-transform: uppercase; opacity: 0.9;">
                EXCLUSIVE
              </h1>
              <h2 style="color: #ffffff; font-size: 36px; margin: 0 0 20px 0; font-weight: 600; letter-spacing: 2px; text-shadow: 0 2px 10px rgba(255,255,255,0.1);">
                ACCESS GRANTED
              </h2>
              
              <div style="background: linear-gradient(90deg, transparent, #333333, transparent); height: 1px; width: 100%; margin-top: 30px;"></div>
            </div>
            
            <!-- Minimal Welcome Message -->
            <div style="text-align: center; margin-bottom: 50px;">
              <p style="color: #cccccc; font-size: 16px; line-height: 1.8; margin: 0; font-weight: 300; letter-spacing: 0.5px;">
                You have been selected for exclusive access.<br>
                <span style="color: #ffffff; font-weight: 500; font-size: 18px; letter-spacing: 1px;">Be Your Own Light.</span>
              </p>
            </div>
            
            <!-- Premium Access Code Box -->
            <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%); border: 1px solid #333333; padding: 40px 30px; text-align: center; margin: 50px 0; border-radius: 2px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 30px rgba(0,0,0,0.5); position: relative;">
              <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #666666, transparent);"></div>
              
              <p style="color: #888888; font-size: 11px; margin: 0 0 25px 0; text-transform: uppercase; letter-spacing: 2px; font-weight: 500;">
                Access Code
              </p>
              <div style="font-size: 28px; font-weight: 600; color: #ffffff; letter-spacing: 6px; margin: 25px 0; font-family: 'Inter', monospace; text-shadow: 0 2px 10px rgba(255,255,255,0.2);">
                light2025
              </div>
              <p style="color: #666666; font-size: 11px; margin: 25px 0 0 0; font-weight: 300; letter-spacing: 0.5px;">
                Enter exactly as shown
              </p>
              
              <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #666666, transparent);"></div>
            </div>
            
            <!-- Minimal Instructions -->
            <div style="background: rgba(10,10,10,0.5); border: 1px solid #1a1a1a; padding: 30px; border-radius: 2px; margin: 40px 0; backdrop-filter: blur(10px);">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 30px; height: 1px; background: #333333; margin: 0 auto;"></div>
              </div>
              
              <div style="color: #cccccc; font-size: 14px; line-height: 2; text-align: center; font-weight: 300;">
                <div style="margin-bottom: 12px; color: #ffffff; font-weight: 400;">01. Return to brisclothing.com</div>
                <div style="margin-bottom: 12px;">02. Enter your access code</div>
                <div>03. Experience the collection</div>
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <div style="width: 30px; height: 1px; background: #333333; margin: 0 auto;"></div>
              </div>
            </div>
            
            <!-- Exclusive CTA -->
            <div style="text-align: center; margin: 50px 0;">
              <a href="https://www.brisclothing.com" 
                 style="display: inline-block; background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); color: #000000; padding: 18px 45px; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 2px; letter-spacing: 2px; text-transform: uppercase; box-shadow: 0 8px 25px rgba(255,255,255,0.15); transition: all 0.3s ease;">
                Enter
              </a>
            </div>
            
            <!-- Minimal Footer -->
            <div style="text-align: center; margin-top: 60px; padding-top: 40px;">
              <div style="background: linear-gradient(90deg, transparent, #333333, transparent); height: 1px; width: 100%; margin-bottom: 30px;"></div>
              
              <p style="color: #555555; font-size: 11px; margin: 0 0 8px 0; font-weight: 300; letter-spacing: 1px;">
                BRISC
              </p>
              <p style="color: #444444; font-size: 10px; margin: 0; font-weight: 300; letter-spacing: 0.5px;">
                Born in Thibodaux • Built for Leaders • Worn by Legends
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
BRISC EXCLUSIVE ACCESS

Welcome to BRISC. You've been granted exclusive access to our latest collection.

Your Access Code: light2025

How to Access:
1. Visit www.brisclothing.com
2. Enter the access code: light2025
3. Explore the exclusive BRISC collection

Be Your Own Light.

---
BRISC Streetwear
Born in Thibodaux • Built for Leaders • Worn by Legends
      `
    });

    if (error) {
      console.error('[BRISC API] Resend error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send email', 
        details: error.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('[BRISC API] Email sent successfully:', data);
    
    return new Response(JSON.stringify({ 
      success: true, 
      messageId: data.id,
      message: 'Access email sent successfully',
      leadCaptured: leadCaptured
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

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
