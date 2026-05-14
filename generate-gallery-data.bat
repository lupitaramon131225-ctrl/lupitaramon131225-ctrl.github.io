@echo off
cd /d %~dp0
node scripts\generate-gallery-data.js
if %ERRORLEVEL% neq 0 pause
