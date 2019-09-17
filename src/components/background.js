import styled from 'styled-components'
import theme from '../data/theme'
import connections from '../images/connections.svg'

export default styled.div`
  background: ${theme.colors.blue};
  height: 100%;
  position: fixed;
  top: 0;
  width: 100%;

  &::before {
    background-image: url(${connections});
    content: '';
    height: 100%;
    opacity: 0.1;
    position: absolute;
    width: 100%;
  }
`
