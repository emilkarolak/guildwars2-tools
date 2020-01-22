import React from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Header from '../Header';
import Map from '../Map';
import Account from '../Account';
import NotFound from '../NotFound';

export default () => (
  <React.Fragment>
    <Header />
    <Switch>
      <Route exact path="/" component={Map} />
      <Route path="/account" component={Account} />
      <Route component={NotFound} />
    </Switch>
    <link href="https://d1h9a8s8eodvjz.cloudfront.net/fonts/menomonia/08-02-12/menomonia.css" rel="stylesheet"></link>
  </React.Fragment>
)