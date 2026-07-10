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
   * @param {(countryName: string) => void} [onCountryClick] - Optional callback invoked with the clicked countryName
   * @returns {ChartConfiguration} A configuration of Chart.js
   */
  getOlympicsChart(
    olympics: Olympic[],
    onCountryClick?: (countryName: string) => void,
  ): ChartConfiguration | null {
    if (!olympics || olympics.length === 0) return null;

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
        onClick: (_event: ChartEvent, activeElements: ActiveElement[]) => {
          if (!activeElements.length || !onCountryClick) return;
          onCountryClick(labels[activeElements[0].index]);
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
