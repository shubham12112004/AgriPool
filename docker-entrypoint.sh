#!/bin/sh
# Exit on error
set -e

# Setup SQLite Database if chosen
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    DB_PATH=${DB_DATABASE:-/var/www/html/database/database.sqlite}
    echo ">>> Initializing SQLite database file at $DB_PATH..."
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
    chown -R www-data:www-data "$(dirname "$DB_PATH")"
    chmod -R 775 "$(dirname "$DB_PATH")"
fi

echo ">>> Running Database Migrations..."
php artisan migrate --force

echo ">>> Database Seeding (Admin Registration)..."
php artisan db:seed --force

echo ">>> Refreshing App Permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo ">>> Building Production configuration caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo ">>> Executing Web Server Startup command..."
exec "$@"
