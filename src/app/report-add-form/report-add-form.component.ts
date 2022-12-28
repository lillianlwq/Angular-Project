import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ReportServiceService } from '../report-service.service';
import { DisplayReportComponent } from '../display-report/display-report.component';
// import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, TitleStrategy } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import * as uuid from 'uuid';

@Component({
  selector: 'app-report-add-form',
  templateUrl: './report-add-form.component.html',
  styleUrls: ['./report-add-form.component.css']
})
export class ReportAddFormComponent implements OnInit {

  private myCompOneObj = new DisplayReportComponent(this._reportService);
  form: FormGroup;

  showCreateBtn:boolean = true;
  showForm:boolean = false;
  showDropDown = false;
  clickSubBtn:boolean = false;
  baseUrl:string = "https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents"

  id:any;
  pigsList: any=[];
  existLocList: any=[];
  thisLocList:any= [];
  existLocName:any=[];


  putLocNameToForm = [];
  putLocLatitudeToForm = [];
  putLocLongtitudeToForm = [];

  toggleCreateBtn() {
    this.showCreateBtn = !this.showCreateBtn;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      //this.fetchExistLocName();
      //this.fetchExistLocList();
    }
  }

  toggleShowDropDown() {
    this.showDropDown = !this.showDropDown;
    this.form.get('locName').setValue('');
    this.form.get('locLtd').setValue('');
    this.form.get('locLatd').setValue('');
    console.log(this.showDropDown);
  }

  fetchExistLocName() {
    return this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents')  // retrieve array that contains all names of places
      .subscribe((data:any)=>{
        this.existLocName = data
        console.log("toggleForm: existLocName ", this.existLocName)
        // this should go in the peopleService component
      })
  }

  fetchExistLocList() {
    return this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocList/documents')  // retrieve array that contains all names of places + latitude & longititude
      .subscribe((data:any)=>{
        this.existLocList = data
        console.log("toggleForm: existLocList ", this.existLocList)
        // this should go in the peopleService component
      })
  }

  

  // modalService: NgbModal;
  closeResult: string;
  constructor(public _reportService: ReportServiceService, private router: Router, private http: HttpClient) { 

    let formControls = {
      name:new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),

      phoneNum:new FormControl('',[
        Validators.required,
        Validators.pattern('[0-9]{10}'),
        Validators.minLength(10),
      ]),

      pBrd:new FormControl('',[
        Validators.required,
        Validators.minLength(1),
      ]),

      pId:new FormControl('',[
        Validators.required,
        Validators.minLength(1),
        Validators.pattern('[0-9]+'),
      ]),

      locName:new FormControl('',[
        Validators.required,
        // Validators.minLength(1),
        this.selectMenuValidator,
      ]),

      locLtd:new FormControl('',[
        Validators.required,
        Validators.pattern('[-+]?[0-9]*\.?[0-9]+'),
        Validators.max(180), 
        Validators.min(-180),
      ]),

      locLatd:new FormControl('',[
        Validators.required,
        Validators.pattern('[-+]?[0-9]*\.?[0-9]+'),
        Validators.max(90), 
        Validators.min(-90)
      ]),

      extra:new FormControl('',[
        Validators.required,
        Validators.minLength(1),
      ]),
    }

    this.form = new FormGroup(formControls);
  }

  selectMenuValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    console.log("control value is ", control.value)
    return (control.value != '-1' )? null : {form_error: true}
  }

  //retrieved = [];
  ngOnInit(): void {
    this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents')
      .subscribe((data:any)=>{
        this.pigsList = data
        console.log("retrieved ngOninit() ", this.pigsList)

      const pigsListBuffer = this.pigsList;
      const sortRepotsByTime = pigsListBuffer.sort((a,b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime());
      //console.log(sortRepotsByTime);
      const containAllLocNames =  this.extractOnlyLocName(sortRepotsByTime)
      const containAllLocLatitude = this.extractOnlyLocLatitude(sortRepotsByTime)
      const containAllLocLongtitude = this.extractOnlyLocLongtitude(sortRepotsByTime)

      const cleanNameWithCoordinates = this.removeDuplicateLocName(containAllLocNames, containAllLocLatitude, containAllLocLongtitude)
      this.putLocNameToForm = cleanNameWithCoordinates[0];
      this.putLocLatitudeToForm = cleanNameWithCoordinates[1];
      this.putLocLongtitudeToForm = cleanNameWithCoordinates[2];

      console.log("Name: ", this.putLocNameToForm);
      console.log("Longtitude: ", this.putLocLongtitudeToForm);
      console.log("Latitude: ", this.putLocLatitudeToForm);
      //console.log(cleanNameWithCoordinates)
       
      })
      
      

      //window.location.reload();
  }

  extractOnlyLocName(allReports) {
    const allLocNames = [];
    for ( const eachReport of allReports) {
      const formateLocName = this.formatLocation(eachReport.data.locName)
      allLocNames.push(formateLocName)
    }
    return allLocNames;
  }

  removeDuplicateLocName(allNames, allLocLatitude, allLocLongtitude) {
    let finalLocLatitude = allLocLatitude;
    let finalLocLontitude = allLocLongtitude;
    let finalLocName = allNames
    console.log("before remove ", finalLocName);
    //let allNamesBuffer = allNames;
    for (let i = 0; i < allNames.length; i++) {
      for (let j = i+1; j < allNames.length; j++) {
        while (allNames[i] == allNames[j]) { // find duplicate
          console.log("remove ", j, " element is ", allNames[j]);
          finalLocName.splice(j,1);
          finalLocLatitude.splice(j,1);
          finalLocLontitude.splice(j,1);
        }
      }
    }
    return [finalLocName, finalLocLatitude, finalLocLontitude] 
  }

  extractOnlyLocLatitude(allReports) {
    const allLocLatitude = [];
    for ( const eachReport of allReports) {
      allLocLatitude.push(eachReport.data.locLatd)
    }
    return allLocLatitude;
  }

  extractOnlyLocLongtitude(allReports) {
    const allLocLongtitude = [];
    for ( const eachReport of allReports) {
      allLocLongtitude.push(eachReport.data.locLtd)
    }
    return allLocLongtitude;
  }

  
  clickSubmit() {
    this.clickSubBtn = !this.clickSubBtn
    if (this.clickSubBtn) {
      //console.log("existLocName: ", this.existLocName);
      //console.log("existLocList: ", this.existLocList);
    }
    this.clickSubBtn = false;
  }


  onSubmit(values: any) {
    //console.log("Value is ", values)
    this.id = uuid.v4();
    values.uniqueID = this.id;

    const add_on = new Date().getTime();
    values.date = add_on;

    let isPicked:boolean = false;
    values.status = isPicked;

    values.locLatd = this.form.get('locLatd').value
    values.locLtd = this.form.get('locLtd').value

    // this.thisLocList.latitude = values.locLatd;
    // this.thisLocList.longitude = values.locLtd;
    // this.thisLocList.location = values.locName;
    
    // const cleanLocName = this.formatLocation(this.thisLocList.location);
    // //console.log(this.existLocName.data)
    // if (this.existLocName == undefined ||!this.existLocName.includes(cleanLocName)){  
    //   this.existLocName.push(this.thisLocList.location); // add only new place to the select list
    //   //console.log(this.existLocName);

    //   // -----------------------------Update existLocName on server--------------------------------------
    //   // const url = "https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents/existLocName/"
    //   // this.http.put(url,this.existLocName).subscribe((data:any)=>{
    //   //   //console.log("inside else", data)
    //   //   console.log("edit existLocName complete")
    //   // })

    // }
    // else {  // repeated place, programmatically add latitude and longtitude from records
    //   //console.log("find records ................")
    //   Object.keys(this.existLocList).forEach(key => {
    //     const compareLoc = this.formatLocation(this.existLocList[key].location);
    //     if ( compareLoc == cleanLocName) {
    //       //console.log("inside if ", this.existLocList[key].latitude)
    //       values.locLatd = this.existLocList[key].latitude
    //       //console.log("inside if values set to ", values.latitude)
    //       values.locLtd = this.existLocList[key].longitude
    //     }
    //   })
      
    //   //console.log("values.locLatd ", values.locLatd);
    //   //this.thisLocList.latitude = values.locLatd; // error
    //   //console.log("thisLocList latitude is ", this.thisLocList.latitude);
    //   //this.thisLocList.longitude = values.locLtd;
    //   //this.thisLocList.location = values.locName;
    // }

    // --------------------------------------Update existLocList on server---------------------------------------
    // this.existLocList.data.push(this.thisLocList);
    // const url = "https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents/existLocList/"
    // this.http.put(url,this.existLocList).subscribe((data:any)=>{
    //   //console.log("inside else", data)
    //   console.log("edit existLocList complete")
    // })

    //this.thisLocList = [];
    //console.log("existLocName: ", this.existLocName);
    //console.log("existLocList: ", this.existLocList);

    //this.postExistLocName(this.existLocName);
    //this.postExistLocList(this.)
    this.addReportToServer(values);
    window.location.reload();


    
    //this.retrivedData();
    
    //console.log("Location info is: ", this.existLocList);
    //console.log("ONLY Location name is: ", this.existLocName);
    
    //console.log("Removed: ", this.thisLocList);
    //this.passDataToDisplay(this.pigsList);
    
    //
  }

  // postExistLocName(value) {
  //   try {
  //     this.http.post('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents/',
  //     {'key': "existLocName", 'data':value}
  //     ).subscribe((data:any)=>{
  //     })
  //   }
  //   catch(error){
  //     this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents')
  //     .subscribe((data:any)=>{
  //       const bufferExistLocName = data
  //     })
      
  //       return this.http.put('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocName/documents/existLocName',this.existLocName).subscribe((data:any)=>{
  //       console.log(data)
  //       console.log("edit complete")
  //     })
  //   }



    
  // }

  // postExistLocList(value) {
  //   return this.http.post('https://272.selfip.net/apps/OeaiFz6Ekw/collections/existLocList/documents/',
  //   {'key': "existLocList", 'data':value}
  //   ).subscribe((data:any)=>{
  //   })
  // }

  addReportToServer(value) {
    return this.http.post('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents/',
    {'key': value.uniqueID, 'data':value}
    ).subscribe((data:any)=>{

    })

  }

  retrivedData() {
    this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents')
      .subscribe((data:any)=>{
        this.pigsList = data
      })
  }

  passDataToDisplay() {
  }

  clearInput() {
    this.form.get('locLtd'). enable();
    this.form.get('locLatd'). enable();
    this.showDropDown = false;
    this.form.reset();
  }


  showMoreInfo(element:any) {
    console.log("Which one to show ", element)
    console.log("Inside shoeMoreInfo ", this.pigsList)
    this.pigsList.forEach((value: any, index:number) => {
      if(element.data == value.data) {
        console.log("element is ", value.data)
        this.router.navigate(["/showmore", value.key])
      }
    });
  }


  showEitherOption(e:any) {
    console.log(e.target.value)
    if (e.target.value == "option1") {  // fill lan + lon & disabled field
      
      this.form.get('locLtd'). disable();

      
      this.form.get('locLatd'). disable();
    }

    else if (e.target.value == "option2") { // enable fields and reset values
      this.form.get('locLtd'). enable();
      this.form.get('locLtd').setValue('');

      this.form.get('locLatd'). enable();
      this.form.get('locLatd').setValue('');
    }

    this.form.get('extra').setValue('');
  }

  isAppearInList(e:any) {
    const promptInput = this.formatLocation(e.target.value);
    if (this.putLocNameToForm.includes(promptInput)) { // user prompts a existing place
      let index = this.putLocNameToForm.indexOf(promptInput)
      this.form.get('locLtd').setValue(this.putLocLongtitudeToForm[index]);
      this.form.get('locLatd').setValue(this.putLocLatitudeToForm[index]); 
      this.form.get('locLtd'). disable();
      this.form.get('locLatd'). disable();
      console.log(this.form.get('locLtd').value);
      console.log(this.form.get('locLatd').value);
    }
    else {
      this.form.get('locLtd'). enable();
      this.form.get('locLtd').setValue('');

      this.form.get('locLatd'). enable();
      this.form.get('locLatd').setValue('');
    }
  }







  //   //console.log("Start comparing .........")
  //   const promptInput = this.formatLocation(e.target.value);
  //   //console.log(promptInput);
  //   if (this.existLocName.includes(promptInput)) {  // user prompts a existing place
  //     //console.log("included!!!")
  //     Object.keys(this.existLocList).forEach(key => {
  //       const getChoice = this.formatLocation(this.existLocList[key].location);
  //       //console.log("format loc in list ", getChoice);
  //       //const existChoice = this.formatLocation(choice);  
  //       //console.log("formate loc from dropdown", existChoice);
  //       //console.log("getChoice is ", getChoice)
  //       //console.log("promptInput is ", promptInput);
  //       if ( getChoice == promptInput) {
  //           this.form.get('locLtd').setValue(this.existLocList[key].longitude);
  //           this.form.get('locLatd').setValue(this.existLocList[key].latitude);
  //           //console.log("tesssssssssssssssssst")
  //       }
  //       else {
  //         //console.log("not equal")
  //       }
  //   });
  //     this.form.get('locLtd'). disable();
  //     this.form.get('locLatd'). disable();
  //   }
  //   else {
  //     this.form.get('locLtd'). enable();
  //     this.form.get('locLtd').setValue('');

  //     this.form.get('locLatd'). enable();
  //     this.form.get('locLatd').setValue('');
  //   }

  // }

 
  autoFillFields(e:any) {
    //console.log("User choose ", e.target.value)
    //console.log("choice before split is: ", e.target.value)
    if (e.target.value == '-1') {
      this.form.get('locLtd').setValue('');
      this.form.get('locLatd').setValue('');
      //console.log("should enter here")
    }
    else {
      const choice = e.target.value.split(':')[1]
      const getChoice = this.formatLocation(choice)
      console.log("User choose", choice)
      //console.log("compare with ", this.putLocNameToForm[0])
      let index = this.putLocNameToForm.indexOf(getChoice)
      console.log("index is ", index)
      this.form.get('locLtd').setValue(this.putLocLongtitudeToForm[index]);
      this.form.get('locLatd').setValue(this.putLocLatitudeToForm[index]); 
      this.form.get('locLtd'). disable();
      this.form.get('locLatd'). disable();


      //console.log("choice is: ", choice)

    //   Object.keys(this.existLocList).forEach(key => {
    //     const getChoice = this.formatLocation(this.existLocList[key].location);
    //     //console.log("format loc in list ", getChoice);
    //     const existChoice = this.formatLocation(choice);  
    //     //console.log("formate loc from dropdown", existChoice);
    //     if ( getChoice == existChoice) {
    //         this.form.get('locLtd').setValue(this.existLocList[key].longitude);
    //         this.form.get('locLatd').setValue(this.existLocList[key].latitude);
    //     }
    // });
    }
    //if (Object.keys(this.existLocList).some(key => this.formatLocation(this.existLocList[key].location) == choice)) { // find in the exist record
      
    //}
  }

  formatLocation(loc:string) {
    const lowerLoc = loc.toLowerCase();
    const newLoc = ((lowerLoc.trim()).replace(/\s/g, ""));
    return newLoc
  }

  sortByLocation() {
    //console.log("Sort ", this.pigsList)
    const sortPigsByLocation = this.pigsList;
    sortPigsByLocation.sort((a,b) => a.data.locName.localeCompare(b.data.locName));
    //console.log("sort by location ", sortPigsByLocation)
  }

  sortByReporter() {
    const sortPigsByReporter = this.pigsList;
    sortPigsByReporter.sort((a,b) => a.data.name.localeCompare(b.data.name));
    //console.log("sort by reporter ", sortPigsByReporter)
  }

  sortByTime() {
    const sortPigsByTime = this.pigsList;
    sortPigsByTime.sort((a,b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
    //console.log("sort by time ", sortPigsByTime)
  }
}
