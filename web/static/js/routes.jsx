"use strict";

import React        from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

import UserStore    from './stores/user';
import mui          from 'material-ui';

// ------------------ Components --------------------------
import Index        from './components/index';
import Home         from './components/main/home';
import Login        from './components/sessions/login';
import Logout       from './components/sessions/logout';
import Register     from './components/users/register';
import Dashboard    from './components/main/dashboard';
import NotFound     from './components/not_found';
import Connections  from './components/users/connections';
import About        from './components/main/about';
// ------------------ Components --------------------------

export default class Routes {

  requireAuth(nextState, replaceState) {
    if(!UserStore.loggedIn()){
      replaceState({ nextPathname: nextState.location.pathname }, '/login');
    }
  }

  Routes() {
    return(
      <Route path="/" component={Index}>
        <IndexRoute component={Home}/>
        <Route path="login" component={Login}/>
        <Route path="register" component={Register}/>
        <Route path="logout" component={Logout}/>
        <Route path="about" component={About}/>
        <Route path="dashboard" component={Dashboard} onEnter={this.requireAuth}/>
        <Route path="connections" component={Connections}/>
        <Route path="*" component={NotFound}/>
      </Route>
    );
  }
}


