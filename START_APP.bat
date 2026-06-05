@echo off
echo Starting Telegram Broadcaster...
echo.
echo Installing dependencies...
call npm install
echo.
echo Building application...
call npm run build
echo.
echo Starting app at http://localhost:3000
echo Press Ctrl+C to stop
echo.
call npm start
pause
