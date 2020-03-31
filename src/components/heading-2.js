import styled from 'styled-components';
import theme from '../data/theme';
import headingStyles from './heading-styles';

export default styled.h2`
  ${headingStyles};
  font-size: 2rem;

  ${theme.media.medium} {
    font-size: 2.5rem;
  }

  ${theme.media.large} {
    text-align: center;
  }
`;
