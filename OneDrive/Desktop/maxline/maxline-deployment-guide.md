# 🚀 MAXLINE BULLDOGS - COMPLETE VERCEL DEPLOYMENT GUIDE

## ⚡ QUICK OVERVIEW
This guide will get your bulldog website live with full admin functionality. You'll deploy in this order:
1. **Strapi CMS Backend** → Admin panel for managing content
2. **Astro Frontend** → Public website connected to CMS

Expected completion time: **2-3 hours**

---

## 📋 PREPARATION CHECKLIST

### Requirements
- [ ] Vercel account (free tier is fine)
- [ ] Node.js 18+ installed
- [ ] Git repository with your code
- [ ] 2-3 hours to complete

### Pre-deployment Setup
1. **Open Terminal/Command Prompt**
2. **Navigate to your project folder**
   ```bash
   cd /path/to/maxline
   ```

---

## 🔧 STEP 1: GENERATE SECURE KEYS

First, we need to generate secure keys for Strapi:

```bash
cd my-bulldog-cms
npm run generate-keys
```

**📝 IMPORTANT**: Copy ALL the generated environment variables. You'll need them in the next step.

---

## 🚀 STEP 2: DEPLOY STRAPI CMS TO VERCEL

### 2.1 Create Vercel Project for Strapi

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your Git repository**
4. **IMPORTANT**: Select the `my-bulldog-cms` folder as the root directory
5. **Configure build settings**:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.2 Add Environment Variables

In your Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add ALL the variables from the generate-keys script**
3. **Update these specific variables**:
   - `PUBLIC_URL`: Replace with your actual Strapi Vercel URL (e.g., `https://my-bulldog-cms.vercel.app`)
   - `CORS_ORIGIN`: We'll update this later with your Astro app URL

### 2.3 Deploy Strapi

1. **Click "Deploy"**
2. **Wait for build to complete** (5-10 minutes)
3. **Note your Strapi URL** (e.g., `https://my-bulldog-cms.vercel.app`)

### 2.4 Test Strapi Deployment

1. **Visit your Strapi URL**
2. **Check these endpoints**:
   - `https://your-strapi-app.vercel.app/admin` (Admin panel)
   - `https://your-strapi-app.vercel.app/api/studs` (API endpoint)

---

## 👤 STEP 3: SET UP ADMIN PANEL

### 3.1 Create Admin User

1. **Go to**: `https://your-strapi-app.vercel.app/admin`
2. **Create your first admin user**:
   - First name: Your name
   - Last name: Your last name
   - Email: Your email
   - Password: Strong password (save this!)

### 3.2 Create API Token

1. **In Strapi admin panel**: Go to **Settings → API Tokens**
2. **Click "Create new API Token"**
3. **Configure token**:
   - **Name**: `Frontend API Token`
   - **Description**: `Token for Astro frontend`
   - **Token duration**: `Unlimited`
   - **Token type**: `Full access`
4. **Click "Save"**
5. **⚠️ IMPORTANT**: Copy the token immediately - you can't see it again!

---

## 📊 STEP 4: ADD INITIAL CONTENT

### 4.1 Add Sample Studs

1. **Go to Content Manager → Studs**
2. **Click "Create new entry"**
3. **Fill in sample data**:
   - **Name**: "Max"
   - **Age**: "3 years"
   - **Status**: "Available"
   - **Fee**: 2000
   - **Description**: "Champion bloodline stud"
   - **Bloodlines**: "English Champion lines"
   - **Specialties**: "Show quality, excellent temperament"
4. **Upload images** (drag and drop)
5. **Click "Save" then "Publish"**

### 4.2 Add Sample Puppies

1. **Go to Content Manager → Puppies**
2. **Click "Create new entry"**
3. **Fill in sample data**:
   - **Name**: "Bella"
   - **Status**: "Available"
   - **Date of birth**: Choose a recent date
   - **Price**: 3500
   - **Gender**: "Female"
   - **Color**: "Fawn"
   - **Weight**: "8 lbs"
   - **Description**: "Beautiful female puppy"
   - **Parents**: "Max x Luna"
   - **Health records**: "Up to date on all vaccinations"
4. **Upload images**
5. **Click "Save" then "Publish"**

---

## 🌐 STEP 5: DEPLOY ASTRO FRONTEND

