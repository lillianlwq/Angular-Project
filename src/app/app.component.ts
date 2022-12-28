
import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet'

// need to add to make leaflet icons work
import { icon, Marker } from 'leaflet';
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
}); 
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

  constructor(private http: HttpClient) {}

  private map;

  rawLocations:any = []
  uniqueLocationNames:any = []
  locationInfoOnMap:any = []
  singleLocBuffer:any = []

  ngAfterViewInit(): void {
    //window.location.reload();
    //this.map = this.map.remove()
    this.map = L.map('mapid').setView([49.2, -123], 11);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGlsbGlhbmx3cSIsImEiOiJjbGF6eTh3Nmkwd295M3VxbGVwd2g3Mnk5In0.4ahwBM-f_pFbQiFgtc4XJw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    this.http.get<Object>('https://272.selfip.net/apps/OeaiFz6Ekw/collections/pigReports/documents')
      .subscribe((data:any)=>{
        this.rawLocations = data
        console.log("retrieved for map", this.rawLocations)
        for (const eachLoc of this.rawLocations) {
          //console.log(eachLoc.data)
          const afterFormatName = this.formatLocation(eachLoc.data.locName);
          if(!this.uniqueLocationNames.includes(afterFormatName)) { // this is a new place
            this.uniqueLocationNames.push(afterFormatName) // update the unique location list
            this.singleLocBuffer.location = afterFormatName;
            this.singleLocBuffer.pigLatitude = eachLoc.data.locLatd;
            this.singleLocBuffer.pigLongitude = eachLoc.data.locLtd;
            this.singleLocBuffer.times = 1;
            this.locationInfoOnMap.push(this.singleLocBuffer);
            this.singleLocBuffer = [];
          }
          else { // this place has already existed in the list --> increment the "times"
            Object.keys(this.locationInfoOnMap).forEach(key => {
              const compareLoc = this.locationInfoOnMap[key].location;
              if ( compareLoc == afterFormatName) {            
                this.locationInfoOnMap[key].times += 1
              }
            })
          }
        }
        //window.location.reload(); 
        console.log("Final locationInfoOnMap is ", this.locationInfoOnMap)
        for (const each of this.locationInfoOnMap){
          L.marker([each.pigLatitude, each.pigLongitude]).addTo(this.map)
          //.bindPopup("<b>{{each.location}}</b><br />{{each.times}}cases reported.").openPopup();
          .bindPopup("<b>"+ each.location + "</b><br />"+each.times + " case(s) reported.").openPopup();
        }
         //   
      })
     
    

    // L.marker([49.2276, -123.0076]).addTo(this.map)
    // .bindPopup("<b>Metrotown</b><br />cases reported.").openPopup();

    // L.marker([49.1867, -122.8490]).addTo(this.map)
    // .bindPopup("<b>SFU Surrey</b><br />cases reported.").openPopup();

    

  }
  //title = 'pigTracker';
  formatLocation(loc:string) {
      const lowerLoc = loc.toLowerCase();
      const newLoc = ((lowerLoc.trim()).replace(/\s/g, ""));
      return newLoc
  }
}

