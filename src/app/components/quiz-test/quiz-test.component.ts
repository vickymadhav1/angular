import { Component, OnInit } from "@angular/core";
import { QuestionsService } from "../../service/questions.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-quiz-test",
  templateUrl: "./quiz-test.component.html",
  styleUrls: ["./quiz-test.component.scss"]
})
export class QuizTestComponent implements OnInit {
  data: any;
  pieChartOptions: any;
  questions: any;
  question: string;
  count: number;
  nextID: number = 0;

  options: [];
  optionsText: any;
  optionsLength: number;
  radioOptions: boolean;
  progressValue: number;
  progress: number;
  select: string = "";
  gender: any = null;
  comment: boolean = false;

  selectedOption = [];

  disable = [];
  constructor(
    private service: QuestionsService,
    private router: Router,
    private httpClient: HttpClient
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

  showComments() {
    this.comment = !this.comment;
  }

  setOptionValue(event, index) {
    let data = {
      questionId: this.questions[this.nextID].questionId,
      answerId: event.value,
      point: this.questions[this.nextID].answers[index].points
    };
    this.selectedOption[this.nextID] = data;

    if (typeof this.selectedOption[this.nextID] === "object") {
      this.disable[this.nextID] = false;
    }
    console.log("selected option", this.selectedOption);
    // return this.httpClient.post(`http://localhost:8080/response/submit`, data);
  }

  ngOnInit() {
    this.service.getAllQuestions().subscribe((data: any) => {
      console.log(data);
      this.questions = data.data;
      //initialize disable indexes for the next and prev button
      this.questions.forEach((element, index) => {
        this.disable[index] = true;
      });
      console.log(this.questions);
      this.question = this.questions[0].question;
      this.optionsText = this.questions[0].answers;
      this.optionsLength = this.questions[0].answers.length;
      this.options = this.questions[0].answers;
      this.count = this.questions[0].questionId;
      this.progressValue = 100 / this.questions.length;
      this.progress = this.progressValue;
      console.log(this.options);
    });
  }

  nextQuestion() {
    if (this.nextID < this.questions.length - 1) {
      this.question = this.questions[this.nextID + 1].question;
      console.log("Questions", this.question);
      this.optionsText = this.questions[this.nextID + 1].answers;
      this.options = this.questions[this.nextID + 1].answers;
      console.log("QuestionText", this.optionsText);
      this.progress += this.progressValue;
      this.gender = null;
      this.nextID++;
    } else {
    }
  }
  //nextQuestion
  previousQuestion() {
    if (this.nextID == 0) {
      // hide previious button
    } else if (this.nextID >= 0) {
      this.nextID--;
      this.question = this.questions[this.nextID].question;
      this.optionsText = this.questions[this.nextID].answers;
      this.options = this.questions[this.nextID].answers;
      this.progress -= this.progressValue;
      this.gender = null;
    }
  }

  postQuestion() {
    const postData = {
      companyId: sessionStorage.getItem("companyId"),
      userId: JSON.parse(sessionStorage.getItem("userData")).uid,
      answers: this.selectedOption
    };
    console.log(postData);
    this.router.navigate(["/quiz-results"]);

    this.httpClient
      .post("http://13.126.96.234/response/submit", postData)
      .subscribe(postData => {
        console.log(postData);
      });
  }
}
