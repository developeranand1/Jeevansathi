import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatrimonyService } from '../../services/matrimony.service';
import { KundliResult, MatrimonialProfile } from '../../models/profile.model';

@Component({
  selector: 'app-kundli-milan',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kundli-milan.component.html',
  styleUrls: ['./kundli-milan.component.css']
})
export class KundliMilanComponent {
  readonly matrimonyService = inject(MatrimonyService);

  readonly rashis = [
    'Mesh (Aries)',
    'Vrishabha (Taurus)',
    'Mithun (Gemini)',
    'Kark (Cancer)',
    'Simha (Leo)',
    'Kanya (Virgo)',
    'Tula (Libra)',
    'Vrishchik (Scorpio)',
    'Dhanu (Sagittarius)',
    'Makar (Capricorn)',
    'Kumbha (Aquarius)',
    'Meena (Pisces)'
  ];

  readonly nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  // Angular Reactive Form for Kundli Matching
  readonly kundliForm = new FormGroup({
    boyName: new FormControl<string>('Vikramaditya Chauhan', { nonNullable: true, validators: [Validators.required] }),
    boyRashi: new FormControl<string>('Simha (Leo)', { nonNullable: true }),
    boyNakshatra: new FormControl<string>('Magha', { nonNullable: true }),
    girlName: new FormControl<string>('Priyanka Sharma', { nonNullable: true, validators: [Validators.required] }),
    girlRashi: new FormControl<string>('Mesh (Aries)', { nonNullable: true }),
    girlNakshatra: new FormControl<string>('Ashwini', { nonNullable: true })
  });

  // Signal for calculation result
  readonly matchResult = signal<KundliResult | null>(null);

  constructor() {
    // Generate initial sample match
    this.calculateMatch();
  }

  loadProfileIntoKundli(profile: MatrimonialProfile): void {
    if (profile.gender === 'bride') {
      this.kundliForm.patchValue({
        girlName: profile.name,
        girlRashi: profile.rashi,
        girlNakshatra: profile.nakshatra
      });
    } else {
      this.kundliForm.patchValue({
        boyName: profile.name,
        boyRashi: profile.rashi,
        boyNakshatra: profile.nakshatra
      });
    }
    this.calculateMatch();
    const section = document.getElementById('kundli-calculator');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.matrimonyService.showToast(`Loaded ${profile.name} into Kundli Milan!`, 'info');
  }

  calculateMatch(): void {
    if (this.kundliForm.invalid) {
      this.matrimonyService.showToast('Please enter both partner names.', 'warning');
      return;
    }

    const val = this.kundliForm.getRawValue();
    const result = this.matrimonyService.calculateKundliMilan({
      boyName: val.boyName,
      boyRashi: val.boyRashi,
      boyNakshatra: val.boyNakshatra,
      girlName: val.girlName,
      girlRashi: val.girlRashi,
      girlNakshatra: val.girlNakshatra
    });

    this.matchResult.set(result);
  }
}
