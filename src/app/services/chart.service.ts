import { Injectable } from '@angular/core';
import { Olympic, Participation } from '@models/olympic.model';
import { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  /**
   * Get a ChartConfiguration for a chart pie of all countries.
   * @param {Olympic[]} olympics - An array of Olympic objects
   * @param {(countryId: number) => void} [onCountryClick] - Optional callback invoked with the clicked countryId
   * @returns {ChartConfiguration} A configuration of Chart.js
   */
  getOlympicsChart(
    olympics: Olympic[],
    onCountryClick?: (countryId: number) => void,
  ): ChartConfiguration | null {
    if (!olympics || olympics.length === 0) return null;

    const ids = olympics.map((c: Olympic) => c.id);
    const labels = olympics.map((c: Olympic) => c.country);
    const data = olympics.map((c: Olympic) =>
      c.participations.reduce(
        (acc: number, p: Participation) => acc + p.medalsCount,
        0,
      ),
    );
    return {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Medals',
            data: data,
            backgroundColor: [
              '#0b868f',
              '#adc3de',
              '#7a3c53',
              '#8f6263',
              'orange',
              '#94819d',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (_event: ChartEvent, activeElements: ActiveElement[]) => {
          if (!activeElements.length || !onCountryClick) return;
          onCountryClick(ids[activeElements[0].index]);
        },
      },
    };
  }

  /**
   * Get a ChartConfiguration for a line chart of a country.
   * @param {Olympic} country - An Olympic object
   * @returns {ChartConfiguration} A configuration of Chart.js
   */
  getCountryChart(country: Olympic): ChartConfiguration | null {
    if (!country) return null;

    const labels = country.participations.map((p) => p.year.toString());
    const data = country.participations.map((p) => p.medalsCount);

    return {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Medals',
            data: data,
            backgroundColor: '#0b868f',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            title: {
              display: true,
              text: 'Medals',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Dates',
            },
          },
        },
      },
    };
  }
}
