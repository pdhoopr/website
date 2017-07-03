import 'normalize.css';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import renderHtml from '../public/index.jsx';
import Root from './app/Root.jsx';

export default function render({ path: location, webpackStats }) {
  return renderHtml(
    webpackStats,
    <Root HtmlTag="body" Router={StaticRouter} routerProps={{ location }} />,
  );
}
