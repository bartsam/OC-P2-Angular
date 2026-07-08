import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { catchError, Observable, of } from 'rxjs';
import { Kpi } from 'src/app/models/Kpi';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public titlePage = 'Medals per Country';
  public kpis$!: Observable<Kpi[]>;
  public chart$!: Observable<ChartConfiguration | null>;
  public error: string | null = null;

  private router = inject(Router);
  private dataService = inject(DataService);

  ngOnInit() {
    this.kpis$ = this.dataService.getOlympicsKPIs().pipe(
      catchError((error: Error) => {
        this.error = error.message;
        return of([]);
      }),
    );

    this.chart$ = this.dataService
      .getOlympicsChart((countryId) =>
        this.router.navigateByUrl(`country/${countryId}`),
      )
      .pipe(
        catchError((error: Error) => {
          this.error = error.message;
          return of(null);
        }),
      );
  }
}
