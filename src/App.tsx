import Menu from './components/Menu';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { connect, ConnectedProps } from "react-redux"
import {tokenStore, tokenRemove, tokenChecked} from "./redux/actions"

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/custom.css';
import './theme/tailwind.css';
import './theme/variables.css';
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import Handle from "./pages/Handle";
import Settings from "./pages/Settings";
import {CONFIG} from "./constants";
import Login from "./components/Login";

const mapState = (state: any) => ({
  session: state.session
})

const mapDispatch = {
  tokenStore,
  tokenRemove,
  tokenChecked
}

const connector = connect(mapState, mapDispatch)

interface ComponentState {
  showUnreadToast: boolean;
  showUnreadToastLink: boolean;
  toastLink: string;
  toastMessage: string;
  loggedIn: boolean;
  redirect: string;
  reLogin: boolean;
}

type PropsFromRedux = ConnectedProps<typeof connector>

class App extends React.Component<PropsFromRedux, ComponentState>  {

  componentDidMount() {
    this.checkToken()
  }

  checkToken = () => {
    const token = window.localStorage[CONFIG.TOKEN_NAME]
    if (token) {
      this.props.tokenStore(token)
    } else {
      this.props.tokenChecked()
    }
  }

  public exitLogin = (loggedIn: boolean) => {
    if (loggedIn) {
      this.checkToken()
    }
  }

  requiresLogin = () => {
    const urlParts = window.location.pathname.split('/')
    if (urlParts.length < 3) {
      return true
    }
    const page = urlParts[2]

    const loginExceptions = ['client_onboarding', 'coach_onboarding', 'create_account', 'reset_password']
    if (loginExceptions.indexOf(page) > -1) {
      return false
    }
    return true
  }

  render() {

    if (!this.props.session.checked) {
      return (<div/>)
    } else if (!this.props.session.valid) {
      if (this.requiresLogin()) {
        return (<Login exitLogin={this.exitLogin}/>)
      }
    }

    return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/page/home" component={Home} exact />
              <Route path="/page/summary" component={Summary} exact />
              <Route path="/page/handle" component={Handle} exact />
              <Route path="/page/settings" component={Settings} exact />
              <Redirect from="/" to="/page/home" exact />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    );

  }
}

export default connector(App)
