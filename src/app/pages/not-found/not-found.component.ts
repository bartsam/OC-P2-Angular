import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '@components/back-button/back-button.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent],
})
export class NotFoundComponent {
  private router = inject(Router);
  public message: string =
    this.router.getCurrentNavigation()?.extras.state?.['message'] ??
    'No corresponding page found';
}
