const path = require('path');
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://react-use-url-state.vercel.app',
  generateRobotsTxt: true,
  sourceDir: path.resolve(__dirname, '../../dist/apps/docs/.next'),
};
