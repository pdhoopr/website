import PropTypes from 'prop-types';
import React from 'react';

import './Container.css';

export default function Container({ children }) {
  return <div className="container">{children}</div>;
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
