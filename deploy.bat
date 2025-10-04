@echo off
echo ========================================
echo AI Video Conference Assistant - Deploy
echo ========================================
echo.

echo Building web application...
cd web
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Web application built to: web\dist\
echo.
echo Deployment options:
echo 1. Upload web\dist\ contents to your web server
echo 2. Use Vercel: cd web && npx vercel --prod
echo 3. Use Netlify: cd web && npx netlify deploy --prod --dir=dist
echo 4. Use GitHub Pages: cd web && npx gh-pages -d dist
echo.
echo For mobile deployment, see DEPLOYMENT.md
echo.
pause
