"use strict";

import Constants   from "../../common/constants";
import Dispatcher  from "../../common/dispatcher";
import StoreCommon from "../../common/stores/store_common";
import assign      from "object-assign";

var _formMessages = [];

// Extend User Store with EventEmitter to add eventing capabilities
var FormStore = assign({}, StoreCommon, {

  formMessages() {
    if (!_.isEmpty(_formMessages)) {
      return _formMessages.pop();
    } else {
      return null;
    }
  }

});

// Register callback with Dispatcher
Dispatcher.register((payload) => {
  var action = payload.action;

  switch(action){

    case Constants.ERROR:
      if (payload.data.body.formError) {
        _formMessages = [];
        _formMessages.push(payload.data.body.formError);
      }
      break;

    case Constants.CLEAR_FORM_ERRORS:
      _formMessages = [];
      break;

    case Constants.LOGOUT:
      _formMessages = [];
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  FormStore.emitChange();

  return true;

});

export default FormStore;

