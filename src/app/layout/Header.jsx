import React from 'react';

import contactData from './contactData';
import './Header.css';
import icons from '../ui/icons.svg';

export default function Header() {
  return (
    <header className="header">
      <nav className="global-nav">
        <ul>
          <li>
            <a href="/" className="logo" title="Patrick Hooper">Patrick Hooper</a>
          </li>
        </ul>
      </nav>
      <address className="contact">
        <ul>
          {Object.entries(contactData).map(([icon, contactMethod]) => (
            <li key={icon}>
              <a href={contactMethod.url} title={contactMethod.title}>
                <svg>
                  <use xlinkHref={`${icons}#${icon}`} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </address>
    </header>
  );
}
