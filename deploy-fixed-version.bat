@echo off
echo ========================================
echo Deploying Fixed Version to Netlify
echo ========================================
echo.

echo Step 1: Building the project...
cd web
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Netlify...
cd ..
call npx netlify deploy --prod --dir=web/dist
if %errorlevel% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Deployment Complete!
echo ========================================
echo.
echo The fixed version is now live on Netlify!
echo.
echo Key fixes in this version:
echo - ✅ Supabase integration (not WebSocket)
echo - ✅ No duplicate users on page refresh
echo - ✅ Cross-device communication
echo - ✅ Proper session management
echo.
echo Test the fixes:
echo 1. Create a meeting
echo 2. Refresh the page - should see only one user
echo 3. Join from mobile - should see both users
echo.
pause
