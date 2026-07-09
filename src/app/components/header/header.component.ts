import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/olympic.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BackButtonComponent } from '../back-button/back-button.component';
import { CardComponent } from '../card/card.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        BackButtonComponent,
        CardComponent,
    ],
})
export class HeaderComponent {
  @Input() title?: string | null;
  @Input() kpis?: Kpi[] | null;
  @Input() backLink?: string;
}
