import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './PageTitle.css';

export default function PageTitle({ children, className }) {
  return <h1 className={classNames('page-title', className)}>{children}</h1>;
}

PageTitle.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

PageTitle.defaultProps = {
  className: undefined,
};
