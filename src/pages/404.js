import React from 'react';
import styled from 'styled-components';
import Background from '../components/background';
import Container from '../components/container';
import Heading1 from '../components/heading-1';
import Layout from '../components/layout';
import Link from '../components/link';
import Paragraph from '../components/paragraph';
import theme from '../data/theme';

const Content = styled(Container)`
  color: white;
  padding-bottom: 6rem;
  padding-top: 6rem;

  ${theme.media.large} {
    padding-bottom: 8.625rem;
    padding-top: 8.625rem;
  }
`;

export default function NotFound() {
  const title = 'Page Not Found';
  return (
    <Layout title={title}>
      <Background />
      <Content>
        <Heading1>{title}</Heading1>
        <Paragraph>
          Oops! The page you&apos;re looking for doesn&apos;t exist. Maybe
          you&apos;d like to <Link to='/'>go to the homepage</Link> or use one
          of the links above to get in touch?
        </Paragraph>
      </Content>
    </Layout>
  );
}
