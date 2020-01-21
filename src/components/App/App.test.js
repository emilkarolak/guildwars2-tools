import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import App from './App';

it('renders without crashing', () => {
  shallow(<BrowserRouter><App /></BrowserRouter>);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<BrowserRouter><App /></BrowserRouter>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});