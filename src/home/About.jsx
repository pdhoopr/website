import React from 'react';

import Container from '../app/layout/Container.jsx';
import PageTitle from '../app/typography/PageTitle.jsx';
import Link from '../app/ui/Link.jsx';
import './About.css';
import avatar from './avatar.jpg';

export default function About() {
  return (
    <section id="about">
      <div className="connections-pattern" />
      <Container>
        <div className="intro">
          <img alt="Patrick Hooper" className="avatar" src={avatar} />
          <PageTitle className="tagline">Web (app) developer</PageTitle>
          <p className="more-taglines">...life enthusiast, <Link to="http://umich.edu/">University of Michigan</Link> alumnus, and all-around neat guy living in Ann Arbor, MI. Also, <Link to="https://mariehooper.me">Marie Hooper</Link>&apos;s biggest fan.</p>
        </div>
        <div className="bio">
          <p>Ever since I was a little kid, I&apos;ve had an affinity for keeping things clean. I like when things are streamlined and seamless. I believe in quality over quantity and all that jazz. I even have a degree centered around optimization and efficiency. Nerdy, right? But now I get to use my education and love of web dev to create cool things every day! See my résumé for more info.</p>
          <p>I think problem solving + technology is awesome. Clean, simple designs are gorgeous. Concise, effective code is beautiful. And all those together? To me, that&apos;s art.</p>
        </div>
      </Container>
    </section>
  );
}
