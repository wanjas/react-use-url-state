const path = require('path');
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://react-use-url-state.wrigglework.com',
  generateRobotsTxt: true,
  sourceDir: path.resolve(__dirname, '../../dist/apps/docs/.next'),
  generateIndexSitemap: false,
  changefreq: 'weekly',
};
