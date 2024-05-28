import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EstateComponent } from '../estate/estate.component';
import { Estate } from '../estate';
import { EstateService } from '../estate.service';
import { CreateNewEstateComponent } from '../create-new-estate/create-new-estate.component';
import { Facility } from '../facility';
import { Image } from '../image';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, EstateComponent, CreateNewEstateComponent],
  template: `
  <section>
    <form>
    <input type="text" placeholder="Filter by city" #filter>
      <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
    </form>
  </section>
  <section class="results">
    <app-estate *ngFor="let est of filteredEstateList" [estate]="est"></app-estate>
    <app-create-new-estate (estateCreated)="onEstateCreate($event)"></app-create-new-estate>
  </section>
  `,
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public estateList: Estate[] = [];
  filteredEstateList: Estate[] = [];
  estateService: EstateService = inject(EstateService);

  constructor(private http: HttpClient, private router: Router)
  {
  }

  onEstateCreate(estate: Estate) {
    console.log("wracamy do dashboard z nowym estatem")
    this.estateList.push(estate);
    // this.filteredEstateList.push(estate);
  }

  ngOnInit() {
    this.estateService.getUserEstates().then((resultEstates: Estate[] | undefined) => {
      if (resultEstates) {
        var est = resultEstates.map(this.mapToEstate);
        this.estateList = est;
        this.filteredEstateList = est; 
        console.log(this.estateList);
      }
    }).catch((error) => {
      console.error('Failed to fetch user estates', error);
      window.location.href = 'http://localhost:5283/Identity/Account/Login?returnUrl=/dashboard';
    });
  }

  // private mapToImage = (img: any): Image => {
  //   return {
  //     id: img.id,
  //     estateId: img.estateId,
  //     fileName: img.fileName,
  //     isMain: img.isMain,
  //     data: img.data
  //   };
  // }
  
  private mapToFacility = (ef: any): Facility => {
    return {
      id: ef.facility.id,
      name: ef.facility.name,
      isPresent: ef.isPresent,
      isBasic: ef.facility.isBasic
    };
  }

  private mapToEstate = (data: any): Estate => {
    // console.log("is facilities an array?: "+ Array.isArray(data.estateFacilities));
    // data.estateFacilities.forEach((ef: any) => console.log(ef.facility));
    // console.log("break");
    // console.log(data);
    // console.log(data.images);
    return {
      id: data.id,
      userId: data.userId,
      name: data.name,
      city: data.city,
      region: data.region,
      country: data.country,
      streetName: data.streetName, 
      streetNumber: data.streetNumber,
      flatNumber: data.flatNumber,
      createdOn: new Date(data.createdOn),
      facilities: Array.isArray(data.estateFacilities) ? data.estateFacilities?.map(this.mapToFacility) : [],
      images: data.images,
      
      };
    }

  filterResults(text: string) {
    if (!text) {
      this.filteredEstateList = this.estateList;
      return;
    }
  
    this.filteredEstateList = this.estateList.filter(
      estate => estate?.city.toLowerCase().includes(text.toLowerCase())
    );
  }

}