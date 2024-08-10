import { useRouter } from 'next/router';
import React from 'react';

const config = {
  logo: <span>aiDe⚡docs</span>,
  project: {
    link: 'https://github.com/somritdasgupta/aide',
  },
  docsRepositoryBase: 'https://github.com/somritdasgupta/aide/tree/main/docs',
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s | aiDe'
      }
    }
  },
  footer: {
    text: 'aiDe by Somrit Dasgupta',
  },
} as any; // Using `any` to bypass type checking

export default config;
