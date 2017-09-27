import 'normalize.css';
import PropTypes from 'prop-types';
import React from 'react';
import { StaticRouter } from 'react-router-dom';

import { gtmNoscript } from '../public/googleTagManager';
import renderHtml from '../public/index.jsx';
import Root from './app/Root.jsx';

function Body({ children }) {
  return (
    <body>
      <noscript dangerouslySetInnerHTML={{ __html: gtmNoscript }} />
      {children}
    </body>
  );
}

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function render({ path: location, webpackStats }) {
  return renderHtml(
    webpackStats,
    <Root HtmlTag={Body} Router={StaticRouter} routerProps={{ location }} />,
  );
}
