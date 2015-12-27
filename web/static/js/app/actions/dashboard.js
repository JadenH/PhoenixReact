"use strict";

import Constants  from "../../common/constants";
import Dispatcher from "../../common/dispatcher";
import Socket     from "../../common/actions/socket";

export default {

  sendChat(payload){
    Socket.sendMessage("chat:lobby", "new_msg", {body: payload});
  },

};