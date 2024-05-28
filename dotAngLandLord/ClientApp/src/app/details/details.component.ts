import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EstateService } from '../estate.service';
import { Estate } from '../estate';
import { Image } from '../image';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Facility } from '../facility';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <article>
    <img class="listing-photo" *ngIf="mainImage" [src]="mainImage"
      alt="Exterior photo of {{estate?.name}}"/>
    <section class="listing-description">
      <h2 class="listing-heading">{{estate?.name}}</h2>
      <p class="listing-location">{{estate?.city}}, {{estate?.region}}</p>
    </section>
    <section class="listing-features">
      <h2 class="section-heading">About this housing location</h2>
      <ul>
        <li>Units available: {{estate?.flatNumber}}</li>
        <li>Does this location have wifi: {{estate?.streetName}}</li>
        <li>Does this location have laundry: {{estate?.streetNumber}}</li>
      </ul>
    </section>
    <section class="listing-facilities">
      <h2 class="section-heading">Facilities</h2>
      <ul>
        <li *ngFor="let facility of facilities">{{facility.name}}, is present: {{facility.isPresent}}</li>
      </ul>
    </section>
  </article>
`,
styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit {
  
  route: ActivatedRoute = inject(ActivatedRoute);
  estateService = inject(EstateService);
  estate!: Estate | undefined;
  mainImage: Image | undefined = this.estate?.images?.find((image) => image.isMain === true);
  facilities: Facility[] = [];
    // Id = 0;
  constructor() { }
  ngOnInit(): void {
    this.estate = this.estateService.selectedEstate;

    if (this.estate) {
      this.mainImage = this.estate.images?.find(image => image.isMain === true);
      this.facilities = this.estate.facilities || [];
    } else {
      console.error('No estate selected');
    }

    console.log(this.estate === null);
  }


}