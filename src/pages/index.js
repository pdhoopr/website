import React from 'react'
import styled from 'styled-components'
import Background from '../components/background'
import ButtonLink from '../components/button-link'
import Container from '../components/container'
import Heading1 from '../components/heading-1'
import Heading2 from '../components/heading-2'
import Heading3 from '../components/heading-3'
import Link from '../components/link'
import Paragraph from '../components/paragraph'
import SEO from '../components/seo'
import projects from '../data/projects'
import site from '../data/site'
import theme from '../data/theme'
import opengraphPhoto from '../images/patrick-hooper-opengraph.jpg'
import photo from '../images/patrick-hooper.jpg'

const About = styled.div`
  color: white;
  padding: 6rem 0 18%;
  position: relative;

  ${theme.media.large} {
    padding-top: 7.5rem;
  }
`

const Hero = styled(Background)`
  position: absolute;
  transform: skewY(-8deg);
  transform-origin: 0;
`

const Greeting = styled.div`
  display: flex;
  flex-direction: column;

  ${theme.media.large} {
    align-items: center;
    flex-direction: row;
  }
`

const Photo = styled.img`
  border-radius: 50%;
  height: 9rem;
  margin-bottom: 2rem;
  width: 9rem;

  ${theme.media.large} {
    height: 6rem;
    margin-bottom: 0;
    margin-right: 2rem;
    width: 6rem;
  }
`

const Projects = styled(Container)`
  padding-bottom: 3rem;
  padding-top: 3rem;

  ${theme.media.medium} {
    padding-bottom: 4rem;
    padding-top: 4rem;
  }

  ${theme.media.large} {
    padding-bottom: 7.5rem;
  }
`

const List = styled.ul`
  list-style-type: none;
  margin-top: 3rem;
  padding-left: 0.6875rem;

  ${theme.media.medium} {
    margin-top: 4rem;
  }
`

const Item = styled.li`
  border-left: 2px solid ${theme.colors.gray};
  display: flex;

  &::before {
    background: white;
    border: 2px solid ${theme.colors.gray};
    border-radius: 50%;
    content: '';
    display: inline-block;
    flex-shrink: 0;
    height: 1.25rem;
    margin-left: -0.6875rem;
    min-width: 1.25rem;
    width: 1.25rem;
  }
`

const Wrapper = styled.div`
  margin-bottom: 3em;
  margin-left: 1rem;
  margin-top: -0.25rem;

  ${theme.media.medium} {
    margin-bottom: 4rem;
  }

  ${theme.media.large} {
    margin-left: 1.5rem;
  }

  ${/* sc-selector */ Item}:last-of-type & {
    margin-bottom: 0;
  }
`

const Description = styled(Paragraph)`
  padding-bottom: 1.25rem;
  padding-top: 1rem;
`

export default function Home() {
  return (
    <SEO
      title={site.title}
      description={site.description}
      image={opengraphPhoto}
      url='/'
    >
      <About>
        <Hero />
        <Container>
          <Greeting>
            <Photo alt='' src={photo} />
            <Heading1>Hi! I&apos;m Patrick.</Heading1>
          </Greeting>
          <Paragraph>
            I&apos;m a web (app) developer, life enthusiast, national park
            junkie, and all-around neat guy. I&apos;m also{' '}
            <Link to='https://mariehooper.me'>Marie Hooper&apos;s</Link> biggest
            fan, probably. I live in Ann Arbor, Michigan, with my amazing wife
            and our adorable baby girl.
          </Paragraph>
          <Paragraph>
            I&apos;ve had an affinity for cleanliness and simplicity since I was
            little. Stories about my love of tidying up are well-known in my
            family. I guess some things never change, because I turned that
            innate love into an actual education focused on optimization and
            efficiency. Now, I work on cool projects for the web every day,
            still always looking for some simplicity in problems that are
            inherently complex.
          </Paragraph>
        </Container>
      </About>
      <Projects>
        <Heading2>Projects</Heading2>
        <List>
          {projects.map(project => (
            <Item key={project.name}>
              <Wrapper>
                <Heading3>{project.name}</Heading3>
                <Description>{project.description}</Description>
                {project.site && (
                  <ButtonLink to={project.site}>Site</ButtonLink>
                )}
                {project.repo && (
                  <ButtonLink to={project.repo} invert>
                    Code
                  </ButtonLink>
                )}
              </Wrapper>
            </Item>
          ))}
        </List>
      </Projects>
    </SEO>
  )
}
