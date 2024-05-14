import { Component, OnInit, inject } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Estate } from '../estate';
import { EstateService } from '../estate.service';


@Component({
  selector: 'app-add-estate-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  template: `
    <div mat-dialog-title class="dialog-title">
      <h2 mat-dialog-title>Add Estate</h2>
      <button mat-icon-button aria-label="close dialog" mat-dialog-close>
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <form [formGroup]="estateForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="City" formControlName="city">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Region" formControlName="region">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Country" formControlName="country">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Street name" formControlName="streetName">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Street number" formControlName="streetNumber">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Flat number" formControlName="flatNumber">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button type="submit" [disabled]="!estateForm.valid" color="primary">Create</button>
      </mat-dialog-actions>
    </form>`,
  styleUrl: './add-estate-modal.component.scss'
})
export class AddEstateModalComponent implements OnInit {

  estateForm!: FormGroup;
  estateService: EstateService = inject(EstateService);

  constructor(
    private dialogRef: MatDialogRef<AddEstateModalComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.estateForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      country: ['', Validators.required],
      streetName: ['', Validators.required],
      streetNumber: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      flatNumber: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
    });
  }

  onSubmit() {
    if (this.estateForm.valid) {
      // Submit form data
      const newEstate: Estate = {
        id: 0,
        userId: '',
        name: this.estateForm.value.name,
        city: this.estateForm.value.city,
        region: this.estateForm.value.region,
        country: this.estateForm.value.country,
        streetName: this.estateForm.value.streetName,
        streetNumber: this.estateForm.value.streetNumber,
        flatNumber: this.estateForm.value.flatNumber,
        createdOn: new Date(),
        photo: ''
      };
      
      var persistedEstate = this.estateService.postNewEstate(newEstate);
      console.log(persistedEstate);
      this.dialogRef.close(this.estateForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
