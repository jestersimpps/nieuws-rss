import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  'https://www.hln.be/home/rss.xml',
  'https://www.demorgen.be/in-het-nieuws/rss.xml',
];

export async function GET() {
  const parser = new Parser();
  const allItems = [];

  try {
    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const source = feedUrl.includes('hln.be') ? 'HLN' : 'De Morgen';
      const itemsWithSource = feed.items.map(item => ({
        ...item,
        source
      }));
      allItems.push(...itemsWithSource);
    }

    // Sort by date
    allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({ items: allItems });
  } catch (error) {
    console.error('Error fetching RSS feeds:', error);
    return NextResponse.json({ error: 'Failed to fetch feeds' }, { status: 500 });
  }
}
