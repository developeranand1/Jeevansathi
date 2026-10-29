import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatrimonyService } from '../../services/matrimony.service';
import { ApiService } from '../../services/api.service';
import { PricingPlansComponent } from '../../components/pricing-plans/pricing-plans.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, PricingPlansComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  readonly matrimonyService = inject(MatrimonyService);
  private readonly apiService = inject(ApiService);

  readonly user = signal<any>(null);
  readonly activeTab = signal<'matches' | 'interests' | 'shortlist' | 'plan'>('matches');
  readonly plans = signal<any[]>([]);

  ngOnInit(): void {
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        this.user.set(JSON.parse(stored));
      } catch (e) {
        this.user.set({ full_name: 'Member Candidate', matrimony_id: 'JS-88219', is_premium: false });
      }
    } else {
      this.user.set({
        full_name: 'Rahul Sharma',
        matrimony_id: 'JS-88219',
        user_name: 'rahul_sharma97',
        is_premium: false,
        email: 'rahul@example.com',
        mobile: '9876543210'
      });
    }

    this.loadPlans();
  }

  loadPlans(): void {
    this.apiService.get<any[]>('membership/plans').subscribe({
      next: (res: any) => {
        if (res.data) {
          this.plans.set(res.data);
        }
      },
      error: () => { }
    });
  }

  setTab(tab: 'matches' | 'interests' | 'shortlist' | 'plan'): void {
    this.activeTab.set(tab);
  }

  upgradePlan(planName: string): void {
    this.matrimonyService.showToast(
      `🎉 Membership Request Initiated for ${planName}! Our executive will connect for activation.`,
      'success'
    );
  }

  logout(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    this.matrimonyService.showToast('You have been logged out successfully.', 'info');
    this.router.navigate(['/login']);
  }
}
