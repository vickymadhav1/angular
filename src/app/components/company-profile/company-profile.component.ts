import { Component, OnInit } from "@angular/core";
import { CompanyService } from "src/app/service/company.service";

@Component({
  selector: "app-company-profile",
  templateUrl: "./company-profile.component.html",
  styleUrls: ["./company-profile.component.scss"]
})
export class CompanyProfileComponent implements OnInit {
  data: any;
  companyProfiledetails = [];
  pieChartOptions: any;
  constructor(private companyService: CompanyService) {
    this.data = {
      events: [],
      labels: ["Female", "Male"],
      datasets: [
        {
          data: [25, 75],
          backgroundColor: ["#148fd5", "#da1b63"]
        }
      ]
    };
    this.pieChartOptions = {
      legend: {
        display: false
      },
      tooltips: {
        enabled: true
      }
    };
  }
  // const data= this.companyService.companayName

  ngOnInit() {
    this.companyProfile();
  }
  companyProfile() {
    this.companyService.getCompanyProfile().subscribe((data: any) => {
      // this.companyService.companayName;
      console.log(data);

      if (data) {
        //companyProfiledetails array
        for (let companyProfiledetails of data.data) {
          this.companyProfiledetails.push(companyProfiledetails.companyName); //companyName is api name
        }
        console.log(this.companyProfiledetails);
      }
    });
  }
}
