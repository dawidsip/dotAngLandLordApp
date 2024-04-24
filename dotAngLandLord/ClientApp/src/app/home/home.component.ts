import { Component , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateComponent } from '../estate/estate.component';
import { Estate } from '../estate';
import { EstateService } from '../estate.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,EstateComponent],
  template: `
  <section>
    <form>
    <input type="text" placeholder="Filter by city" #filter>
      <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
    </form>
  </section>
  <section class="results">
    <app-estate *ngFor="let est of filteredEstateList" [estate]="est"></app-estate>
  </section>
  `,
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  estateList: Estate[] = [];
  filteredEstateList: Estate[] = [];
  estateService: EstateService = inject(EstateService);


  constructor() {
    this.estateService.getAllEstates().then((estateList: Estate[]) => {
      this.estateList = estateList;
      this.filteredEstateList = estateList;
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