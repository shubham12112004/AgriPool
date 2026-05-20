import axios from 'axios';

async function scrapeUnsplash(query) {
  try {
    const url = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    const html = response.data;
    
    // Look for JSON or image IDs
    const regex = /"id":"([a-zA-Z0-9_-]{11})"/g;
    const ids = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
    
    console.log(`\n--- Unsplash IDs for: ${query} ---`);
    console.log(ids.slice(0, 10));
  } catch (error) {
    console.error(`Error scraping Unsplash for ${query}:`, error.message);
  }
}

async function run() {
  await scrapeUnsplash('combine-harvester');
  await scrapeUnsplash('sprayer-tractor');
  await scrapeUnsplash('seed-drill');
  await scrapeUnsplash('rotavator');
}

run();
