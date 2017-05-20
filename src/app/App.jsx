import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './global.css';
import Header from './Header.jsx';
import Home from '../home/Home.jsx';

export default function App({ ContentTag, Router, routerProps }) {
  return (
    <ContentTag>
      <Header />
      <main className="content">
        <Router {...routerProps}>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </main>
    </ContentTag>
  );
}

App.propTypes = {
  ContentTag: PropTypes.string.isRequired,
  Router: PropTypes.func.isRequired,
  routerProps: PropTypes.shape({
    location: PropTypes.string,
  }),
};

App.defaultProps = {
  routerProps: {},
};
