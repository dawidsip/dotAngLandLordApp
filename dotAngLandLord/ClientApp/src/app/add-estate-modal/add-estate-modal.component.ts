import { Component, OnInit, inject } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Estate } from '../estate';
import { Image } from '../image';
import { EstateService } from '../estate.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRippleModule} from '@angular/material/core';
import { Facility } from '../facility';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-add-estate-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatRippleModule, MatChipsModule],
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
          <div 
            class="img-container" 
            [class.selected]="selectedImageIndex === 0 && imagePreviews.length > 0"
            (click)="selectImage(0)">
            <img *ngIf="imagePreviews.length > 0" [src]="imagePreviews[0].src"/>
          </div>
          <div 
            class="img-container" 
            [class.selected]="selectedImageIndex === 1 && imagePreviews.length > 1"
            (click)="selectImage(1)">
            <img *ngIf="imagePreviews.length > 1" [src]="imagePreviews[1].src"/>
          </div>
          <div 
            class="img-container" 
            [class.selected]="selectedImageIndex === 2 && imagePreviews.length > 2"
            (click)="selectImage(2)">
            <img *ngIf="imagePreviews.length > 2" [src]="imagePreviews[2].src"/>
          </div>
          <div 
            class="img-container" 
            [class.selected]="selectedImageIndex === 3 && imagePreviews.length > 3"
            (click)="selectImage(3)">
            <img *ngIf="imagePreviews.length > 3" [src]="imagePreviews[3].src"/>
          </div>
          <div 
            class="img-container" 
            [class.selected]="selectedImageIndex === 4 && imagePreviews.length > 4"
            (click)="selectImage(4)">
            <img *ngIf="imagePreviews.length > 4" [src]="imagePreviews[4].src"/>
          </div>
        </div>
        <button matRipple [matRippleColor]="myColor" color="primary" type="button" (click)="onClearImagePreviews()" mat-fab extended [disabled]="!imagePreviews" aria-label="clear all images">
          <mat-icon>delete</mat-icon>
        </button> 
        <button matRipple [matRippleColor]="myColor" class="primary upload-button" color="primary" type="button" mat-raised-button aria-label="upload dialog" (click)="fileInput.click()">
        <input hidden (change)="onFileSelected($event)" #fileInput type="file" multiple accept="image/png, image/jpeg">
          Upload images
        </button>
      </div>
    </div>
    <form [formGroup]="estateForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Location name" formControlName="name">
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
        <form>
          <mat-form-field appearance="fill" class="facilities-chips">
            <mat-label>Facilities for your new location:</mat-label>
            <mat-chip-grid class="mat-mdc-chip-set-stacked" #chipGrid aria-label="Enter facility">
              @for (bfs of basicFacilities; track bfs) {
                <mat-chip-option
                  (removed)="remove(bfs)"
                  [aria-description]="'press enter to edit ' + bfs.name"
                >
                  {{bfs.name}}
                  <button matChipRemove [attr.aria-label]="'remove ' + bfs.name">
                    <mat-icon>cancel</mat-icon>
                  </button>
                </mat-chip-option>
              }
              <input class="mat-mdc-chip-input"
                matInput
                value="+ Add facility"
                placeholder="Enter custom facility..."
                [matChipInputFor]="chipGrid"
                [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
                [matChipInputAddOnBlur]="addOnBlur"
                (matChipInputTokenEnd)="add($event)"
                (focus)="onFocus($event)"
              />
            </mat-chip-grid>
          </mat-form-field>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions>        
        <button matRipple [matRippleColor]="myColor" mat-dialog-close (click)="onCancel()" class="primary" type="button" mat-raised-button color="primary">Cancel</button>
        <button matRipple [matRippleColor]="myColor" class="primary" type="button" mat-raised-button type="submit" [disabled]="!estateForm.valid" color="primary">Create</button>
      </mat-dialog-actions>
    </form>
  `,
  styleUrl: './add-estate-modal.component.scss'
})

export class AddEstateModalComponent implements OnInit {

  uploadFiles: File[] = [];
  myColor = 'rgba(177, 127, 177, 0.5)';
  images: Image[] = [];
  estateForm!: FormGroup;
  estateService: EstateService = inject(EstateService);
  imagePreviews: { src: string, fileName: string }[] = [];
  selectedImageIndex: number | null = null;
  basicFacilities: Facility[] | null = null;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  announcer = inject(LiveAnnouncer);
  constructor(
    private dialogRef: MatDialogRef<AddEstateModalComponent>,
    private fb: FormBuilder
  ) {}
  
  selectImage(index: number): void {
    console.log("selectImage clicked");
    if(index < this.imagePreviews.length )
      this.selectedImageIndex = index;

    console.log("selectImage" + this.selectedImageIndex);
  }

  onClearImagePreviews()
  {
    this.imagePreviews = [];
    this.images = [];
  }

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
            isMain: index == this.selectedImageIndex, 
            data: data
          });

          const reader = new FileReader();
      
          reader.onload = (e: any) => {
            this.imagePreviews.push({
              src: e.target.result,
              fileName: file.name
            });
          };

          reader.readAsDataURL(file); // Convert the file to Base64

          console.log(this.images);
        }).catch((err) => {
          console.error('Error reading file data:', err);
        });
      });
    }
  }
  
  ngOnInit() {
    this.createForm();
    this.estateService.FetchBasicFacilities().subscribe({
      next: (value: Facility[]) => {
        console.log(value);
        this.basicFacilities = value;
        },
      error: (e) =>
        {
          console.log("Couldnt retvrieve basic facilities." + e);
        },
    });
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

  validateMainImageWasChosen() : boolean {
    return this.images?.filter((im: Image) => im.isMain == true).length === 1;
  }

  onSubmit() {
    if (this.estateForm.valid) {
      // Submit form data
      if(!this.validateMainImageWasChosen())
      {
        if(this.images.length>0) this.images[0].isMain = true;
      }
      
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
        facilities: [],
      };
      console.log("we have this many images : " + newEstate.images.length);
      this.estateService.postNewEstate(newEstate).then((persistedEstate: Estate | undefined) => {
        // console.log(persistedEstate);
        this.dialogRef.close(persistedEstate);
      }).catch((error) => {
        console.error('Failed to persist new estate', error);
      });
    
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFocus(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = '';
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value) {
      this.basicFacilities?.push({id: undefined, name: value, isPresent: true, isBasic: false});
    }
    event.chipInput!.clear();

    if (input) {
      input.value = '';
    }
  }

  remove(facility: Facility): void {
    if(this.basicFacilities != undefined){
      const index = this.basicFacilities?.indexOf(facility);
      if (index >= 0) {
        this.basicFacilities?.splice(index, 1);

        this.announcer.announce(`Removed ${facility}`);
      }
    }
  }
}