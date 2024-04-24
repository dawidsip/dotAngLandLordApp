import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EstateService } from '../estate.service';
import { Estate } from '../estate';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <article>
    <img class="listing-photo" [src]="estate?.photo"
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
    <section class="listing-apply">
      <h2 class="section-heading">Apply now to live here</h2>
      <form [formGroup]="applyForm" (submit)="submitApplication()">
        <label for="first-name">First Name</label>
        <input id="first-name" type="text" formControlName="firstName">

        <label for="last-name">Last Name</label>
        <input id="last-name" type="text" formControlName="lastName">

        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email">
        <button type="submit" class="primary">Apply now</button>
      </form>
    </section>
  </article>
`,
styleUrl: './details.component.scss'
})

export class DetailsComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  estateService = inject(EstateService);
  estate: Estate | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });
  // constructor() {
  //   const estateId = Number(this.route.snapshot.params['id']);
  //   this.estate = this.estateService.getEstateById(estateId);
  // }

  constructor() {
    const Id = parseInt(this.route.snapshot.params['id'], 10);
    this.estateService.getEstateById(Id).then(estate => {
      this.estate = estate;
    });
  }

  // this.route.queryParamMap.subscribe(params => {
  //   const userIdStr = params.get('userid'); // Get the 'userid' query parameter as a string
  //   if (userIdStr) {
  //     const userId = parseInt(userIdStr, 10); // Convert it to an integer
  //     this.estateService.getEstatesByUserId(userId).then(estate => {
  //       this.estate = estate;
  //     });
  //   }
  // });

  submitApplication() {
    this.estateService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
}