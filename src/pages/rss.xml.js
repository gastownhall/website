import rss from '@astrojs/rss';
import { site, blogPosts } from '../site.config';

export function GET(context) {
  return rss({
    title: `${site.name} Blog`,
    description: site.description,
    site: context.site || site.url,
    items: blogPosts.map((post) => {
      // Parse the short date format (e.g., "Jan 19") to a full date
      const year = 2026;
      const dateStr = `${post.date}, ${year}`;
      const pubDate = new Date(dateStr);

      return {
        title: post.title,
        description: post.description,
        link: post.url,
        pubDate,
      };
    }),
    customData: `<language>en-us</language>`,
  });
}
