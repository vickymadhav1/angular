import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { first } from "rxjs/operators";

import { UserService } from "src/app/service/user.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent implements OnInit {
  emailFormControl: FormGroup;
  formBuilder: any;
  isSubscribed = {
    show: false,
    message: ""
  };

  constructor(public userService: UserService, private efc: FormBuilder) {}

  ngOnInit() {
    this.emailFormControl = this.efc.group({
      emailId: ["", [Validators.required, Validators.email]]
    });
  }

  subscribeNewsLetter() {
    console.log(this.emailFormControl);
    this.userService
      .getNewsLetter(this.emailFormControl.value)
      .pipe(first())
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res.statusCode === 200) {
            this.isSubscribed.show = true;
            this.isSubscribed.message = res.message;
            this.emailFormControl.get("emailId").disable();
          }
        },
        _error => {
          console.log(_error);
        }
      );
  }
}
