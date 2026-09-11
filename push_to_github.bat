@echo off
echo ===================================================
echo   Pushing NexaStandards to GitHub: SIH26107
echo ===================================================
cd /d "%~dp0"
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo ===================================================
    echo   SUCCESS! Pushed to https://github.com/Shashikumarrajurs/SIH26107
    echo ===================================================
) else (
    echo.
    echo ===================================================
    echo   Push encountered an error. Check authentication.
    echo ===================================================
)
pause
