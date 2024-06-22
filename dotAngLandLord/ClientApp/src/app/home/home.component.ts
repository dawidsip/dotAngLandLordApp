import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EstateComponent } from '../estate/estate.component';
import { EstateService } from '../estate.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, EstateComponent],
  template: `
    <section fxLayout="column" fxLayout.gt-sm="row" class="container">
      <div fxFlex="50" class="left">
        <h1>Welcome to Your Estate Management Hub</h1>
        <p>Effortlessly manage all your properties in one place. Never lose track of your estates again.</p>
        <p>Join us and simplify your property management today!</p>
        <button class="signup-btn" (click)="signUp()">Sign Up</button>
      </div>
      <div fxFlex="50" class="right"></div>
    </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';
  imagesLink = 'http://localhost:5283';  

  estateService: EstateService = inject(EstateService);

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  signUp(): void {
    // Logic to handle sign-up, e.g., redirect to sign-up page http://localhost:5283/Identity/Account/Register
    window.location.href = 'http://localhost:5283/Identity/Account/Register?returnUrl=/';
  }
}