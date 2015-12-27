"use strict";

import React        from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

var appDirectory = './app';

// ------------------ Components --------------------------
import Index        from './app/components/index';
import Home         from './app/components/main/home';
import Login        from './app/components/users/login';
import Logout       from './app/components/users/logout';
import Register     from './app/components/users/register';
import Dashboard    from './app/components/main/dashboard';
import NotFound     from './app/components/not_found';
import About        from './app/components/main/about';
// ------------------ Components --------------------------

// ------------------ Stores --------------------------
import SettingsStore    from './common/stores/settings';
// ------------------ Stores --------------------------

export default class Routes {

  requireAuth(nextState, replaceState) {
    if(!SettingsStore.loggedIn()){
      // Redirects the user to sign in. Onced authenticated, we can redirect
      // to the path they originally were attempting to access by using:
      // this.props.locations.state.nextPathname
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
        <Route path="*" component={NotFound}/>
      </Route>
    );
  }
}
