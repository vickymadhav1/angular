import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/service/home.service';
import { DetailedReportService } from 'src/app/service/detailed-report.service';
import { CompanyService } from 'src/app/service/company.service';

/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AmChartsLogo } from '@amcharts/amcharts4/.internal/core/elements/AmChartsLogo';


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-detailed-report',
  templateUrl: './detailed-report.component.html',
  styleUrls: ['./detailed-report.component.scss']
})
export class DetailedReportComponent implements OnInit {
  companyNameList = [];
  id: any;
  detailedReports: any;

  constructor(private detailedService: DetailedReportService,
    private companyService: CompanyService) { }

  ngOnInit() {
    this.getDetailedReports();
  }
  // get detailed report list of each company
  getDetailedReports() {
    this.id = this.companyService.getParticularCompanyId();
    sessionStorage.setItem('companyId', this.id)
    console.log(this.id, 'id');
    this.detailedService.getCompanyById(this.id).subscribe((res: any) => {
      this.detailedReports = res.data;
      console.log(this.detailedReports);
    });
  }

  ngAfterViewInit(){
    let chart = am4core.create("chartdiv", am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    let colorSet = new am4core.ColorSet();
    
    let axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    axis2.min = 0;
    axis2.max = 100;
    axis2.renderer.innerRadius = 10
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;
    
    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = 50;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);
    
    let range1 = axis2.axisRanges.create();
    range1.value = 50;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = colorSet.getIndex(2);

    let label = chart.radarContainer.createChild(am4core.Circle);
    label.isMeasured = false;

    let hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(20);
    hand.startWidth = 10;
    hand.pin.disabled = true;
    hand.value = 50;
    
    hand.events.on("propertychanged", function(ev) {
      range0.endValue = ev.target.value;
      range1.value = ev.target.value;
      axis2.invalidate();
    });
    
    setInterval(function() {
      let value = Math.round(Math.random() * 100);
      label.text = value + "%";
      let animation = new am4core.Animation(hand, {
        property: "value",
        to: value
      }, 1000, am4core.ease.cubicOut).start();
    }, 2000);
  }
}
