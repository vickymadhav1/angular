import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss']
})
export class QuizResultsComponent implements OnInit {

  data: any;
  pieChartOptions: any;

  constructor() {
    this.data = {
      events: [],
      labels: ["Female", "Male"],
      datasets: [
        {
          data: [25, 75],
          backgroundColor: [
            "#148fd5",
            "#da1b63",
          ],
        }]
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
  SelectedRadio = "select";

  ngOnInit() {
  }

}
