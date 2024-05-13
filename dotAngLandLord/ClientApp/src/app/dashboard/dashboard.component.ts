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
    <app-create-new-estate></app-create-new-estate>
  </section>
  `,
  styleUrls: ['./dashboard.component.scss'] // Fixed typo, `styleUrls`
})
export class DashboardComponent implements OnInit {

  public estateList: Estate[] = [];
  filteredEstateList: Estate[] = [];
  estateService: EstateService = inject(EstateService);

  constructor(private http: HttpClient, private router: Router) {this.fetchUserEstates();}

  ngOnInit() {
    // this.fetchUserEstates(); // Fetch user information on initialization
  }

  fetchUserEstates() {
    this.http
      .get('http://localhost:5283/estate', { withCredentials: true }) // Include cookies for authentication
      .subscribe(
        (response: any) => {
          this.estateList = response; // Store user information for rendering
          this.filteredEstateList = response; // Store user information for rendering
        },
        (error) => {
          console.error('Failed to fetch user information', error);
          // Redirect to login if unauthorized
          window.location.href = 'http://localhost:5283/Identity/Account/Login?returnUrl=/dashboard';
          // this.router.navigate(['/login']);
        }
      );
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