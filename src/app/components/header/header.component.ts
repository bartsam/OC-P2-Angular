import { Component, Input } from '@angular/core';
import { Kpi } from 'src/app/models/Kpi';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() title: string | null = '';
  @Input() kpis: Kpi[] | null = [];
  @Input() backLink: string | undefined;
}
