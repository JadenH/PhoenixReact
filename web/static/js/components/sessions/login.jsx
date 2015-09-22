"use strict";

import React         from "react";
import Validator     from "validator";
import UserActions   from "../../actions/user";
import _             from "lodash";
import assign        from "object-assign";
import UserStore     from "../../stores/user";
import AtomicForm    from "atomic-form";
import BaseComponent from "../base_component";
import { Link, History, Navigation }      from "react-router";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";

class Login extends BaseComponent {
  constructor(props, context){
    super(props, context);

    this.stores = [UserStore];
    this.state = this.getState();

    this._bind('validationMessage', 'onInputChange', 'afterValidation')
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.setState(this.getState());
  }

  getState() {
    var nextPathname = this.props.location.state && this.props.location.state.nextPathname
    return {
      loggedIn: UserStore.loggedIn(),
      nextPathname: nextPathname || '/dashboard'
    };
  }

  // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState());
  }

  componentWillMount(){
    if(this.state.loggedIn) {
      this.context.history.pushState(null, this.state.nextPathname);
    }
  }

  componentDidUpdate(){
    if(this.state.loggedIn) {
      this.context.history.pushState(null, this.state.nextPathname);
    }
  }

  handleSubmit(formData){
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

  onInputChange(e, ref) {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    var validations = this.state.validations || {};
    validations[ref] = formValidations[ref];
    this.setState({validations: validations});
  }

  validationMessage(field) {
    var res = {};
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        res = this.state.validations[field].message[0];
        return res;
      }
    }
    return null;
  }

  getStyles() {
    return {
      paper: {
        backgroundColor: "white",
        width: "345px",
        margin: "auto"
      },

      container: {
        marginTop: "10px",
        margin: "auto"
      }
    };
  }

  render(){
    return (<div className="login-screen">
      <Paper className="login-paper">
        <AtomicForm ref="MainForm" doSubmit={this.handleSubmit} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
          <h4>Login</h4>
          <TextField hintText="johndoe@example.com" floatingLabelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e, 'email')} validate={[
            {
              message: "Must be a valid Email.",
              validate: "isEmail",
            }
            ]}/>
          <TextField type="password" hintText="******" floatingLabelText="Password" ref="password"/>
          <Link to="/register" state={this.state}>Create Account</Link>
          <RaisedButton label="Login" primary={true} type="submit"/>
        </AtomicForm>
      </Paper>

      <div className="button-example-container">
        <RaisedButton className="auth-button" linkButton={true} href="/auth/facebook" secondary={true}>
          <FontIcon className="icon-facebook example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Facebook</span>
        </RaisedButton>
      </div>

      <div className="button-example-container">
        <RaisedButton className="auth-button" linkButton={true} href="/auth/twitter" secondary={true}>
          <FontIcon className="icon-twitter example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Twitter</span>
        </RaisedButton>
      </div>

      <div className="button-example-container">
        <RaisedButton className="auth-button" linkButton={true} href="/auth/google" secondary={true}>
          <FontIcon className="icon-google example-button-icon"/>
          <span className="mui-raised-button-label example-icon-button-label">Google+</span>
        </RaisedButton>
      </div>

    </div>);
  }

}

Login.contextTypes = {
  history: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object
};

module.exports = Login;
