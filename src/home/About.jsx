import React from 'react';

import Container from '../app/layout/Container.jsx';
import PageTitle from '../app/typography/PageTitle.jsx';
import Link from '../app/ui/Link.jsx';
import './About.css';
import avatar from './avatar.jpg';
import resume from './patrick-hooper-resume.pdf';

export default function About() {
  return (
    <section id="about">
      <div className="connections-pattern" />
      <Container>
        <div className="intro">
          <img alt="Patrick Hooper" className="avatar" src={avatar} />
          <PageTitle className="tagline">Hi! I&apos;m Patrick.</PageTitle>
        </div>
        <div className="bio">
          <p>I&apos;m a web (app) developer, life enthusiast, <Link to="http://umich.edu/">University of Michigan</Link> alumnus, and all-around neat guy living in Ann Arbor, MI. I&apos;m also <Link to="https://mariehooper.me">Marie Hooper</Link>&apos;s biggest fan.</p>
          <p>Ever since I was a little kid, I&apos;ve had an affinity for keeping things clean. I like when things are streamlined and seamless. I believe in quality over quantity and all that jazz. I even have a degree centered around optimization and efficiency. Nerdy, right? But now I get to use my education and love of web dev to create cool things every day!</p>
          <p>If you&apos;re looking for more info, feel free to contact me or check out some of my other profiles using the links above. You can also have a look at <Link to={resume}>my résumé</Link> if  it interests you.</p>
        </div>
      </Container>
    </section>
  );
}
