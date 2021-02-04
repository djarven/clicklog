import React from "react";
import {IonButton} from "@ionic/react";
import Api from "../services/Api";

interface ComponentProps {
  exitLogin: Function
}

interface ComponentState {
  email: string
  password: string
  errorMsg: string
  loggedIn: boolean
  formOk: boolean
}

export default class Login extends React.Component<ComponentProps, ComponentState> {

  private api = Api.getInstance()
  private pollInterval: any

  state = {
    email: '',
    password: '',
    errorMsg: '',
    loggedIn: this.api.loggedIn,
    formOk: false,
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  private exitLogin = (loggedIn: boolean) => {
    this.props.exitLogin(loggedIn);
  }

  private handleEmail = (e: any) => {
    this.setState({email: e.target.value});
  }

  private handlePassword = (e: any) => {
    this.setState({password: e.target.value});
  }

  private emailOk = () => {
    if (this.state.email.length > 5 || this.state.email.indexOf('@') > -1) {
      return true;
    }
    return false;
  }

  private passwordOk = () => {
    return this.state.password.length > 5;
  }

  private loginPassword = () => {
    this.setState({errorMsg: ''})

    if (!this.emailOk()) {
      this.setState({errorMsg: 'Fel format på epost-adressen'})
      return
    }

    if (!this.passwordOk()) {
      this.setState({errorMsg: 'Fel på lösenordet'})
      return
    }

    const data = {
      email: this.state.email,
      password: this.state.password
    }

    this.api.post('login', data).then(response => {
      if (response.ok) {
        response.json().then(responseJson => {
          if (responseJson.status === 'ok') {
            if (responseJson.user_token.jwt_token) {
              this.api.logIn(responseJson.user_token.jwt_token)
            }
            this.exitLogin(true);
          } else {
            this.setState({errorMsg: responseJson.message})
          }
        })
      } else {
        if (response.status === 401) {
          this.setState({errorMsg: 'Fel inloggningsuppgifter'})
        } else {
          this.setState({errorMsg: response.statusText})
        }
      }
    });
  }

  private forgotPassword = () => {
    this.setState({errorMsg: ''})

    if (!this.emailOk()) {
      this.setState({errorMsg: 'Du måste fylla i en giltig epost-adress'})
      return
    }

    const data = {
      email: this.state.email
    }

    this.api.post('forgot_password', data).then(response => {
      if (response.ok) {
        response.json().then(responseJson => {
          if (responseJson.status === 'ok') {
            this.setState({errorMsg: 'Vi har skickat ett mail med instruktioner till ' + this.state.email})
          } else {
            this.setState({errorMsg: responseJson.message})
          }
        })
      } else {
        if (response.status < 500) {
          response.json().then(responseJson => {
            this.setState({errorMsg: responseJson.message})
          })
        } else {
          this.setState({errorMsg: response.statusText})
        }
      }
    });
  }

  render() {
    return (
      <div className="bg_zebra_pattern pt-8 text_center min-h-screen">
        <h2 className="color_white">Logga in</h2>

        <div className="mt-8">
          <input type="text" name="email" placeholder="Epost"
                 onChange={(e) => this.handleEmail(e)}/>
        </div>

        <div className="mt-4">
          <input type="password" name="password" placeholder="Lösenord"
                 onChange={(e) => this.handlePassword(e)}/>
        </div>

        <div className="mt-4">
          <IonButton onClick={() => this.loginPassword()}>Logga in</IonButton>
        </div>

        {
          this.state.errorMsg.length > 0 &&
          <div className="mt-8 bg_white p-4">{this.state.errorMsg}</div>
        }

        <div className="mt-8 underline color_white cursor-pointer"
             onClick={() => this.forgotPassword()}>
          Jag har glömt mitt lösenord
        </div>

      </div>
    )
  }
}
