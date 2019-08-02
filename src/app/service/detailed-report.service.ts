import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DetailedReportService {
  private getCompanyByIdApi = 'company-getCompany';

  constructor(private httpService: HttpService) { }

  getCompanyById(id) {
    // tslint:disable-next-line: whitespace
    return this.httpService.get(this.getCompanyByIdApi+"?id="+id + '/');
  }
}
