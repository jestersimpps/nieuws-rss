import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  'https://www.hln.be/home/rss.xml',
  'https://www.demorgen.be/in-het-nieuws/rss.xml',
  'https://www.vrt.be/vrtnieuws/en.rss.articles.xml',
  'https://www.hbvl.be/rss/section/D1618839-F921-43CC-AF6A-A2B200A962DC',
  'https://www.hbvl.be/rss/section/0DB351D4-B23C-47E4-AEEB-09CF7DD521F9',
  'https://www.standaard.be/rss/section/113a9a78-f65a-47a8-bd1c-b24483321d0f',
  'https://www.standaard.be/rss/section/afa7bd44-db14-4fab-81c5-427b1ecb8b98',
];

export async function GET() {
  const parser = new Parser();
  const allItems = [];

  try {
    const uniqueItems = new Map();

    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const source = feedUrl.includes('hln.be') ? 'HLN' : 'De Morgen';
      
      feed.items.forEach(item => {
        if (item.title) {
          const normalizedTitle = item.title.toLowerCase().trim();
          if (!uniqueItems.has(normalizedTitle)) {
            uniqueItems.set(normalizedTitle, {
              ...item,
              source
            });
          }
        }
      });
    }

    // Convert Map values to array and sort by date
    allItems.push(...Array.from(uniqueItems.values()));
    allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({ items: allItems });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}
