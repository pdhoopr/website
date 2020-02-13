import React from 'react'
import styled from 'styled-components'
import site from '../data/site'
import social from '../data/social'
import theme from '../data/theme'
import Link from './link'

const Wrapper = styled.header`
  align-items: center;
  display: flex;
  justify-content: space-between;
  left: 50%;
  max-width: 43rem;
  padding: 1rem 0.75rem;
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  z-index: 1;

  ${theme.media.large} {
    max-width: none;
  }
`

const Item = styled.span`
  color: ${theme.colors.orange};
  font-family: ${theme.fontStacks.monospace};
  font-size: 1.25rem;
  font-weight: ${theme.fontWeights.bold};
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  &::after {
    border-bottom-width: 0.125rem;
    margin-top: 0.25rem;
  }
`

const FullName = styled(Item)`
  display: none;

  ${theme.media.medium} {
    display: inline-block;
  }
`

const Initials = styled(Item)`
  font-size: 1.5rem;
  letter-spacing: 0.05em;

  ${theme.media.medium} {
    display: none;
  }
`

const Contact = styled.address`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const Icon = styled.svg`
  fill: currentColor;
  height: 1.25rem;
  vertical-align: -18%;
  width: 1.25rem;
`

export default function Header() {
  return (
    <Wrapper>
      <FullName>{site.title}</FullName>
      <Initials title={site.title}>{site.shortTitle}</Initials>
      <Contact>
        {social.map(profile => (
          <Item
            key={profile.link}
            as={Link}
            to={profile.link}
            title={`See my ${profile.title} profile`}
          >
            <Icon as={profile.icon} />
          </Item>
        ))}
      </Contact>
    </Wrapper>
  )
}
