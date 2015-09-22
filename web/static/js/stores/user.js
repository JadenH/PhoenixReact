"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _user = {};

// log the user in
function login(payload){
  _user = payload.data.body.user;
}

// Register
function register(payload){
  _user = payload.data.body.user;
}

function loadUserFromSettings(payload) {
  _user.email = payload.data.email;
  _user.displayName = payload.data.displayName;
}

function logout(){
  localStorage.removeItem('jwt');
  _user.jwt = null;
}

// Extend User Store with EventEmitter to add eventing capabilities
var UserStore = assign({}, StoreCommon, {

  // Return current user
  current(){
    return _user;
  },

  loggedIn(){
    return !_.isEmpty(_user.jwt) || !_.isEmpty(localStorage.getItem('jwt'));
  },

  loggedOut(){
    return _user.jwt == null && localStorage.getItem('jwt') == null;
  },

  jwt(){
    return _user.jwt || localStorage.getItem('jwt');
  }

});

// Register callback with Dispatcher
Dispatcher.register((payload) => {
  var action = payload.action;

  switch(action){

    // Respond to LOGIN action
    case Constants.LOGIN:
      login(payload);
      break;

    // Respond to REGISTER action
    case Constants.REGISTER:
      register(payload.data.body.user);
      break;

    case Constants.LOGOUT:
      logout(payload);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  UserStore.emitChange();

  return true;

});

export default UserStore;

