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
import { Image } from '../image';
import { EstateService } from '../estate.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRippleModule} from '@angular/material/core';

@Component({
  selector: 'app-add-estate-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatRippleModule],
  template: `
    <div mat-dialog-title class="dialog-title">

      <h2 mat-dialog-title>Add Estate</h2>
      <button  matRipple [matRippleColor]="myColor" class="close-button" mat-icon-button aria-label="close dialog" mat-dialog-close (click)="onCancel()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div class="upload-container">
      <div class="image-upload-container">
        <div class="img-group">
          <div class="img-container"><img *ngIf="images.length > 0" [src]="'http://localhost:5283/UserImages/' + images[0].fileName"/></div>
          <div class="img-container"><img *ngIf="images.length > 1" [src]="'http://localhost:5283/UserImages/' + images[1].fileName"/></div>
          <div class="img-container"><img *ngIf="images.length > 2" [src]="'http://localhost:5283/UserImages/' + images[2].fileName"/></div>
          <div class="img-container"><img *ngIf="images.length > 3" [src]="'http://localhost:5283/UserImages/' + images[3].fileName"/></div>
          <div class="img-container"><img *ngIf="images.length > 4" [src]="'http://localhost:5283/UserImages/' + images[4].fileName"/></div>
        </div>
        <button matRipple [matRippleColor]="myColor" class="primary upload-button" color="primary" type="button" mat-raised-button aria-label="upload dialog" (click)="fileInput.click()">
        <input hidden (change)="onFileSelected($event)" #fileInput type="file" multiple accept="image/png, image/jpeg">
          Upload images
        </button>
      </div>
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
        <button matRipple [matRippleColor]="myColor" class="primary" type="button" mat-raised-button type="submit" [disabled]="!estateForm.valid" color="primary">Create</button>
      </mat-dialog-actions>
    </form>`,
  styleUrl: './add-estate-modal.component.scss'
})
export class AddEstateModalComponent implements OnInit {

  uploadFiles: File[] = [];
  myColor = 'rgba(177, 177, 177, 0.5)';
  images: Image[] = [];
  estateForm!: FormGroup;
  estateService: EstateService = inject(EstateService);

  constructor(
    private dialogRef: MatDialogRef<AddEstateModalComponent>,
    private fb: FormBuilder
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input.files) {
      const files = Array.from(input.files);
  
      files.forEach((file, index) => {
        file.arrayBuffer().then((data) => {
          this.images.push({
            id: undefined,
            estateId: undefined,
            fileName: file.name,
            isMain: index === 0, 
            data: data
          });
          console.log(this.images);
        }).catch((err) => {
          console.error('Error reading file data:', err);
        });
      });
    }
  }
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
        images: this.images ?? [],
      };
      console.log("we have this many images : " + newEstate.images.length);
      this.estateService.postNewEstate(newEstate).then((persistedEstate: Estate | undefined) => {
        // console.log(persistedEstate);
        this.dialogRef.close(persistedEstate);
      }).catch((error) => {
        console.error('Failed to persist new estate', error);
      });
      
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
