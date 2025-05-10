# Google Scholar Python Scraper

This directory contains the Python script used for scraping Google Scholar profiles in the Nexscholar platform. The script uses Playwright to handle dynamic loading of content and clicks the "Show more" button to load all publications.

## Requirements

To use this scraper, you need to have Python 3.7+ installed on your system, along with the following packages:

```bash
pip install playwright
pip install bs4
pip install mysql-connector-python
```

You also need to install the Playwright browsers:

```bash
python -m playwright install
```

## Configuration

The script reads the database configuration from the Laravel `.env` file in the project root directory. Make sure your `.env` file has the following settings:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

## Usage

### From Laravel

The script is designed to be called from Laravel using the `GoogleScholarPythonService`. You don't need to run it manually in normal operation.

### Manual Testing

For testing purposes, you can run the script directly:

```bash
python google_scholar_scraper.py --url "https://scholar.google.com/citations?user=..." --academician_id "user_12345"
```

Or via the Laravel Artisan command:

```bash
php artisan scholar:scrape user_12345
```

To test with a direct URL without saving to the database:

```bash
php artisan scholar:scrape --url="https://scholar.google.com/citations?user=..."
```

To scrape all academicians with Google Scholar URLs:

```bash
php artisan scholar:scrape --all
```

## Troubleshooting

### Script Not Found

Make sure that the script has executable permissions:

```bash
chmod +x scripts/google_scholar_scraper.py
```

### Python Not Found

If you get a "Python not found" error, you may need to specify the full path to the Python executable in `GoogleScholarPythonService.php`:

```php
$process = new Process([
    '/usr/bin/python3', // Use the full path to your Python executable
    $this->scriptPath,
    // ...
]);
```

### CAPTCHA Issues

Google Scholar may show CAPTCHA challenges if there are too many requests in a short period. The script includes random delays and user-agent rotation to minimize this, but if you still encounter CAPTCHA issues:

1. Reduce the frequency of scraping
2. Add more varied user-agents
3. Consider using a proxy rotation service

## Logging

The script logs detailed information to `google_scholar_scraper.log` in the same directory as the script. Check this file for debugging information if the scraper is not working correctly. 