"use strict";

import React          from "react";
import Messages       from "./common/messages";
import LeftNav        from "./layout/left_nav";
import UsersStore     from "../stores/user";
import mui            from "material-ui";

var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;
var ThemeManager = mui.Styles.ThemeManager;
var LightRawTheme = mui.Styles.LightRawTheme;

var { AppCanvas } = mui;

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme)
    }
  }

  render(){
    return (
      <AppCanvas predefinedLayout={1}>
        <h1>Phoenix React Starter App</h1>
        {this.props.children}
        <div className="footer">
          <p>
            Assembled by <a href="http://www.jadenholladay.com">Jaden Holladay</a>.
          </p>
        </div>
      </AppCanvas>
    );
  }

}

Index.contextTypes = {
  history: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object
};

Index.childContextTypes = {
  muiTheme: React.PropTypes.object
}

module.exports = Index;
