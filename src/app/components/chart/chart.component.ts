import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input({ required: true }) config!: ChartConfiguration;

  // 1. Accès à l'élément #chartCanvas du template
  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  // 2. Initialisation après le rendu du DOM
  ngAfterViewInit() {
    this.buildChart();
  }
  // 3. Mise à jour si les données (config) changent
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && !changes['config'].firstChange) {
      this.buildChart();
    }
  }
  // 4. Nettoyage obligatoire pour éviter les fuites de mémoire
  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart() {
    if (!this.canvasRef?.nativeElement) return;
    this.chart?.destroy();
    this.chart = new Chart(this.canvasRef.nativeElement, this.config);
  }
}
