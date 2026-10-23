import { Component, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroComponent } from '../../components/hero/hero.component';
import { ProfileExplorerComponent } from '../../components/profile-explorer/profile-explorer.component';
import { KundliMilanComponent } from '../../components/kundli-milan/kundli-milan.component';
import { BrowseCategoriesComponent } from '../../components/browse-categories/browse-categories.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { SuccessStoriesComponent } from '../../components/success-stories/success-stories.component';
import { PricingPlansComponent } from '../../components/pricing-plans/pricing-plans.component';
import { MatrimonialProfile } from '../../models/profile.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    ProfileExplorerComponent,
    KundliMilanComponent,
    BrowseCategoriesComponent,
    WhyChooseComponent,
    SuccessStoriesComponent,
    PricingPlansComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  readonly kundliComp = viewChild(KundliMilanComponent);

  onKundliProfileRequested(profile: MatrimonialProfile): void {
    const comp = this.kundliComp();
    if (comp) {
      comp.loadProfileIntoKundli(profile);
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
