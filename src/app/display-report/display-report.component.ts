import { Component, OnInit } from '@angular/core';
import { ReportServiceService } from '../report-service.service';

@Component({
  selector: 'app-display-report',
  templateUrl: './display-report.component.html',
  styleUrls: ['./display-report.component.css']
})
export class DisplayReportComponent implements OnInit {
  

  constructor(public _reportService: ReportServiceService) { }

  dataToDisplay:any=[];
  // isClickSubmit:boolean = this._reportService.isClickSubmit;
  

  ngOnInit(): void {
    this.dataToDisplay =  this._reportService.reportData;
  }
  updateTable(){
    this.dataToDisplay = this._reportService.reportData;
    this.updateTable2()
    console.log("Method invoked")
  }
  updateTable2(){
    this.dataToDisplay =  this._reportService.reportData;
    console.log(typeof(this.dataToDisplay))
  }

  sortByLocation() {
    console.log("sort by location")
  }

  sortByReporter() {
    console.log("sort by reporter")
  }

  sortByTime() {
    console.log("sort by time")
  }

}
