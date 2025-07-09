import { Component } from '@angular/core';
import { ApiServiceComponent } from '../api-service-component/api-service-component';

@Component({
  selector: 'app-home-component',
  imports: [ApiServiceComponent],
  standalone: true,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {

}
