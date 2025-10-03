#!/bin/bash

# ================================================================
# Nexscholar Queue Worker Starter (Linux/Mac)
# ================================================================
# 
# This script starts the Laravel queue worker for background
# processing of AI embeddings and other asynchronous tasks.
#
# Keep this terminal open while the application is running.
# Press Ctrl+C to stop the worker.
# ================================================================

echo ""
echo "========================================"
echo "  Nexscholar Queue Worker"
echo "========================================"
echo ""
echo "Starting queue worker..."
echo "Keep this terminal open to process background jobs."
echo ""
echo "Press Ctrl+C to stop the worker"
echo "========================================"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Start the queue worker with error handling
php artisan queue:work --tries=3 --timeout=120 --sleep=3 --verbose

# If the worker stops unexpectedly
echo ""
echo "========================================"
echo "  Queue worker stopped"
echo "========================================"
echo ""
echo "If the worker stopped due to an error:"
echo "  1. Check storage/logs/laravel.log"
echo "  2. Run: php artisan queue:failed"
echo "  3. Fix the issue and restart this script"
echo ""

