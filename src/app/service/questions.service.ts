import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
// import { catchError, tap, map } from 'rxjs/operators';
// import 'rxjs/add/operator/map';
import { HttpService } from "./http.service";

@Injectable()
export class QuestionsService {
  private readonly getNewsLatterApi = "answer-preapreCurrentEmployeeTest/";

  constructor(private http: HttpService, private httpClient: HttpClient) {}

  requestOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Origin": "*"
    })
  };

  getAllQuestions() {
    //return this.http.get(this.getNewsLatterApi);
    return this.httpClient.get("http://192.168.2.153:8080/quiz/current");
  }
}
