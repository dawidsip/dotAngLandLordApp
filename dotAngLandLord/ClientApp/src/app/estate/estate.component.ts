import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Estate } from '../estate';
import { Image } from '../image';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EstateService } from '../estate.service';
import { MatIconModule } from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { AddEstateModalComponent } from '../add-estate-modal/add-estate-modal.component';
import { EditEstateModalComponent } from '../edit-estate-modal/edit-estate-modal.component';

@Component({
  selector: 'app-estate',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterOutlet, MatIconModule, MatRippleModule, MatButtonModule],
  template: `
  
  <section class="listing">
    <div class="image-container">
      <img class="listing-photo" *ngIf="mainImage.fileName" [src]="'http://localhost:5283/UserImages/' + mainImage.fileName" alt="Exterior photo of {{estate.name}}">
    </div>
    <div class="lower-half">  
      <div class="left">
        <h2 class="listing-heading">{{ estate.name }}</h2>
        <p class="listing-location">{{ estate.city}}, {{estate.region }}</p>
        <a (click)="selectEstate()" [routerLink]="['/details', estate.id]">Learn More</a>
      </div>  
      <div class="icons-block">  
        <button  mat-icon-button aria-label="close dialog" (click)="onDelete()">
          <mat-icon>delete</mat-icon>
        </button>
        <button  mat-icon-button aria-label="edit estate" (click)="onEdit()">
          <mat-icon>edit</mat-icon>
        </button>
      </div>
    </div>
  </section>
  `,
  styleUrl: './estate.component.scss'
})

export class EstateComponent {
onEdit() {
  this.estate.images.forEach(f => console.log("Edit estate :" + f.fileName));
    const dialogRef = this.dialog.open(EditEstateModalComponent, {
      width: '75%',
      hasBackdrop: true,
      backdropClass: 'no-close',
      disableClose: true,
      data : { estate: this.estate }
    });
}

  @Input() estate!: Estate;
  @Output() estateDeleted = new EventEmitter<number>();
  estateService = inject(EstateService);
  mainImage: Image = { id: undefined, estateId: undefined, isMain: true, fileName: '', data: undefined };
  myColor = 'rgba(177, 127, 177, 0.5)';
  public dialog: MatDialog = inject(MatDialog);

  ngOnInit() {
    if (this.estate !== undefined && this.estate.images) {
      this.mainImage.fileName = this.estate.images.find(image => image.isMain === true)?.fileName || '';
    }
  }

  onDelete() {
    this.estateService.selectedEstate = this.estate;
    var dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });

    dialogRef.afterClosed().subscribe({
      next: (value: boolean) => {
        if(value === true)
        {
          this.estateService.deleteEstate(this.estate.id).subscribe(() => {
            this.estateDeleted.emit(this.estate.id);
          });
        }
      },
      error: (e) =>
        {
          console.log("Delete dialog error.: " + e);
        },
    });
  }

  private openDialog(): boolean {
    var result: boolean = false;
    var dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '25%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.afterClosed().subscribe({
      next: (value: boolean) => {
        console.log("Delete dialog result: " + value);
        result = value;
        },
      error: (e) =>
        {
          console.log("Delete dialog error.: " + e);
          return result;
        },
    });

    console.log("Exiting openDialog : " + result);
    return result;
  }
  selectEstate() {
    // console.log("clicked");
    // console.log(this.estate);
    // this.estateService.selectedEstate = this.estate;
  }
}