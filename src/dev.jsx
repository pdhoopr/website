import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './app/Root.jsx';

delete AppContainer.prototype.unstable_handleError;

function render(Component) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
}

render(Root);

if (module.hot) {
  module.hot.accept('./app/Root.jsx', () => {
    render(Root);
  });
}
