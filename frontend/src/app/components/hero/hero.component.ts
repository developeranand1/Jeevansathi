import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  readonly matrimonyService = inject(MatrimonyService);

  readonly activeQuickFilter = signal<string>('all');
  readonly selectedRashi = signal<string>('all');

  // Astrological Zodiac Signs in English
  readonly popularRashis = [
    { name: 'Aries (Mesh)', symbol: '♈', rashi: 'Mesh' },
    { name: 'Taurus (Vrishabha)', symbol: '♉', rashi: 'Vrishabha' },
    { name: 'Gemini (Mithun)', symbol: '♊', rashi: 'Mithun' },
    { name: 'Cancer (Kark)', symbol: '♋', rashi: 'Kark' },
    { name: 'Leo (Simha)', symbol: '♌', rashi: 'Simha' },
    { name: 'Virgo (Kanya)', symbol: '♍', rashi: 'Kanya' },
    { name: 'Libra (Tula)', symbol: '♎', rashi: 'Tula' },
    { name: 'Scorpio (Vrishchik)', symbol: '♏', rashi: 'Vrishchik' },
    { name: 'Sagittarius (Dhanu)', symbol: '♐', rashi: 'Dhanu' },
    { name: 'Capricorn (Makar)', symbol: '♑', rashi: 'Makar' },
    { name: 'Aquarius (Kumbha)', symbol: '♒', rashi: 'Kumbha' },
    { name: 'Pisces (Meena)', symbol: '♓', rashi: 'Meena' },
  ];

  // Angular Reactive Form
  readonly searchForm = new FormGroup({
    gender: new FormControl<'all' | 'bride' | 'groom'>('bride', { nonNullable: true, validators: [Validators.required] }),
    minAge: new FormControl<number>(21, { nonNullable: true, validators: [Validators.required, Validators.min(18)] }),
    maxAge: new FormControl<number>(29, { nonNullable: true, validators: [Validators.required, Validators.max(70)] }),
    caste: new FormControl<string>('all', { nonNullable: true }),
    motherTongue: new FormControl<string>('all', { nonNullable: true }),
    city: new FormControl<string>('all', { nonNullable: true }),
    manglik: new FormControl<string>('all', { nonNullable: true })
  });

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.matrimonyService.showToast('Please check search criteria.', 'warning');
      return;
    }

    const val = this.searchForm.getRawValue();

    this.matrimonyService.updateFilter({
      gender: val.gender,
      minAge: Number(val.minAge),
      maxAge: Number(val.maxAge),
      caste: val.caste,
      motherTongue: val.motherTongue,
      city: val.city,
      manglik: val.manglik
    });

    const profilesSection = document.getElementById('profiles');
    if (profilesSection) {
      profilesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const count = this.matrimonyService.totalMatchesCount();
    this.matrimonyService.showToast(
      `Discovered ${count} verified matrimonial matches!`,
      'success'
    );
  }

  applyQuickCaste(casteName: string): void {
    this.activeQuickFilter.set(casteName);
    this.searchForm.patchValue({ caste: casteName });
    this.onSearch();
  }

  filterByRashi(rashiKey: string): void {
    this.selectedRashi.set(rashiKey);
    this.matrimonyService.updateFilter({
      searchKeyword: rashiKey === 'all' ? '' : rashiKey
    });

    const profilesSection = document.getElementById('profiles');
    if (profilesSection) {
      profilesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    this.matrimonyService.showToast(`Filtering profiles matching ${rashiKey} zodiac sign...`, 'info');
  }
}
