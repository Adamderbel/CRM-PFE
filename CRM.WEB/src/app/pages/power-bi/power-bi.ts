import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PowerBiService, PowerBiEmbedConfig, PowerBiReportInfo } from '../../core/services/power-bi.service';

@Component({
  selector: 'app-power-bi',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './power-bi.html',
  styleUrl: './power-bi.css',
})
export class PowerBi implements OnInit {
  config = signal<PowerBiEmbedConfig | null>(null);
  reports = signal<PowerBiReportInfo[]>([]);
  safeEmbed = signal<SafeResourceUrl | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(
    private powerBiService: PowerBiService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    forkJoin({
      cfg: this.powerBiService.getEmbedConfig().pipe(catchError(() => of(null))),
      rpt: this.powerBiService.getReports().pipe(catchError(() => of([] as PowerBiReportInfo[]))),
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: ({ cfg, rpt }) => {
          if (!cfg) {
            this.errorMessage.set('Impossible de charger la configuration Power BI.');
            return;
          }
          this.config.set(cfg);
          this.reports.set(rpt);
          const url = cfg.embedUrl?.trim();
          if (cfg.configured && url) {
            this.safeEmbed.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
          }
        },
      });
  }
}
