"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";

var _user = {};
var logoutState = 1;

// log the user in
function login(payload){
  _user.email = payload.data.body.email;
  _user.displayName = payload.data.body.displayName;
  // We get a JWT back.
  var jwt = payload.data.body.jwt;
  localStorage.setItem('jwt', jwt);
  logoutState = 1;
}

// Register
function register(user){
  _user.email = user.email;
  _user.displayName = user.displayName;
  _user.jwt = user.jwt;
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
    return _user.jwt || localStorage.getItem('jwt') !== null;
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

