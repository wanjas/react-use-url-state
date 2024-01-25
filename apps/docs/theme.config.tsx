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
    description: 'React state hook for URL params',
  }),
  head: (
    <>
      {/*<meta property="og:title" content="React useUrlState" />*/}
      {/*<meta*/}
      {/*  property="og:description"*/}
      {/*  content="React state hook for URL params"*/}
      {/*/>*/}
    </>
  ),
};
export default config;
