import { Component , inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateComponent } from '../estate/estate.component';
import { Estate } from '../estate';
import { EstateService } from '../estate.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, EstateComponent],
  template: `
  <section>

  </section>
  `,
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  estateService: EstateService = inject(EstateService);

  constructor(private authService: AuthService)
  {
  }


  ngOnInit(): void {
  }
  
}