import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    console.log(`[BRISC API] Sending access email to: ${email}`);

    const { data, error } = await resend.emails.send({
      from: 'BRISC Access <onboarding@resend.dev>', // Temporary - will switch to access@brisclothing.com after verification
      to: [email],
      subject: 'Your BRISC Exclusive Access Code 🔥',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BRISC Exclusive Access</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000000;">
          <div style="max-width: 600px; margin: 0 auto; background: #000000; color: #ffffff; padding: 40px 20px;">
            
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 40px;">
              <img src="https://www.brisclothing.com/images/Product%20Assets/M%20copy.png" 
                   alt="BRISC" 
                   style="width: 80px; height: auto; margin-bottom: 20px;" />
              <h1 style="color: #ffffff; font-size: 32px; margin: 0; font-weight: 300; letter-spacing: 2px;">
                BRISC
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #ffffff; font-size: 28px; margin-bottom: 20px; font-weight: 400;">
                EXCLUSIVE ACCESS GRANTED
              </h2>
              
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Welcome to BRISC. You've been granted exclusive access to our latest collection.<br>
                <strong>Be Your Own Light.</strong>
              </p>
            </div>
            
            <!-- Access Code Box -->
            <div style="background: #111111; border: 2px solid #333333; padding: 30px; text-align: center; margin: 40px 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(255,255,255,0.1);">
              <p style="color: #888888; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
                Your Access Code
              </p>
              <div style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 4px; margin: 20px 0; font-family: 'Courier New', monospace;">
                light2025
              </div>
              <p style="color: #888888; font-size: 12px; margin: 15px 0 0 0;">
                Copy this code exactly as shown
              </p>
            </div>
            
            <!-- Instructions -->
            <div style="background: #0a0a0a; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 15px 0;">
                How to Access:
              </h3>
              <ol style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Return to <a href="https://www.brisclothing.com" style="color: #ffffff; text-decoration: underline;">www.brisclothing.com</a></li>
                <li>Enter this access code when prompted</li>
                <li>Explore the exclusive BRISC collection</li>
              </ol>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://www.brisclothing.com" 
                 style="display: inline-block; background: #ffffff; color: #000000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 6px; letter-spacing: 1px;">
                ENTER STORE
              </a>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #333333;">
              <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
                BRISC Streetwear
              </p>
              <p style="color: #666666; font-size: 11px; margin: 0;">
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
      return res.status(400).json({ 
        error: 'Failed to send email', 
        details: error.message 
      });
    }

    console.log('[BRISC API] Email sent successfully:', data);
    
    return res.status(200).json({ 
      success: true, 
      messageId: data.id,
      message: 'Access email sent successfully'
    });

  } catch (error) {
    console.error('[BRISC API] Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again'
    });
  }
}
