@echo off
title CampusConnect - Setup Dependencies
echo ========================================================
echo   CampusConnect Portal - Initial Setup
echo ========================================================
echo.
echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend dependencies. Please ensure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo [2/2] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies. Please ensure Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)
cd ..
echo.
echo ========================================================
echo   Setup Complete!
echo   You can now launch the app anytime by double-clicking:
echo   start.bat
echo ========================================================
echo.
pause
