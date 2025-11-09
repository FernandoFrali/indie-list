/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://indie-list.frali.com.br",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/*", "/my-notes"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/my-notes"],
      },
    ],
    additionalSitemaps: ["https://indie-list.frali.com.br/sitemap.xml"],
  },

  additionalPaths: async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sitemap`);
    const contents = await res.json();

    return contents?.data?.map((c) => ({
      loc: `/${c.slug}`,
      changefreq: "weekly",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    }));
  },
};
