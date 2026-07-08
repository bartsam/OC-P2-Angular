import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { catchError, filter, finalize, Observable, of, tap } from 'rxjs';
import { Kpi, Olympic } from 'src/app/models/olympic.model';
import { ChartService } from 'src/app/services/chart.service';
import { DataService } from 'src/app/services/data.service';
import { KpisService } from 'src/app/services/kpis.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
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
    const id = this.route.snapshot.paramMap.get('id');
    const countryId = Number(id);

    if (!id || isNaN(countryId)) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.dataService
      .getOlympicById(countryId)
      .pipe(
        // Catch HTTP errors and treat them as "country not found" to unify error handling
        catchError((error: Error) => {
          this.error = error.message;
          return of(undefined);
        }),
        // Check the result of getOlympicById and redirect if country is undefined
        tap((country: Olympic | undefined) => {
          if (!country) this.router.navigate(['/not-found']);
        }),
        // Stop pipe if country is undefined
        filter((country: Olympic | undefined): country is Olympic => !!country),
        // Stop loading once the pipe completes or errors
        finalize(() => (this.loading = false)),
      )
      .subscribe((country) => {
        // Wrap synchronous values in of() to match types Observable
        this.titlePage$ = of(country.country);
        this.kpis$ = of(this.kpisService.getCountryKPIs(country));
        this.chart$ = of(
          country.participations.length > 0
            ? this.chartService.getCountryChart(country)
            : null,
        );
      });
  }
}
