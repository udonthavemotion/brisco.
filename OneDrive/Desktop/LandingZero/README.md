# ZeroMotionMarketing Landing Page

A mobile-first landing page built with Astro and Tailwind CSS, featuring a Spline 3D hero background.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile-First Design

- Responsive breakpoints: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+)
- Hero section uses `90svh` on mobile, `100vh` on desktop
- All buttons are full-width on mobile, inline on larger screens
- Grid layouts stack on mobile: 1 column → 2 columns → 4 columns

## 🎨 Brand Colors

- Background: `bg-neutral-950` (deep black)
- Accent: `bg-purple-600` (#7C3AED)
- Glass cards: `bg-black/20` with `backdrop-blur-sm`
- Text: `text-white` primary, `text-white/70` secondary

## 📁 Project Structure

```
src/
├── components/
│   ├── HeroSpline.astro     # Full-screen Spline hero
│   ├── BandDark.astro       # Dark background sections
│   ├── BandMotion.astro     # Video/image background sections
│   └── HoverCard.astro      # Glass effect cards
└── pages/
    └── index.astro          # Main landing page

public/
├── favicon.svg
└── media/bg/                # Background media files
```

## 🎬 Media Assets

Add these files to `public/media/bg/`:
- `louisiana-bridge.mp4` + `louisiana-bridge.jpg` (poster)
- `louisiana-bayou.mp4` + `louisiana-bayou.jpg` (poster)

## ⚡ Performance Features

- Preconnect to Spline domain
- Lazy loading for background media
- System font stack (no web fonts)
- Compressed HTML output
- Inline critical CSS

## 🔗 CTAs

- Primary: "Book a Strategy Call" → `/booking`
- Secondary: "Call (985) 217-0368" → `tel:19852170368`
- Pricing anchor: `#pricing`
- Benefits anchor: `#benefits`
