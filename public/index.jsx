import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { gtmScript } from './googleTagManager';

export default function renderHtml(data, body) {
  return `
    <!DOCTYPE html>
    ${ReactDOMServer.renderToStaticMarkup(
      <html lang="en">
        <head>
          {(process.env.NODE_ENV === 'production') &&
            <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
          }
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Patrick Hooper</title>
          <meta name="description" content="Web (app) developer, life enthusiast, University of Michigan alumnus, and all-around neat guy living in Ann Arbor, MI. Also, Marie Hooper's biggest fan." />
          <link href="https://fonts.googleapis.com/css?family=Space+Mono:700|Titillium+Web:400,600" rel="stylesheet" />
          {Object.keys(data.compilation.assets)
            .filter(asset => asset.match(/\.css(\.map)?$/))
            .map(stylesheet => <link href={`/${stylesheet}`} rel="stylesheet" />)
          }
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fa755a" />
          <meta name="theme-color" content="#ffffff" />
        </head>
        {body || <body><div id="app" /></body>}
      </html>,
    )}
  `;
}
