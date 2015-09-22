"use strict";

import Dispatcher     from "../dispatcher";
import Constants      from "../constants";
import StoreCommon    from "./store_common";
import assign         from "object-assign";
import QueryString    from '../utils/query_string';

var _settings = {};

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
    csrfToken        : defaultSettings.csrfToken || null
  };

}

function updateJWT(jwt) {
  if(jwt != null) {
    localStorage.setItem('jwt', jwt);
  } else {
    localStorage.removeItem('jwt');
  }
}

// Extend Message Store with EventEmitter to add eventing capabilities
var SettingsStore = assign({}, StoreCommon, {

  // Return current messages
  current(){
    return _settings;
  }

});

// Register callback with Dispatcher
Dispatcher.register(function(payload) {

  switch(payload.action){

    // Respond to TIMEOUT action
    case Constants.SETTINGS_LOAD:
      loadSettings(payload.data);
      break;

    case Constants.REGISTER:
      updateJWT(payload.data.body.user.jwt);
      break;

    case Constants.LOGIN:
      updateJWT(payload.data.body.user.jwt);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  SettingsStore.emitChange();

  return true;

});

export default SettingsStore;

