import { useEffect, useState } from 'react';

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  enclosure?: {
    url: string;
    type?: string;
  };
  'media:content'?: {
    $: {
      url: string;
      type?: string;
    };
  };
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
        <article key={index} className="p-6 rounded-lg border border-black/[.08] dark:border-white/[.145] flex gap-6">
          <div className="flex-grow">
            <h2 className="text-xl font-semibold mb-2">
              <a href={item.link} target="_blank" rel="noopener noreferrer" 
                 className="hover:underline">
                {item.title}
              </a>
            </h2>
          <time className="text-sm text-gray-500">
            {new Date(item.pubDate).toLocaleDateString()}
          </time>
          {(item.enclosure?.url || item['media:content']?.$?.url) && (
            <div className="mt-4 mb-4">
              <img 
                src={item.enclosure?.url || item['media:content']?.$?.url}
                alt={item.title}
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
            </div>
          )}
          {item.content && (
            <div 
              className="mt-4 text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          )}
          </div>
          <div className="flex-none self-center">
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Read Article
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
