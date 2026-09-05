@echo off
title News Pulse Launcher
cd /d "%~dp0"

echo ============================================
echo   NEWS PULSE - Starting both servers
echo ============================================
echo.

node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Download it from https://nodejs.org
    pause
    exit /b
)

echo Node version:
node -v
echo.

echo Starting BACKEND on http://localhost:5000 ...
start "News Pulse Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

echo Starting FRONTEND on http://localhost:5173 ...
start "News Pulse Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 8 /nobreak >nul

echo.
echo Opening browser...
start "" http://localhost:5173

echo.
echo ============================================
echo   Done. Keep the two black windows OPEN.
echo   Closing them stops the app.
echo ============================================
pause
