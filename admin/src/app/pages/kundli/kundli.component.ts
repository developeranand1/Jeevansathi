import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-kundli-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid p-0">
      
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 class="font-serif fw-bold text-maroon mb-0">Kundli Milan & Ashtakoot Matching</h5>
          <small class="text-muted">Calculate 36-Guna compatibility score, Manglik Dosha & astrological verdict</small>
        </div>
      </div>

      <div class="row g-3">
        
        <!-- Kundli Calculator Form -->
        <div class="col-lg-5 col-12">
          <div class="card border-0 shadow-sm rounded-3 bg-white p-3">
            
            <div class="d-flex align-items-center mb-3 border-bottom pb-2">
              <div class="p-2 bg-gold-subtle text-gold rounded-circle me-2">
                <i class="bi bi-moon-stars-fill fs-5"></i>
              </div>
              <div>
                <h6 class="font-serif fw-bold text-dark mb-0">Astrology Match Calculator</h6>
                <small class="text-muted font-size-xs">Enter Groom and Bride birth details</small>
              </div>
            </div>

            <form [formGroup]="kundliForm" (ngSubmit)="calculateMatch()">
              
              <!-- Groom Section -->
              <div class="p-2.5 rounded-2 bg-light border mb-2.5">
                <div class="fw-bold text-maroon font-size-xs mb-2 d-flex align-items-center">
                  <i class="bi bi-gender-male me-1 fs-6"></i> Groom Details (Var)
                </div>
                <div class="row g-2">
                  <div class="col-12">
                    <input type="text" class="form-control form-control-compact" formControlName="groom_name" placeholder="Groom Name" />
                  </div>
                  <div class="col-6">
                    <select class="form-select form-select-compact" formControlName="groom_rashi">
                      <option *ngFor="let r of rashis" [value]="r">{{ r }}</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <select class="form-select form-select-compact" formControlName="groom_nakshatra">
                      <option *ngFor="let n of nakshatras" [value]="n">{{ n }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Bride Section -->
              <div class="p-2.5 rounded-2 bg-light border mb-3">
                <div class="fw-bold text-maroon font-size-xs mb-2 d-flex align-items-center">
                  <i class="bi bi-gender-female me-1 fs-6"></i> Bride Details (Kanya)
                </div>
                <div class="row g-2">
                  <div class="col-12">
                    <input type="text" class="form-control form-control-compact" formControlName="bride_name" placeholder="Bride Name" />
                  </div>
                  <div class="col-6">
                    <select class="form-select form-select-compact" formControlName="bride_rashi">
                      <option *ngFor="let r of rashis" [value]="r">{{ r }}</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <select class="form-select form-select-compact" formControlName="bride_nakshatra">
                      <option *ngFor="let n of nakshatras" [value]="n">{{ n }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-maroon w-100 py-2 d-flex align-items-center justify-content-center"
                [disabled]="kundliForm.invalid || loading()">
                <span *ngIf="loading()" class="spinner-border spinner-border-sm me-2"></span>
                <i *ngIf="!loading()" class="bi bi-stars me-1.5 text-gold"></i>
                <span>Calculate 36-Guna Match</span>
              </button>

            </form>

          </div>
        </div>

        <!-- Kundli Match Result Display -->
        <div class="col-lg-7 col-12">
          
          <!-- When Result Available -->
          <div *ngIf="matchResult()" class="card border-0 shadow-sm rounded-3 bg-white p-3 animate-fade-in">
            
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <div>
                <h6 class="font-serif fw-bold text-maroon mb-0">Guna Milan Scorecard</h6>
                <small class="text-muted font-size-xs">
                  {{ kundliForm.value.groom_name }} &hearts; {{ kundliForm.value.bride_name }}
                </small>
              </div>
              <span class="badge px-3 py-1.5 font-size-xs fw-bold rounded-pill" [ngClass]="getVerdictBadge(matchResult().verdict)">
                {{ matchResult().verdict }} MATCH
              </span>
            </div>

            <!-- Big Score Circle Banner -->
            <div class="p-3 rounded-3 text-center mb-3 bg-sand border border-gold-subtle">
              <div class="text-muted font-size-xs text-uppercase fw-semibold">Ashtakoot Total Score</div>
              <div class="display-5 fw-bold text-maroon my-1">
                {{ matchResult().total_score }} <span class="fs-4 text-muted">/ 36</span>
              </div>
              <div class="small fw-semibold" [ngClass]="matchResult().total_score >= 18 ? 'text-success' : 'text-danger'">
                <i class="bi" [ngClass]="matchResult().total_score >= 18 ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
                {{ matchResult().total_score >= 18 ? 'Auspicious Match for Vivah (Above 18 Gunas)' : 'Below Recommended Threshold (Less than 18 Gunas)' }}
              </div>
            </div>

            <!-- 8 Gunas Breakdown Table with strict integer classes -->
            <div class="table-responsive rounded-2 border mb-3">
              <table class="table table-sm align-middle mb-0 font-size-xs">
                <thead class="bg-light text-muted">
                  <tr>
                    <th class="py-1 px-2">#</th>
                    <th class="py-1 px-2">Guna (Attribute)</th>
                    <th class="py-1 px-2">Significance</th>
                    <th class="py-1 px-2 text-end">Max</th>
                    <th class="py-1 px-2 text-end">Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="py-1 px-2">1</td>
                    <td class="py-1 px-2 fw-semibold">Varna</td>
                    <td class="py-1 px-2 text-muted">Ego & Work Compatibility</td>
                    <td class="py-1 px-2 text-end">1</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.varna }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">2</td>
                    <td class="py-1 px-2 fw-semibold">Vashya</td>
                    <td class="py-1 px-2 text-muted">Mutual Attraction & Control</td>
                    <td class="py-1 px-2 text-end">2</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.vashya }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">3</td>
                    <td class="py-1 px-2 fw-semibold">Tara</td>
                    <td class="py-1 px-2 text-muted">Health & Destiny</td>
                    <td class="py-1 px-2 text-end">3</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.tara }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">4</td>
                    <td class="py-1 px-2 fw-semibold">Yoni</td>
                    <td class="py-1 px-2 text-muted">Biological & Sexual Compatibility</td>
                    <td class="py-1 px-2 text-end">4</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.yoni }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">5</td>
                    <td class="py-1 px-2 fw-semibold">Graha Maitri</td>
                    <td class="py-1 px-2 text-muted">Friendship & Mental Harmony</td>
                    <td class="py-1 px-2 text-end">5</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.graha_maitri }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">6</td>
                    <td class="py-1 px-2 fw-semibold">Gana</td>
                    <td class="py-1 px-2 text-muted">Temperament & Social Behavior</td>
                    <td class="py-1 px-2 text-end">6</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.gana }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">7</td>
                    <td class="py-1 px-2 fw-semibold">Bhakoot</td>
                    <td class="py-1 px-2 text-muted">Family Welfare & Prosperity</td>
                    <td class="py-1 px-2 text-end">7</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.bhakoot }}</td>
                  </tr>
                  <tr>
                    <td class="py-1 px-2">8</td>
                    <td class="py-1 px-2 fw-semibold">Nadi</td>
                    <td class="py-1 px-2 text-muted">Genetic & Progeny Health</td>
                    <td class="py-1 px-2 text-end">8</td>
                    <td class="py-1 px-2 text-end fw-bold text-dark">{{ matchResult().guna_scores?.nadi }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Manglik Dosha Summary -->
            <div class="p-2 rounded bg-light d-flex align-items-center justify-content-between">
              <span class="font-size-xs text-muted">Manglik Dosha Match:</span>
              <span class="badge" [ngClass]="matchResult().manglik_dosha_match ? 'bg-success' : 'bg-warning text-dark'">
                {{ matchResult().manglik_dosha_match ? 'Compatible (No Dosha Conflict)' : 'Dosha Caution' }}
              </span>
            </div>

          </div>

          <!-- Empty State When Not Calculated -->
          <div *ngIf="!matchResult()" class="card border-0 shadow-sm rounded-3 bg-white p-5 text-center text-muted">
            <i class="bi bi-stars text-gold fs-1 d-block mb-2"></i>
            <h6 class="text-dark fw-bold mb-1">Awaiting Match Calculation</h6>
            <p class="font-size-xs mb-0">Fill in the Groom and Bride birth rashis on the left and click Calculate to view Ashtakoot scorecard.</p>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .font-size-xs {
      font-size: 0.8125rem;
    }
    .animate-fade-in {
      animation: fadeIn 0.25s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class KundliPageComponent implements OnInit {
  private readonly adminApi = inject(AdminApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly loading = signal<boolean>(false);
  readonly matchResult = signal<any>(null);

  readonly rashis = [
    'Mesh (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
    'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ];

  readonly nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];

  kundliForm = this.fb.group({
    groom_name: ['Rahul Sharma', Validators.required],
    groom_rashi: ['Mesh (Aries)', Validators.required],
    groom_nakshatra: ['Ashwini', Validators.required],
    bride_name: ['Priya Verma', Validators.required],
    bride_rashi: ['Simha (Leo)', Validators.required],
    bride_nakshatra: ['Magha', Validators.required],
  });

  ngOnInit() {}

  calculateMatch() {
    if (this.kundliForm.invalid) return;

    this.loading.set(true);
    const payload = this.kundliForm.value;

    this.adminApi.post('admin/kundli/match', payload).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        this.matchResult.set(res.data);
        this.toast.success(`Kundli Score: ${res.data.total_score}/36 (${res.data.verdict})`, 'Kundli Milan Done');
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error(err.message, 'Kundli Milan Error');
      }
    });
  }

  getVerdictBadge(verdict: string): string {
    switch (verdict) {
      case 'EXCELLENT': return 'bg-success text-white';
      case 'GOOD': return 'bg-primary text-white';
      case 'AVERAGE': return 'bg-warning text-dark';
      default: return 'bg-danger text-white';
    }
  }
}
