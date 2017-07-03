import React from 'react';
import { Route, Switch } from 'react-router-dom';

import './Content.css';
import Home from '../../home/Home.jsx';

export default function Content() {
  return (
    <main className="content">
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </main>
  );
}
