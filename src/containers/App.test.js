import React from 'react';
import ReactDOM from 'react-dom';
import BaseLayout from '../components/BaseLayout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BaseLayout />, div);
});
