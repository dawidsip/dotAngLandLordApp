import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <div class="footer">
      <div class="container">
        © 2024 - Landlord
      </div>
    </div>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent { }
