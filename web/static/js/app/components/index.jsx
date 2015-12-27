"use strict";
import { Grid, Row, Cell } from 'react-inline-grid';

import React          from "react";
import Messages       from "./common/messages";
import UsersStore     from "../stores/user";
import mui            from "material-ui";
import muiTheme from "../themes/mui_theme";
import BaseComponent from "./base_component";
import SettingsStore  from "../../common/stores/settings";
import Header         from "./layout/header";

var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;
var ThemeManager = mui.Styles.ThemeManager;

var { AppCanvas } = mui;

class Index extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.stores = [SettingsStore]
  }

  storeChanged(){
    if (!SettingsStore.loggedIn()) {
      this.context.history.pushState(null, '/login');
    }
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(muiTheme)
    }
  }

  render(){
    return (
      <AppCanvas predefinedLayout={1}>
        <Header/>
        {this.props.children}
        <div style={{
          borderTop: "#888888",
          borderWidth: "1px 0px 0px",
          borderStyle: "solid"
        }}>
          <Grid>
            <Row is="nospace">
              <Cell is="middle">
              <h5>
                Built by <a target="_blank" href="http://jadenholladay.com">Jaden Holladay</a>
              </h5>
              </Cell>
            </Row>
          </Grid>
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
