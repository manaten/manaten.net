import React from 'react';
import { Root, Routes } from 'react-static';
import { hot } from 'react-hot-loader';
import css from '@emotion/css';
import { Global } from '@emotion/core';
import { Link } from '@reach/router';

const globalStyle = css`
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
  <Root>
    <Global styles={[ globalStyle ]} />
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Root>
);

export default hot(module)(App);
