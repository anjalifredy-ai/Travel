// api/youtube.js - ViewTube YouTube API Handler
// Vercel pe deploy karo — YouTube Data API v3 powered
// YOUTUBE_API_KEY environment variable mein dalo Vercel pe

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YOUTUBE_API_KEY not set in Vercel environment variables' });
  }

  const { type = 'home', q = 'trending india', pageToken = '' } = req.query;

  try {
    let url = '';

    if (type === 'search') {
      // Search videos
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=20&regionCode=IN&relevanceLanguage=hi&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
    } else if (type === 'trending') {
      // Trending videos
      url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IN&maxResults=20&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
    } else if (type === 'shorts') {
      // Shorts — short videos
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=shorts+india&type=video&videoDuration=short&maxResults=20&regionCode=IN&key=${YOUTUBE_API_KEY}`;
    } else {
      // Home feed — mix of trending
      url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IN&maxResults=24&pageToken=${pageToken}&key=${YOUTUBE_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    // Clean aur format karo response
    const items = data.items || [];

    const videos = items.map(item => {
      const snippet = item.snippet || {};
      const stats   = item.statistics || {};
      const content = item.contentDetails || {};

      // Video ID handle karo (search vs videos endpoint)
      const videoId = typeof item.id === 'object' ? item.id.videoId : item.id;

      // Duration format karo (PT4M13S → 4:13)
      const dur = content.duration ? formatDuration(content.duration) : '';

      // Views format karo (1200000 → 1.2M)
      const views = stats.viewCount ? formatViews(stats.viewCount) : '';

      // Published time
      const ago = snippet.publishedAt ? timeAgo(snippet.publishedAt) : '';

      return {
        id:          videoId,
        title:       snippet.title || '',
        channel:     snippet.channelTitle || '',
        channelId:   snippet.channelId || '',
        thumbnail:   snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || '',
        description: snippet.description || '',
        views,
        likes:       formatViews(stats.likeCount || '0'),
        comments:    formatViews(stats.commentCount || '0'),
        duration:    dur,
        publishedAt: snippet.publishedAt || '',
        ago,
        tags:        snippet.tags || [],
      };
    });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      videos,
      nextPageToken: data.nextPageToken || null,
      totalResults:  data.pageInfo?.totalResults || videos.length,
    });

  } catch (error) {
    console.error('YouTube API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ===== HELPER FUNCTIONS =====

function formatDuration(iso) {
  // PT4M13S → 4:13
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function formatViews(n) {
  const num = parseInt(n);
  if (isNaN(num)) return '0';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000)     return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000)         return (num / 1_000).toFixed(1) + 'K';
  return String(num);
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)     return 'just now';
  if (s < 3600)   return Math.floor(s / 60) + ' minutes ago';
  if (s < 86400)  return Math.floor(s / 3600) + ' hours ago';
  if (s < 604800) return Math.floor(s / 86400) + ' days ago';
  if (s < 2592000)return Math.floor(s / 604800) + ' weeks ago';
  if (s < 31536000)return Math.floor(s / 2592000) + ' months ago';
  return Math.floor(s / 31536000) + ' years ago';
}

