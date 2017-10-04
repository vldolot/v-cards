import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import BaseLayout from './components/BaseLayout';
import HomePage from './containers/HomePage';
import Admin from './containers/Admin';
import NotFound from './containers/NotFound';

const Routes = () => {
  return (
    <BrowserRouter>
      <BaseLayout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </BaseLayout>
    </BrowserRouter>
  )
};

export default Routes;