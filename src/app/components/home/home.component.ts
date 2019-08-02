import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CompanyService } from "../../service/company.service";
import { HomeService } from "src/app/service/home.service";
import { DetailedReportService } from "src/app/service/detailed-report.service";
import { MatDialog } from '@angular/material';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { AuthGuardService } from 'src/app/service/auth-guard.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  data: any;
  pieChartOptions: any;
  company = [];
  filteredcompany: Observable<string[]>;
  companycontrol = new FormControl();
  companyCard = [];
  term: string = "";

  // company top list
  companytop = []; // company top list
  companytopform = new FormControl(); //formcontrol html
  filteredcompanylist: Observable<string[]>; //let
  currentempy = [];
  currentemplist = new FormControl();
  curemp = [];
  currentcontrol = new FormControl();
  profileForm: FormGroup;
  companyList: any;
  id: any;

  companyListData: any[] = [];
  dropdownCompanyList: any[] = [];

  constructor(
    private router: Router,
    private companySvc: CompanyService,
    private fb: FormBuilder,
    private http: HttpClient,
    private homeService: HomeService,
    public dialog: MatDialog,
    private AuthService: AuthenticationService
  ) {
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

  ngOnInit() {
    this.companyNames();
    this.dropDownCompany();
    // this.companyToplist();
    // this.currentEmp();

    // this.filteredcompany = this.companycontrol.valueChanges.pipe(
    //   startWith(""),
    //   map(value => this._filter(value))
    // );

    this.profileForm = this.fb.group({
      company: ["", Validators.required]
    });
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.company.filter(company =>
      this._normalizeValue(company).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, "");
  }

  dropDownCompany() {
    this.homeService.getDropdownCompany()
      .subscribe((res: any) => {
        if (res.statusCode === 200) {
          this.dropdownCompanyList = res.data;
        }
      })
  }

  companyNames() {
    this.homeService.getCompanyNames().subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.companyListData = res.data;
      }
    });
  }

  companyToplist() {
    this.homeService.getCompanyToplist().subscribe((data: any) => {
      console.log(data);
      if (data) {
        for (let companytop1 of data.data) {
          this.companytop.push(companytop1.companyName); //companyName is api name
        }
        console.log(this.companytop);
      }
    });
  }

  shouldOpenSideMenu = false;
  myplaceHolder = "";
  companyName = "";

  curforEmp() {
    // if (!this.company.includes(this.currentcontrol.value)) {
    //   this.router.navigate(["/new-company"]);
    //   console.log("ok");
    // } else {
    //   this.router.navigate(["/company-details"]);
    //   console.log("not");
    // }
    this.router.navigate(['/quiz-test']);
  }

  //company.service
  searchCompany() {
    if (!this.AuthService.isLoggednIn()) {
      const dialogRef = this.dialog.open(AuthenticationComponent, {
        width: '600px',
        height: '90%',
        data: {
          comapny: this.dropdownCompanyList.filter((res) => { return res.name === this.companycontrol.value })[0]
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result !== undefined) {
          if (result.comapny !== undefined) {
            this.router.navigate(['/company-details']);
          } else {
            this.router.navigate(['/request-company']);
          }
        }
      });

      //console.log(this.dropdownCompanyList.filter((res) => { return res.name === this.companycontrol.value })[0])
    } else {
      //console.log(this.dropdownCompanyList.filter((res) => { return res.name === this.companycontrol.value })[0])
      const comapny = this.dropdownCompanyList.filter((res) => { return res.name === this.companycontrol.value })[0];
      if (comapny !== undefined) {
        this.router.navigate(['/company-details']);
        this.homeService.setCompanyId(comapny._id);
      } else {
        this.router.navigate(['/request-company']);
        this.homeService.removeCompanyId();
      }
    }

  }
  showSideMenu() {
    this.shouldOpenSideMenu = !this.shouldOpenSideMenu;
  }  
}
