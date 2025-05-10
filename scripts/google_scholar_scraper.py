#!/usr/bin/env python3
import sys
import os
import json
import time
import logging
import argparse
import mysql.connector
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import configparser
import random

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("google_scholar_scraper.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("GoogleScholarScraper")

# User agents for randomization
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.55',
]

def get_db_config() -> Dict[str, str]:
    """Get database configuration from Laravel .env file"""
    try:
        # Path to Laravel's .env file
        env_path = Path(__file__).parent.parent / '.env'
        if not env_path.exists():
            raise FileNotFoundError(f"Could not find .env file at {env_path}")
        
        # Parse .env file
        config = {}
        with open(env_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key] = value.strip('"\'')
        
        # Return database config
        return {
            'host': config.get('DB_HOST', 'localhost'),
            'user': config.get('DB_USERNAME', 'root'),
            'password': config.get('DB_PASSWORD', ''),
            'database': config.get('DB_DATABASE', ''),
            'port': int(config.get('DB_PORT', '3306'))
        }
    except Exception as e:
        logger.error(f"Error reading database configuration: {e}")
        # Default configuration as fallback
        return {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'nexscholar',
            'port': 3306
        }

def connect_to_database() -> mysql.connector.connection.MySQLConnection:
    """Connect to the MySQL database"""
    try:
        db_config = get_db_config()
        logger.info(f"Connecting to database {db_config['database']} on {db_config['host']}")
        connection = mysql.connector.connect(**db_config)
        logger.info("Database connection established")
        return connection
    except mysql.connector.Error as e:
        logger.error(f"Database connection error: {e}")
        raise

def log_scraping(connection, academician_id: str, status: str, message: str) -> None:
    """Log scraping operation to database"""
    try:
        cursor = connection.cursor()
        query = """
        INSERT INTO scraping_logs (academician_id, status, message, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s)
        """
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(query, (academician_id, status, message, now, now))
        connection.commit()
        cursor.close()
    except Exception as e:
        logger.error(f"Error logging scraping operation: {e}")
        # Try to commit what we can
        try:
            connection.commit()
        except:
            pass

