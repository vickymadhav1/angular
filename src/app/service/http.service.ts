import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private httpOptions = {
    baseUrl: environment.baseUrl,
    header: {
      headers: new HttpHeaders({
        //Authorization: this.authGuardService.getToken() ? this.authGuardService.getToken() : ''
      })
    }
  };

  constructor(private http: HttpClient) { }

  get = (api: string) => {
    return this.http
      .get(this.httpOptions.baseUrl + api, this.httpOptions.header)
      .pipe(
        catchError(err => {
          console.log(err);
          return throwError(err);
        })
      );
  }

  post = (api: string, data) => {
    return this.http
      .post(this.httpOptions.baseUrl + api, data, this.httpOptions.header)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }

  put = (api: string, data) => {
    return this.http
      .put(this.httpOptions.baseUrl + api, data, this.httpOptions.header)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }

  delete = (api: string) => {
    return this.http
      .delete(this.httpOptions.baseUrl + api, this.httpOptions.header)
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }
}
