import React from 'react';

import './About.css';
import avatar from './avatar.jpg';

export default function About() {
  return (
    <section id="about">
      <div className="gradient" />
      <div className="container">
        <div className="intro">
          <img src={avatar} alt="Patrick Hooper" className="avatar" />
          <h1 className="tagline">Web (app) developer</h1>
          <p className="more-taglines">...life enthusiast, <a href="http://umich.edu/">University of Michigan</a> alumnus, and all-around neat guy living in Ann Arbor, MI. Also, <a href="https://mariehooper.me">Marie Hooper</a>&apos;s biggest fan.</p>
        </div>
        <div className="bio">
          <p>Ever since I was a little kid, I&apos;ve had an affinity for keeping things clean. I like when things are streamlined and seamless. I believe in quality over quantity and all that jazz. I even have a degree centered around optimization and efficiency. Nerdy, right? But now I get to use my education and love of web dev to create cool things every day! See my résumé for more info.</p>
          <p>I think problem solving + technology is awesome. Clean, simple designs are gorgeous. Concise, effective code is beautiful. And all those together? To me, that&apos;s art.</p>
        </div>
      </div>
    </section>
  );
}
