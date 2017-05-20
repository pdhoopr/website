import 'normalize.css';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import renderHtml from '../public/index.jsx';
import App from './app/App.jsx';

export default function render({ path: location, webpackStats }) {
  return renderHtml(
    webpackStats,
    <App ContentTag="body" Router={StaticRouter} routerProps={{ location }} />,
  );
}
