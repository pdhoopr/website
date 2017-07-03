import PropTypes from 'prop-types';
import React from 'react';

import './global.css';
import Content from './layout/Content.jsx';
import TopBar from './layout/TopBar.jsx';

export default function Root({ HtmlTag, Router, routerProps }) {
  return (
    <Router {...routerProps}>
      <HtmlTag>
        <TopBar />
        <Content />
      </HtmlTag>
    </Router>
  );
}

Root.propTypes = {
  HtmlTag: PropTypes.string.isRequired,
  Router: PropTypes.func.isRequired,
  routerProps: PropTypes.shape({
    location: PropTypes.string,
  }),
};

Root.defaultProps = {
  routerProps: {},
};
