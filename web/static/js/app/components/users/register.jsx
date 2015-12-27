"use strict";
import { Link }     from 'react-router';
import { Grid, Row, Cell } from 'react-inline-grid';
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";

import React         from 'react';
import Validator     from "validator";
import UserStore     from "../../stores/user";
import UserActions   from "../../actions/user";
import _             from "lodash";
import assign        from "object-assign";
import AtomicForm    from "atomic-form";
import BaseComponent from "../base_component";
import Defines       from "../defines";
import SettingsStore from "../../../common/stores/settings";

class Register extends BaseComponent {

  constructor(props, context){
    super(props, context)
    this.stores = [UserStore]
    this._bind('onInputChange', 'validationMessage', 'onInputChange', 'afterValidation')
    this.state = this.getState();
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
      submitDisabled: true
    };
  }

  storeChanged() {
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

  handleRegister(formData){
    UserActions.register({
      user: {
        email: formData.email,
        password: formData.password,
        name: formData.name
      }
    });
  }

  onInputChange(e, ref) {
    var formData = this.refs.MainForm.formData();
    var formValidations = this.refs.MainForm.validateForm(formData);
    var validations = this.state.validations || {};
    _.forEach(ref, (ref) => {
      validations[ref] = formValidations[ref];
    })
    var submitDisabled = !this.refs.MainForm.allValid(formValidations);
    this.setState({validations: validations, submitDisabled: submitDisabled});
  }

  getStyles(){
    return {
      signUpButton: {
        marginTop: "20px",
        backgroundColor: Defines.colors.teal
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
        res = this.state.validations[field].message[0];
        return res;
      }
    }
    return null;
  }


  render(){
    var styles = this.getStyles();
    return (
      <Grid>
        <Row is="center">
          <Cell is="6">
            <Paper>
              <Row>
                <Cell is="12">
                  <AtomicForm ref="MainForm" doSubmit={this.handleRegister} afterValidation={this.afterValidation} collectFormData={this.collectFormData}>
                    <h3>Create An Account</h3>
                    <TextField fullWidth hintText="account@example.com" floatingLabelText="Email" errorText={this.validationMessage("email")} ref="email" onBlur={(e) => this.onInputChange(e, ['email'])} validate={[
                    {
                      message: "Must be a valid Email.",
                      validate: "isEmail",
                    }
                    ]}/>
                    <TextField fullWidth hintText="" floatingLabelText="Display Name" errorText={this.validationMessage("name")} ref="name" onBlur={(e) => this.onInputChange(e, ['name'])} validate={[
                    {
                      message: "Cannot contain spaces.",
                      validate: (val) => { return !/\s/.test(val)}
                    },
                    {
                      message: "Name must be at least 3 characters.",
                      validate: "isLength",
                      args: [3]
                    }
                    ]}/>
                    <TextField fullWidth type="password" hintText="******" floatingLabelText="Password" errorText={this.validationMessage("password")} ref="password" onBlur={(e) => this.onInputChange(e, ['password', 'confirmPassword'])} onChange={(e) => this.onInputChange(e, ['password', 'confirmPassword'])} validate={[
                    {
                      message: "Password must be at least 5 characters.",
                      validate: "isLength",
                      args: [5]
                    }
                    ]}/>
                    <TextField fullWidth type="password" hintText="******" floatingLabelText="Confirm Password" errorText={this.validationMessage("confirmPassword")} ref="confirmPassword" onChange={(e) => this.onInputChange(e, ['password', 'confirmPassword'])} validate={[
                    {
                      message: "Passwords don't match.",
                      validate: (val, formData) => { return val == formData.password}
                    }
                    ]}/>
                    <RaisedButton fullWidth style={styles.signUpButton} label="Create Account" primary={true} type="submit" disabled={this.state.submitDisabled}/>
                    <p style={{paddingTop:"12px"}}>
                      Already have an account? <Link style={{textTransform: "uppercase"}} to="/login" state={this.state}>Sign in</Link>
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

Register.contextTypes = {
  history: React.PropTypes.object.isRequired
};


module.exports = Register;


// register: {
//   width: "400px",
//   margin: "5% auto",
//   backgroundColor: Defines.colors.white,
// }