import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatrimonyService } from '../../services/matrimony.service';

@Component({
  selector: 'app-registration-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.css']
})
export class RegistrationModalComponent {
  readonly close = output<void>();
  readonly matrimonyService = inject(MatrimonyService);

  readonly currentStep = signal<number>(1);
  readonly isSubmitted = signal<boolean>(false);

  // Angular Reactive Form for Registration
  readonly registerForm = new FormGroup({
    // Step 1: Basic Profile Info
    profileFor: new FormControl<string>('Self', { nonNullable: true, validators: [Validators.required] }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    gender: new FormControl<'bride' | 'groom'>('bride', { nonNullable: true, validators: [Validators.required] }),
    mobile: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),

    // Step 2: Cultural & Astrological Heritage
    religion: new FormControl<string>('Hindu', { nonNullable: true }),
    caste: new FormControl<string>('Brahmin', { nonNullable: true, validators: [Validators.required] }),
    gotra: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    motherTongue: new FormControl<string>('Hindi', { nonNullable: true }),
    manglik: new FormControl<string>('Non-Manglik', { nonNullable: true }),

    // Step 3: Career & Education
    education: new FormControl<string>('B.Tech / MBA', { nonNullable: true, validators: [Validators.required] }),
    profession: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    income: new FormControl<string>('₹20-30 Lakhs', { nonNullable: true }),
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),

    // Step 4: Partner Expectations
    partnerAge: new FormControl<string>('24 - 29 Yrs', { nonNullable: true }),
    partnerExpectations: new FormControl<string>('', { nonNullable: true })
  });

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.matrimonyService.showToast('Please fill all mandatory details.', 'warning');
      return;
    }

    const val = this.registerForm.getRawValue();
    this.isSubmitted.set(true);

    this.matrimonyService.showToast(
      `🎉 Shubharambh! Profile for ${val.name} created successfully! Our relationship team will reach out.`,
      'success'
    );
  }

  onFinish(): void {
    this.close.emit();
  }
}
