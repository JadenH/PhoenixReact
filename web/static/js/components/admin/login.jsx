"use strict";

import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";

import React         from "react";
import Validator     from "validator";
import UserActions   from "../../actions/user";
import UserStore     from "../../stores/user";
import AtomicForm    from "atomic-form";
import BaseComponent from "../base_component";
import _             from "lodash";
import assign        from "object-assign";
import Defines       from "../defines";

class Login extends BaseComponent {

  constructor(props, context){
    super(props, context);

    this.stores = [UserStore];
    this.state = this.getState();

    this._bind('validationMessage', 'onInputChange', 'afterValidation')
    if(this.state.loggedIn) {
      context.router.transitionTo("dashboard");
    }
  }

  getState() {
    return {
      loggedIn: UserStore.loggedIn()
    };
  }

  // Method to update state based upon store changes
  storeChanged(){
    super.storeChanged();
    if(this.state.loggedIn) {
      this.context.router.transitionTo("dashboard");
    }
  }

  handleSubmit(){
    UserActions.login({
      user: {
        email: formData.email,
        password: formData.password
      }
    });
  }

  collectFormData(refs) {
    var formData = {};
    _.forEach(refs, (val, ref) => {
      formData[ref] = refs[ref].getValue();
    }.bind(this));
    return formData;
  }

  afterValidation(formValidations) {
    //Callback after validation fails.
    this.setState({validations: formValidations});
  }

  validationMessage(field) {
    var res = {};
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        res[field] = this.state.validations[field].message[0];
        return res;
      }
    }
    return null;
  }

  getStyles() {
    return {
      paper: {
        backgroundColor: Defines.colors.white,
      },

      container: {
        width: "345px",
        margin: "auto"
      },

      button: {
        backgroundColor : Defines.colors.white,
        color           : Defines.colors.teal,
      },

      form: {
        padding: "10px"
      }
    };
  }

  render(){
    var styles = this.getStyles();
    return(
    <div style={styles.container}>
      <h3>Login</h3>
        <Paper style={styles.paper} zDepth={0}>
          <AtomicForm ref="MainForm" doSubmit={this.handleSubmit} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
            <TextField hintText="johndoe@example.com" floatingLabelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e, 'email')} validate={[
              {
                message: "Must be a valid Email.",
                validate: "isEmail",
              }
              ]}/>
            <TextField type="password" hintText="******" floatingLabelText="Password" ref="password"/>
            <RaisedButton style={styles.button} label="Login" primary={true} type="submit"/>
          </AtomicForm>
        </Paper>
      </div>);
  }
}

Login.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Login;
