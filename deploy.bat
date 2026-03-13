@echo off
title GrahAI - Deploy to Vercel
echo.
echo  ========================================
echo   GrahAI - Deploy to Vercel
echo  ========================================
echo.

:: Check for Vercel CLI
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  Installing Vercel CLI...
    call npm install -g vercel
    echo.
)

:: Deploy
echo  Deploying GrahAI to Vercel...
echo  (You'll be asked to log in if not already)
echo.
call vercel --yes
echo.
echo  ========================================
echo   Deployment complete!
echo   Open the URL above on your phone.
echo  ========================================
echo.
pause
