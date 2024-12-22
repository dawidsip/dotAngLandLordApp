import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  template: `
    <section fxLayout="column" fxLayout.gt-sm="row" class="container">
      <div fxFlex="50" class="right">
        <img src="http://localhost:5283/author1.png" alt="Dawid" class="profile-pic">
      </div>
      <div fxFlex="50" class="left">
      <h1>Hello, E-Traveller!</h1>
      <p>Welcome to my demo project.</p>
      <p>The Landlord is your favorite CRUD app for managing real estate.</p>
      <p>My name is Dawid. If you'd like to reach out to me, please find me on <a href="https://www.linkedin.com/in/🏄🏼‍♂️-dawid-sip-a41a412a1/" target="_blank" class="linkedin-link">LinkedIn</a>.
      <p>In the mean-time, here is my skillset:</p>
        <ul>
          <li>.NET</li>
          <li>C#</li>
          <li>Java</li>
          <li>Entity Framework</li>
          <li>MVC</li>
          <li>Event-based architecture</li>
          <li>Kafka</li>
          <li>REST</li>
          <li>SQL</li>
          <li>Angular</li>
          <li>Typescript</li>
          <li>JavaScript</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Bootstrap</li>
          <li>DevOps</li>
          <li>Git</li>
          <li>GitHub Actions</li>
          <li>Azure</li>
          <li>Azure DevOps</li>
          <li>GKE</li>
          <li>PowerShell</li>
          <li>Kubernetes</li>
          <li>Docker</li>
          <li>Linux</li>
          <li>Bash</li>
          <li>SOPS</li>
          <li>YAML</li>
          
          

        </ul>
      
      </div>

    </section>
  `,
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
