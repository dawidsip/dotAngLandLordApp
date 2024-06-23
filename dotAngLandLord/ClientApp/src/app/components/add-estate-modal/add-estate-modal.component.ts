import { Component, OnInit, inject, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Estate } from '../../estate';
import { Image } from '../../image';
import { EstateService } from '../../estate.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRippleModule} from '@angular/material/core';
import { Facility } from '../../facility';
import {MatChipEditedEvent, MatChipInputEvent, MatChipOption, MatChipsModule} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-add-estate-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatRippleModule, MatChipsModule],
  templateUrl: './add-estate-modal.component.html',
  styleUrl: './add-estate-modal.component.scss'
})

export class AddEstateModalComponent implements OnInit, AfterViewInit {

  title: string = "Add Estate";
  proceed: string = "Save";
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

  @ViewChildren(MatChipOption) chipOption!: QueryList<MatChipOption>;

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
        facilities: this.extractFacilities(),
      };
      // console.log("we have this many images : " + newEstate.images.length);
      console.log("we have this many facilities : " + newEstate.facilities.length);
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
    this.extractFacilities();
  }

  extractFacilities(): Facility[] {
    const facilities: Facility[] = [];
    this.chipOption.forEach(chip => {
      // console.log("chip name is: " + chip.value + " and selected is: " + chip.selected);

      var basicChip = this.basicFacilities?.find(f => f.name == chip.value)
      if(basicChip)
      {
        facilities.push({id: basicChip.id, name: basicChip.name, isPresent: chip.selected, isBasic: true});
      }
      else
      {
        facilities.push({id: undefined, name: chip.value, isPresent: chip.selected, isBasic: false});
      }

    });
    
    return facilities;
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

  ngAfterViewInit() {
    // Detect changes if necessary
  }
}