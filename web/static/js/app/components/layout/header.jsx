"use strict";
import { Grid, Row, Cell } from 'react-inline-grid';
import { Link }     from "react-router";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, IconMenu, IconButton } from "material-ui";
import MenuItem from 'material-ui/lib/menus/menu-item';

import React          from "react";
import BaseComponent from "../base_component";
import SettingsStore  from "../../../common/stores/settings";

class Header extends BaseComponent {
  constructor(props, context) {
    super(props, context);
    this.stores = [SettingsStore]
  }

  getState() {
    return {}
  }

  styles() {
    return {
      header: {
        height: "45px",
        backgroundColor: "#2e2f33"
      },
      logo: {
        verticalAlign: "middle",
        color: "#ffffff",
      },
      userIcon: {
        float: "right",
        marginTop: "0px",
        marginRight: "3px",
        textTransform: "uppercase",
        color: "#7f8082"
      },
      docs: {
        float: "right"
      },
      docsIcon: {
        verticalAlign: "middle",
        color: "#ffffff",
      }
    }
  }

  accountMenu(e, value) {
    if (value == "logout") {
      this.context.history.pushState(null, '/logout');
    }
  }

  accountDropDown() {
    var styles = this.styles();
    if (SettingsStore.loggedIn()) {
      return(
        <span style={styles.userIcon}>
          <IconMenu onChange={(e, value) => this.accountMenu(e, value)} iconButtonElement={
            <IconButton tooltip="Account">
              <FontIcon className="mdi mdi-account"/>
            </IconButton>
          }>
            <MenuItem index={0} value="logout" primaryText="Sign out" />
          </IconMenu>
          </span>
        )
    } else {
      return null
    }
  }

  render(){
    var styles = this.styles();
    return (
      <div style={styles.header}>
        <Link to="/dashboard">
          <IconButton tooltip="Home">
            <FontIcon className="mdi mdi-home"/>
          </IconButton>
        </Link>
        {this.accountDropDown()}
        <span style={styles.userIcon}>
        </span>
      </div>
    );
  }

}

Header.contextTypes = {
  history: React.PropTypes.object.isRequired,
};

module.exports = Header;
