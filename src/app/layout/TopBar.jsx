import React from 'react';

import contactData from './contactData';
import './TopBar.css';
import Link from '../ui/Link.jsx';
import icons from '../ui/icons.svg';

export default function TopBar() {
  return (
    <header className="top-bar">
      <nav className="global-nav">
        <ul>
          <li>
            <Link className="logo" to="/">Patrick Hooper</Link>
          </li>
        </ul>
      </nav>
      <address className="contact">
        <ul>
          {Object.entries(contactData).map(([icon, contactMethod]) => (
            <li key={icon}>
              <Link title={contactMethod.title} to={contactMethod.url}>
                <svg>
                  <use xlinkHref={`${icons}#${icon}`} />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </address>
    </header>
  );
}
