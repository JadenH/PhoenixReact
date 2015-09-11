"use strict";

import React        from 'react';
import { Link }     from 'react-router';
import Validator    from "validator";
import UserActions  from "../../actions/user";
import _            from "lodash";
import assign       from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";
import AtomicForm   from "atomic-form";
import BaseComponent from "../base_component";

class Register extends BaseComponent {

  constructor(){
    super()
    this._bind('onInputChange', 'validationMessage', 'onInputChange')
    this.state = {
      validations: {}
    };
  }

  handleRegister(formData){
    UserActions.register({
      user: {
        email: formData.email,
        password: formData.password
      }
    });
  }

  onInputChange() {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    this.setState({validations: formValidations});
  }

  getStyles(){
    return {
      register: {
        width: "400px",
        margin: "5% auto"
      },
      signUpButton: {
        marginTop: "20px"
      }
    };
  }

  afterValidation(formValidations) {
    //Callback after validation fails.
    this.setState({validations: formValidations});
  }

  collectFormData(refs) {
    var formData = {};
    _.forEach(refs, (val, ref) => {
      formData[ref] = refs[ref].getValue();
    }.bind(this));
    return formData;
  }

  validationMessage(field) {
    var res = {};
    if (this.state.validations && this.state.validations[field]) {
      if (!this.state.validations[field].isValid) {
        res[field] = this.state.validations[field].message[0];
        return res;
      }
    }
    res[field] = "";
    return res;
  }

  render(){
    var styles = this.getStyles();
    return (<div>
      <Paper style={styles.register}>
        <h1><span className="fa fa-sign-in"></span> Signup</h1>
        <AtomicForm ref="MainForm" doSubmit={this.handleRegister} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
          <TextField hintText="johndoe@example.com" floatingLabelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e)} validate={[
            {
              message: "Must be a valid Email.",
              validate: "isEmail",
            }
            ]}/>
          <TextField type="password" hintText="******" floatingLabelText="Password" errorText={this.validationMessage("password")} ref="password" onBlur={(e) => this.onInputChange(e)} validate={[
            {
              message: "Password must be atleast 5 characters.",
              validate: "isLength",
              args: [5]
            }
            ]}/>
          <TextField type="password" hintText="******" floatingLabelText="Confirm Password" errorText={this.validationMessage("confirmPassword")} ref="confirmPassword" onBlur={(e) => this.onInputChange(e)} validate={[
            {
              message: "Passwords don't match.",
              validate: (val, formData) => { return val == formData.password}
            }
            ]}/>
          <RaisedButton style={styles.signUpButton} label="Signup" primary={true} type="submit"/>
        </AtomicForm>
        <p>
          Already have an account? <Link to="login">Login</Link>
        </p>
      </Paper>
    </div>);
  }
}

module.exports = Register;
