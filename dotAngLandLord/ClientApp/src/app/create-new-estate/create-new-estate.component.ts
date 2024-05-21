import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AddEstateModalComponent } from '../add-estate-modal/add-estate-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Estate } from '../estate';

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

  // @Input() estateList: Estate[] = [];
  @Output() estateCreated = new EventEmitter<Estate>();
  constructor(private dialog: MatDialog) {}

  
  openDialog() {
    const dialogRef = this.dialog.open(AddEstateModalComponent, {
      width: '75%',
      hasBackdrop: true,
      backdropClass: 'no-close',
      disableClose: true,
      
    });

    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed and the result is: ');
      console.log(result);
      if(result)
        this.estateCreated.emit(result);
    });
  }
  
  ngOnInit(): void {
  }
  
    onClick(): void {
      // Handle the click event here
      console.log('Component clicked!');
    }
}
