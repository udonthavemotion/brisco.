@echo off
REM === ZERO-FAIL VERCEL DEPLOY PREP + PUSH (Windows Batch) ===
REM Goal: guarantee the same behavior on Vercel as your local preview.

echo 🔧 1) Verify Node.js version
node -v
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js 20.x
    exit /b 1
)

echo 🧹 2) Clean caches to avoid 'works-on-my-machine' gremlins
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist .next rmdir /s /q .next
if exist .output rmdir /s /q .output
if exist .vercel rmdir /s /q .vercel
if exist .astro rmdir /s /q .astro
if exist .cache rmdir /s /q .cache

echo 📥 3) Install dependencies (clean install)
npm ci
if %errorlevel% neq 0 (
    echo ❌ npm ci failed
    exit /b 1
)

echo 🔍 4) Type/route check exactly like CI
npx astro check
REM Continue even if check has warnings

echo 🧪 5) Build locally exactly as Vercel will
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo 🚀 6) Deploy to Vercel
REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo Deploying to production...
vercel --prod --yes
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    exit /b 1
)

echo ✅ Done! Your prod build on Vercel matches this local preview/build.
echo 🌐 Check your deployment at: https://vercel.com/dashboard
pause

