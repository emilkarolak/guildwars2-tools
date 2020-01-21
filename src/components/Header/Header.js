import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

export default () => (
  <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <a className="navbar-brand" href="/">Guild Wars 2 - Tools</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
    <div className="collapse navbar-collapse" id="navbarCollapse">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item"><NavLink to="/" exact className="nav-link" activeClassName="active">Map</NavLink></li>
        <li className="nav-item"><NavLink to="/account" className="nav-link" activeClassName="active">Account</NavLink></li>
      </ul>
    </div>
  </nav>
)