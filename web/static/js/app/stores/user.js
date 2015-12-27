"use strict";

import Constants   from "../../common/constants";
import Dispatcher  from "../../common/dispatcher";
import StoreCommon from "../../common/stores/store_common";
import assign      from "object-assign";

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

// Extend User Store with EventEmitter to add eventing capabilities
var UserStore = assign({}, StoreCommon, {

  // Return current user
  current(){
    return _user;
  },

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
      register(payload);
      break;

    case Constants.LOGOUT:
      _user = {};
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  UserStore.emitChange();

  return true;

});

export default UserStore;

