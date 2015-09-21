"use strict";

import React         from 'react';
import {Link}        from 'react-router';
import BaseComponent from "../base_component";
import UserActions   from "../../actions/user";
import UserStore     from "../../stores/user";

class Logout extends BaseComponent {

  constructor(){
    super();

    this.stores = [UserStore];
    UserActions.logout();
    this.state = this.getState();
  }

  getState(){
    return {
      loggedOut: UserStore.loggedOut()
    };
  }

  render(){
    if (!this.state.loggedOut) {
      return <h3>One Moment</h3>;
    } else if (this.state.loggedOut) {
      return (
        <div>
          <h2>You have successfully logged out</h2>
          <Link to="/">Home</Link>
        </div>
      );
    } else {
      return <h3>There was an error logging out, please try again</h3>;
    }
  }
}

module.exports = Logout;
