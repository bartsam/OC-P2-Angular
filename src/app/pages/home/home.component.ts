import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveElement, ChartConfiguration, ChartEvent } from 'chart.js';
import { Kpi } from 'src/app/models/Kpi';
import { Olympic } from 'src/app/models/Olympic';
import { Participation } from 'src/app/models/Participation';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public titlePage = 'Medals per Country';
  public kpis: Kpi[] = [];
  public chartConfig!: ChartConfiguration;
  public error!: string;

  private router = inject(Router);
  private dataService = inject(DataService);

  ngOnInit() {
    this.dataService.getOlympics().subscribe({
      next: (data) => this.handleCountries(data),
      error: (error) => (this.error = error.message),
    });
  }

  private handleCountries(countries: Olympic[]) {
    if (!countries?.length) return;

    const totalJOs = new Set(
      countries.flatMap((c: Olympic) =>
        c.participations.map((p: Participation) => p.year),
      ),
    ).size;

    const totalCountries = countries.map(
      (olympic: Olympic) => olympic.country,
    ).length;

    this.kpis = [
      { label: 'Number of countries', value: totalCountries },
      { label: 'Number of JOs', value: totalJOs },
    ];

    const chartLabels = countries.map((c: Olympic) => c.country);
    const chartData = countries.map((c: Olympic) =>
      c.participations.reduce(
        (acc: number, p: Participation) => acc + p.medalsCount,
        0,
      ),
    );

    this.chartConfig = {
      type: 'pie',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Medals',
            data: chartData,
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
        onClick: (_event: ChartEvent, elements: ActiveElement[]) =>
          this.onChartClick(elements, chartLabels),
      },
    };
  }

  private onChartClick(elements: ActiveElement[], labels: string[]) {
    if (!elements.length) return;
    this.router.navigate(['country', labels[elements[0].index]]);
  }
}
