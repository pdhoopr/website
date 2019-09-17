import { Link as GatsbyLink } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import theme from '../data/theme'

const Wrapper = styled.a.attrs(({ title }) => ({
  'aria-label': title,
}))`
  color: ${theme.colors.orange};
  display: inline-block;
  font-weight: ${theme.fontWeights.medium};
  text-decoration: none;

  &::after {
    border-bottom-style: solid;
    border-bottom-width: 0.0625rem;
    content: '';
    display: block;
    transform: scaleX(0);
    transition: transform 0.15s;
  }

  &:hover::after,
  &:active::after,
  &:focus::after {
    transform: scaleX(1);
  }
`

export default function Link({ children, className, title, to }) {
  const isInternal = /^\/(?!(static)?\/)/.test(to)
  return isInternal ? (
    <Wrapper as={GatsbyLink} to={to} title={title} className={className}>
      {children}
    </Wrapper>
  ) : (
    <Wrapper href={to} title={title} className={className}>
      {children}
    </Wrapper>
  )
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  to: PropTypes.string.isRequired,
}

Link.defaultProps = {
  className: null,
  title: null,
}
