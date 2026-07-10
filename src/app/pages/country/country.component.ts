import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import {
  catchError,
  filter,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
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
export class CountryComponent implements OnInit {
  public titlePage$!: Observable<string>;
  public kpis$!: Observable<Kpi[] | null>;
  public chart$!: Observable<ChartConfiguration | null>;
  public error: string | null = null;
  public loading = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private kpisService = inject(KpisService);
  private chartService = inject(ChartService);

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('countryName');
    const countryName = name ? decodeURIComponent(name) : null;

    if (!countryName) {
      this.router.navigate(['/not-found'], {
        state: { message: `Missing Country ID.` },
      });
      return;
    }
    const country$ = this.dataService.getOlympicByName(countryName).pipe(
      catchError((error: Error) => {
        this.error = error.message;
        return of(undefined);
      }),
      // Check the result of getOlympicByName and redirect if country is undefined
      tap((country: Olympic | undefined) => {
        if (!country)
          this.router.navigate(['/not-found'], {
            state: { message: `Invalid Country ID.` },
          });
      }),
      // Stop pipe if country is undefined
      filter((country: Olympic | undefined): country is Olympic => !!country),
      finalize(() => {
        this.loading = false;
      }),
      // Avoid duplicating catchError/tap/finalize for each subscriber
      shareReplay(1),
    );

    this.titlePage$ = country$.pipe(map((country: Olympic) => country.country));
    this.kpis$ = country$.pipe(
      map((country: Olympic) => this.kpisService.getCountryKPIs(country)),
    );
    this.chart$ = country$.pipe(
      map((country: Olympic) =>
        country.participations.length > 0
          ? this.chartService.getCountryChart(country)
          : null,
      ),
    );
  }
}
