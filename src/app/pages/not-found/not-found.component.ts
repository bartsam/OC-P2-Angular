import { Component } from '@angular/core';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent],
})
export class NotFoundComponent {}
