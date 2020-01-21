import React from 'react';
import { BrowserRouter, NavLink } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Header from './Header';

it('renders without crashing', () => {
  shallow(<BrowserRouter><Header /></BrowserRouter>);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<BrowserRouter><Header /></BrowserRouter>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders navigation menu', () => {
  const wrapper = shallow(<Header />);
  const element = <ul className="navbar-nav mr-auto">
    <li className="nav-item"><NavLink to="/" exact className="nav-link" activeClassName="active">Map</NavLink></li>
    <li className="nav-item"><NavLink to="/account" className="nav-link" activeClassName="active">Account</NavLink></li>
  </ul>;
  expect(wrapper).toContainReact(element);
});