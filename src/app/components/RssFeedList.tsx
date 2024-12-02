import { useEffect, useState } from 'react';
import Parser from 'rss-parser';

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
};

const RSS_FEEDS = [
  'https://news.ycombinator.com/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  // Add more RSS feeds as needed
];

export default function RssFeedList() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeds = async () => {
      const parser = new Parser();
      const allItems: FeedItem[] = [];

      try {
        for (const feedUrl of RSS_FEEDS) {
          const feed = await parser.parseURL(feedUrl);
          allItems.push(...(feed.items as FeedItem[]));
        }

        // Sort by date
        allItems.sort((a, b) => 
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );
        
        setFeedItems(allItems);
      } catch (error) {
        console.error('Error fetching RSS feeds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeds();
  }, []);

  if (loading) {
    return <div>Loading feeds...</div>;
  }

  return (
    <div className="grid gap-6">
      {feedItems.map((item, index) => (
        <article key={index} className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145]">
          <h2 className="text-xl font-semibold mb-2">
            <a href={item.link} target="_blank" rel="noopener noreferrer" 
               className="hover:underline">
              {item.title}
            </a>
          </h2>
          <time className="text-sm text-gray-500">
            {new Date(item.pubDate).toLocaleDateString()}
          </time>
          {item.content && (
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {item.content.slice(0, 200)}...
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
