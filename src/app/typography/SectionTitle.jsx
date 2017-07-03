import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './SectionTitle.css';

export default function SectionTitle({ children, className }) {
  return <h2 className={classNames('section-title', className)}>{children}</h2>;
}

SectionTitle.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

SectionTitle.defaultProps = {
  className: undefined,
};
