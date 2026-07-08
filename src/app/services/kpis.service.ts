import { Injectable } from '@angular/core';
import { Kpi, Olympic } from '../models/olympic.model';

@Injectable({
  providedIn: 'root',
})
export class KpisService {
  /**
   * Get an array of the KPIs of all countries.
   * @param {Olympic[]} olympics - An array of Olympic objects
   * @returns {Kpi[]} An array of KPIs.
   */
  getOlympicsKPIs(olympics: Olympic[]): Kpi[] | null {
    if (!olympics || olympics.length === 0) return null;

    const totalCountries = olympics.map(
      (olympic: Olympic) => olympic.country,
    ).length;
    const totalJOs = new Set(
      olympics.flatMap((olympic: Olympic) =>
        olympic.participations.map((p) => p.year),
      ),
    ).size;
    return [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: totalJOs },
    ];
  }

  /**
   * Get an array of the KPIs of a country.
   * @param {Olympic} country - An Olympic object
   * @returns {Kpi[]} An array of KPIs.
   */
  getCountryKPIs(country: Olympic): Kpi[] | null {
    if (!country) return null;

    const totalEntries = country.participations.length;
    const totalMedals = country.participations.reduce(
      (acc, p) => acc + p.medalsCount,
      0,
    );
    const totalAthletes = country.participations.reduce(
      (acc, p) => acc + p.athleteCount,
      0,
    );
    return [
      { label: 'Number of entries', value: totalEntries },
      { label: 'Total medals', value: totalMedals },
      { label: 'Total athletes', value: totalAthletes },
    ];
  }
}
