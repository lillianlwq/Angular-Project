import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {

  constructor() { }

  public reportData: [];
  // public isClickSubmit: boolean;

  // get reportData(): any {
  //   return this.reportData
  // }

  // set reportData(value) {
  //   this.reportData = value
  // }

  // get isClickSubmit(): boolean {
  //   return this.isClickSubmit
  // }

  // set isClickSubmit(value) {
  //   this.isClickSubmit = value;
  // }

  public getReportData() {
    return this.reportData;
  }

  // public getIsClickSubmit() {
  //   console.log("isClickSubmit ", this.isClickSubmit)
  //   return this.isClickSubmit
  // }
   
  
}
