import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
    standalone: true,
})
export class ErrorComponent {
  @Input() message?: string = 'Une erreur est survenue';
}
