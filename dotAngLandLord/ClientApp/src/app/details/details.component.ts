import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EstateService } from '../estate.service';
import { Estate } from '../estate';
import { Image } from '../image';
import { ReactiveFormsModule } from '@angular/forms';
import { Facility } from '../facility';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatChipsModule],
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
        <mat-chip-set aria-label="facilities selection">
          <mat-chip-option *ngFor="let facility of facilities" disabled [selected]="facility.isPresent">{{facility.name}}</mat-chip-option>
        </mat-chip-set>
      </section>
    </article>
  `,
styleUrl: './details.component.scss'
})

export class DetailsComponent implements OnInit{
  
  myColor = 'rgba(107,231,177,0.9)';
  route: ActivatedRoute = inject(ActivatedRoute);
  estateService = inject(EstateService);
  estate!: Estate | undefined;
  mainImage: Image | undefined = this.estate?.images?.find((image) => image.isMain === true);
  facilities: Facility[] = [];
    // Id = 0;
  constructor() { }

  ngOnInit(): void {
    const Id = parseInt(this.route.snapshot.params['id'], 10);
    this.estateService.getEstateById(Id).then(response => {
      this.estate = this.estateService.mapToEstate(response);
      if (this.estate) {
        this.mainImage = this.estate.images?.find(image => image.isMain === true);
        this.facilities = this.estate.facilities ?? [];
      } else {
        console.error('No estate selected');
      }
    });
  }
}