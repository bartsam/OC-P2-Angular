import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty',
    templateUrl: './empty.component.html',
    styleUrl: './empty.component.scss',
    standalone: true,
})
export class EmptyComponent {
  @Input() label?: string = 'Aucune donnée disponible.';
}
