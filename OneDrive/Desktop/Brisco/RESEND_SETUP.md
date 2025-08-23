# BRISC Email Setup with Resend

## ✅ Current Status
- ✅ Local email testing working perfectly
- ✅ Resend integration implemented
- ✅ Frontend auto-detects environment (localhost vs production)
- ✅ API endpoints configured for both environments

## 🚀 Production Deployment Steps

### 1. Vercel Environment Variables
Add the following environment variable in your Vercel dashboard:

```
RESEND_API_KEY=re_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt
```

**How to add:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your BRISC project
3. Go to Settings → Environment Variables
4. Add: `RESEND_API_KEY` with value `re_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt`
5. Make sure it's available for Production, Preview, and Development

### 2. Deploy to Vercel
```bash
# Build and deploy
npm run build
vercel --prod
```

### 3. Test Production Email
Once deployed, test the email functionality on your live site:
- Visit your production URL
- Enter `godspeedbulldogs@gmail.com` 
- Check that the email is sent successfully

## 🔧 How It Works

### Local Development
- Frontend detects `localhost` and calls `http://localhost:3001/api/send-access-email`
- Local Express server handles the request
- Uses Resend API to send emails

### Production
- Frontend detects production domain and calls `/api/send-access-email`
- Vercel serverless function handles the request
- Uses Resend API with environment variable

## 📧 Email Configuration

### Current Settings
- **From:** `BRISC Access <onboarding@resend.dev>`
- **Subject:** `🔥 Your BRISC Exclusive Access Code - Be Your Own Light`
- **Access Code:** `light2025`

### Verified Email
Currently only `godspeedbulldogs@gmail.com` can receive emails because:
1. Using Resend's default `onboarding@resend.dev` sender
2. Domain `brisclothing.com` not verified with Resend yet

### To Send to Any Email (Optional)
1. Verify your domain `brisclothing.com` with Resend
2. Update sender to `access@brisclothing.com`
3. Add DNS records as required by Resend

## 🧪 Testing Commands

### Test Local Server
```bash
# Start local server
node local-server.js

# Test API directly
$body = @{email='godspeedbulldogs@gmail.com'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/send-access-email' -Method POST -Body $body -ContentType 'application/json'
```

### Test Production API
```bash
# Test production endpoint (after deployment)
$body = @{email='godspeedbulldogs@gmail.com'} | ConvertTo-Json
Invoke-RestMethod -Uri 'https://your-domain.vercel.app/api/send-access-email' -Method POST -Body $body -ContentType 'application/json'
```

## 🔒 Security Features
- CORS configured for specific domains only
- Email validation on both frontend and backend
- Environment-based API key management
- Rate limiting through Resend's built-in limits

## 📱 Frontend Integration
The authentication flow automatically:
1. Detects if running on localhost or production
2. Uses appropriate API endpoint
3. Handles errors gracefully
4. Shows loading states and success/error messages

## 🎯 Next Steps
1. Deploy to Vercel with environment variable
2. Test email functionality on production
3. (Optional) Verify custom domain for broader email sending
4. Monitor email delivery and error rates
