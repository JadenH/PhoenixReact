"use strict";

import Constants   from   "../../common/constants";
import Dispatcher  from   "../../common/dispatcher";

export default {

  load(defaultSettings){
    Dispatcher.dispatch({ action: Constants.SETTINGS_LOAD, data: defaultSettings });
  }

};