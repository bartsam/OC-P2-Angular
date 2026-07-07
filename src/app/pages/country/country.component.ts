import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { Kpi } from 'src/app/models/Kpi';
import { Participation } from 'src/app/models/Participation';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public titlePage = '';
  public kpis: Kpi[] = [];
  public chartConfig!: ChartConfiguration;
  public error!: string;

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);

  ngOnInit() {
    const countryName = this.route.snapshot.paramMap.get('countryName');
    if (!countryName) return;

    this.dataService.getOlympicByCountryName(countryName).subscribe({
      next: (country) => {
        if (!country) return;
        this.titlePage = country.country;
        this.handleParticipations(country.participations);
      },
      error: (error) => (this.error = error.message),
    });
  }

  private handleParticipations(participations: Participation[]) {
    const totalEntries = participations.length;
    const totalMedals = participations.reduce(
      (acc: number, p: Participation) => acc + p.medalsCount,
      0,
    );
    const totalAthletes = participations.reduce(
      (acc: number, p: Participation) => acc + p.athleteCount,
      0,
    );

    this.kpis = [
      { label: 'Number of entries', value: totalEntries },
      { label: 'Total Number of medals', value: totalMedals },
      { label: 'Total Number of athletes', value: totalAthletes },
    ];

    const chartLabels = participations.map((p) => p.year.toString());
    const chartData = participations.map((p) => p.medalsCount);

    this.chartConfig = {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Medals',
            data: chartData,
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
