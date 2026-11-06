@echo off
title CampusConnect - Launcher
echo ========================================================
echo   CampusConnect Portal - Starting Services
echo ========================================================
echo.
echo Launching Backend Server on port 5000...
start "CampusConnect - Backend Server" cmd /k "cd backend && npm start"

echo Launching Frontend Client on port 5173...
start "CampusConnect - Frontend Client" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Both services are launching in separate windows!
echo   - Backend API:  http://localhost:5000
echo   - Frontend App: http://localhost:5173
echo.
echo   Demo Login Accounts:
echo   - Administrator: admin@campusconnect.edu       (Admin@12345)
echo   - Student:       rahul.sharma@campusconnect.edu (Student@12345)
echo.
echo   Opening browser in 5 seconds...
echo ========================================================
echo.
timeout /t 5 >nul
start http://localhost:5173
