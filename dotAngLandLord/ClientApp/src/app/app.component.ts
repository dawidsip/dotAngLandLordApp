import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FlexLayoutModule, CommonModule, RouterOutlet, RouterModule, HomeComponent, 
    MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatSidenavModule,
    MatToolbarModule, MatListModule],
  template: `
    <main>
      <mat-toolbar class="custom-toolbar">
        <span>
          <a [routerLink]="['/']">
            <img class="brand-logo" src="{{wwwroot}}/logoMonster.jpg" alt="logo" aria-hidden="true">
          </a>
        </span>
        <span fxFlex></span>
        <nav fxHide.xs>
          <a mat-button [routerLink]="['dashboard']" *ngIf="isLoggedIn">Estates</a>
          <a mat-button [href]="this.url + 'Identity/Account/Login'" *ngIf="!isLoggedIn">Login</a>
          <a mat-button [href]="this.url + 'Identity/Account/Logout'" *ngIf="isLoggedIn">Logout</a>
          <a mat-button [routerLink]="['/about']">About</a>
        </nav>
        <button mat-icon-button (click)="sidenav.toggle()" fxHide fxShow.xs>
          <mat-icon>menu</mat-icon>
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav class="sidenav" [mode]="'over'" [fixedInViewport]="true" [opened]="false" fxHide fxShow.xs>
          <mat-nav-list>
            <a mat-list-item [routerLink]="['dashboard']" *ngIf="isLoggedIn">Estates</a>
            <a mat-list-item [href]="this.url + 'Identity/Account/Login'" *ngIf="!isLoggedIn">Login</a>
            <a mat-list-item [href]="this.url + 'Identity/Account/Logout'" *ngIf="isLoggedIn">Logout</a>
            <a mat-list-item [routerLink]="['/about']">About</a>
          </mat-nav-list>
        </mat-sidenav>
        <mat-sidenav-content>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  wwwroot: string = '/assets';
  url = 'http://localhost:5283/';
  // wwwroot: string = 'localhost:7127';
  title = 'homes';
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService)
  {
    // this.isLoggedIn = this.authService.getAuthStatus();
    // console.log("is there a cookie: " + this.authService.getAuthStatus());
  }


  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe({
      next: (res: boolean) => {
         this.isLoggedIn = this.authService.getAuthStatus();
         console.log("is there a valid authentication: " + this.isLoggedIn);
        },
      error: (error: any) => {
        console.log("check wether is authenticated: " + error);
      }
    });
  }

}
