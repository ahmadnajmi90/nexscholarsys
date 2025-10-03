@echo off
REM ================================================================
REM Nexscholar Queue Worker Starter (Windows)
REM ================================================================
REM 
REM This script starts the Laravel queue worker for background
REM processing of AI embeddings and other asynchronous tasks.
REM
REM Keep this window open while the application is running.
REM Press Ctrl+C to stop the worker.
REM ================================================================

echo.
echo ========================================
echo  Nexscholar Queue Worker
echo ========================================
echo.
echo Starting queue worker...
echo Keep this window open to process background jobs.
echo.
echo Press Ctrl+C to stop the worker
echo ========================================
echo.

REM Change to the project directory (adjust if needed)
cd /d "%~dp0"

REM Start the queue worker with error handling
php artisan queue:work --tries=3 --timeout=120 --sleep=3 --verbose

REM If the worker stops unexpectedly
echo.
echo ========================================
echo  Queue worker stopped
echo ========================================
echo.
echo If the worker stopped due to an error:
echo   1. Check storage/logs/laravel.log
echo   2. Run: php artisan queue:failed
echo   3. Fix the issue and restart this script
echo.
pause

