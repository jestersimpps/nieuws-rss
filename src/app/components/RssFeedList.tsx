import { useEffect, useState } from 'react';

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
};

export default function RssFeedList() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feeds')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setFeedItems(data.items);
        }
      })
      .catch(err => {
        console.error('Error fetching feeds:', err);
        setError('Failed to load feeds');
      })
      .finally(() => {
        setLoading(false);
      });
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
