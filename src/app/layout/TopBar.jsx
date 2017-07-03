import React from 'react';

import './TopBar.css';
import Link from '../ui/Link.jsx';
import GitHubIcon from '../ui/icons/GitHubIcon.jsx';
import GoogleIcon from '../ui/icons/GoogleIcon.jsx';
import InstagramIcon from '../ui/icons/InstagramIcon.jsx';
import LinkedInIcon from '../ui/icons/LinkedInIcon.jsx';
import TwitterIcon from '../ui/icons/TwitterIcon.jsx';

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
          <li>
            <Link title="Google" to="mailto:patrick.d.hooper@gmail.com">
              <GoogleIcon />
            </Link>
          </li>
          <li>
            <Link title="GitHub" to="https://github.com/pdhoopr">
              <GitHubIcon />
            </Link>
          </li>
          <li>
            <Link title="Twitter" to="https://twitter.com/pdhoopr">
              <TwitterIcon />
            </Link>
          </li>
          <li>
            <Link title="LinkedIn" to="https://www.linkedin.com/in/pdhoopr">
              <LinkedInIcon />
            </Link>
          </li>
          <li>
            <Link title="Instagram" to="https://instagram.com/pdhoopr">
              <InstagramIcon />
            </Link>
          </li>
        </ul>
      </address>
    </header>
  );
}
