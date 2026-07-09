import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-back-button',
    templateUrl: './back-button.component.html',
    styleUrl: './back-button.component.scss',
    standalone: true,
    imports: [RouterLink],
})
export class BackButtonComponent {
  @Input() link?: string = '';
}
