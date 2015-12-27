"use strict";

import Constants  from "../../common/constants";
import Dispatcher from "../../common/dispatcher";

export default {

  clearFormErrors(){
    Dispatcher.dispatch({
      action: Constants.CLEAR_FORM_ERRORS
    });
  },

};