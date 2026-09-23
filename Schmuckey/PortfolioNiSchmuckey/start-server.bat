@echo off
title Portfolio Tracker Server (PHP + MySQL)
echo ========================================================
echo   Starting Portfolio Tracker Local Server
echo   Database: MySQL (Localhost:3306)
echo   URL: http://localhost:8000
echo ========================================================

set "PHP_BIN=C:\xampp\php\php.exe"
if not exist "%PHP_BIN%" (
    where php >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "PHP_BIN=php"
    ) else (
        echo [!] PHP not found at C:\xampp\php\php.exe
        echo Falling back to powershell static server...
        start http://localhost:8000
        powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
        goto end
    )
)

echo Starting PHP server on http://localhost:8000 ...
start http://localhost:8000
"%PHP_BIN%" -S localhost:8000 -t "%~dp0." "%~dp0router.php"

:end
pause
