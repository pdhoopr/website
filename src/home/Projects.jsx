import React from 'react';

import './Projects.css';
import projectData from './projectData';

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <h2 className="page-title">Projects</h2>
        <ul className="projects-list">
          {Object.entries(projectData).map(([slug, project]) => (
            <li className="project" key={slug}>
              <div className="project-container">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <a className="button" href={`/projects/${slug}`}>View Project</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
