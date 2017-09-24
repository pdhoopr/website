import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import './Link.css';

export default function Link({ children, className, theme, title, to }) {
  const isExternal = /^((.+:)|(\/static\/))/.test(to);
  const HtmlTag = isExternal ? 'a' : RouterLink;
  const props = {
    className: classNames('link', className, theme),
    title,
    [isExternal ? 'href' : 'to']: to,
  };
  return <HtmlTag {...props}>{children}</HtmlTag>;
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  theme: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string.isRequired,
};

Link.defaultProps = {
  className: undefined,
  theme: undefined,
  title: undefined,
};
