import store from "../redux/store";
import {CONFIG} from "../constants"
import {TOKEN_REMOVE} from "../redux/actionTypes";

interface ProfileInterface {
  picture: string,
  firstName: string,
  lastName: string,
  email: string,
  authenticated: boolean,
}

const defaultProfile = {
  picture: "assets/images/profile.png",
  firstName: "",
  lastName: "",
  email: "",
  authenticated: false,
}

export default class Api {

  static myInstance: Api;
  private headers: any;
  private baseUrl: string;
  public loggedIn: boolean;
  public profile: ProfileInterface;
  public token: string;
  public lang: string;
  private texts: any

  constructor() {
    this.loggedIn = false;
    this.lang = 'sv'
    this.baseUrl = CONFIG.API_ENDPOINT;
    this.headers = {
      'X-Version': CONFIG.VERSION,
      'X-platform': 'unknown',
      'Content-Type': 'application/json',
    };

    this.profile = defaultProfile;

    this.token = window.localStorage[CONFIG.TOKEN_NAME];

    if (this.token) {
      this.loggedIn = true;
      this.headers['Authorization'] = 'Bearer ' + this.token;
    }
  }


  /**
   * @returns {ApiService}
   */
  static getInstance(): Api {
    if (Api.myInstance == null) {
      Api.myInstance = new Api();
    }

    return this.myInstance;
  }

  public getProfile() {
    this.get('settings').then(response => {
      if (response.ok) {
        response.json().then(responseJson => {
          this.profile = responseJson.person;
        });
      }
    });
  }

  public logOut(nextUrl: string) {
    this.get('logout').then(response => {
      this.loggedIn = false;
      this.profile = defaultProfile;
      delete window.localStorage[CONFIG.TOKEN_NAME];
      if (nextUrl) {
        window.location.href = nextUrl
      }
    })
  }

  public logIn(token: string) {
    window.localStorage[CONFIG.TOKEN_NAME] = token;
    this.headers['Authorization'] = 'Bearer ' + token;
    this.loggedIn = true;
    this.token = token;
    // this.getProfile();
  }

  public get(url: string) {

    return fetch(this.baseUrl + url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: this.headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
    });
  }

  public sess_get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.get(url).then((result) => {
        if (result.ok) {
          result.json().then(resultJson => {
            resolve(resultJson);
          });
        } else {
          if (result.status === 401 || result.status === 403) {
            store.dispatch({type: TOKEN_REMOVE})
          }
          reject(result.status);
        }
      });
    });
  }

  public post(url: string, data: any) {

    return fetch(this.baseUrl + url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: this.headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  }

  public post_raw(url: string, data: any) {

    return fetch(this.baseUrl + url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: this.headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: data        // body data type must match "Content-Type" header
    });
  }
}
