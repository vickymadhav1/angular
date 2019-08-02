import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable()
export class AuthenticationService {
  [x: string]: any;
  userData: any; // Save logged in user data

  constructor(public router: Router) {}

  // set token value in local storage
  setUserDetailsWithToken(userDetails) {
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  // get token value
  getToken() {
    return JSON.parse(sessionStorage.getItem("userDetails")) !== null
      ? JSON.parse(sessionStorage.getItem("userDetails")).token
      : null;
  }

  // get token value
  getUserId() {
    return JSON.parse(sessionStorage.getItem("userDetails")) !== null
      ? JSON.parse(sessionStorage.getItem("userDetails")).userId
      : null;
  }

  // check whether user is loagged in or not
  isLoggednIn() {
    return this.getToken() !== null;
  }
}
