import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span>react-use-url-state</span>,
  project: {
    link: 'https://github.com/wanjas/react-use-url-state',
  },
  // chat: {
  //   link: 'https://discord.com',
  // },

  docsRepositoryBase:
    'https://github.com/wanjas/react-use-url-state/tree/main/apps/docs',
  footer: {
    text: 'React useUrlState',
  },
  useNextSeoProps: () => ({
    titleTemplate: '%s | useUrlState',
  }),
};

export default config;
