"use strict";

import Constants   from "../../common/constants";
import Dispatcher  from "../../common/dispatcher";
import StoreCommon from "./store_common";
import assign      from "object-assign";
import QueryString from '../utils/query_string';
import socket        from '../actions/socket';

var _settings = {};

function login(jwt) {
  if(jwt !== null) {
    _settings.jwt = jwt;
    localStorage.setItem('jwt', jwt);
    socket.connect(jwt);
  } else {
    _settings.jwt = null;
    localStorage.removeItem('jwt');
    socket.disconnect();
  }
}

function logout(){
  localStorage.removeItem('jwt');
  _settings.jwt = null;
  socket.disconnect();
}

function loadSettings(defaultSettings){

  defaultSettings = defaultSettings || {};

  var bestValue = function(settings_prop, params_prop, default_prop){
    return defaultSettings[settings_prop] || QueryString.params()[params_prop] || default_prop;
  };

  // var jwt = (defaultSettings.jwt && defaultSettings.jwt.length) ? defaultSettings.jwt : null;
  // if(jwt!==null) {
  //   localStorage.setItem('jwt', jwt);
  // } else {
  //   localStorage.removeItem('jwt');
  // }

  _settings = {
    apiUrl           : defaultSettings.api_url || "/",
    csrfToken        : defaultSettings.csrfToken || null,
    jwt              : null
  };

}

// Extend Message Store with EventEmitter to add eventing capabilities
var SettingsStore = assign({}, StoreCommon, {

  // Return current messages
  current(){
    return _settings;
  },

  jwt(){
    return _settings.jwt || localStorage.getItem('jwt');
  },

  loggedIn(){
    return !_.isEmpty(_settings.jwt) || !_.isEmpty(localStorage.getItem('jwt'));
  },

  loggedOut(){
    return _settings.jwt == null && localStorage.getItem('jwt') == null;
  },

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {

  switch(payload.action){

    // Respond to TIMEOUT action
    case Constants.SETTINGS_LOAD:
      loadSettings(payload.data);
      break;

    // Respond to LOGIN action
    case Constants.LOGIN:
      login(payload.data.body.user.jwt);
      break;

    // Respond to REGISTER action
    case Constants.REGISTER:
      login(payload.data.body.user.jwt);
      break;

    case Constants.LOGOUT:
      logout(payload);
      break;

    case Constants.DISCONNECT:
      logout(payload);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  SettingsStore.emitChange();

  return true;

});

export default SettingsStore;