### 5.1 Create Vercel Project for Astro

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your Git repository**
4. **IMPORTANT**: Select the `astroship-main 2` folder as the root directory
5. **Configure build settings**:
   - **Framework Preset**: Astro
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 5.2 Add Environment Variables

In your Astro Vercel project settings:

1. **Go to Settings → Environment Variables**
2. **Add these variables**:
   ```
   STRAPI_URL=https://your-strapi-app.vercel.app
   PUBLIC_STRAPI_URL=https://your-strapi-app.vercel.app
   STRAPI_TOKEN=your-api-token-from-step-3.2
   PUBLIC_STRAPI_TOKEN=your-api-token-from-step-3.2
   ```

### 5.3 Deploy Astro

1. **Click "Deploy"**
2. **Wait for build to complete** (3-5 minutes)
3. **Note your Astro URL** (e.g., `https://maxline-bulldogs.vercel.app`)

---

## 🔗 STEP 6: CONNECT FRONTEND TO BACKEND

### 6.1 Update CORS Settings

1. **Go back to your Strapi Vercel project**
2. **Go to Settings → Environment Variables**
3. **Update the CORS_ORIGIN variable**:
   ```
   CORS_ORIGIN=https://your-astro-app.vercel.app
   ```
4. **Redeploy** Strapi project

### 6.2 Test Connection

1. **Visit your Astro site**: `https://your-astro-app.vercel.app`
2. **Check these pages**:
   - **Home page**: Should load without errors
   - **Studs page**: Should show your sample stud
   - **Puppies page**: Should show your sample puppy

---

## ✅ STEP 7: FINAL TESTING

### 7.1 Test Admin Panel

1. **Visit**: `https://your-strapi-app.vercel.app/admin`
2. **Log in with your admin credentials**
3. **Test these functions**:
   - [ ] Add a new stud
   - [ ] Upload images
   - [ ] Edit existing content
   - [ ] Publish/unpublish content

### 7.2 Test Frontend Updates

1. **In admin panel**: Edit a stud's name
2. **Save and publish**
3. **Visit your frontend**: Changes should appear immediately

### 7.3 Test Image Uploads

1. **In admin panel**: Upload a new image to a stud
2. **Save and publish**
3. **Check frontend**: Image should display correctly

---

## 🎯 CLIENT HANDOVER

### Share These URLs with Your Client

1. **Website**: `https://your-astro-app.vercel.app`
2. **Admin Panel**: `https://your-strapi-app.vercel.app/admin`
3. **Login Credentials**: [Email and password you created]

### Client Instructions

**"Here's your new website! To manage content:**

1. **Go to**: `https://your-strapi-app.vercel.app/admin`
2. **Log in** with the credentials provided
3. **To add/edit studs**: Content Manager → Studs
4. **To add/edit puppies**: Content Manager → Puppies
5. **To upload images**: Drag and drop into image fields
6. **Always click "Save" then "Publish"** to make changes live

**Changes appear on the website immediately!**"

---

## 🚨 TROUBLESHOOTING

### Common Issues

**Build Fails**:
- Check Node.js version: `node --version` (needs 18+)
- Verify all environment variables are set
- Check build logs in Vercel dashboard

**404 Errors**:
- Ensure environment variables are set correctly
- Check that Strapi URL doesn't end with `/`
- Verify API token is valid

**Images Not Loading**:
- Check CORS_ORIGIN is set correctly
- Ensure images are published in Strapi
- Verify image URLs in browser network tab

**Admin Panel Not Loading**:
- Check PUBLIC_URL environment variable
- Verify ADMIN_PATH is set to `/admin`
- Check browser console for errors

### Get Help

1. **Check Vercel build logs** for specific error messages
2. **Test locally** first: `npm run dev` in both folders
3. **Verify environment variables** are identical to local setup

---

## 🎉 SUCCESS!

If you've followed all steps, you should now have:
- ✅ **Live website** with dynamic content
- ✅ **Working admin panel** for content management
- ✅ **Image uploads** working correctly
- ✅ **Client can manage content** independently

**🚀 Your bulldog website is now live and ready for client use!**

---

## 📞 SUPPORT

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Test both applications locally first
4. Check Vercel build logs for specific errors

**Time to completion**: 2-3 hours
**Result**: Fully functional website with admin panel 