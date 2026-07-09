import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  delay,
  map,
  shareReplay,
  throwError,
} from 'rxjs';
import { Olympic } from '../models/olympic.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private olympicUrl = './assets/mock/olympic.json';
  private http = inject(HttpClient);

  private olympics$: Observable<Olympic[]> | null = null;

  /**
   * Get an observable that emits the list of countries.
   * @returns {Observable<Olympic[]>} An observable of an array of Olympics.
   */
  getOlympics(): Observable<Olympic[]> {
    if (!this.olympics$) {
      this.olympics$ = this.http.get<Olympic[]>(this.olympicUrl).pipe(
        delay(500),
        map((olympics: Olympic[]) =>
          [...olympics].sort((a, b) => a.country.localeCompare(b.country)),
        ),
        // Memoization : Observable avec cache : la 1ère souscription déclenche l'appel HTTP, toutes suivantes réutilisent la même requête.
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
