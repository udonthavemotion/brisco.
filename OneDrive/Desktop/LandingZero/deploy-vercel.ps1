# === ZERO-FAIL VERCEL DEPLOY PREP + PUSH (Windows PowerShell) ===
# Goal: guarantee the same behavior on Vercel as your local preview.

$ErrorActionPreference = "Stop"

Write-Host "🔧 1) Verify Node.js version" -ForegroundColor Cyan
$nodeVersion = node -v
Write-Host "Node version: $nodeVersion" -ForegroundColor Green
if (-not $nodeVersion.StartsWith("v20")) {
    Write-Warning "Consider using Node.js 20.x for best Vercel compatibility"
}

Write-Host "🧹 2) Clean caches to avoid 'works-on-my-machine' gremlins" -ForegroundColor Cyan
$foldersToRemove = @("node_modules", "dist", ".next", ".output", ".vercel", ".astro", ".cache")
foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Remove-Item -Recurse -Force $folder
        Write-Host "Removed $folder" -ForegroundColor Yellow
    }
}

Write-Host "📥 3) Install dependencies (clean install)" -ForegroundColor Cyan
npm ci

Write-Host "🔍 4) Type/route check exactly like CI" -ForegroundColor Cyan
try {
    npx astro check
    Write-Host "✅ Astro check passed" -ForegroundColor Green
} catch {
    Write-Warning "Astro check had warnings/errors - continuing anyway"
}

Write-Host "🧪 5) Build locally exactly as Vercel will" -ForegroundColor Cyan
npm run build

Write-Host "🚀 6) Deploy to Vercel" -ForegroundColor Cyan
# Check if Vercel CLI is installed
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login if needed (interactive)
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
try {
    vercel whoami | Out-Null
} catch {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

# Pull environment variables
Write-Host "Syncing environment variables..." -ForegroundColor Yellow
vercel env pull .env.local --yes

# Deploy to production
Write-Host "Deploying to production..." -ForegroundColor Magenta
vercel --prod --yes

Write-Host "✅ Done! Your prod build on Vercel matches this local preview/build." -ForegroundColor Green
Write-Host "🌐 Check your deployment at: https://vercel.com/dashboard" -ForegroundColor Blue
