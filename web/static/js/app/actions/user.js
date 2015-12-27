"use strict";

import Constants   from   "../../common/constants";
import Dispatcher  from   "../../common/dispatcher";

import Api         from   "../../common/actions/api";
import Socket     from "../../common/actions/socket";

export default {

  login(payload){
    Dispatcher.dispatch({ action: Constants.LOGIN_PENDING });
    Api.post(Constants.LOGIN, "sign_in", payload);
  },

  register(payload) {
    Dispatcher.dispatch({ action: Constants.REGISTER_PENDING });
    Api.post(Constants.REGISTER, "sign_up", payload);
  },

  logout(){
    Dispatcher.dispatch({ action: Constants.LOGOUT_PENDING });
    Api.del(Constants.LOGOUT, "sign_out");
  }

};
