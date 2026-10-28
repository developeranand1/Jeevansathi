import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrimonyService } from '../../services/matrimony.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-pricing-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.css']
})
export class PricingPlansComponent implements OnInit {
  readonly matrimonyService = inject(MatrimonyService);
  private readonly apiService = inject(ApiService);

  plans = [
    {
      name: 'Silver Starter',
      subtitle: 'Basic Matrimony Access',
      price: 'Free',
      period: 'Lifetime',
      badge: 'Free Forever',
      isPopular: false,
      features: [
        'Browse 5,00,000+ verified profiles',
        'Send unlimited initial interests',
        'Basic 18-Guna Kundli preview',
        'Standard profile visibility',
        'Photo privacy controls'
      ],
      btnText: 'Current Plan',
      btnClass: 'btn-outline-secondary'
    },
    {
      name: 'Gold Matchmaker',
      subtitle: 'Most Preferred for Fast Matches',
      price: '₹3,499',
      period: '3 Months (Quarterly)',
      badge: 'Most Popular',
      isPopular: true,
      features: [
        'View 50 verified direct contact numbers & WhatsApp',
        'Full 36-Guna Ashtakoot Kundli Milan reports',
        'Priority profile spotlight (3x more views)',
        'Direct messaging with verified candidates',
        'Dedicated helpline support assistance'
      ],
      btnText: 'Choose Gold Plan',
      btnClass: 'btn-royal-gold'
    },
    {
      name: 'Royal Diamond VIP',
      subtitle: 'Elite Personalized Matchmaking',
      price: '₹8,999',
      period: '6 Months (VIP Assisted)',
      badge: 'VIP Elite',
      isPopular: false,
      features: [
        'Dedicated Personal Relationship Manager',
        'Unlimited verified direct contact accesses',
        'Manual background check & horoscope analysis',
        'Arranged family intro video & direct meetings',
        'Guaranteed top-tier matrimonial matching'
      ],
      btnText: 'Join Royal VIP',
      btnClass: 'btn-royal-primary'
    }
  ];

  ngOnInit(): void {
    // Fetch live plans configured from Admin Panel
    this.apiService.get<any[]>('membership/plans').subscribe({
      next: (res: any) => {
        if (res.data && res.data.length > 0) {
          this.plans = res.data.map((p: any, idx: number) => ({
            name: p.plan_name,
            subtitle: p.has_relationship_manager ? 'VIP Dedicated Assistance' : `${p.duration_days} Days Plan`,
            price: p.price_inr === 0 ? 'Free' : `₹${p.price_inr.toLocaleString('en-IN')}`,
            period: `${p.duration_days} Days`,
            badge: p.plan_code === 'GOLD' || p.plan_code === 'ROYAL_VIP' ? 'Most Popular' : 'Active Plan',
            isPopular: p.plan_code === 'GOLD',
            features: p.features && p.features.length > 0 ? p.features : [
              `View ${p.contact_views_limit} direct contacts`,
              `Send ${p.interests_limit} match interests`,
              p.has_relationship_manager ? 'Dedicated Relationship Manager' : 'Standard Support',
              'Full Ashtakoot Kundli Milan'
            ],
            btnText: `Choose ${p.plan_name}`,
            btnClass: p.plan_code === 'ROYAL_VIP' ? 'btn-royal-primary' : (p.plan_code === 'GOLD' ? 'btn-royal-gold' : 'btn-outline-secondary')
          }));
        }
      },
      error: () => {}
    });
  }

  selectPlan(planName: string): void {
    this.matrimonyService.showToast(
      `🎉 You selected the ${planName}! Our matrimonial relationship team will assist you.`,
      'success'
    );
  }
}
