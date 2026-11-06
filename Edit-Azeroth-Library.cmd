@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 20 or newer, then reopen this launcher.
  echo https://nodejs.org/en/download
  pause
  exit /b 1
)
node scripts\work.mjs --edit
if errorlevel 1 pause
