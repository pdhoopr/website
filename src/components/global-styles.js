import { createGlobalStyle } from 'styled-components'
import theme from '../data/theme'

export default createGlobalStyle`
  html {
    box-sizing: border-box;
    text-size-adjust: 100%;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  body {
    background: white;
    color: ${theme.colors.gray};
    font-family: ${theme.fontStacks.sansSerif};
    font-size: 1.125rem;
    font-weight: ${theme.fontWeights.regular};
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
    margin: 0;
  }

  noscript {
    display: none;
  }

  main {
    display: block;
  }
`
