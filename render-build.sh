#!/usr/bin/env bash
# exit on error
set -o errexit

echo ">>> Building Frontend React SPA..."
cd frontend
npm install
npm run build
cd ..

echo ">>> Installing Composer Dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev --ignore-platform-reqs

# Prepare SQLite Database file if using SQLite
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    DB_PATH=${DB_DATABASE:-database/database.sqlite}
    echo ">>> Preparing SQLite database file at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
fi

echo ">>> Running migrations and seeds..."
php artisan migrate --force
php artisan db:seed --force

echo ">>> Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ">>> Deployment build finished successfully!"
