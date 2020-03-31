import styled from 'styled-components';
import headingStyles from './heading-styles';
import theme from '../data/theme';

export default styled.h3`
  ${headingStyles};
  font-size: 1.25rem;

  ${theme.media.medium} {
    font-size: 1.5rem;
  }
`;
