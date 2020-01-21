import React from 'react';
import { NavLink } from 'react-router-dom';
import './NotFound.css';

export default () => {
  return (
    <section className="page-content">
      <h1>Error 404</h1>
      <h2>Page not found.</h2>
      <p>
        <NavLink to="/" exact className="nav-link">Go back to start</NavLink>
      </p>
    </section>
  );
}