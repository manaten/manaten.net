import React from 'react';
import { Router, Link } from 'react-static';
import { hot } from 'react-hot-loader';
import { injectGlobal } from 'react-emotion';

import Routes from 'react-static-routes';

injectGlobal`
  body {
    padding: 0;
    margin: 0;
    font-family:
      'HelveticaNeue-Light',
      'Helvetica Neue Light',
      'Helvetica Neue',
      Helvetica,
      Arial,
      'Lucida Grande',
      sans-serif;
    font-size: 16px;
    font-weight: 300;
  }

  a {
    font-weight: bold;
    color: #108db8;
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }

  nav {
    width: 100%;
    background: #108db8;
  }

  nav a {
    display: inline-block;
    padding: 1rem;
    color: white;
  }

  .content {
    padding: 1rem;
  }
`;

const App = () => (
  <Router>
    <div>
      <nav>
        <Link exact to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Router>
);

export default hot(module)(App);
