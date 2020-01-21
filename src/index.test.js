import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

jest.mock('react-dom', ()=> ({render: jest.fn()}))

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<BrowserRouter>
    <App />
  </BrowserRouter>, div);
  global.document.getElementById = (id) => id ==='root' && div
  expect(render).toHaveBeenCalledWith(<BrowserRouter>
    <App />
  </BrowserRouter>, div);
});