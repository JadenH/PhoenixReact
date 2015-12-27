"use strict";

import Constants   from "../../common/constants";
import Dispatcher  from "../../common/dispatcher";
import StoreCommon from "../../common/stores/store_common";
import assign      from "object-assign";

var _messages = [];

function receiveMessage(payload){
  _messages.push({message: payload.data.body, user: payload.data.user});
}

// Extend User Store with EventEmitter to add eventing capabilities
var DashboardStore = assign({}, StoreCommon, {

  // Return current user
  messages(){
    return _messages
  },

});

// Register callback with Dispatcher
Dispatcher.register((payload) => {
  var action = payload.action;

  switch(action){

    // Respond to REGISTER action
    case Constants.NEW_MSG:
      receiveMessage(payload);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  DashboardStore.emitChange();

  return true;

});

export default DashboardStore;

