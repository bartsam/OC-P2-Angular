import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { catchError, filter, Observable, of, tap } from 'rxjs';
import { Kpi } from 'src/app/models/Kpi';
import { Olympic } from 'src/app/models/Olympic';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public titlePage$!: Observable<string>;
  public kpis$!: Observable<Kpi[]>;
  public chart$!: Observable<ChartConfiguration | null>;
  public error!: string;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);

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
        // Check the result of getOlympicById and redirect if country is undefined
        tap((country: Olympic | undefined) => {
          if (!country) {
            this.router.navigate(['/not-found']);
          }
        }),
        // Stop pipe if country is undefined
        filter((country: Olympic | undefined): country is Olympic => !!country),
      )
      .subscribe((country) => {
        // Assign Observable<string> to titlePage$ with of()
        this.titlePage$ = of(country.country);

        this.kpis$ = this.dataService.getCountryKPIs(countryId).pipe(
          catchError((error: Error) => {
            this.error = error.message;
            return of([]);
          }),
        );

        this.chart$ = this.dataService.getCountryChart(countryId).pipe(
          catchError((error: Error) => {
            this.error = error.message;
            return of(null);
          }),
        );
      });
  }
}
