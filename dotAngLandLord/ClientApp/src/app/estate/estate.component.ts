import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estate } from '../estate';
import { Image } from '../image';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EstateService } from '../estate.service';

@Component({
  selector: 'app-estate',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  template: `
  <section class="listing">
    <img class="listing-photo" *ngIf="mainImage.fileName" [src]="'http://localhost:5283/UserImages/' + mainImage.fileName" alt="Exterior photo of {{estate.name}}">
    <h2 class="listing-heading">{{ estate.name }}</h2>
    <p class="listing-location">{{ estate.city}}, {{estate.region }}</p>
    <a (click)="selectEstate()" [routerLink]="['/details', estate.id]">Learn More</a>
  </section>
  `,
  styleUrl: './estate.component.scss'
})
export class EstateComponent {

  @Input() estate!: Estate;
  estateService = inject(EstateService);
  mainImage: Image = { id: undefined, estateId: undefined, isMain: true, fileName: '', data: undefined };

  ngOnInit() {
    if (this.estate !== undefined && this.estate.images) {
      this.mainImage.fileName = this.estate.images.find(image => image.isMain === true)?.fileName || '';
    }
  }

  selectEstate() {
    console.log("clicked");
    console.log(this.estate);
    this.estateService.selectedEstate = this.estate;
  }
}