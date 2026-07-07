import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Olympic } from '../models/Olympic';

@Injectable({ providedIn: 'root' })
export class DataService {
  // Chemin d'accès à la ressource de données simulée (mock)
  private olympicUrl = './assets/mock/olympic.json';
  // Injection du service HttpClient pour effectuer les requêtes réseau
  private http = inject(HttpClient);
  // constructor(private http: HttpClient) {}

  getOlympics(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl);
  }

  getOlympicByCountryName(
    countryName: string,
  ): Observable<Olympic | undefined> {
    return this.getOlympics().pipe(
      map((countries: Olympic[]) =>
        countries.find((c: Olympic) => c.country === countryName),
      ),
    );
  }
}
