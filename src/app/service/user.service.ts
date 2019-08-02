import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";

@Injectable()
export class UserService {
  private readonly getNewsLatterApi = "query-subscribeNewsLetter/";
  private readonly createNewCompanyApi = "query-requestNewCompany/";
  private readonly registerApi = 'auth/signup/';
  private readonly loginApi = 'auth/login';

  constructor(private http: HttpService) {}

  getNewsLetter(subscribe) {
    return this.http.post(this.getNewsLatterApi, subscribe);
  }

  createCompany(company) {
    return this.http.post(this.createNewCompanyApi, company);
  }

  // register a user
  register(user) {
    return this.http.post(this.registerApi, user);
  }

  // login if user is registered
  login(credentials) {
    return this.http.post(this.loginApi, credentials);
  }
}
