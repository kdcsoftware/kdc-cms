import React from 'react';
import { Router } from '@reach/router';

import Dashboard from './dashboard';
import DefinePages from './define/pages';
import DefineTypes from './define/types';
import Pages from './pages';
import Contents from './contents';
import Users from './users';
import Apps from './apps';
import Error404 from './404';

const Public = () => (
  <Router>
    <Dashboard path="/" />
    <DefinePages path="/define/pages/*" />
    <DefineTypes path="/define/types/*" />
    <Pages path="/pages/*" />
    <Contents path="/contents/*" />
    <Users path="/users/*" />
    <Apps path="/apps/*" />
    <Error404 default />
  </Router>
);

export default Public;
