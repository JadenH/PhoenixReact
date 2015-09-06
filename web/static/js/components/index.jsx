"use strict";

import React          from "react";
import {RouteHandler} from "react-router";


class Index extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render(){

    return (
      <div>
        <h1>Reactjs & Phoenix Boilerplate</h1>
        <RouteHandler />
        <div className="footer">
          <p>
            Assembled by <a href="http://www.jadenholladay.com">Jaden Holladay</a>.
          </p>
        </div>
      </div>
    );
  }

}

Index.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Index;
