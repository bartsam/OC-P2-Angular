import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { Kpi } from '../models/Kpi';
import { Olympic } from '../models/Olympic';
import { ChartService } from './chart.service';
import { KpisService } from './kpis.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  private olympicUrl = './assets/mock/olympic.json';
  private http = inject(HttpClient);
  private kpisService = inject(KpisService);
  private chartService = inject(ChartService);

  private olympics$: Observable<Olympic[]> | null = null;

  /**
   * Get an observable that emits the list of countries.
   * @returns {Observable<Olympic[]>} An observable of an array of Olympics.
   */
  getOlympics(): Observable<Olympic[]> {
    if (!this.olympics$) {
      this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
        shareReplay(1),
        catchError((error: HttpErrorResponse) => {
          this.olympics$ = null;
          return this.handleError(error);
        }),
      );
    }
    return this.olympics$;
  }

  /**
   * Get an observable that emits an country associated with an id.
   * @param {number} id - Country's id to find
   * @returns {Observable<Olympic | undefined>} An observable of an Olympic or undefined.
   */
  getOlympicById(countryId: number): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((countries: Olympic[]) =>
        countries.find((c: Olympic) => c.id === countryId),
      ),
    );
  }

  /**
   * Get an observable that emits the KPIs of all countries
   * @returns {Observable<Kpi[]>} An observable of an array of KPIs
   */
  getOlympicsKPIs(): Observable<Kpi[]> {
    return this.getOlympics().pipe(
      map((olympics) => this.kpisService.getOlympicsKPIs(olympics)),
    );
  }

  /**
   * Get an observable that emits the KPIs of a country
   * @returns {Observable<Kpi[]>} An observable of an array of KPIs
   */
  getCountryKPIs(countryId: number): Observable<Kpi[]> {
    return this.getOlympicById(countryId).pipe(
      map((country: Olympic | undefined) =>
        country ? this.kpisService.getCountryKPIs(country) : [],
      ),
    );
  }

  /**
   * Get an observable that emits the pie chart config of all countries
   * @param {(countryId: number) => void} [onCountryClick] - Callback invoked with the clicked country's name
   * @returns {Observable<ChartConfiguration | null>} An observable of a chart config
   */
  getOlympicsChart(
    onCountryClick?: (countryId: number) => void,
  ): Observable<ChartConfiguration | null> {
    return this.getOlympics().pipe(
      map((olympics) =>
        this.chartService.getOlympicsChart(olympics, onCountryClick),
      ),
    );
  }

  /**
   * Get an observable that emits the line chart config of a country
   * @param {number} countryId - Id of the country
   * @returns {Observable<ChartConfiguration | null>} An observable of a Chart config
   */
  getCountryChart(countryId: number): Observable<ChartConfiguration | null> {
    return this.getOlympicById(countryId).pipe(
      map((country: Olympic | undefined) =>
        country ? this.chartService.getCountryChart(country) : null,
      ),
    );
  }

  /**
   * Handles HTTP errors and return error message via an error Observable.
   * @param {HttpErrorResponse} error - The HTTP error response to handle.
   * @returns {Observable<never>} An Observable that immediately throws a formatted Error.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.status === 0) {
      console.error('Network error:', error.error);
      errorMessage = 'Unable to contact server.';
    } else {
      console.error(`Server error ${error.status}:`, error.error);
      errorMessage = 'Error while loading data.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
