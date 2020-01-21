import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import NotFound from './NotFound';

it('renders without crashing', () => {
  shallow(<BrowserRouter><NotFound /></BrowserRouter>);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<BrowserRouter><NotFound /></BrowserRouter>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});