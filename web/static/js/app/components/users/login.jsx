"use strict";

import { Link, History, Navigation }      from "react-router";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";
import { Grid, Row, Cell } from 'react-inline-grid';

import React         from "react";
import Validator     from "validator";
import UserActions   from "../../actions/user";
import FormActions   from "../../actions/form";
import _             from "lodash";
import assign        from "object-assign";
import UserStore     from "../../stores/user";
import FormStore     from "../../stores/form";
import AtomicForm    from "atomic-form";
import BaseComponent from "../base_component";
import SettingsStore from "../../../common/stores/settings";

class Login extends BaseComponent {
  constructor(props, context){
    super(props, context);

    this.stores = [UserStore, SettingsStore, FormStore];
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
      loggedIn: SettingsStore.loggedIn(),
      nextPathname: nextPathname || '/dashboard',
      submitDisabled: true,
      formError: FormStore.formMessages()
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
    var submitDisabled = !this.refs.MainForm.allValid(formValidations);
    this.setState({validations: validations, submitDisabled:submitDisabled});
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
      socialButtons: {
        height: "100%",
        verticalAlign: "middle",
        float: "left",
        paddingLeft: "12px",
        lineHeight: "36px",
        color: "#295266"
      },

    };
  }

  render(){
    var styles = this.getStyles();
    return (
      <Grid>
        <Row is="center">
          <Cell is="4">
            <Paper>
              <Row>
                <Cell is="12">
                  <AtomicForm ref="MainForm" doSubmit={this.handleSubmit} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
                    <div style={{textAlign: "center", marginBottom: "12px"}}><FontIcon style={{fontSize: "120px"}} className="mdi mdi-account-circle"/></div>
                    <h5 style={{color: "#F44336"}}>{this.state.formError}</h5>
                    <TextField fullWidth hintText="account@example.com" labelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e, 'email')} validate={[
                      {
                        message: "Must be a valid Email.",
                        validate: "isEmail",
                      }
                    ]}/>
                    <TextField fullWidth type="password" hintText="******" labelText="Password" ref="password" errorText={this.validationMessage("password")} onChange={(e) => this.onInputChange(e, 'password')} validate={[
                      {
                        message: "Password can't be blank.",
                        validate: "isLength",
                        args: [1]
                      }
                    ]}/>
                    <RaisedButton fullWidth primary style={{marginTop:"20px"}} label="Sign in" labelColor="#ffffff" type="submit" disabled={this.state.submitDisabled}/>
                    <p style={{paddingTop:"12px"}}>
                      Need an account? <Link to="/register" style={{textTransform: "uppercase"}} state={this.state}>Sign Up</Link>
                    </p>
                  </AtomicForm>
                </Cell>
              </Row>
            </Paper>
          </Cell>
        </Row>
      </Grid>);
}

}

Login.contextTypes = {
  history: React.PropTypes.object.isRequired,
  muiTheme: React.PropTypes.object
};

module.exports = Login;


// <Row is="center">
//   <Cell>
//     <RaisedButton className="auth-button" linkButton href="/auth/facebook" secondary label="Facebook">
//       <FontIcon style={styles.socialButtons} className="mdi mdi-facebook"/>
//     </RaisedButton>
//   </Cell>
//   <Cell>
//     <RaisedButton className="auth-button" linkButton href="/auth/twitter" secondary label="Twitter">
//       <FontIcon style={styles.socialButtons} className="mdi mdi-twitter"/>
//     </RaisedButton>
//   </Cell>
//   <Cell>
//     <RaisedButton className="auth-button" linkButton href="/auth/github" secondary label="GitHub">
//       <FontIcon style={styles.socialButtons} className="mdi mdi-github-box"/>
//     </RaisedButton>
//   </Cell>
// </Row>