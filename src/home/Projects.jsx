import React from 'react';

import Container from '../app/layout/Container.jsx';
import SectionTitle from '../app/typography/SectionTitle.jsx';
import SubsectionTitle from '../app/typography/SubsectionTitle.jsx';
import Link from '../app/ui/Link.jsx';
import './Projects.css';
import projectData from './projectData';

export default function Projects() {
  return (
    <section id="projects">
      <Container>
        <SectionTitle>Projects</SectionTitle>
        <ul className="projects-list">
          {Object.entries(projectData).map(([slug, project]) => (
            <li className="project" key={slug}>
              <div className="project-container">
                <SubsectionTitle className="project-title">{project.title}</SubsectionTitle>
                <p className="project-description">{project.description}</p>
                <Link theme="button" to={project.github || project.website}>View Project</Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
