import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estate } from '../estate';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-estate',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet],
  template: `
  <section class="listing">
    <img class="listing-photo" [src]="estate.photo" alt="Exterior photo of {{estate.name}}">
    <h2 class="listing-heading">{{ estate.name }}</h2>
    <p class="listing-location">{{ estate.city}}, {{estate.region }}</p>
    <a [routerLink]="['/details', estate.id]">Learn More</a>
  </section>
  `,
  styleUrl: './estate.component.scss'
})
export class EstateComponent {
  @Input() estate!: Estate;

}