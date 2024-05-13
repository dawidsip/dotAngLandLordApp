import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-add-estate-modal',
  standalone: true,
  imports: [ CommonModule, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, ],
  template: `
    <h2 mat-dialog-title>Add Estate</h2>
    <form [formGroup]="estateForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="City" formControlName="city">
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Street" formControlName="street">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-button type="submit" [disabled]="!estateForm.valid">Add</button>
      </mat-dialog-actions>
    </form>`,
  styleUrl: './add-estate-modal.component.scss'
})
export class AddEstateModalComponent implements OnInit {
  estateForm!: FormGroup;

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
      street: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.estateForm.valid) {
      // Submit form data
      this.dialogRef.close(this.estateForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
