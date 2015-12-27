"use strict";

import React         from 'react';
import {Link}        from 'react-router';
import BaseComponent from "../base_component";
import UserActions   from "../../actions/user";
import SettingsStore from "../../../common/stores/settings";

class Logout extends BaseComponent {

  constructor(){
    super();
    UserActions.logout();
  }

  logout() {
    UserActions.logout();
  }

  render(){
    return (<h5>Ooops, an error while logging out may have occured. <a onClick={e => logout()}>Click here to try Again.</a></h5>)
  }
}

module.exports = Logout;
