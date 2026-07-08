import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { catchError, finalize, Observable, of } from 'rxjs';
import { Kpi, Olympic } from 'src/app/models/olympic.model';
import { ChartService } from 'src/app/services/chart.service';
import { DataService } from 'src/app/services/data.service';
import { KpisService } from 'src/app/services/kpis.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public titlePage = 'Medals per Country';
  public kpis$!: Observable<Kpi[] | null>;
  public chart$!: Observable<ChartConfiguration | null>;
  public error: string | null = null;
  public loading = true;

  private router = inject(Router);
  private dataService = inject(DataService);
  private kpisService = inject(KpisService);
  private chartService = inject(ChartService);

  ngOnInit() {
    const onCountryClick = (countryId: number) =>
      this.router.navigateByUrl(`country/${countryId}`);

    this.dataService
      .getOlympics()
      .pipe(
        catchError((error: Error) => {
          this.error = error.message;
          return of([]);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe((olympics: Olympic[]) => {
        this.kpis$ = of(this.kpisService.getOlympicsKPIs(olympics));
        this.chart$ = of(
          this.chartService.getOlympicsChart(olympics, onCountryClick),
        );
      });
  }
}
