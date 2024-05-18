import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EstateComponent } from '../estate/estate.component';
import { Estate } from '../estate';
import { EstateService } from '../estate.service';
import { CreateNewEstateComponent } from '../create-new-estate/create-new-estate.component';
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
    this.estateList.push(estate);
  }

  ngOnInit() {
    this.estateService.getUserEstates().then((resultEstates: Estate[] | undefined) => {
      if (resultEstates) {
        this.estateList = resultEstates;
        this.filteredEstateList = resultEstates; 
      }
    }).catch((error) => {
      console.error('Failed to fetch user estates', error);
      window.location.href = 'http://localhost:5283/Identity/Account/Login?returnUrl=/dashboard';
    });
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