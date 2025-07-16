# Maxline English Bulldogs - Full Stack Website

A modern, full-stack website for Maxline English Bulldogs featuring a headless CMS backend and a beautiful Astro frontend.

## 🏗️ Project Structure

```
maxline/
├── astroship-main 2/          # Astro Frontend
│   ├── src/
│   │   ├── pages/            # Website pages
│   │   ├── components/       # Reusable components
│   │   ├── lib/             # API utilities
│   │   └── layouts/         # Page layouts
│   ├── astro.config.mjs     # Astro configuration
│   └── vercel.json          # Vercel deployment config
└── my-bulldog-cms/          # Strapi CMS Backend
    ├── src/
    │   └── api/             # Content types (Studs, Puppies)
    ├── config/              # Strapi configuration
    └── vercel.json          # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Vercel account
- Git repository

### 1. Deploy Strapi CMS First

```bash
# Navigate to Strapi folder
cd my-bulldog-cms

# Install dependencies
npm install

# Deploy to Vercel
# Follow DEPLOYMENT_GUIDE.md in my-bulldog-cms/
```

**Required Environment Variables for Strapi:**
```bash
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
JWT_SECRET=your-32-character-secret
ADMIN_JWT_SECRET=your-32-character-secret
API_TOKEN_SALT=your-32-character-secret
APP_KEYS=key1,key2,key3,key4
HOST=0.0.0.0
PORT=1337
ADMIN_PATH=/admin
CORS_ORIGIN=https://your-astro-app.vercel.app
```

### 2. Deploy Astro Frontend

```bash
# Navigate to Astro folder
cd "astroship-main 2"

# Install dependencies
npm install

# Deploy to Vercel
# Follow VERCEL_DEPLOYMENT_GUIDE.md
```

**Required Environment Variables for Astro:**
```bash
STRAPI_URL=https://your-strapi-app.vercel.app
PUBLIC_STRAPI_URL=https://your-strapi-app.vercel.app
STRAPI_TOKEN=your-strapi-api-token
PUBLIC_STRAPI_TOKEN=your-strapi-api-token
```

## 🎯 Features

### Frontend (Astro)
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Fast Performance**: Static site generation with Astro
- **SEO Optimized**: Built-in SEO features and sitemap
- **Mobile First**: Responsive design for all devices
- **Image Optimization**: Lazy loading and optimized images

### Backend (Strapi)
- **Headless CMS**: Content management through admin panel
- **Media Management**: Image upload and management
- **API Access**: RESTful API for content delivery
- **User Management**: Role-based access control
- **Content Types**: Studs, Puppies, Testimonials, Home Page Content

## 📋 Content Management

### Admin Panel Access
1. Go to `https://your-strapi-app.vercel.app/admin`
2. Create admin account
3. Manage content through intuitive interface

### Content Types

#### Studs
- Name, Age, Status (Available/Busy)
- Stud Fee, Description
- Bloodlines, Specialties
- Multiple images

#### Puppies
- Name, Status (Available/Reserved)
- Date of Birth, Price
- Gender, Color, Weight
- Description, Parents, Health Records
- Multiple images

#### Home Page Content
- Hero section content
- Featured sections
- Testimonials

## 🔧 Development

### Local Development

```bash
# Start Strapi CMS
cd my-bulldog-cms
npm run develop

# Start Astro Frontend (in new terminal)
cd "astroship-main 2"
npm run dev
```

### Environment Setup
- Copy `env.example` to `.env` in both folders
- Update with your local development URLs

## 🚀 Deployment

### Vercel Deployment
Both frontend and backend are configured for Vercel deployment:

1. **Deploy Strapi CMS** (see `my-bulldog-cms/DEPLOYMENT_GUIDE.md`)
2. **Deploy Astro Frontend** (see `astroship-main 2/VERCEL_DEPLOYMENT_GUIDE.md`)
3. **Configure Environment Variables** in Vercel dashboard
4. **Test Functionality**

### Environment Variables Checklist

**Strapi CMS:**
- [ ] Database configuration
- [ ] Security keys (JWT, API tokens)
- [ ] CORS settings
- [ ] Admin panel path

**Astro Frontend:**
- [ ] Strapi URL
- [ ] API token
- [ ] Public environment variables

## 🛠️ Technologies Used

### Frontend
- **Astro**: Modern static site generator
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **Vercel**: Deployment platform

### Backend
- **Strapi**: Headless CMS
- **SQLite**: Database (for Vercel compatibility)
- **Node.js**: Runtime environment
- **GraphQL**: API (optional)

## 📱 Admin Panel Features

### Content Management
- **Intuitive Interface**: Easy-to-use admin panel
- **Media Upload**: Drag-and-drop image uploads
- **Rich Text Editor**: WYSIWYG content editing
- **Bulk Operations**: Manage multiple entries

### User Management
- **Role-Based Access**: Editor and Admin roles
- **Secure Authentication**: JWT-based auth
- **API Token Management**: Generate and manage API tokens

## 🔒 Security

- **Environment Variables**: Sensitive data stored securely
- **CORS Configuration**: Proper cross-origin settings
- **API Authentication**: Token-based API access
- **Input Validation**: Server-side validation

## 📈 Performance

- **Static Generation**: Fast page loads
- **Image Optimization**: Lazy loading and compression
- **CDN Delivery**: Global content delivery
- **Caching**: Efficient caching strategies

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check Node.js version (18+ required)
2. **Environment Variables**: Ensure all variables are set in Vercel
3. **CORS Errors**: Update CORS_ORIGIN with correct URLs
4. **Database Issues**: Verify SQLite configuration

### Support
- Check deployment guides in respective folders
- Verify environment variables
- Test locally before deploying

## 📄 License

This project is private and proprietary to Maxline English Bulldogs.

---

**Need Help?** Check the deployment guides in each folder for detailed instructions. 