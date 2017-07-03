import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './SubsectionTitle.css';

export default function SubsectionTitle({ children, className }) {
  return <h3 className={classNames('subsection-title', className)}>{children}</h3>;
}

SubsectionTitle.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

SubsectionTitle.defaultProps = {
  className: undefined,
};
