import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-show-more-info',
  templateUrl: './show-more-info.component.html',
  styleUrls: ['./show-more-info.component.css']
})
export class ShowMoreInfoComponent implements OnInit {
  //name
  uniqueID;
  showThisOne;
  showPwdField:boolean=false;
  isCorrectPwd:boolean = false;
  showSuccessUptMsg = false;
  isClickDlete:boolean = false;
  isClickEdit:boolean = false;
  baseUrl:string = "https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents"
  showBtns:boolean = true;

  constructor(private ActivatedRoute: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    //this.name = this.ActivatedRoute.snapshot.paramMap.get('name')
    this.uniqueID = this.ActivatedRoute.snapshot.paramMap.get('uniqueID')
    this.showMore(this.uniqueID);
  }

  toggleBtnField() {
    this.showBtns = !this.showBtns;
  }

  showMore(reportId) {
    this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents/' + reportId + '/' )
      .subscribe((data:any)=>{
        this.showThisOne = data
        console.log("retrieved from the server ", this.showThisOne)
        // this should go in the peopleService component
      })
  }

  checkPassword(e:any) {
    const inputPwd = e.target.value;
    //const md5 = new Md5();
    const encryInputPwd = Md5.hashStr(inputPwd)
    //console.log("User enters ",encryInputPwd);
    const correctPwd = "84892b91ef3bf9d216bbc6e88d74a77c";
    
    if (encryInputPwd !== correctPwd ) {
      this.isCorrectPwd = false;
      console.log("INCORRECT and flag is ", this.isCorrectPwd);
    }
    else {
      this.isCorrectPwd = true;
      console.log("CORRECT and flag is ", this.isCorrectPwd);
    }
  }

  clickDeleteBtn() {
    this.isClickDlete = true
  }

  clickEditBtn() {
    this.isClickEdit = true
  }
 
  ableEnterPwd() {
    this.showPwdField = true;
  }

  hideEnterPwd() {
    this.showPwdField = false;
    if (this.isClickDlete) {
      this.deleteThisOne();
      this.isClickDlete = false;
      this.toggleBtnField();
    }

    if (this.isClickEdit) {
      this.toggleStatus()
      this.isClickEdit = false;
      this.toggleBtnField();
    }
    
    
  }

  deleteThisOne() {
    const url = `${this.baseUrl}/${this.uniqueID}/`;
    //const correct = "https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents/f57ec0bd-acac-4eb8-be2d-0143df201a06/"
    console.log("url is ", url);
    this.http.delete(url).subscribe((data:any)=>{
      console.log("Delete this one: ", data)
      if (data == null) {
        console.log("delete complete")
        this.isCorrectPwd = false;
        
        //window.location.reload();
        this.router.navigate(["/"])
          .then(() => {
          window.location.reload();
        });
      }
    }) 
    
  }

  toggleStatus() {
    const updatedStatus = !this.showThisOne.data.status
    this.showThisOne.data.status = updatedStatus;
    //console.log("After update", updatedStatus)
    //const allKeys = Object.keys(this.showThisOne.data)
    //const theKey = allKeys[6]
    //console.log(theKey)

    //this.deleteThisOne();
    //const newId = uuid.v4();
    const url = `${this.baseUrl}/${this.uniqueID}/`;
    return this.http.put(url,this.showThisOne).subscribe((data:any)=>{
      this.showSuccessUptMsg = true;
      this.isCorrectPwd = false
      console.log(data)
      console.log("edit complete")
    })

    // this.http.post('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents/',
    // {'key': newId, 'data':this.showThisOne.data}
    // ).subscribe((data:any)=>{
    //   console.log("Adding this one: ", data)
    // })

    //window.location.reload();

    

    // this.http.put('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents/' + this.showThisOne.key + '/',
    // {'key': this.showThisOne.key, 'data':{ 'status': updatedStatus }}
    // ).subscribe((data:any)=>{
    //   console.log(data)
    // })
    
  }

}
