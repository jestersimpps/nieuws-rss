import Parser from 'rss-parser';
import { NextResponse } from 'next/server';

const RSS_FEEDS = [
  'https://news.ycombinator.com/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
];

export async function GET() {
  const parser = new Parser();
  const allItems = [];

  try {
    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      allItems.push(...feed.items);
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
