@echo off
echo ========================================
echo Deploying to Netlify
echo ========================================
echo.

echo Building project...
cd web
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Build completed! Choose deployment method:
echo.
echo 1. Netlify CLI (requires login)
echo 2. Manual upload (drag & drop)
echo 3. Git integration
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Deploying with Netlify CLI...
    netlify deploy --create-site --dir=dist --prod
) else if "%choice%"=="2" (
    echo.
    echo Manual upload instructions:
    echo 1. Go to https://netlify.com
    echo 2. Sign up/Login
    echo 3. Drag the 'web\dist' folder to the deploy area
    echo 4. Your site will be live in seconds!
    echo.
    echo Opening Netlify website...
    start https://netlify.com
) else if "%choice%"=="3" (
    echo.
    echo Git integration instructions:
    echo 1. Push your code to GitHub
    echo 2. Go to https://netlify.com
    echo 3. Click "New site from Git"
    echo 4. Connect your GitHub repository
    echo 5. Set build command: npm run build
    echo 6. Set publish directory: web/dist
    echo 7. Deploy!
) else (
    echo Invalid choice!
)

echo.
pause
