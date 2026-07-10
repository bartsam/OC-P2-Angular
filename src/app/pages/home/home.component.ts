import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartComponent } from '@components/chart/chart.component';
import { EmptyComponent } from '@components/empty/empty.component';
import { ErrorComponent } from '@components/error/error.component';
import { HeaderComponent } from '@components/header/header.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { Kpi, Olympic } from '@models/olympic.model';
import { ChartService } from '@services/chart.service';
import { DataService } from '@services/data.service';
import { KpisService } from '@services/kpis.service';
import { ChartConfiguration } from 'chart.js';
import { catchError, finalize, map, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    LoadingComponent,
    ErrorComponent,
    ChartComponent,
    EmptyComponent,
    AsyncPipe,
  ],
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
    const onCountryClick = (countryName: string) =>
      this.router.navigateByUrl(
        `country/${encodeURIComponent(countryName.toLowerCase())}`,
      );

    const olympics$ = this.dataService.getOlympics().pipe(
      catchError((error: Error) => {
        this.error = error.message;
        return of([]);
      }),
      finalize(() => (this.loading = false)),
      // Avoid duplicating catchError/finalize for each subscriber
      shareReplay(1),
    );

    this.kpis$ = olympics$.pipe(
      map((olympics: Olympic[]) => this.kpisService.getOlympicsKPIs(olympics)),
    );

    this.chart$ = olympics$.pipe(
      map((olympics: Olympic[]) =>
        this.chartService.getOlympicsChart(olympics, onCountryClick),
      ),
    );
  }
}
