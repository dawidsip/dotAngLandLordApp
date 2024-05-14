import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AddEstateModalComponent } from '../add-estate-modal/add-estate-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-new-estate',
  standalone: true,
  imports: [MatIconModule, ],
  template: `
  <div class="addNewEstate" (click)="openDialog()">
    <mat-icon class="plus-icon" color="primary">library_add</mat-icon>
  </div>
  `,
  styleUrl: './create-new-estate.component.scss'
})
export class CreateNewEstateComponent implements OnInit{

  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(AddEstateModalComponent, {
      width: '50%',
      hasBackdrop: true,
      backdropClass: 'no-close',
      disableClose: true,
      
    });

    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any result from dialog if needed
    });
  }
  
  ngOnInit(): void {
  }
  
    onClick(): void {
      // Handle the click event here
      console.log('Component clicked!');
    }
}
