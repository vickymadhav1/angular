import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../service/authentication.service";
import { UserService } from 'src/app/service/user.service';

declare let $: any;

@Component({
  selector: "app-company-details",
  templateUrl: "./company-details.component.html",
  styleUrls: ["./company-details.component.scss"]
})
export class CompanyDetailsComponent implements OnInit {
  [x: string]: any;

  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  data: any;
  pieChartOptions: any;
  model: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthenticationService,
    private userService: UserService
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
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['', Validators.required]
    });

    this.loginFrom = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    //$("#myModal").modal("show");
  }

  // register a new user
  register() {
    this.userService.register(this.registerForm.value).subscribe((res: any) => {
      console.log(res);
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // login if user exists
  onSubmit() {
    this.userService.login(this.model).subscribe((res: any) => {
      if (res.statuscode === 200) {
        this.authService.sendToken(res.data.token);
      }
    });
  }

}
