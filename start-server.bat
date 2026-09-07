@echo off
title Local Web Server
echo Starting local web server at http://localhost:8000 ...
start http://localhost:8000
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
