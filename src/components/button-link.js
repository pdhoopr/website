import styled, { css } from 'styled-components';
import theme from '../data/theme';
import Link from './link';

function gradientBackground(invert) {
  const colors = [theme.colors.blue, theme.colors.orange];
  if (invert) {
    colors.reverse();
  }
  return css`
    background: linear-gradient(
      to top left,
      ${colors[0]} 33%,
      ${colors[1]} 66%
    );
  `;
}

export default styled(Link)`
  background: white;
  color: ${theme.colors.gray};
  font-family: ${theme.fontStacks.monospace};
  font-size: 0.75rem;
  font-weight: ${theme.fontWeights.bold};
  letter-spacing: 0.05em;
  line-height: 1;
  margin: 3px;
  min-width: 6rem;
  padding: 0.625rem;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  transition: color 0.15s;

  &::before {
    ${({ invert }) => gradientBackground(invert)};
    border-radius: 3px;
    bottom: 0;
    content: '';
    left: 0;
    margin: -3px;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.15s;
    z-index: -1;
  }

  &::after {
    content: none;
  }

  &:hover,
  &:active,
  &:focus {
    color: ${theme.colors.lightGray};

    &::before {
      opacity: 0.5;
    }
  }

  & + & {
    margin-left: 0.5rem;
  }
`;
