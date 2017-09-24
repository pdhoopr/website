import PropTypes from 'prop-types';
import React from 'react';

export default function Icon({ children, title, viewBox }) {
  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="1.414"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

Icon.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  viewBox: PropTypes.string,
};

Icon.defaultProps = {
  viewBox: '0 0 16 16',
};
