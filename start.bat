@echo off
title GrahAI - Vedic Astrology AI
echo.
echo  ========================================
echo   GrahAI - Vedic Astrology AI Platform
echo  ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo  [ERROR] Node.js is not installed!
    echo  Download it from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Show Node version
echo  Node.js version:
node -v
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo  Installing dependencies... (this may take 2-3 minutes)
    echo.
    call npm install
    echo.
)

:: Get local IP for phone access
echo  Starting GrahAI...
echo.
echo  ----------------------------------------
echo   Once ready, open in your browser:
echo.
echo   PC:    http://localhost:3000
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%
echo   Phone: http://%IP%:3000
echo  ----------------------------------------
echo.
echo  (Press Ctrl+C to stop the server)
echo.

:: Start the dev server
call npx next dev -p 3000 -H 0.0.0.0
