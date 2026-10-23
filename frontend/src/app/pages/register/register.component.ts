import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatrimonyService } from '../../services/matrimony.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private readonly router = inject(Router);
  readonly matrimonyService = inject(MatrimonyService);
  readonly apiService = inject(ApiService);

  readonly currentStep = signal<number>(1);
  readonly isSubmitted = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  // Comprehensive Reactive Registration Form
  readonly regForm = new FormGroup({
    // Step 1: Personal & Account Basics
    profileFor: new FormControl<string>('Self', { nonNullable: true, validators: [Validators.required] }),
    fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    gender: new FormControl<'bride' | 'groom'>('bride', { nonNullable: true, validators: [Validators.required] }),
    dob: new FormControl<string>('1998-05-15', { nonNullable: true, validators: [Validators.required] }),
    height: new FormControl<string>(`5' 5" (165 cm)`, { nonNullable: true }),
    maritalStatus: new FormControl<string>('Never Married', { nonNullable: true }),
    mobile: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('Pass@1234', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),

    // Step 2: Religion, Community & Astrology
    religion: new FormControl<string>('Hindu', { nonNullable: true, validators: [Validators.required] }),
    caste: new FormControl<string>('Brahmin', { nonNullable: true, validators: [Validators.required] }),
    subCaste: new FormControl<string>('Gaur', { nonNullable: true }),
    gotra: new FormControl<string>('Shandilya', { nonNullable: true, validators: [Validators.required] }),
    motherTongue: new FormControl<string>('Hindi', { nonNullable: true, validators: [Validators.required] }),
    manglik: new FormControl<string>('Non-Manglik', { nonNullable: true }),
    rashi: new FormControl<string>('Mesh (Aries)', { nonNullable: true }),
    nakshatra: new FormControl<string>('Ashwini', { nonNullable: true }),

    // Step 3: Education & Career
    education: new FormControl<string>('B.Tech / B.E.', { nonNullable: true, validators: [Validators.required] }),
    institute: new FormControl<string>('', { nonNullable: true }),
    employedIn: new FormControl<string>('Private Sector / MNC', { nonNullable: true }),
    profession: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    company: new FormControl<string>('', { nonNullable: true }),
    income: new FormControl<string>('₹20 - ₹30 Lakhs', { nonNullable: true }),
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl<string>('Delhi NCR', { nonNullable: true }),

    // Step 4: Family Details
    fatherOccupation: new FormControl<string>('Civil Engineer (Govt.)', { nonNullable: true }),
    motherOccupation: new FormControl<string>('Homemaker', { nonNullable: true }),
    siblings: new FormControl<string>('1 Brother, 1 Sister', { nonNullable: true }),
    familyType: new FormControl<string>('Nuclear', { nonNullable: true }),
    familyValues: new FormControl<string>('Moderate', { nonNullable: true }),
    familyOrigin: new FormControl<string>('Jaipur, Rajasthan', { nonNullable: true }),

    // Step 5: Partner Preferences & Bio
    partnerMinAge: new FormControl<number>(24, { nonNullable: true }),
    partnerMaxAge: new FormControl<number>(30, { nonNullable: true }),
    partnerPreferredCities: new FormControl<string>('Delhi NCR, Mumbai, Bengaluru', { nonNullable: true }),
    partnerEducationPref: new FormControl<string>('Post Graduate / Professional Degree', { nonNullable: true }),
    aboutMe: new FormControl<string>('', { nonNullable: true })
  });

  goToStep(stepNumber: number): void {
    if (stepNumber >= 1 && stepNumber <= 5) {
      this.currentStep.set(stepNumber);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  nextStep(): void {
    if (this.currentStep() < 5) {
      this.currentStep.update(s => s + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
    if (this.regForm.invalid) {
      this.matrimonyService.showToast('Please fill all mandatory details.', 'warning');
      return;
    }

    const val = this.regForm.getRawValue();
    this.isLoading.set(true);

    const userNameGen = (val.fullName.replace(/\s+/g, '_').toLowerCase() + Math.floor(100 + Math.random() * 900)).substring(0, 18);

    const payload = {
      full_name: val.fullName,
      user_name: userNameGen,
      email: val.email,
      mobile: val.mobile,
      password: val.password || 'Pass@1234',
      gender: val.gender === 'groom' ? 'GROOM' : 'BRIDE',
      profile_for: val.profileFor.toUpperCase(),
      date_of_birth: val.dob,
      religion: val.religion,
      mother_tongue: val.motherTongue,
      city: val.city || 'Delhi',
      highest_education: val.education,
      employed_in: 'PRIVATE',
      marital_status: 'NEVER_MARRIED',
    };

    this.apiService.post<any>('v1/auth/register', payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.isSubmitted.set(true);
        if (res.data?.access_token) {
          localStorage.setItem('user_token', res.data.access_token);
          localStorage.setItem('user_data', JSON.stringify(res.data.user));
        }
        this.matrimonyService.showToast(
          `Registration Successful! Matrimony ID: ${res.data?.user?.matrimony_id || 'Generated'}`,
          'success'
        );
        window.scrollTo({ top: 100, behavior: 'smooth' });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.matrimonyService.showToast(err.message || 'Registration failed. Please try again.', 'error');
      }
    });
  }

  viewMatches(): void {
    this.router.navigate(['/']);
  }
}