def save_profile_data(connection, academician_id: str, profile_data: Dict[str, Any]) -> None:
    """Save scholar profile data to database"""
    try:
        cursor = connection.cursor()
        
        # Check if profile exists
        cursor.execute(
            "SELECT * FROM scholar_profiles WHERE academician_id = %s", 
            (academician_id,)
        )
        existing_profile = cursor.fetchone()
        
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        if existing_profile:
            # Update existing profile
            query = """
            UPDATE scholar_profiles 
            SET name = %s, affiliation = %s, total_citations = %s, 
                h_index = %s, i10_index = %s, last_scraped_at = %s, updated_at = %s
            WHERE academician_id = %s
            """
            cursor.execute(query, (
                profile_data['name'],
                profile_data['affiliation'],
                profile_data['total_citations'],
                profile_data['h_index'],
                profile_data['i10_index'],
                now,
                now,
                academician_id
            ))
        else:
            # Create new profile
            query = """
            INSERT INTO scholar_profiles 
            (academician_id, name, affiliation, total_citations, h_index, i10_index, last_scraped_at, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                academician_id,
                profile_data['name'],
                profile_data['affiliation'],
                profile_data['total_citations'],
                profile_data['h_index'],
                profile_data['i10_index'],
                now,
                now,
                now
            ))
        
        connection.commit()
        cursor.close()
        logger.info(f"Saved profile data for academician {academician_id}")
    except Exception as e:
        logger.error(f"Error saving profile data: {e}")
        raise

def save_publications(connection, academician_id: str, publications: List[Dict[str, Any]]) -> None:
    """Save publications to database"""
    try:
        cursor = connection.cursor()
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        for pub in publications:
            # Check if publication exists
            cursor.execute(
                "SELECT * FROM publications WHERE academician_id = %s AND title = %s", 
                (academician_id, pub['title'])
            )
            existing_pub = cursor.fetchone()
            
            if existing_pub:
                # Update existing publication
                query = """
                UPDATE publications 
                SET authors = %s, venue = %s, year = %s, citations = %s, 
                    url = %s, abstract = %s, last_updated_at = %s, updated_at = %s
                WHERE academician_id = %s AND title = %s
                """
                cursor.execute(query, (
                    pub['authors'],
                    pub['venue'],
                    pub['year'],
                    pub['citations'],
                    pub['url'],
                    pub.get('abstract', ''),
                    now,
                    now,
                    academician_id,
                    pub['title']
                ))
            else:
                # Create new publication
                query = """
                INSERT INTO publications 
                (academician_id, title, authors, venue, year, citations, url, abstract, last_updated_at, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(query, (
                    academician_id,
                    pub['title'],
                    pub['authors'],
                    pub['venue'],
                    pub['year'],
                    pub['citations'],
                    pub['url'],
                    pub.get('abstract', ''),
                    now,
                    now,
                    now
                ))
        
        connection.commit()
        cursor.close()
        logger.info(f"Saved {len(publications)} publications for academician {academician_id}")
    except Exception as e:
        logger.error(f"Error saving publications: {e}")
        raise

def extract_profile_data(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract profile data from Google Scholar page"""
    profile_data = {
        'name': '',
        'affiliation': '',
        'total_citations': 0,
        'h_index': 0,
        'i10_index': 0,
    }
    
    try:
        # Extract name
        name_elem = soup.select_one('#gsc_prf_in')
        if name_elem:
            profile_data['name'] = name_elem.text.strip()
        
        # Extract affiliation
        affiliation_elem = soup.select_one('.gsc_prf_il')
        if affiliation_elem:
            profile_data['affiliation'] = affiliation_elem.text.strip()
        
        # Extract citation metrics
        metrics_table = soup.select_one('#gsc_rsb_st')
        if metrics_table:
            rows = metrics_table.select('tbody tr')
            for row in rows:
                cells = row.select('td')
                if len(cells) >= 2:
                    label = cells[0].text.strip().lower()
                    value = int(cells[1].text.strip())
                    
                    if 'citations' in label:
                        profile_data['total_citations'] = value
                    elif 'h-index' in label:
                        profile_data['h_index'] = value
                    elif 'i10-index' in label:
                        profile_data['i10_index'] = value
    except Exception as e:
        logger.error(f"Error extracting profile data: {e}")
    
    return profile_data

def extract_publications(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    """Extract publications from Google Scholar page"""
    publications = []
    
    try:
        publication_rows = soup.select('tr.gsc_a_tr')
        
        for row in publication_rows:
            try:
                # Extract title and URL
                title_elem = row.select_one('a.gsc_a_at')
                title = title_elem.text.strip() if title_elem else ''
                title_url = ''
                if title_elem and title_elem.has_attr('href'):
                    title_url = 'https://scholar.google.com' + title_elem['href']
                
                # Extract authors and venue
                info_elements = row.select('div.gs_gray')
                authors = info_elements[0].text.strip() if len(info_elements) > 0 else ''
                venue = info_elements[1].text.strip() if len(info_elements) > 1 else ''
                
                # Extract year
                year_elem = row.select_one('td.gsc_a_y')
                year = year_elem.text.strip() if year_elem else ''
                
                # Extract citations
                citations_elem = row.select_one('td.gsc_a_c a')
                citations = 0
                if citations_elem and citations_elem.text.strip().isdigit():
                    citations = int(citations_elem.text.strip())
                
                # Create publication object
                publication = {
                    'title': title,
                    'url': title_url,
                    'authors': authors,
                    'venue': venue,
                    'year': year,
                    'citations': citations,
                    'abstract': '',  # Abstract not available in listing
                }
                
                publications.append(publication)
            except Exception as e:
                logger.warning(f"Error extracting publication: {e}")
                continue
    except Exception as e:
        logger.error(f"Error extracting publications: {e}")
    
    return publications

def scrape_google_scholar(profile_url: str, academician_id: str) -> bool:
    """
    Scrape Google Scholar profile using Playwright
    """
    conn = None
    try:
        # Connect to database
        conn = connect_to_database()
        
        # Start browser
        logger.info(f"Starting scraping for Google Scholar URL: {profile_url}")
        log_scraping(conn, academician_id, 'started', 'Scraping initiated')
        
        with sync_playwright() as p:
            # Use random user agent
            user_agent = random.choice(USER_AGENTS)
            
            # Launch browser with stealth mode
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent=user_agent,
                viewport={'width': 1280, 'height': 800},
                locale='en-US',
            )
            
            # Create a new page
            page = context.new_page()
            
            # Navigate to the profile
            page.goto(profile_url, wait_until='domcontentloaded')
            time.sleep(2)  # Initial wait
            
            # Check for CAPTCHA
            if "Sorry, we can't verify" in page.content() or "unusual traffic" in page.content() or "id=\"captcha\"" in page.content():
                browser.close()
                logger.error("CAPTCHA detected or unusual traffic warning")
                log_scraping(conn, academician_id, 'failure', 'CAPTCHA detected or unusual traffic warning')
                return False
            
            # Wait for the initial publications to load
            page.wait_for_selector('tr.gsc_a_tr', timeout=10000)
            
            # Click "Show more" button until all publications are loaded
            while True:
                more_button = page.query_selector('#gsc_bpf_more')
                if more_button and more_button.is_visible() and not more_button.is_disabled():
                    logger.info("Clicking 'Show more' button")
                    try:
                        page.click('#gsc_bpf_more')
                        time.sleep(random.uniform(1.5, 3.0))  # Random delay
                    except Exception as e:
                        logger.warning(f"Error clicking 'Show more': {e}")
                        break
                else:
                    logger.info("No more 'Show more' button found or button is disabled")
                    break
            
            # Get the final HTML and parse it
            html_content = page.content()
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract profile data
            profile_data = extract_profile_data(soup)
            
            # Extract publications
            publications = extract_publications(soup)
            
            # Save data to database
            save_profile_data(conn, academician_id, profile_data)
            save_publications(conn, academician_id, publications)
            
            # Log successful scraping
            log_scraping(conn, academician_id, 'success', f'Profile scraped successfully. Found {len(publications)} publications.')
            
            # Close browser
            browser.close()
            
            logger.info(f"Successfully scraped profile for academician {academician_id}")
            return True
            
    except Exception as e:
        logger.error(f"Error scraping Google Scholar: {e}")
        if conn:
            log_scraping(conn, academician_id, 'failure', f'Error: {str(e)}')
        return False
    finally:
        if conn:
            try:
                conn.close()
                logger.info("Database connection closed")
            except:
                pass

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Google Scholar Profile Scraper')
    parser.add_argument('--url', required=True, help='Google Scholar profile URL')
    parser.add_argument('--academician_id', required=True, help='Academician ID')
    
    args = parser.parse_args()
    
    success = scrape_google_scholar(args.url, args.academician_id)
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 