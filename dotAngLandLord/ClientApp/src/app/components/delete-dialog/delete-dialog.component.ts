import {Component} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
} from '@angular/material/dialog';
import { EstateService } from '../../estate.service';

@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Delete property.</h2>
    <mat-dialog-content>
      Delete {{estateService.selectedEstate.name}}?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="false">No</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Ok</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  styleUrl: './delete-dialog.component.scss',

})
export class DeleteDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>, public estateService: EstateService) {}
}